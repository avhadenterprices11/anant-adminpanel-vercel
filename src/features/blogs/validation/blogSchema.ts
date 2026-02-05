import { z } from 'zod';

export const blogSchema = z.object({
  // Basic Details
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required'),
  content: z.string().min(1, 'Content is required').refine(val => val.trim() !== '<p><br></p>', { message: 'Content is required' }),
  quote: z.string().optional(),
  excerpt: z.string().max(500, 'Excerpt must be less than 500 characters').optional(),

  // Categorization
  category: z.string().default(''), // Made optional with default

  tags: z.array(z.string()).default([]),

  // Visibility & Publishing - use enum with default
  // The normalization is handled in blogService.ts getBlogById which transforms 'draft'->'Draft'
  visibility: z.enum(['Public', 'Draft', 'Private']).default('Draft'),
  publishDate: z.string().optional(),
  publishTime: z.string().optional(),

  // Media
  featuredImage: z.string().optional(),
  galleryImages: z.array(z.string()).optional(),

  // SEO
  metaTitle: z.string().max(60, 'Meta title must be less than 60 characters').default(''),
  metaDescription: z.string().max(160, 'Meta description must be less than 160 characters').default(''),
  metaKeywords: z.array(z.string()).optional(),
  slug: z.string().default(''), // Made optional - will be generated from title
  metaURL: z.string().optional(),

  // Author & Attribution
  author: z.string().default(''),
  authorBio: z.string().optional(),
  authorImage: z.any().optional().nullable(),

  // Settings - added defaults
  allowComments: z.boolean().default(true),
  featured: z.boolean().default(false),
  sticky: z.boolean().default(false),
  adminComment: z.string().default(''),

  // Subsections
  subsections: z.array(z.object({
    id: z.string().optional(),
    title: z.string(),
    description: z.string(),
    image: z.any().optional(), // File or string URL
  })).default([]),

  // Device specific images (optional/nullable)
  mainImagePC: z.any().optional().nullable(),
  mainImageMobile: z.any().optional().nullable(),
});

// NOTE: BlogFormData type is defined in '../types/blog.types.ts' for actual use
// This schema is used for validation only. The inferred type is kept as BlogSchemaData
// to avoid conflicts with the main BlogFormData interface.
export type BlogSchemaData = z.infer<typeof blogSchema>;
