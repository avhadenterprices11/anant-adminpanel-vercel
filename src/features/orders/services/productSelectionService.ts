/**
 * Product Selection Service for Orders
 * 
 * Fetches products with variants expanded for order creation.
 * Each variant is treated as a separate selectable item.
 */

import { makeGetRequestWithParams } from "@/lib/api";
import { API_ROUTES } from '@/lib/constants';
import { logger } from '@/lib/utils/logger';

export interface ProductVariantSelection {
  id: string; // variant_id or product_id
  product_id: string;
  product_title: string;
  variant_option?: string; // e.g., "Size: Medium"
  sku: string;
  selling_price: string;
  cost_price?: string;
  primary_image_url: string | null;
  category_tier_1: string | null;
  inventory_quantity: number;
  is_variant: boolean;
  variant_id?: string;
}

export interface ProductSelectionQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProductSelectionResponse {
  products: ProductVariantSelection[];
  total: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Fetch products with variants expanded as individual rows
 */
export const fetchProductsForSelection = async (
  params: ProductSelectionQueryParams
): Promise<ProductSelectionResponse> => {
  try {
    logger.debug('[ProductSelectionService] Fetching products with params', params);

    // Fetch products from the main products API
    const response = await makeGetRequestWithParams<{
      data: {
        products: any[];
        total: number;
        totalPages: number;
        currentPage: number;
      };
    }>(API_ROUTES.PRODUCTS.BASE, params);

    const { products, total: _total, currentPage } = response.data.data;

    // Transform products - expand variants into separate items
    const expandedProducts: ProductVariantSelection[] = [];

    for (const product of products) {
      // Fetch detailed product data to get variants
      const detailResponse = await makeGetRequestWithParams<{ data: any }>(
        API_ROUTES.PRODUCTS.BY_ID(product.id),
        {}
      );
      
      const productDetail = detailResponse.data.data;
      const hasVariants = productDetail.has_variants && productDetail.variants?.length > 0;

      if (hasVariants) {
        // Add each variant as a separate row
        for (const variant of productDetail.variants) {
          expandedProducts.push({
            id: variant.id, // Use variant ID for selection
            product_id: product.id,
            product_title: product.product_title,
            variant_option: `${variant.option_name}: ${variant.option_value}`,
            sku: variant.sku,
            selling_price: variant.selling_price,
            cost_price: variant.cost_price,
            primary_image_url: variant.image_url || product.primary_image_url,
            category_tier_1: product.category_tier_1,
            inventory_quantity: variant.inventory_quantity || 0,
            is_variant: true,
            variant_id: variant.id,
          });
        }
      } else {
        // Add product as single item
        expandedProducts.push({
          id: product.id,
          product_id: product.id,
          product_title: product.product_title,
          sku: product.sku,
          selling_price: product.selling_price,
          cost_price: product.cost_price,
          primary_image_url: product.primary_image_url,
          category_tier_1: product.category_tier_1,
          inventory_quantity: product.inventory_quantity || 0,
          is_variant: false,
        });
      }
    }

    // Calculate total based on expanded products
    // Note: This is an approximation since we're expanding on the current page only
    const totalPages = Math.ceil(expandedProducts.length / (params.limit || 10));

    return {
      products: expandedProducts,
      total: expandedProducts.length,
      totalPages,
      currentPage,
    };
  } catch (error) {
    logger.error('[ProductSelectionService] Error fetching products', error);
    throw error;
  }
};
