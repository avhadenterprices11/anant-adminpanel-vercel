/**
 * Import/Export Configuration for Customers
 * 
 * Defines the schema-based configuration for importing and exporting customers
 * Based on actual fields implemented in AddCustomerPage and CustomerDetailPage
 */

import type { ImportField, ExportColumn } from '@/components/features/import-export';

/**
 * Import fields configuration for Customers
 * Based on actual customer form implementation
 */
export const customerImportFields: ImportField[] = [
    // ============================================
    // REQUIRED FIELDS (3)
    // ============================================
    {
        id: 'first_name',
        label: 'First Name',
        required: true,
        type: 'text',
        description: 'Customer first name (required, max 255 characters)'
    },
    {
        id: 'last_name',
        label: 'Last Name',
        required: true,
        type: 'text',
        description: 'Customer last name (required, max 255 characters)'
    },
    {
        id: 'email',
        label: 'Email',
        required: true,
        type: 'email',
        description: 'Primary email address (required, must be unique)'
    },

    // ============================================
    // OPTIONAL CORE FIELDS (8)
    // ============================================
    {
        id: 'display_name',
        label: 'Display Name',
        required: false,
        type: 'text',
        description: 'Public display name (auto-generated from first + last name if empty)'
    },
    {
        id: 'phone_number',
        label: 'Phone Number',
        required: false,
        type: 'text',
        description: 'Primary phone number (max 20 characters)'
    },
    {
        id: 'secondary_email',
        label: 'Secondary Email',
        required: false,
        type: 'email',
        description: 'Secondary email address'
    },
    {
        id: 'secondary_phone_number',
        label: 'Secondary Phone',
        required: false,
        type: 'text',
        description: 'Secondary phone number'
    },
    {
        id: 'date_of_birth',
        label: 'Date of Birth',
        required: false,
        type: 'date',
        description: 'Date of birth in YYYY-MM-DD format'
    },
    {
        id: 'gender',
        label: 'Gender',
        required: false,
        type: 'select',
        options: ['male', 'female', 'other', 'prefer_not_to_say'],
        description: 'Customer gender'
    },
    {
        id: 'user_type',
        label: 'Customer Type',
        required: false,
        type: 'select',
        options: ['individual', 'business'],
        description: 'Customer type: individual (B2C) or business (B2B) - default: individual'
    },
    {
        id: 'tags',
        label: 'Internal Tags',
        required: false,
        type: 'text',
        description: 'Comma-separated tags for internal classification (e.g., "vip,wholesale,corporate")'
    },

    // ============================================
    // PROFILE FIELDS (3)
    // ============================================
    {
        id: 'segments',
        label: 'Customer Segments',
        required: false,
        type: 'text',
        description: 'Comma-separated customer segments (e.g., "new,regular,vip") - options: new, regular, vip, at_risk'
    },
    {
        id: 'account_status',
        label: 'Account Status',
        required: false,
        type: 'select',
        options: ['active', 'inactive', 'banned'],
        description: 'Account status (default: active)'
    },
    {
        id: 'notes',
        label: 'Internal Notes',
        required: false,
        type: 'text',
        description: 'Internal notes about the customer (not visible to customer)'
    },

    // ============================================
    // BUSINESS FIELDS (4) - Only for user_type='business'
    // ============================================
    {
        id: 'company_name',
        label: 'Company Name',
        required: false,
        type: 'text',
        description: 'Company legal name (for business customers only, max 255 characters)'
    },
    {
        id: 'tax_id',
        label: 'Tax ID (GST/PAN)',
        required: false,
        type: 'text',
        description: 'GST number or PAN for business customers (max 50 characters)'
    },
    {
        id: 'credit_limit',
        label: 'Credit Limit',
        required: false,
        type: 'number',
        description: 'Credit limit for business customers (numeric value)'
    },
    {
        id: 'payment_terms',
        label: 'Payment Terms',
        required: false,
        type: 'select',
        options: ['immediate', 'net_15', 'net_30', 'net_60', 'net_90'],
        description: 'Payment terms for business customers'
    },

    // ============================================
    // ADDRESS FIELDS (7) - Optional single address per import
    // ============================================
    {
        id: 'address_name',
        label: 'Address Name',
        required: false,
        type: 'text',
        description: 'Recipient name for address (defaults to customer name)'
    },
    {
        id: 'address_line1',
        label: 'Address Line 1',
        required: false,
        type: 'text',
        description: 'Street address line 1 (max 255 characters)'
    },
    {
        id: 'address_line2',
        label: 'Address Line 2',
        required: false,
        type: 'text',
        description: 'Street address line 2, apartment, suite, etc.'
    },
    {
        id: 'city',
        label: 'City',
        required: false,
        type: 'text',
        description: 'City name (required if address provided)'
    },
    {
        id: 'state_province',
        label: 'State/Province',
        required: false,
        type: 'text',
        description: 'State or province (required if address provided)'
    },
    {
        id: 'postal_code',
        label: 'Postal Code',
        required: false,
        type: 'text',
        description: 'Postal code or ZIP code'
    },
    {
        id: 'country',
        label: 'Country',
        required: false,
        type: 'text',
        description: 'Country name (default: India)'
    },
];

