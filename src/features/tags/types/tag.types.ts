/**
 * Tag Type Definitions
 * 
 * TypeScript interfaces for tag data matching backend schema
 */

export interface Tag {
    id: string;
    name: string;
    type: string;
    status: boolean;
    usage_count: number;
    created_at: string;
    updated_at: string;
    created_by?: string;
}

export interface TagFilters {
    search?: string;
    type?: string;
    status?: string | boolean;
    page?: number;
    limit?: number;
    sort?: string;
}

export interface TagFormData {
    name: string;
    type: string;
    status: boolean;
}

export interface TagResponse {
    tags: Tag[];
    total: number;
    page: number;
    limit: number;
}
