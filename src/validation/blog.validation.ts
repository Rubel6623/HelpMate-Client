import { z } from 'zod';

export const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(255),
  category: z.enum(['EARNING', 'PRODUCTIVITY', 'SAFETY', 'LIFESTYLE']),
  tags: z.array(z.string()),
  coverImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  readTimeMin: z.number().min(1),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
});

export type BlogValues = z.infer<typeof blogSchema>;
