/**
 * Types for Phase 3 Enhanced Order APIs
 */

// ============================================
// Product Search Types
// ============================================

export interface ProductSearchParams {
    query?: string;
    limit?: number;
    check_stock?: boolean;
}

export interface ProductSearchResult {
    id: string;
    name: string;
    sku: string;
    price: string;
    stock_quantity: number;
    image_url?: string;
}

export interface ProductSearchResponse {
    products: ProductSearchResult[];
}

// ============================================
// Order Tag Types
// ============================================

export interface OrderTag {
    id: string;
    name: string;
    color?: string;
    created_at?: string;
}

export interface CreateTagRequest {
    name: string;
    color?: string;
}

export interface CreateTagResponse {
    tag: OrderTag;
}

export interface OrderTagsResponse {
    tags: OrderTag[];
}

// ============================================
// Bulk Delete Types
// ============================================

export interface BulkDeleteRequest {
    order_ids: string[];
}

export interface BulkDeleteResponse {
    deleted_count: number;
    order_ids: string[];
}

// ============================================
// Duplicate Order Types
// ============================================

export interface DuplicateOrderResponse {
    order: any; // Uses same structure as Order type
}

// ============================================
// Email Template Types
// ============================================

// EmailTemplate is imported from abandonedOrder.types.ts to avoid duplication

export interface EmailTemplatesResponse {
    templates: {
        id: string;
        name: string;
        subject: string;
        category: string;
    }[];
}
