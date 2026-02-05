/**
 * Import/Export Configuration for Tags
 * 
 * Defines the schema-based configuration for importing and exporting tags
 */

import type { ImportField, ExportColumn } from '@/components/features/import-export';

/**
 * Import fields configuration for Tags
 * Based on the Tag schema in the backend
 */
export const tagImportFields: ImportField[] = [
    {
        id: 'name',
        label: 'Tag Name',
        required: true,
        type: 'text'
    },
    {
        id: 'type',
        label: 'Type',
        required: true,
        type: 'select',
        options: ['customer', 'product', 'blogs', 'order']
    },
    {
        id: 'status',
        label: 'Status',
        required: false,
        type: 'select',
        options: ['true', 'false']
    }
];

/**
 * Export columns configuration for Tags
 * Includes all available fields from the Tag model
 */
export const tagExportColumns: ExportColumn[] = [
    {
        id: 'id',
        label: 'Tag ID',
        defaultSelected: true
    },
    {
        id: 'name',
        label: 'Tag Name',
        defaultSelected: true
    },
    {
        id: 'type',
        label: 'Type',
        defaultSelected: true
    },
    {
        id: 'status',
        label: 'Status',
        defaultSelected: true
    },
    {
        id: 'usage_count',
        label: 'Usage Count',
        defaultSelected: true
    },
    {
        id: 'created_at',
        label: 'Created Date',
        defaultSelected: true
    },
    {
        id: 'updated_at',
        label: 'Updated Date',
        defaultSelected: false
    },
    {
        id: 'created_by',
        label: 'Created By',
        defaultSelected: false
    }
];

/**
 * Template URL for downloading tags import template
 */
export const tagTemplateUrl = `${import.meta.env.VITE_SUPABASE_STORAGE_URL}/import-templates/tags-template.csv?download`;

/**
 * Module name for tags (used in dialogs)
 */
export const tagModuleName = 'Tags';
