import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

const base = process.env.PUBLIC_BASE_PATH ?? '/';

export default defineConfig({
  output: 'static',
  site: 'https://LaBaFan.cc/',
  base,
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex]
  }
});
