/**
 * Abandoned Carts API Type Definitions
 *
 * TypeScript types matching backend abandoned carts API responses
 */

// Backend abandoned cart item structure (from carts table)
export interface AbandonedCartApiItem {
  id: string;
  user_id: string;
  customer_email?: string;
  customer_name?: string;
  grand_total: string;
  cart_status: "active" | "abandoned" | "converted" | "expired";
  source: "web" | "app" | "pos" | "other";
  abandoned_at: string;
  last_activity_at: string;
  recovery_email_sent: boolean;
  recovery_email_sent_at?: string;
  items_count?: number;
  items?: AbandonedCartItemApi[];
}

export interface AbandonedCartItemApi {
  id: string;
  product_id: string;
  product_name: string;
  product_image_url?: string;
  product_sku?: string;
  quantity: number;
  cost_price: string;
  line_total: string;
}

// Paginated list response
export interface AbandonedCartsListResponse {
  success: boolean;
  data: {
    carts: AbandonedCartApiItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message: string;
}

// Single cart details response
export interface AbandonedCartDetailsResponse {
  success: boolean;
  data: AbandonedCartApiItem;
  message: string;
}

// Metrics response
export interface AbandonedCartsMetricsResponse {
  success: boolean;
  data: {
    total_abandoned: number;
    potential_revenue: string;
    emails_sent: number;
    recovered_count: number;
    recovery_rate: string;
  };
  message: string;
}

// Request types
export interface AbandonedCartsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "not-contacted" | "email-sent" | "recovered" | "";
  channel?: "web" | "app" | "";
  from_date?: string;
  to_date?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface SendRecoveryEmailRequest {
  template_id?: string;
  custom_message?: string;
}

export interface BulkSendEmailRequest {
  cart_ids: string[];
  template_id?: string;
}
