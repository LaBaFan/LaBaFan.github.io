import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/notes'
  }),
  schema: z.object({
    title: z.string().optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    section: z.string().optional(),
    course: z.string().optional(),
    tags: z.array(z.string()).default([]),
    comments: z.boolean().default(true),
    draft: z.boolean().default(false),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional()
  })
});

export const collections = { notes };
