import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

/** Returns a file's latest commit time, or undefined when Git is unavailable. */
export async function getGitUpdatedAt(filePath: string): Promise<Date | undefined> {
  try {
    const { stdout } = await execFileAsync('git', ['log', '-1', '--format=%cI', '--', filePath], {
      timeout: 2_000,
    });
    const value = stdout.trim();
    if (!value) return undefined;

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  } catch {
    return undefined;
  }
}
