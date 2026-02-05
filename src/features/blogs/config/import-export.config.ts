/**
 * Import/Export Configuration for Blogs
 * 
 * Defines the schema-based configuration for importing and exporting blogs
 */

import type { ImportField, ExportColumn } from '@/components/features/import-export';

/**
 * Import fields configuration for Blogs
 * Based on the Blog schema in the backend
 */
export const blogImportFields: ImportField[] = [
    {
        id: 'title',
        label: 'Title',
        required: true,
        type: 'text',
        description: 'Blog post title (max 255 characters)'
    },
    {
        id: 'slug',
        label: 'Slug',
        required: false,
        type: 'text',
        description: 'URL-friendly identifier (auto-generated from title if empty)'
    },
    {
        id: 'description',
        label: 'Description',
        required: false,
        type: 'text',
        description: 'Short summary (max 150 characters)'
    },
    {
        id: 'content',
        label: 'Content',
        required: false,
        type: 'text',
        description: 'Full blog content (HTML supported)'
    },
    {
        id: 'quote',
        label: 'Quote',
        required: false,
        type: 'text',
        description: 'Featured quote (max 500 characters)'
    },
    {
        id: 'category',
        label: 'Category',
        required: false,
        type: 'select',
        options: ['Product Guide', 'Buying Guide', 'Sports Tips', 'Health & Wellness', 'Technology', 'Lifestyle'],
        description: 'Blog category (max 100 characters)'
    },
    {
        id: 'tags',
        label: 'Tags',
        required: false,
        type: 'text',
        description: 'Comma-separated tags (e.g., "water purifier,health,guide")'
    },
    {
        id: 'author',
        label: 'Author',
        required: false,
        type: 'text',
        description: 'Author name (max 255 characters)'
    },
    {
        id: 'status',
        label: 'Status',
        required: false,
        type: 'select',
        options: ['public', 'private', 'draft'],
        description: 'Publication status (default: draft)'
    },
    {
        id: 'meta_title',
        label: 'Meta Title',
        required: false,
        type: 'text',
        description: 'SEO meta title (max 60 characters)'
    },
    {
        id: 'meta_description',
        label: 'Meta Description',
        required: false,
        type: 'text',
        description: 'SEO meta description (max 160 characters)'
    },
    {
        id: 'admin_comment',
        label: 'Admin Comment',
        required: false,
        type: 'text',
        description: 'Internal notes/comments for administrators'
    }
];

/**
 * Export columns configuration for Blogs
 * Includes all available fields from the Blog model
 */
export const blogExportColumns: ExportColumn[] = [
    {
        id: 'id',
        label: 'Blog ID',
        defaultSelected: true
    },
    {
        id: 'title',
        label: 'Title',
        defaultSelected: true
    },
    {
        id: 'slug',
        label: 'Slug',
        defaultSelected: true
    },
    {
        id: 'description',
        label: 'Description',
        defaultSelected: true
    },
    {
        id: 'content',
        label: 'Content',
        defaultSelected: false // Large field, not selected by default
    },
    {
        id: 'quote',
        label: 'Quote',
        defaultSelected: true
    },
    {
        id: 'category',
        label: 'Category',
        defaultSelected: true
    },
    {
        id: 'tags',
        label: 'Tags',
        defaultSelected: true
    },
    {
        id: 'author',
        label: 'Author',
        defaultSelected: true
    },
    {
        id: 'status',
        label: 'Status',
        defaultSelected: true
    },
    {
        id: 'meta_title',
        label: 'Meta Title',
        defaultSelected: false
    },
    {
        id: 'meta_description',
        label: 'Meta Description',
        defaultSelected: false
    },
    {
        id: 'admin_comment',
        label: 'Admin Comment',
        defaultSelected: false
    },
    {
        id: 'published_at',
        label: 'Published Date',
        defaultSelected: true
    },
    {
        id: 'views_count',
        label: 'Views',
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
 * Template URL for blog CSV template
 */
export const blogTemplateUrl = `${import.meta.env.VITE_SUPABASE_STORAGE_URL}/import-templates/blogs-template.csv?download`;

/**
 * Module name for display
 */
export const blogModuleName = 'Blogs';
