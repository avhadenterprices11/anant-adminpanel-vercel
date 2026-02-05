import {
    makeGetRequest,
    makeGetRequestWithParams,
    makePostRequest,
    makePutRequest,
    makeDeleteRequest
} from '@/lib/api/baseApi';
import { httpClient } from '@/lib/api';
import { API_ROUTES } from '@/lib/constants/api-routes';
import { logger } from '@/lib/utils/logger';
import type { Tier, TierFormData } from '../types/tier.types';

/**
 * Backend DTO (Data Transfer Object)
 * Matches the snake_case structure of the backend API
 */
interface TierResponseDTO {
    id: string;
    name: string;
    code: string;
    description: string | null;
    level: 1 | 2 | 3 | 4;
    parent_id: string | null;
    status: 'active' | 'inactive';
    usage_count: number;
    created_at: string;
    updated_at: string;
    children?: TierResponseDTO[];
}

interface TierHierarchyResponse {
    tiers: TierResponseDTO[];
}



/**
 * Mappers
 */
const mapDtoToTier = (dto: TierResponseDTO): Tier => ({
    id: dto.id,
    name: dto.name,
    code: dto.code,
    description: dto.description || '',
    level: dto.level,
    parentId: dto.parent_id,
    status: dto.status,
    isDeleted: false,
    usageCount: dto.usage_count,
    children: dto.children?.map(mapDtoToTier),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
});

const mapFormDataToRequest = (data: Partial<TierFormData>) => {
    return {
        name: data.name,
        code: data.code,
        description: data.description || undefined,
        level: data.level,
        parent_id: data.parentId || undefined,
        status: data.status,
    };
};

/**
 * Tier Service
 * Handles all API calls for tier management
 */
class TierService {
    /**
     * Get all tiers with optional filters
     */
    async getAllTiers(params?: {
        status?: string;
        level?: string | number;
        search?: string;
        usage?: string;
    }): Promise<Tier[]> {
        const response = await makeGetRequestWithParams<{ data: TierResponseDTO[] }>(
            API_ROUTES.TIERS.BASE,
            params || {}
        );

        // ResponseFormatter wraps in { success, data: [...], message, meta }
        // Axios gives us response.data (the body), so response.data.data is the actual array
        return (response.data.data || []).map(mapDtoToTier);
    }

    /**
     * Get a single tier by ID
     */
    async getTierById(id: string): Promise<Tier> {
        const response = await makeGetRequest<{ data: TierResponseDTO }>(
            API_ROUTES.TIERS.BY_ID(id)
        );
        return mapDtoToTier(response.data.data);
    }

    /**
     * Create a new tier
     */
    async createTier(data: TierFormData): Promise<Tier> {
        const requestBody = mapFormDataToRequest(data);
        const response = await makePostRequest<{ data: TierResponseDTO }>(
            API_ROUTES.TIERS.BASE,
            requestBody
        );
        return mapDtoToTier(response.data.data);
    }

    /**
     * Update an existing tier
     */
    async updateTier(id: string, data: Partial<TierFormData>): Promise<Tier> {
        const requestBody = mapFormDataToRequest(data);
        const response = await makePutRequest<{ data: TierResponseDTO }>(
            API_ROUTES.TIERS.BY_ID(id),
            requestBody
        );
        return mapDtoToTier(response.data.data);
    }

    /**
     * Delete a tier
     */
    async deleteTier(id: string): Promise<void> {
        await makeDeleteRequest(API_ROUTES.TIERS.BY_ID(id));
    }

    /**
     * Bulk delete tiers
     */
    async bulkDeleteTiers(ids: string[]): Promise<void> {
        // Assuming backend supports this endpoint, similar to other services
        await makePostRequest(
            `${API_ROUTES.TIERS.BASE}/bulk-delete`,
            { ids }
        );
    }

    /**
     * Get available parent tiers for a given level
     */
    async getAvailableParents(level: 2 | 3 | 4): Promise<Tier[]> {
        const parentLevel = level - 1;
        // Fetch active tiers of the parent level
        const response = await makeGetRequestWithParams<{ data: TierResponseDTO[] }>(
            API_ROUTES.TIERS.BASE,
            { level: parentLevel, status: 'active' }
        );
        return (response.data.data || []).map(mapDtoToTier);
    }

    /**
     * Get tier hierarchy (tree structure)
     */
    async getTierHierarchy(): Promise<Tier[]> {
        const response = await makeGetRequest<{ data: TierHierarchyResponse }>(
            API_ROUTES.TIERS.HIERARCHY
        );
        // The API returns { success, data: { tiers: [...] }, ... }
        return (response.data.data.tiers || []).map(mapDtoToTier);
    }

    /**
     * Import tiers from CSV data
     * POST /api/tiers/import
     */
    async importTiers(
        data: any[],
        mode: 'create' | 'update' | 'upsert'
    ): Promise<{
        success: number;
        failed: number;
        skipped: number;
        errors: Array<{ row: number; name: string; error: string }>;
    }> {
        try {
            const response = await makePostRequest<{ data: any }, { data: any[]; mode: string }>(
                API_ROUTES.TIERS.IMPORT,
                {
                    data: data.map(item => ({
                        ...item,
                        // Ensure level is a number (it comes as string from CSV import)
                        level: item.level ? Number(item.level) : item.level,
                        // Ensure priority is a number if present
                        priority: item.priority !== undefined && item.priority !== null && item.priority !== ''
                            ? Number(item.priority)
                            : undefined
                    })),
                    mode
                }
            );
            return response.data.data;
        } catch (error) {
            logger.error('Failed to import tiers', error);
            throw error;
        }
    }

    /**
     * Export tiers with various filters and formats
     * POST /api/tiers/export
     */
    async exportTiers(options: {
        scope: 'all' | 'selected';
        format: 'csv' | 'xlsx';
        selectedIds?: string[];
        selectedColumns: string[];
        dateRange?: {
            from: string;
            to: string;
        };
    }): Promise<Blob> {
        try {
            const response = await httpClient.post(
                API_ROUTES.TIERS.EXPORT,
                options,
                {
                    responseType: 'blob',
                }
            );

            return response.data;
        } catch (error) {
            logger.error('Failed to export tiers', error);
            throw error;
        }
    }
}

export const tierService = new TierService();
