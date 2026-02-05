/**
 * Import/Export Configuration for Tiers
 * 
 * Defines the schema-based configuration for importing and exporting tiers
 */

import type { ImportField, ExportColumn } from '@/components/features/import-export';

/**
 * Import fields configuration for Tiers
 * Based on the Tier schema in the backend
 */
export const tierImportFields: ImportField[] = [
    {
        id: 'name',
        label: 'Tier Name',
        required: true,
        type: 'text',
        description: 'The display name of the tier'
    },
    {
        id: 'code',
        label: 'Code',
        required: false,
        type: 'text',
        description: 'URL-friendly slug (auto-generated if not provided)'
    },
    {
        id: 'description',
        label: 'Description',
        required: false,
        type: 'text',
        description: 'Optional description of the tier'
    },
    {
        id: 'level',
        label: 'Level',
        required: true,
        type: 'select',
        options: ['1', '2', '3', '4'],
        description: 'Hierarchy level (1=top, 4=bottom)'
    },
    {
        id: 'parent_code',
        label: 'Parent Code',
        required: false,
        type: 'text',
        description: 'Code of parent tier (required for levels 2-4)'
    },
    {
        id: 'priority',
        label: 'Priority',
        required: false,
        type: 'number',
        description: 'Display order (lower = first, default: 0)'
    },
    {
        id: 'status',
        label: 'Status',
        required: false,
        type: 'select',
        options: ['active', 'inactive'],
        description: 'Tier status (default: active)'
    }
];

/**
 * Export columns configuration for Tiers
 * Includes all available fields from the Tier model
 */
export const tierExportColumns: ExportColumn[] = [
    {
        id: 'id',
        label: 'Tier ID',
        defaultSelected: true
    },
    {
        id: 'name',
        label: 'Tier Name',
        defaultSelected: true
    },
    {
        id: 'code',
        label: 'Code',
        defaultSelected: true
    },
    {
        id: 'description',
        label: 'Description',
        defaultSelected: true
    },
    {
        id: 'level',
        label: 'Level',
        defaultSelected: true
    },
    {
        id: 'parent_id',
        label: 'Parent ID',
        defaultSelected: false
    },
    {
        id: 'parent_code',
        label: 'Parent Code',
        defaultSelected: true
    },
    {
        id: 'priority',
        label: 'Priority',
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
    }
];

/**
 * Template URL for tier CSV template
 */
export const tierTemplateUrl = `${import.meta.env.VITE_SUPABASE_STORAGE_URL}/import-templates/tiers-template.csv?download`;

/**
 * Module name for display
 */
export const tierModuleName = 'Tiers';