/**
 * Export columns configuration for Customers
 * Based on actual fields displayed in customer list and detail pages
 */
export const customerExportColumns: ExportColumn[] = [
    // ============================================
    // DEFAULT SELECTED COLUMNS (9)
    // ============================================
    { id: 'customer_id', label: 'Customer ID', defaultSelected: true },
    { id: 'first_name', label: 'First Name', defaultSelected: true },
    { id: 'last_name', label: 'Last Name', defaultSelected: true },
    { id: 'email', label: 'Email', defaultSelected: true },
    { id: 'phone_number', label: 'Phone Number', defaultSelected: true },
    { id: 'user_type', label: 'Customer Type', defaultSelected: true },
    { id: 'segments', label: 'Segments', defaultSelected: true },
    { id: 'account_status', label: 'Status', defaultSelected: true },
    { id: 'created_at', label: 'Created At', defaultSelected: true },

    // ============================================
    // OPTIONAL CORE COLUMNS (8)
    // ============================================
    { id: 'display_name', label: 'Display Name', defaultSelected: false },
    { id: 'secondary_email', label: 'Secondary Email', defaultSelected: false },
    { id: 'secondary_phone_number', label: 'Secondary Phone', defaultSelected: false },
    { id: 'date_of_birth', label: 'Date of Birth', defaultSelected: false },
    { id: 'gender', label: 'Gender', defaultSelected: false },
    { id: 'tags', label: 'Internal Tags', defaultSelected: false },
    { id: 'notes', label: 'Internal Notes', defaultSelected: false },
    { id: 'profile_image_url', label: 'Profile Image URL', defaultSelected: false },

    // ============================================
    // VERIFICATION COLUMNS (3)
    // ============================================
    { id: 'email_verified', label: 'Email Verified', defaultSelected: false },
    { id: 'phone_verified', label: 'Phone Verified', defaultSelected: false },
    { id: 'secondary_email_verified', label: 'Secondary Email Verified', defaultSelected: false },

    // ============================================
    // BUSINESS COLUMNS (4) - Commented out as not used in form
    // ============================================
    // { id: 'company_name', label: 'Company Name', defaultSelected: false },
    // { id: 'tax_id', label: 'Tax ID', defaultSelected: false },
    // { id: 'credit_limit', label: 'Credit Limit', defaultSelected: false },
    // { id: 'payment_terms', label: 'Payment Terms', defaultSelected: false },

    // ============================================
    // ADDRESS COLUMNS (4) - From default address
    // ============================================
    { id: 'city', label: 'City', defaultSelected: false },
    { id: 'state', label: 'State', defaultSelected: false },
    { id: 'postal_code', label: 'Postal Code', defaultSelected: false },
    { id: 'country', label: 'Country', defaultSelected: false },

    // ============================================
    // METRICS COLUMNS (2) - Aggregated from orders
    // ============================================
    { id: 'total_orders', label: 'Total Orders', defaultSelected: false },
    { id: 'total_spent', label: 'Total Spent', defaultSelected: false },
];

/**
 * CSV Template URL
 */
export const customerTemplateUrl = `${import.meta.env.VITE_SUPABASE_STORAGE_URL}/import-templates/customers-template.csv?download`;

/**
 * Module name for display
 */
export const customerModuleName = 'customers';
