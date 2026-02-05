/**
 * Tag Service
 * 
 * API integration for tags management
 */

import { makeGetRequestWithParams, makeGetRequest, makePostRequest, makePutRequest, makeDeleteRequest, httpClient } from '@/lib/api';
import { API_ROUTES } from '@/lib/constants';
import { logger } from '@/lib/utils/logger';
import type { Tag, TagFilters, TagFormData, TagResponse } from '../types/tag.types';

export const tagService = {
    /**
     * Get all tags with optional filters
     * GET /api/tags
     */
    getAllTags: async (params?: TagFilters): Promise<TagResponse> => {
        try {
            // Convert params to query string format expected by backend
            const queryParams: any = { ...params };
            if (queryParams.status !== undefined) {
                // Backend expects 'active'/'inactive' or 'true'/'false'
                if (queryParams.status === true) queryParams.status = 'active';
                if (queryParams.status === false) queryParams.status = 'inactive';
            }

            const response = await makeGetRequestWithParams<{ data: TagResponse }>( // Backend wraps in data object via ResponseFormatter
                API_ROUTES.TAGS?.BASE || '/tags',
                queryParams
            );

            // The ResponseFormatter returns { success: true, data: { tags: [], total... } }
            // makeGetRequestWithParams unwraps 'data' property of axios response, which is the full body
            // So response.data is { success: true, data: TagResponse, ... }
            // We need to return the inner data
            return response.data.data;
        } catch (error) {
            logger.error('Failed to fetch tags', error);
            throw error; // Let the component handle the error (or fallback if needed)
        }
    },

    /**
     * Get single tag by ID
     * GET /api/tags/:id
     */
    getTagById: async (id: string): Promise<Tag> => {
        const response = await makeGetRequest<{ data: Tag }>(
            API_ROUTES.TAGS?.BY_ID?.(id) || `/tags/${id}`
        );
        return response.data.data;
    },

    /**
     * Create new tag
     * POST /api/tags
     */
    createTag: async (data: TagFormData): Promise<Tag> => {
        const response = await makePostRequest<{ data: Tag }, TagFormData>(
            API_ROUTES.TAGS?.BASE || '/tags',
            data
        );
        return response.data.data;
    },

    /**
     * Update existing tag
     * PUT /api/tags/:id
     */
    updateTag: async (id: string, data: Partial<TagFormData>): Promise<Tag> => {
        const response = await makePutRequest<{ data: Tag }, Partial<TagFormData>>(
            API_ROUTES.TAGS?.BY_ID?.(id) || `/tags/${id}`,
            data
        );
        return response.data.data;
    },

    /**
     * Delete tag (soft delete)
     * DELETE /api/tags/:id
     */
    deleteTag: async (id: string): Promise<void> => {
        await makeDeleteRequest(API_ROUTES.TAGS?.BY_ID?.(id) || `/tags/${id}`);
    },

    /**
     * Bulk delete tags
     * DELETE /api/tags/bulk
     */
    bulkDeleteTags: async (ids: string[]): Promise<void> => {
        await makeDeleteRequest(
            API_ROUTES.TAGS?.BULK_DELETE || '/tags/bulk',
            { ids }
        );
    },

    /**
     * Import tags from CSV data
     * POST /api/tags/import
     */
    importTags: async (data: any[], mode: 'create' | 'update' | 'upsert'): Promise<{
        success: number;
        failed: number;
        skipped: number;
        errors: Array<{ row: number; name: string; error: string }>;
    }> => {
        try {
            const response = await makePostRequest<{ data: any }, { data: any[]; mode: string }>(
                '/tags/import',
                { data, mode }
            );
            return response.data.data;
        } catch (error) {
            logger.error('Failed to import tags', error);
            throw error;
        }
    },

    /**
     * Export tags with various filters and formats
     * POST /api/tags/export
     */
    exportTags: async (options: {
        scope: 'all' | 'selected';
        format: 'csv' | 'xlsx';
        selectedIds?: string[];
        selectedColumns: string[];
        dateRange?: {
            from: string;
            to: string;
        };
    }): Promise<Blob> => {
        try {
            const response = await httpClient.post(
                API_ROUTES.TAGS?.EXPORT || 'tags/export',
                options,
                {
                    responseType: 'blob',
                }
            );

            return response.data;
        } catch (error) {
            logger.error('Failed to export tags', error);
            throw error;
        }
    },
};
