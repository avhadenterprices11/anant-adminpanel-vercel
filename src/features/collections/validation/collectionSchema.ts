import { z } from 'zod';

export const collectionSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),

  description: z.string().optional(),

  bannerImage: z.string().url('Banner image must be a valid URL').optional(),
  bannerImageMobile: z.string().url('Mobile banner image must be a valid URL').optional(),

  collectionType: z.enum(['manual', 'automated']),

  conditionMatchType: z.enum(['all', 'any']).optional(),

  conditions: z.array(z.object({
    field: z.string().min(1, 'Field is required'),
    condition: z.string().min(1, 'Condition is required'),
    value: z.string().min(1, 'Value is required'),
  })).optional(),

  sortOrder: z.string().min(1, 'Sort order is required'),

  status: z.enum(['active', 'inactive']),

  publishDate: z.string().optional(),
  publishTime: z.string().optional(),

  tags: z.array(z.string()).optional(),

  urlHandle: z.string()
    .min(3, 'URL handle must be at least 3 characters')
    .regex(/^[a-z0-9-]+$/, 'URL handle can only contain lowercase letters, numbers, and hyphens'),

  metaTitle: z.string().max(60, 'Meta title should not exceed 60 characters').optional(),
  metaDescription: z.string().max(160, 'Meta description should not exceed 160 characters').optional(),
}).refine((data) => {
  // If collection type is automated, conditions are required
  if (data.collectionType === 'automated' && (!data.conditions || data.conditions.length === 0)) {
    return false;
  }
  return true;
}, {
  message: 'At least one condition is required for automated collections',
  path: ['conditions'],
}).refine((data) => {
  // If collection type is automated, conditionMatchType is required
  if (data.collectionType === 'automated' && !data.conditionMatchType) {
    return false;
  }
  return true;
}, {
  message: 'Condition match type is required for automated collections',
  path: ['conditionMatchType'],
});

export type CollectionFormData = z.infer<typeof collectionSchema>;
