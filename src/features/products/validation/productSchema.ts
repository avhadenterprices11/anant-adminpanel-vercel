import { z } from 'zod';

export const productValidationSchema = z.object({
  // Basic Product Details
  productTitle: z.string()
    .min(3, 'Product title must be at least 3 characters')
    .max(200, 'Product title must not exceed 200 characters'),

  secondaryTitle: z.string()
    .max(200, 'Secondary title must not exceed 200 characters')
    .optional(),

  shortDescription: z.string()
    .max(500, 'Short description must not exceed 500 characters')
    .optional(),

  fullDescription: z.string()
    .min(10, 'Full description must be at least 10 characters'),

  // Pricing
  costPrice: z.string()
    .refine((val) => parseFloat(val) > 0, 'Cost price must be greater than 0'),

  sellingPrice: z.string()
    .refine((val) => parseFloat(val) > 0, 'Selling price must be greater than 0'),

  compareAtPrice: z.string()
    .refine((val) => !val || parseFloat(val) > 0, 'Compare at price must be greater than 0')
    .optional(),

  // Product Identification
  sku: z.string()
    .regex(/^[A-Z0-9-]+$/, 'SKU must contain only uppercase letters, numbers, and hyphens')
    .optional(),

  hsnNumber: z.string()
    .regex(/^[0-9]{6,8}$/, 'HSN number must be 6-8 digits')
    .optional(),

  barcode: z.string()
    .max(50, 'Barcode must not exceed 50 characters')
    .optional(),

  // Inventory & Dimensions
  inventoryQuantity: z.string()
    .refine((val) => !val || parseFloat(val) >= 0, 'Inventory quantity must be 0 or greater')
    .optional(),

  weight: z.string()
    .refine((val) => !val || parseFloat(val) > 0, 'Weight must be greater than 0')
    .optional(),

  length: z.string()
    .refine((val) => !val || parseFloat(val) > 0, 'Length must be greater than 0')
    .optional(),

  breadth: z.string()
    .refine((val) => !val || parseFloat(val) > 0, 'Breadth must be greater than 0')
    .optional(),

  height: z.string()
    .refine((val) => !val || parseFloat(val) > 0, 'Height must be greater than 0')
    .optional(),

  // Categorization (4-tier hierarchy)
  tier1Category: z.string().min(1, 'Tier 1 category is required'),
  tier2Category: z.string().min(1, 'Tier 2 category is required'),
  tier3Category: z.string().optional(),
  tier4Category: z.string().optional(),

  // Availability & Flags
  productStatus: z.enum(['draft', 'active', 'archived']),
  featured: z.boolean().optional(),
  delistProduct: z.boolean().optional(),
  delistDate: z.string().optional(),
  salesChannels: z.array(z.string()).optional(),

  // Scheduling & Preorder
  scheduleDate: z.string().optional(),
  scheduleTime: z.string().optional(),
  preorderEnabled: z.boolean().optional(),
  preorderDate: z.string().optional(),
  limitedEdition: z.boolean().optional(),

  // Media
  primaryImage: z.string().url('Primary image must be a valid URL').optional(),
  additionalImages: z.array(z.string().url('Image URL must be valid')).optional(),

  // SEO & URL
  productUrl: z.string()
    .regex(/^[a-z0-9-]+$/, 'Product URL must contain only lowercase letters, numbers, and hyphens'),

  metaTitle: z.string()
    .max(60, 'Meta title should not exceed 60 characters for optimal SEO')
    .optional(),

  metaDescription: z.string()
    .max(160, 'Meta description should not exceed 160 characters for optimal SEO')
    .optional(),

  // Associations
  size: z.string().optional(),
  accessoriesGroup: z.string().optional(),
  pickupLocation: z.string().optional(),
  giftWrapAvailable: z.boolean().optional(),

  // FAQ
  faqs: z.array(z.object({
    id: z.string(),
    question: z.string().min(1, 'FAQ question is required'),
    answer: z.string().min(1, 'FAQ answer is required'),
  })).optional(),
}).refine((data) => {
  // Selling price should be greater than or equal to cost price
  if (data.costPrice && data.sellingPrice) {
    return parseFloat(data.sellingPrice) >= parseFloat(data.costPrice);
  }
  return true;
}, {
  message: 'Selling price should be greater than cost price',
  path: ['sellingPrice'],
}).refine((data) => {
  // Compare at price should be greater than selling price
  if (data.compareAtPrice && data.sellingPrice) {
    return parseFloat(data.compareAtPrice) > parseFloat(data.sellingPrice);
  }
  return true;
}, {
  message: 'Compare at price should be greater than selling price',
  path: ['compareAtPrice'],
}).refine((data) => {
  // Preorder date is required when preorder is enabled
  if (data.preorderEnabled && !data.preorderDate) {
    return false;
  }
  return true;
}, {
  message: 'Preorder date is required when preorder is enabled',
  path: ['preorderDate'],
});

// NOTE: ProductFormData type is defined in '../types/product.types.ts' for actual use
// This schema is used for validation only. The inferred type is kept as ProductSchemaData
// to avoid conflicts with the main ProductFormData interface.
export type ProductSchemaData = z.infer<typeof productValidationSchema>;
