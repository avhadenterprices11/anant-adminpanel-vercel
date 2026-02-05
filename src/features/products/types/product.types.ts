export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  file?: File; // Optional if needed for upload logic
  name?: string;
  size?: number;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
  /** Blob URL for instant preview (local file, not yet uploaded) */
  previewUrl?: string;
  /** Upload progress percentage (0-100) */
  uploadProgress?: number;
  /** Error message if upload failed */
  errorMessage?: string;
  /** Thumbnail URL (compressed, for faster grid loading) */
  thumbnailUrl?: string;
}

/**
 * Represents a file that is pending upload (held in browser memory).
 * Used in the deferred upload pattern where files are only uploaded on form submit.
 */
export interface PendingImage {
  /** Unique local ID (e.g., crypto.randomUUID()) */
  id: string;
  /** The actual File object (not uploaded yet) */
  file: File;
  /** Blob URL for instant preview - MUST call URL.revokeObjectURL() when done */
  previewUrl: string;
  /** Is this the primary/cover image? */
  isPrimary: boolean;
  /** Current status in the upload lifecycle */
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
  /** Upload progress percentage (0-100) */
  uploadProgress?: number;
  /** Error message if upload failed */
  errorMessage?: string;
  /** The final URL after successful upload */
  uploadedUrl?: string;
  /** The thumbnail URL after successful upload */
  uploadedThumbnailUrl?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface VariantOption {
  id: string;
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  // Dimensions
  optionName?: string; // Single dimension support
  optionValue?: string; // Single dimension support
  combination?: { [key: string]: string }; // Multi-dimension support

  image?: string;
  imageFile?: File; // For deferred upload
  previewUrl?: string; // For deferred upload preview
  sku: string;
  barcode?: string;

  // Pricing
  costPrice?: string;
  sellingPrice: string;
  compareAtPrice: string;
  price?: string; // Alternative pricing field for variants

  // Inventory
  inventoryQuantity: string;

  enabled?: boolean;
}

// NOTE: This is the main ProductFormData interface used throughout the application.
// The validation schema in '../validation/productSchema.ts' exports ProductSchemaData instead
// to avoid naming conflicts. Both should eventually be unified in a future refactor.
export interface ProductFormData {
  // Basic Product Details
  productTitle: string;
  secondaryTitle: string;
  shortDescription: string;
  fullDescription: string;

  // Pricing
  costPrice: string;
  sellingPrice: string;
  compareAtPrice: string;

  //Product Identification
  sku: string;
  hsnNumber: string;
  barcode: string;

  // Inventory & Dimensions
  inventoryQuantity: string;
  weight: string;
  length: string;
  breadth: string;
  height: string;

  // Categorization (4-tier hierarchy - matching schema)
  tier1Category: string;
  tier2Category: string;
  tier3Category: string;
  tier4Category: string;

  // Availability & Flags
  productStatus: 'draft' | 'active' | 'archived' | 'schedule';
  featured: boolean;
  scheduleDate?: string;
  scheduleTime?: string;
  preorderEnabled?: boolean;
  preorderDate?: string;
  limitedEdition?: boolean;
  delistProduct?: boolean;
  delistDate?: string;
  giftWrapAvailable?: boolean;
  salesChannels?: string[];
  adminComment?: string;

  // Media
  productImages: ProductImage[];
  primaryImage?: string;
  additionalImages?: string[];

  // SEO & URL
  productUrl: string;
  metaTitle: string;
  metaDescription: string;

  // FAQ
  faqs: FAQItem[];

  // Tags
  tags: string[];
  size?: string;
  accessoriesGroup?: string;
  pickupLocation?: string;

  // Auto-generated slug
  slug?: string;

  // Variants
  productVariants?: ProductVariant[];
  variantOptions?: VariantOption[];

  // Read-only Metadata
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string; // Placeholder
}

export interface Product {
  id: string;
  slug?: string;
  product_title: string;
  selling_price: string;
  cost_price?: string;
  compare_at_price?: string | null;
  primary_image_url?: string | null;
  sku?: string;
  barcode?: string;
  hsn_code?: string;
  weight?: string | null;
  length?: string | null;
  breadth?: string | null;
  height?: string | null;
  // Phase 2A: inventory_quantity removed - products use inventory table
  status: 'draft' | 'active' | 'archived';
  featured?: boolean;
  category_tier_1?: string;
  category_tier_2?: string;
  tags?: string[] | null;
  total_stock?: number;
  rating?: number;
  review_count?: number;
  created_at: string;
  updated_at?: string;
}

// API Query Params
export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string | string[];
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  stockStatus?: 'in_stock' | 'out_of_stock' | 'low_stock' | ('in_stock' | 'out_of_stock' | 'low_stock')[];
  category_tier_1?: string | string[];
  quickFilter?: string | string[];
}

// Backend Response Type for Product Details
export interface BackendProductDetail {
  id: string;
  slug: string;
  product_title: string;
  secondary_title: string | null;
  short_description: string | null;
  full_description: string | null;
  status: string;
  cost_price: string;
  selling_price: string;
  compare_at_price: string | null;
  discount: number | null;
  sku: string;
  inStock: boolean;
  total_stock: number;
  base_inventory: number;
  primary_image_url: string | null;
  thumbnail_url?: string | null; // <--- NEW
  additional_images: string[];
  additional_thumbnails?: string[]; // <--- NEW
  images: string[];
  category_tier_1: string | null;
  category_tier_2: string | null;
  category_tier_3: string | null;
  category_tier_4: string | null;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  weight: string | null;
  length: string | null;
  breadth: string | null;
  height: string | null;
  meta_title: string | null;
  meta_description: string | null;
  admin_comment: string | null;
  product_url: string | null;
  hsn_code: string | null;
  barcode: string | null;
  tags: string[] | null;
  featured: boolean;
  faqs?: Array<{ id: string; question: string; answer: string }>;

  // Variants support
  has_variants: boolean;
  variants: Array<{
    id: string;
    product_id: string;
    option_name: string;
    option_value: string;
    sku: string;
    barcode?: string | null;
    cost_price: string;
    selling_price: string;
    compare_at_price?: string | null;
    inventory_quantity?: number;
    image_url?: string | null;
    thumbnail_url?: string | null;
    is_default: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }>;
}

export interface ProductsApiResponse {
  success: boolean;
  data: {
    products: Product[];
    total: number;
    totalPages: number;
    currentPage: number;
  };
  message: string;
}
export interface ProductStats {
  total: number;
  active: number;
  featured: number;
  out_of_stock: number;
  low_stock: number;
}
