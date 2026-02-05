import {
  makeGetRequestWithParams,
  makeGetRequest,
  makePostRequest,
  makePutRequest,
  makeDeleteRequest,
  httpClient
} from "@/lib/api";
import { API_ROUTES } from '@/lib/constants';
import { logger } from '@/lib/utils/logger';
import type {
  ProductsApiResponse,
  ProductsQueryParams,
  ProductFormData,
  BackendProductDetail,
  ProductStats
} from "../types/product.types";

export const productService = {
  getProducts: async (params: ProductsQueryParams): Promise<ProductsApiResponse['data']> => {
    logger.debug('[ProductService] Calling API with params', params);
    const response = await makeGetRequestWithParams<ProductsApiResponse>(
      API_ROUTES.PRODUCTS.BASE,
      params
    );
    // Extract the nested data object from backend response
    return response.data.data;
  },

  getProductById: async (id: string): Promise<ProductFormData> => {
    const response = await makeGetRequest<{ data: BackendProductDetail }>(
      API_ROUTES.PRODUCTS.BY_ID(id)
    );
    const data = response.data.data;

    // Map Backend Snake_Case to Frontend CamelCase
    return {
      id: data.id,
      productTitle: data.product_title,
      secondaryTitle: data.secondary_title || '',
      shortDescription: data.short_description || '',
      fullDescription: data.full_description || '',
      adminComment: data.admin_comment || '',


      costPrice: data.cost_price || '0',
      sellingPrice: data.selling_price || '0',
      compareAtPrice: data.compare_at_price || '0',

      sku: data.sku || '',
      hsnNumber: data.hsn_code || '',
      barcode: data.barcode || '',

      inventoryQuantity: String(data.base_inventory || data.total_stock || 0),
      weight: data.weight || '',
      length: data.length || '',
      breadth: data.breadth || '',
      height: data.height || '',

      tier1Category: data.category_tier_1 || '',
      tier2Category: data.category_tier_2 || '',
      tier3Category: data.category_tier_3 || '',
      tier4Category: data.category_tier_4 || '',

      productStatus: (data.status as 'draft' | 'active' | 'archived' | 'schedule') || 'draft',
      featured: data.featured || false,

      productImages: (() => {
        const images: any[] = [];
        if (data.primary_image_url) {
          images.push({
            id: 'primary',
            url: data.primary_image_url,
            isPrimary: true,
            uploadStatus: 'success',
            thumbnailUrl: data.thumbnail_url || undefined,
          });
        }
        if (data.additional_images && Array.isArray(data.additional_images)) {
          const addThumbnails = Array.isArray(data.additional_thumbnails) ? data.additional_thumbnails : [];
          data.additional_images.forEach((url: string, index: number) => {
            images.push({
              id: `additional-${index}`,
              url: url,
              isPrimary: false,
              uploadStatus: 'success',
              thumbnailUrl: addThumbnails[index] || undefined,
            });
          });
        }
        return images;
      })(),

      productUrl: data.product_url || '',
      metaTitle: data.meta_title || '',
      metaDescription: data.meta_description || '',

      faqs: (data.faqs || []).map((faq: any, index: number) => ({
        id: faq.id || `faq-${index}`,
        question: faq.question || '',
        answer: faq.answer || '',
      })),

      tags: (data.tags as string[]) || [],

      slug: data.slug || '',

      // Variants
      productVariants: (data.variants || []).map(v => ({
        id: v.id,
        optionName: v.option_name,
        optionValue: v.option_value,
        sku: v.sku,
        barcode: v.barcode || '',
        costPrice: v.cost_price,
        sellingPrice: v.selling_price,
        compareAtPrice: v.compare_at_price || '',
        inventoryQuantity: String(v.inventory_quantity || 0),
        image: v.image_url || '',
        enabled: v.is_active,
      })),

      // Metadata
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      createdBy: 'Admin' // Placeholder
    } as ProductFormData;
  },

  createProduct: async (data: ProductFormData) => {
    // Helper to convert empty strings to undefined (backend Zod expects undefined, not null)
    const toOptionalString = (value: string | null | undefined): string | undefined => {
      return value && value.trim() ? value.trim() : undefined;
    };

    // Helper to convert numeric strings to decimal or undefined
    const toOptionalDecimal = (value: string | null | undefined): string | undefined => {
      if (!value || value.trim() === '' || value === '0') return undefined;
      const num = parseFloat(value);
      return !isNaN(num) && num > 0 ? num.toFixed(2) : undefined;
    };

    // Map frontend status to backend-supported values
    // Backend only supports: 'draft', 'active', 'archived'
    // 'schedule' maps to 'draft' (scheduled products are drafts until publish date)
    const mapStatus = (frontendStatus: string): string => {
      const statusMap: Record<string, string> = {
        'draft': 'draft',
        'active': 'active',
        'archived': 'archived',
        'schedule': 'draft',
      };
      return statusMap[frontendStatus] || 'draft';
    };

    // Map Frontend CamelCase to Backend Snake_Case
    const payload: any = {
      slug: data.slug || data.productTitle.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim(),
      product_title: data.productTitle,
      secondary_title: toOptionalString(data.secondaryTitle),
      short_description: toOptionalString(data.shortDescription),
      full_description: toOptionalString(data.fullDescription),
      admin_comment: toOptionalString(data.adminComment),


      status: mapStatus(data.productStatus),
      featured: data.featured || false,

      cost_price: data.costPrice || '0.00',
      selling_price: data.sellingPrice,
      compare_at_price: data.compareAtPrice || null,

      sku: data.sku,
      hsn_code: toOptionalString(data.hsnNumber),
      barcode: toOptionalString(data.barcode),

      weight: toOptionalDecimal(data.weight),
      length: toOptionalDecimal(data.length),
      breadth: toOptionalDecimal(data.breadth),
      height: toOptionalDecimal(data.height),

      // Categories - Send UUIDs to backend
      category_tier_1: toOptionalString(data.tier1Category),
      category_tier_2: toOptionalString(data.tier2Category),
      category_tier_3: toOptionalString(data.tier3Category),
      category_tier_4: toOptionalString(data.tier4Category),

      // Images
      primary_image_url: (data.productImages.find(img => img.isPrimary)?.url || data.productImages[0]?.url) || undefined,
      thumbnail_url: (data.productImages.find(img => img.isPrimary)?.thumbnailUrl || data.productImages[0]?.thumbnailUrl) || undefined,
      additional_images: data.productImages
        .filter(img => {
          const primaryUrl = (data.productImages.find(p => p.isPrimary)?.url || data.productImages[0]?.url);
          return img.url !== primaryUrl;
        })
        .map(img => img.url)
        .filter(url => url && url.trim()),
      additional_thumbnails: data.productImages
        .filter(img => {
          const primaryUrl = (data.productImages.find(p => p.isPrimary)?.url || data.productImages[0]?.url);
          return img.url !== primaryUrl;
        })
        .map(img => img.thumbnailUrl)
        .filter(url => url && url.trim()),

      // SEO
      meta_title: toOptionalString(data.metaTitle),
      meta_description: toOptionalString(data.metaDescription),
      product_url: toOptionalString(data.productUrl),

      tags: data.tags || [],

      // FAQs - send array of question/answer pairs
      faqs: data.faqs.map(faq => ({
        question: faq.question,
        answer: faq.answer,
      })),

      // Inventory - Restore for creation
      inventory_quantity: parseInt(data.inventoryQuantity || '0', 10),

      // Variants support
      has_variants: data.productVariants && data.productVariants.length > 0,
      variants: (data.productVariants || []).map(variant => ({
        option_name: variant.optionName || '',
        option_value: variant.optionValue || '',
        sku: variant.sku,
        barcode: variant.barcode || null,
        cost_price: variant.costPrice || '0.00',
        selling_price: variant.sellingPrice,
        compare_at_price: variant.compareAtPrice || null,
        inventory_quantity: parseInt(variant.inventoryQuantity || '0', 10),
        image_url: variant.image || null,
        thumbnail_url: null,
      })),
    };

    logger.debug('[ProductService] Creating product with payload', payload);

    const response = await makePostRequest<{ data: any }>(
      API_ROUTES.PRODUCTS.BASE,
      payload
    );
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<ProductFormData>) => {
    // Helper to convert numeric strings to decimal or null
    const toOptionalDecimal = (value: string | null | undefined): string | null => {
      if (!value || value.trim() === '' || value === '0') return null;
      const num = parseFloat(value);
      return !isNaN(num) && num > 0 ? num.toFixed(2) : null;
    };

    // Map Frontend CamelCase to Backend Snake_Case
    const payload: any = {};

    if (data.productTitle !== undefined) payload.product_title = data.productTitle;
    if (data.secondaryTitle !== undefined) payload.secondary_title = data.secondaryTitle;
    if (data.shortDescription !== undefined) payload.short_description = data.shortDescription;
    if (data.fullDescription !== undefined) payload.full_description = data.fullDescription;
    if (data.adminComment !== undefined) payload.admin_comment = data.adminComment;


    if (data.costPrice !== undefined) payload.cost_price = data.costPrice;
    if (data.sellingPrice !== undefined) payload.selling_price = data.sellingPrice;
    if (data.compareAtPrice !== undefined) {
      // Convert "0" or empty string to null to avoid constraint violations
      const comparePrice = parseFloat(data.compareAtPrice);
      payload.compare_at_price = (!isNaN(comparePrice) && comparePrice > 0) ? data.compareAtPrice : null;
    }

    if (data.sku !== undefined) payload.sku = data.sku;
    if (data.hsnNumber !== undefined) payload.hsn_code = data.hsnNumber;
    if (data.barcode !== undefined) payload.barcode = data.barcode;

    // Inventory
    if (data.inventoryQuantity !== undefined) {
      payload.inventory_quantity = parseInt(data.inventoryQuantity || '0', 10);
    }

    // Dimensional fields - convert empty strings to null, validate decimals
    if (data.weight !== undefined) payload.weight = toOptionalDecimal(data.weight);
    if (data.length !== undefined) payload.length = toOptionalDecimal(data.length);
    if (data.breadth !== undefined) payload.breadth = toOptionalDecimal(data.breadth);
    if (data.height !== undefined) payload.height = toOptionalDecimal(data.height);

    // Categories - Convert empty strings to null (DB expects UUID or null, not empty string)
    if (data.tier1Category !== undefined) {
      payload.category_tier_1 = data.tier1Category && data.tier1Category.trim() ? data.tier1Category : null;
    }
    if (data.tier2Category !== undefined) {
      payload.category_tier_2 = data.tier2Category && data.tier2Category.trim() ? data.tier2Category : null;
    }
    if (data.tier3Category !== undefined) {
      payload.category_tier_3 = data.tier3Category && data.tier3Category.trim() ? data.tier3Category : null;
    }
    if (data.tier4Category !== undefined) {
      payload.category_tier_4 = data.tier4Category && data.tier4Category.trim() ? data.tier4Category : null;
    }

    // Slug
    if (data.slug !== undefined) payload.slug = data.slug;

    // Map frontend status to backend-supported values
    if (data.productStatus !== undefined) {
      const statusMap: Record<string, string> = {
        'draft': 'draft',
        'active': 'active',
        'archived': 'archived',
        'schedule': 'draft',
      };
      payload.status = statusMap[data.productStatus] || 'draft';
    }
    if (data.featured !== undefined) payload.featured = data.featured;

    // SEO
    if (data.productUrl !== undefined) payload.product_url = data.productUrl;
    if (data.metaTitle !== undefined) payload.meta_title = data.metaTitle;
    if (data.metaDescription !== undefined) payload.meta_description = data.metaDescription;

    // Images (assuming new array replaces old one)
    if (data.productImages !== undefined) {
      const primaryImg = data.productImages.find(img => img.isPrimary) || data.productImages[0];
      const primaryUrl = primaryImg?.url;
      const primaryThumbnailUrl = primaryImg?.thumbnailUrl;

      payload.primary_image_url = primaryUrl || null;
      payload.thumbnail_url = primaryThumbnailUrl || null;

      const additionalImages = data.productImages
        .filter(img => img.url !== primaryUrl)
        .filter(img => img.url && img.url.trim());

      const additionalUrls = additionalImages.map(img => img.url);
      const additionalThumbnails = additionalImages.map(img => img.thumbnailUrl || '');

      // Ensure it's an actual array, not a stringified array
      payload.additional_images = Array.isArray(additionalUrls) ? additionalUrls : [];
      payload.additional_thumbnails = Array.isArray(additionalThumbnails) ? additionalThumbnails : [];
    }

    // Tags - ensure it's an actual array, not a string
    if (data.tags !== undefined) {
      let tags = data.tags;
      // Handle if tags is a string (e.g., "[]" or "[\"tag1\",\"tag2\"]")
      if (typeof tags === 'string') {
        try {
          tags = JSON.parse(tags);
        } catch {
          tags = [];
        }
      }
      payload.tags = Array.isArray(tags) ? tags : [];
    }

    // FAQs - send array of question/answer pairs
    if (data.faqs !== undefined && data.faqs.length > 0) {
      payload.faqs = data.faqs.map(faq => ({
        question: faq.question,
        answer: faq.answer,
      }));
    }

    // Variants support - send variants to backend
    if (data.productVariants !== undefined) {
      payload.has_variants = data.productVariants.length > 0;
      payload.variants = data.productVariants.map(variant => ({
        // Include ID for existing variants (for update/delete detection)
        id: variant.id && !variant.id.startsWith('variant-') ? variant.id : undefined,
        option_name: variant.optionName || '',
        option_value: variant.optionValue || '',
        sku: variant.sku,
        barcode: variant.barcode || null,
        cost_price: variant.costPrice || '0.00',
        selling_price: variant.sellingPrice,
        compare_at_price: variant.compareAtPrice || null,
        inventory_quantity: parseInt(variant.inventoryQuantity || '0', 10),
        image_url: variant.image || null,
        thumbnail_url: null,
        is_active: variant.enabled ?? true,
      }));
    }

    logger.debug('[ProductService] Updating product with payload', payload);

    const response = await makePutRequest<{ data: ProductFormData }>(
      API_ROUTES.PRODUCTS.BY_ID(id),
      payload
    );
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await makeDeleteRequest<{ message: string }>(
      API_ROUTES.PRODUCTS.BY_ID(id)
    );
    return response.data;
  },

  bulkDeleteProducts: async (ids: string[]) => {
    const response = await makePostRequest<{ message: string; data: any }>(
      `${API_ROUTES.PRODUCTS.BASE}/bulk-delete`,
      { ids }
    );
    return response.data;
  },

  duplicateProducts: async (ids: string[]) => {
    const response = await makePostRequest<{ message: string; data: { count: number } }>(
      `${API_ROUTES.PRODUCTS.BASE}/duplicate`,
      { ids }
    );
    return response.data;
  },

  importProducts: async (data: any[], mode: 'create' | 'update' | 'upsert'): Promise<{
    success: number;
    failed: number;
    skipped: number;
    errors: Array<{ row: number; sku: string; error: string }>;
  }> => {
    try {
      const response = await makePostRequest<{ data: any }, { data: any[]; mode: string }>(
        `${API_ROUTES.PRODUCTS.BASE}/import`,
        { data, mode }
      );
      return response.data.data;
    } catch (error) {
      logger.error('Failed to import products', error);
      throw error;
    }
  },

  exportProducts: async (options: {
    scope: 'all' | 'selected';
    format: 'csv' | 'xlsx';
    selectedIds?: string[];
    selectedColumns: string[];
    dateRange?: { from: string; to: string };
    status?: string | string[];
    stockStatus?: string | string[];
    categoryId?: string | string[];
    search?: string;
  }): Promise<Blob> => {
    try {
      const response = await httpClient.post(
        `${API_ROUTES.PRODUCTS.BASE}/export`,
        options,
        {
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Failed to export products', error);
      throw error;
    }
  },

  getProductStats: async (): Promise<ProductStats> => {
    const response = await makeGetRequest<{ data: ProductStats }>(
      `${API_ROUTES.PRODUCTS.BASE}/stats`
    );
    return response.data.data;
  },
};
