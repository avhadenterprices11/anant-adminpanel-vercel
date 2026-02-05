/**
 * Inventory Service
 * 
 * Handles all inventory-related API calls including history.
 */

import { makeGetRequestWithParams } from "@/lib/api";
import { API_ROUTES } from '@/lib/constants';

export interface InventoryHistoryItem {
    id: string;
    adjustment_type: 'increase' | 'decrease' | 'correction' | 'write-off';
    quantity_change: number;
    reason: string;
    reference_number: string | null;
    quantity_before: number;
    quantity_after: number;
    adjusted_by: string;
    adjusted_at: string;
    notes: string | null;
    adjusted_by_name: string | null;
    target_name?: string;
    variant_sku?: string | null;
}

// Backend response structure from ResponseFormatter.paginated
export interface InventoryHistoryResponse {
    success: boolean;
    data: InventoryHistoryItem[];
    message: string;
    meta: {
        timestamp: string;
        pagination: {
            page: number;
            limit: number;
            total: number;
        };
    };
}

export interface InventoryHistoryParams {
    page?: number;
    limit?: number;
}

export const inventoryService = {
    /**
     * Get inventory adjustment history for a product
     */
    getProductHistory: async (
        productId: string,
        params: InventoryHistoryParams = {}
    ): Promise<{
        items: InventoryHistoryItem[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
    }> => {
        const response = await makeGetRequestWithParams<InventoryHistoryResponse>(
            API_ROUTES.INVENTORY.PRODUCT_HISTORY(productId),
            {
                page: params.page || 1,
                limit: params.limit || 20,
            }
        );

        // Access pagination from meta.pagination (not root level)
        const pagination = response.data.meta?.pagination || { page: 1, limit: 20, total: 0 };

        return {
            items: response.data.data || [],
            pagination: {
                ...pagination,
                totalPages: Math.ceil(pagination.total / pagination.limit) || 0,
            },
        };
    },
};
