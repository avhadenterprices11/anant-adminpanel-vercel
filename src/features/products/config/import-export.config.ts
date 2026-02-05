/**
 * Product Import/Export Configuration
 * 
 * Defines the fields and columns available for product data import/export
 */

import type { ImportField } from '@/components/features/import-export/ImportDialog';
import type { ExportColumn } from '@/components/features/import-export/ExportDialog';

export const productImportFields: ImportField[] = [
    { id: 'product_title', label: 'Product Title', required: true, description: 'Name of the product', type: 'text' },
    { id: 'sku', label: 'SKU', required: true, description: 'Stock Keeping Unit (Unique Identifier)', type: 'text' },
    { id: 'selling_price', label: 'Selling Price', required: true, description: 'Number (e.g., 99.99)', type: 'number' },
    { id: 'cost_price', label: 'Cost Price', required: true, description: 'Number (e.g., 50.00)', type: 'number' },
    { id: 'compare_at_price', label: 'Compare at Price', required: false, description: 'Original price before discount', type: 'number' },
    
    { id: 'category_name', label: 'Category Name', required: false, description: 'Exact Tier 1 Name (e.g. Electronics).', type: 'text' },

    { id: 'status', label: 'Status', required: false, description: 'active, draft, or archived', type: 'select', options: ['active', 'draft', 'archived'] },
    { id: 'featured', label: 'Featured', required: false, description: 'true/false or 1/0', type: 'select', options: ['true', 'false'] },

    { id: 'hsn_code', label: 'HSN Code', required: false, type: 'text' },
    { id: 'barcode', label: 'Barcode', required: false, type: 'text' },
    
    { id: 'weight', label: 'Weight (kg)', required: false, type: 'number' },
    { id: 'length', label: 'Length (cm)', required: false, type: 'number' },
    { id: 'breadth', label: 'Breadth (cm)', required: false, type: 'number' },
    { id: 'height', label: 'Height (cm)', required: false, type: 'number' },
    
    // Phase 2A: inventory_quantity field removed from backend - manage via Inventory module
    // { id: 'inventory_quantity', label: 'Product Base Inventory', required: true, description: 'Initial stock (0 if empty)', type: 'number' },

    { id: 'short_description', label: 'Short Description', required: false, type: 'text' },
    { id: 'full_description', label: 'Full Description', required: false, description: 'HTML or Text', type: 'text' },
    
    { id: 'meta_title', label: 'Meta Title', required: false, type: 'text' },
    { id: 'meta_description', label: 'Meta Description', required: false, type: 'text' },
    { id: 'product_url', label: 'Product URL', required: false, type: 'text' },

    { id: 'tags', label: 'Tags', required: false, description: 'Comma separated list of tags', type: 'text' },
    { id: 'primary_image_url', label: 'Primary Image URL', required: false, type: 'text' },
    { id: 'additional_images', label: 'Additional Images', required: false, description: 'Comma separated URLs', type: 'text' },
];

export const productExportColumns: ExportColumn[] = [
    { id: 'id', label: 'Product ID' },
    { id: 'sku', label: 'SKU' },
    { id: 'product_title', label: 'Title' },
    { id: 'slug', label: 'Slug' },
    { id: 'status', label: 'Status' },
    { id: 'featured', label: 'Featured' },
    
    { id: 'selling_price', label: 'Selling Price' },
    { id: 'cost_price', label: 'Cost Price' },
    { id: 'compare_at_price', label: 'Compare Price' },
    
    { id: 'hsn_code', label: 'HSN Code' },
    { id: 'barcode', label: 'Barcode' },
    
    { id: 'weight', label: 'Weight' },
    { id: 'length', label: 'Length' },
    { id: 'breadth', label: 'Breadth' },
    { id: 'height', label: 'Height' },
    
    { id: 'short_description', label: 'Short Desc' },
    { id: 'meta_title', label: 'Meta Title' },
    { id: 'meta_description', label: 'Meta Desc' },
    
    { id: 'tags', label: 'Tags' },
    { id: 'primary_image_url', label: 'Image URL' },
    
    { id: 'created_at', label: 'Created At' },
    { id: 'updated_at', label: 'Updated At' }
];

export const productTemplateUrl = `${import.meta.env.VITE_SUPABASE_STORAGE_URL}/import-templates/products-template.csv?download`; 
export const productModuleName = 'Products';
