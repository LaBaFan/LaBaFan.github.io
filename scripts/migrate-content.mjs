#!/usr/bin/env node

/**
 * Copy the legacy MkDocs notes into Astro's content directory.
 *
 * This migration is intentionally additive: it never removes source files or
 * destination files. Markdown receives a generated canonical slug while every
 * other copied file remains byte-identical to its MkDocs source.
 */
import { cp, lstat, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const sourceDirectory = resolve(repositoryRoot, 'docs/notes');
const destinationDirectory = resolve(repositoryRoot, 'src/content/notes');
const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/;

async function pathExists(path) {
  try {
    await lstat(path);
    return true;
  } catch (error) {
    if (error && typeof error === 'object' && error.code === 'ENOENT') return false;
    throw error;
  }
}

function getCanonicalSlug(sourcePath) {
  return relative(sourceDirectory, sourcePath)
    .replace(/\\/g, '/')
    .replace(/\.md$/i, '')
    .replace(/(^|\/)index$/i, '');
}

function normalizeMkDocsMarkdown(markdown) {
  const match = markdown.match(frontmatter);
  const body = match ? markdown.slice(match[0].length) : markdown;
  const normalizedBody = body
    .replace(/<figure\s+markdown\s*=\s*"span"\s*>/g, '')
    .replace(/<\/figure>/g, '')
    .replace(/(!\[[^\]\r\n]*\]\([^\r\n)]*\))\{[^\r\n}]*\}/g, '$1');

  return match ? match[0] + normalizedBody : normalizedBody;
}

function withCanonicalSlug(markdown, slug) {
  const slugLine = 'slug: ' + JSON.stringify(slug);
  const match = markdown.match(frontmatter);

  if (!match) return '---\n' + slugLine + '\n---\n\n' + markdown;

  const [block, fields] = match;
  const updatedFields = /^slug:\s*.*(?:\r?\n|$)/m.test(fields)
    ? fields.replace(/^slug:\s*.*(?=\r?$)/m, slugLine)
    : fields.replace(/\r?\n$/, '') + '\n' + slugLine;
  return block.replace(fields, updatedFields) + markdown.slice(block.length);
}

function withoutCanonicalSlug(markdown) {
  return markdown.replace(frontmatter, (block, fields) => {
    const newline = fields.includes('\r\n') ? '\r\n' : '\n';
    const fieldsWithoutSlug = fields
      .split(/\r?\n/)
      .filter((line) => !/^slug:\s*/.test(line))
      .join(newline);
    return block.replace(fields, fieldsWithoutSlug);
  });
}

async function copyDirectory(source, destination) {
  await mkdir(destination, { recursive: true });

  for (const entry of await readdir(source, { withFileTypes: true })) {
    const sourcePath = resolve(source, entry.name);
    const destinationPath = resolve(destination, entry.name);

    if (entry.isDirectory()) {
      if (await pathExists(destinationPath)) {
        const destinationStats = await lstat(destinationPath);
        if (!destinationStats.isDirectory()) {
          throw new Error(`目标路径类型冲突：${relative(repositoryRoot, destinationPath)}`);
        }
      }
      await copyDirectory(sourcePath, destinationPath);
      continue;
    }

    const sourceContents = await readFile(sourcePath);
    const expectedContents = entry.name.toLowerCase().endsWith('.md')
      ? Buffer.from(
          withCanonicalSlug(
            normalizeMkDocsMarkdown(sourceContents.toString('utf8')),
            getCanonicalSlug(sourcePath),
          ),
          'utf8',
        )
      : sourceContents;

    if (await pathExists(destinationPath)) {
      const destinationStats = await lstat(destinationPath);
      const destinationContents = destinationStats.isFile()
        ? await readFile(destinationPath)
        : undefined;
      if (!destinationStats.isFile() || !destinationContents) {
        throw new Error(
          `目标文件已被修改，已停止以避免覆盖：${relative(repositoryRoot, destinationPath)}`,
        );
      }
      const destinationCanReceiveSlug = entry.name.toLowerCase().endsWith('.md')
        && normalizeMkDocsMarkdown(withoutCanonicalSlug(destinationContents.toString('utf8')))
          === normalizeMkDocsMarkdown(withoutCanonicalSlug(sourceContents.toString('utf8')));
      if (destinationContents.equals(expectedContents)) continue;
      if (destinationContents.equals(sourceContents) || destinationCanReceiveSlug) {
        await writeFile(destinationPath, expectedContents);
        continue;
      }

      throw new Error(
        '目标文件已被修改，已停止以避免覆盖：' + relative(repositoryRoot, destinationPath),
      );
    }

    if (entry.name.toLowerCase().endsWith('.md')) {
      await writeFile(destinationPath, expectedContents, { flag: 'wx' });
    } else {
      await cp(sourcePath, destinationPath, { force: false, errorOnExist: true });
    }
  }
}

if (!(await pathExists(sourceDirectory))) {
  throw new Error(`找不到源目录：${relative(repositoryRoot, sourceDirectory)}`);
}

await copyDirectory(sourceDirectory, destinationDirectory);
console.log(`已同步 ${relative(repositoryRoot, sourceDirectory)} -> ${relative(repositoryRoot, destinationDirectory)}`);
