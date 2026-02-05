/**
 * API Route Constants
 * 
 * Centralized API endpoint definitions for all features.
 * Use these constants in your service files to avoid hardcoding endpoints.
 * 
 * @example
 * import { API_ROUTES } from '@/lib/constants/apiRoutes';
 * makeGetRequest(API_ROUTES.PRODUCTS.BASE);
 */

export const API_ROUTES = {
  // Authentication
  AUTH: {
    LOGIN: 'auth/login',
    LOGOUT: 'auth/logout',
    REGISTER: 'auth/register',
    REFRESH_TOKEN: 'auth/refresh',
    FORGOT_PASSWORD: 'auth/forgot-password',
    RESET_PASSWORD: 'auth/reset-password',
  },

  // Products
  PRODUCTS: {
    BASE: 'products',
    BY_ID: (id: string) => `products/${id}`,
    BULK_DELETE: 'products/bulk-delete',
    BULK_UPDATE: 'products/bulk-update',
  },

  UPLOADS: {
    BASE: 'uploads',
  },
  TIERS: {
    BASE: 'tiers',
    BY_ID: (id: string) => `tiers/${id}`,
    HIERARCHY: 'tiers/hierarchy',
    IMPORT: 'tiers/import',
    EXPORT: 'tiers/export',
  },
  TAGS: {
    BASE: 'tags',
    BY_ID: (id: string) => `tags/${id}`,
    EXPORT: 'tags/export',
    BULK_DELETE: 'tags/bulk',
  },

  // Collections
  COLLECTIONS: {
    BASE: 'collections',
    BY_ID: (id: string) => `collections/${id}`,
    BULK_DELETE: 'collections/bulk-delete',
  },

  // Orders
  ORDERS: {
    BASE: 'admin/orders',
    BY_ID: (id: string) => `admin/orders/${id}`,
    CREATE: 'admin/orders/direct', // Admin direct order creation (not cart-based)
    STATUS: (id: string) => `admin/orders/${id}/status`,
    CREATE_PAYMENT_ORDER: 'admin/orders/create-payment-order',
    VERIFY_PAYMENT: 'admin/orders/verify-payment',

    // Status updates
    FULFILLMENT: (id: string) => `admin/orders/${id}/fulfillment`,
    PAYMENT: (id: string) => `admin/orders/${id}/payment`,
    TRACKING: (id: string) => `admin/orders/${id}/tracking`,

    // Drafts
    DRAFTS: 'admin/orders/drafts',
    CONFIRM_DRAFT: (id: string) => `admin/orders/drafts/${id}/confirm`,

    // Metrics
    METRICS: 'admin/orders/metrics',

    // Phase 3 - Enhanced Order APIs
    DUPLICATE: (id: string) => `admin/orders/${id}/duplicate`,
    BULK_DELETE: 'admin/orders',
    SEARCH_PRODUCTS: 'admin/products/search',
    TAGS: 'admin/order-tags',
    CREATE_TAG: 'admin/order-tags',
  },

  // Abandoned Carts
  ABANDONED_CARTS: {
    BASE: 'admin/abandoned-carts',
    BY_ID: (id: string) => `admin/abandoned-carts/${id}`,
    METRICS: 'admin/abandoned-carts/metrics',
    SEND_EMAILS: 'admin/abandoned-carts/send-emails',
    EMAIL_TEMPLATES: 'admin/abandoned-carts/email-templates',
  },

  // Customers
  CUSTOMERS: {
    BASE: 'users/customers', // Get all customers (paginated)
    CREATE: 'users/customer', // Create new customer (POST)
    BY_ID: (id: string) => `users/customer/${id}`, // Get/Update customer details
    ORDERS: (id: string) => `users/${id}/orders`, // Get customer orders
    SEND_OTP: 'users/send-otp', // Send OTP for email verification
    VERIFY_OTP: 'users/verify-otp', // Verify OTP code
    IMPORT: 'users/customers/import', // Import customers
    EXPORT: 'users/customers/export', // Export customers
    PAYMENTS: (id: string) => `payments/admin/payments/customer/${id}`, // Customer payment history
  },

  // Blogs
  BLOGS: {
    BASE: 'blogs',
    BY_ID: (id: string) => `blogs/${id}`,
    PUBLISH: (id: string) => `blogs/${id}/publish`,
    UNPUBLISH: (id: string) => `blogs/${id}/unpublish`,
    IMPORT: 'blogs/import',
    EXPORT: 'blogs/export',
  },

  // Discounts
  DISCOUNTS: {
    BASE: 'discounts',
    BY_ID: (id: string) => `discounts/${id}`,
    VALIDATE: 'discounts/validate',
  },

  // Dashboard/Analytics
  DASHBOARD: {
    STATS: 'dashboard/stats',
    RECENT_ORDERS: 'dashboard/recent-orders',
    TOP_PRODUCTS: 'dashboard/top-products',
  },

  // Gift Cards
  GIFT_CARDS: {
    BASE: 'gift-cards',
    BY_ID: (id: string) => `gift-cards/${id}`,
    REDEEM: 'gift-cards/redeem',
    BALANCE: 'gift-cards/balance',
    STATS: 'gift-cards/stats',
    BULK_CREATE: 'gift-cards/bulk-create',
    EXPORT: 'gift-cards/export',
    DISABLE: (id: string) => `gift-cards/${id}/disable`,
    ENABLE: (id: string) => `gift-cards/${id}/enable`,
  },

  // Settings
  SETTINGS: {
    ROLES: 'settings/roles',
    PERMISSIONS: 'settings/permissions',
    SECTIONS: 'settings/sections',
    STORE: 'settings/store',
    PAYMENTS: 'settings/payments',
    SHIPPING: 'settings/shipping',
    TAXES: 'settings/taxes',
  },

  // Invitations
  INVITATIONS: {
    BASE: 'admin/invitations',
    BY_ID: (id: string) => `admin/invitations/${id}`,
    DETAILS: 'admin/invitations/details',
    ACCEPT: 'admin/invitations/accept',
  },

  // Inventory
  INVENTORY: {
    BASE: 'inventory',
    BY_ID: (id: string) => `inventory/${id}`,
    HISTORY: (id: string) => `inventory/${id}/history`,
    ADJUST: (id: string) => `inventory/${id}/adjust`,
    TRANSFERS: 'inventory/transfers',
    TRANSFER_BY_ID: (id: string) => `inventory/transfers/${id}`,
    EXECUTE_TRANSFER: (id: string) => `inventory/transfers/${id}/execute`,
    PRODUCT_LOCATIONS: (productId: string) => `inventory/products/${productId}/locations`,
    PRODUCT_HISTORY: (productId: string) => `inventory/products/${productId}/history`,

    // Future: Bulk operations (to be implemented in backend)
    BULK_RECEIVE: 'inventory/bulk-receive',
    BULK_ADJUST: 'inventory/bulk-adjust',
    BULK_TRANSFER: 'inventory/bulk-transfer',
    BULK_DAMAGED: 'inventory/bulk-damaged',
    LOCATIONS: 'inventory/locations',
  },
};