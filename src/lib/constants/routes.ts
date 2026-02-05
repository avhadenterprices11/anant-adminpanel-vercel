/**
 * Application Route Constants
 * 
 * Centralized route definitions for navigation.
 * Use these constants throughout the app for type-safe routing.
 * 
 * @example
 * import { ROUTES } from '@/lib/constants/routes';
 * navigate(ROUTES.PRODUCTS.LIST);
 */

export const ROUTES = {
  // Dashboard
  DASHBOARD: '/dashboard',

  // Authentication
  AUTH: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    LOGOUT: '/logout',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },

  // Products
  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products/new',
    DETAIL: (id: string) => `/products/${id}`,
    EDIT: (id: string) => `/products/${id}/edit`,
  },

  // Collections
  COLLECTIONS: {
    LIST: '/collections',
    CREATE: '/collections/new',
    DETAIL: (id: string) => `/collections/${id}`,
    EDIT: (id: string) => `/collections/${id}/edit`,
  },

  // Tiers
  TIERS: {
    LIST: '/tiers',
    CREATE: '/tiers/new',
    DETAIL: (id: string) => `/tiers/${id}`,
    EDIT: (id: string) => `/tiers/${id}/edit`,
  },

  // Orders
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders/new',
    DETAIL: (id: string) => `/orders/${id}`,
    EDIT: (id: string) => `/orders/${id}/edit`,
    DRAFT: '/orders/draft',
    DRAFT_DETAIL: (id: string) => `/orders/draft/${id}`,
    ABANDONED_CART: '/orders/abandoned-cart',
  },

  // Customers
  CUSTOMERS: {
    LIST: '/customers',
    CREATE: '/customers/new',
    DETAIL: (id: string) => `/customers/${id}`,
    EDIT: (id: string) => `/customers/${id}/edit`,
  },

  // Customer Segments
  CUSTOMER_SEGMENTS: {
    LIST: '/customer-segments',
    CREATE: '/customer-segments/new',
    DETAIL: (id: string) => `/customer-segments/${id}`,
    EDIT: (id: string) => `/customer-segments/${id}/edit`,
  },

  // Bundles
  BUNDLES: {
    LIST: '/bundles',
    CREATE: '/bundles/new',
    DETAIL: (id: string) => `/bundles/${id}`,
    EDIT: (id: string) => `/bundles/${id}/edit`,
  },

  // Blogs
  BLOGS: {
    LIST: '/blogs',
    CREATE: '/blogs/add',
    DETAIL: (id: string) => `/blogs/${id}`,
    EDIT: (id: string) => `/blogs/${id}`,
  },

  // Discounts
  DISCOUNTS: {
    LIST: '/discounts',
    CREATE: '/discounts/new',
    DETAIL: (id: string) => `/discounts/${id}`,
  },

  // Gift Cards
  GIFTCARDS: {
    LIST: '/giftcards',
    CREATE: '/giftcards/new',
    DETAIL: (id: string) => `/giftcards/${id}`,
  },

  // Catalogs
  CATALOGS: {
    LIST: '/catalogs',
    CREATE: '/catalogs/new',
    DETAIL: (id: string) => `/catalogs/${id}`,
    EDIT: (id: string) => `/catalogs/${id}/edit`,
  },

  // Chats/Conversations
  CHATS: {
    LIST: '/conversations',
    DETAIL: (id: string) => `/conversations/${id}`,
  },

  // Access Management
  ACCESS_MANAGEMENT: {
    LIST: '/access-management',
    ROLES: '/access-management/roles',
    PERMISSIONS: '/access-management/permissions',
  },

  // Settings
  SETTINGS: {
    OVERVIEW: '/settings',
    ROLES: '/settings/roles',
    STORE: '/settings/store',
    PLAN: '/settings/plan',
    BILLING: '/settings/billing',
    PAYMENTS: '/settings/payments',
    CHECKOUT: '/settings/checkout',
    SHIPPING: '/settings/shipping',
    TAXES: '/settings/taxes',
    MARKETS: '/settings/markets',
    LOCATIONS: '/settings/locations',
    NOTIFICATIONS: '/settings/notifications',
    FILES: '/settings/files',
    POLICIES: '/settings/policies',
    METAFIELDS: '/settings/metafields',
    API: '/settings/api',
  },

  // Inventory
  INVENTORY: {
    LIST: '/inventory',
  },

  // Profile
  PROFILE: '/profile',

  // Notifications
  NOTIFICATIONS: '/notifications',
} as const;
