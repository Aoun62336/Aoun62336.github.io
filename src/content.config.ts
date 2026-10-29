import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/projects',
  }),

  schema: z.object({
    title: z.string(),
    category: z.string(),
    description: z.string(),
    role: z.string(),
    period: z.string(),
    order: z.number(),
    technologies: z.array(z.string()),
    flow: z.array(z.string()),
    source: z.url().optional(),
  }),
});

export const collections = { projects };