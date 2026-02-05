import {
  makeGetRequestWithParams,
  makeGetRequest,
  makePostRequest,
  makePutRequest,
  makeDeleteRequest,
} from "@/lib/api";
import { API_ROUTES } from "@/lib/constants";
import type {
  OrderFormData,
  OrdersQueryParams,
} from "../types/order.types";
import type {
  OrdersListResponse,
  OrderDetailsResponse,
  DraftOrdersResponse,
  OrderMetricsResponse,
  UpdateFulfillmentRequest,
  UpdatePaymentRequest,
  UpdateTrackingRequest,
  ConfirmDraftRequest,
  UpdateOrderStatusRequest,
} from "./ordersApi.types";
import { mapFormToCreateRequest } from "./createOrderMapper";

export const orderService = {
  /**
   * Get all orders with optional filtering and pagination
   */
  async getOrders(params?: OrdersQueryParams): Promise<OrdersListResponse> {
    const response = await makeGetRequestWithParams<OrdersListResponse>(
      API_ROUTES.ORDERS.BASE,
      params || {},
    );
    return response.data;
  },

  /**
   * Get a single order by ID
   */
  async getOrderById(id: string): Promise<OrderDetailsResponse> {
    const response = await makeGetRequest<OrderDetailsResponse>(
      API_ROUTES.ORDERS.BY_ID(id),
    );
    return response.data;
  },

  /**
   * Create a new order
   */
  async createOrder(data: OrderFormData): Promise<{ data: any }> {
    // Map frontend form data to backend API format
    const mappedData = mapFormToCreateRequest(data);
    const response = await makePostRequest<{ data: any }>(
      API_ROUTES.ORDERS.CREATE,
      mappedData,
    );
    return response.data;
  },

  /**
   * Update an existing order
   */
  async updateOrder(
    id: string,
    data: Partial<OrderFormData>,
  ): Promise<{ data: any }> {
    // Map frontend form data to backend API format
    const mappedData = mapFormToCreateRequest(data as OrderFormData);
    const response = await makePutRequest<{ data: any }>(
      API_ROUTES.ORDERS.BY_ID(id),
      mappedData,
    );
    return response.data;
  },

  /**
   * Delete an order
   */
  async deleteOrder(id: string): Promise<void> {
    await makeDeleteRequest<void>(API_ROUTES.ORDERS.BY_ID(id));
  },

  /**
   * Update order status
   */
  async updateOrderStatus(
    id: string,
    data: UpdateOrderStatusRequest,
  ): Promise<{ data: OrderFormData }> {
    const response = await makePutRequest<{ data: OrderFormData }>(
      API_ROUTES.ORDERS.STATUS(id),
      data,
    );
    return response.data;
  },

  /**
   * Update fulfillment status
   */
  async updateFulfillmentStatus(id: string, data: UpdateFulfillmentRequest) {
    const response = await makePutRequest(
      API_ROUTES.ORDERS.FULFILLMENT(id),
      data,
    );
    return response.data;
  },

  /**
   * Update payment status
   */
  async updatePaymentStatus(id: string, data: UpdatePaymentRequest) {
    const response = await makePutRequest(API_ROUTES.ORDERS.PAYMENT(id), data);
    return response.data;
  },

  /**
   * Update tracking information
   */
  async updateTracking(id: string, data: UpdateTrackingRequest) {
    const response = await makePutRequest(API_ROUTES.ORDERS.TRACKING(id), data);
    return response.data;
  },

  /**
   * Get draft orders
   */
  async getDraftOrders(
    params?: OrdersQueryParams,
  ): Promise<DraftOrdersResponse> {
    const response = await makeGetRequestWithParams<DraftOrdersResponse>(
      API_ROUTES.ORDERS.DRAFTS,
      params || {},
    );
    return response.data;
  },

  /**
   * Confirm draft order
   */
  async confirmDraftOrder(id: string, data?: ConfirmDraftRequest) {
    const response = await makePostRequest(
      API_ROUTES.ORDERS.CONFIRM_DRAFT(id),
      data || { send_confirmation_email: true },
    );
    return response.data;
  },

  /**
   * Get order metrics/statistics
   */
  async getOrderMetrics(): Promise<OrderMetricsResponse> {
    const response = await makeGetRequest<OrderMetricsResponse>(
      API_ROUTES.ORDERS.METRICS,
    );
    return response.data;
  },

  /**
   * Create a payment order (Razorpay)
   */
  async createPaymentOrder(data: { orderId: string, paymentMethod: string }): Promise<any> {
    const response = await makePostRequest<any>(
      API_ROUTES.ORDERS.CREATE_PAYMENT_ORDER,
      data
    );
    return response.data;
  },

  /**
   * Verify payment signature
   */
  async verifyPayment(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<any> {
    const response = await makePostRequest<any>(
      API_ROUTES.ORDERS.VERIFY_PAYMENT,
      data
    );
    return response.data;
  },

  // ============================================
  // Phase 3 - Enhanced Order APIs
  // ============================================

  /**
   * Duplicate an existing order as a draft
   */
  async duplicateOrder(id: string): Promise<{ order: any }> {
    const response = await makePostRequest<{ order: any }>(
      API_ROUTES.ORDERS.DUPLICATE(id),
      {},
    );
    return response.data;
  },

  /**
   * Bulk delete orders
   */
  async bulkDeleteOrders(order_ids: string[]): Promise<{
    success: boolean;
    data: {
      deleted_count: number;
      order_ids: string[];
    };
    message: string;
  }> {
    const response = await makeDeleteRequest<{
      success: boolean;
      data: {
        deleted_count: number;
        order_ids: string[];
      };
      message: string;
    }>(API_ROUTES.ORDERS.BULK_DELETE, { order_ids });
    return response.data;
  },

  /**
   * Search products for order creation
   */
  async searchProducts(params: {
    query?: string;
    limit?: number;
    check_stock?: boolean;
  }): Promise<{
    products: Array<{
      id: string;
      name: string;
      sku: string;
      price: string;
      stock_quantity: number;
      image_url?: string;
    }>;
  }> {
    const response = await makeGetRequestWithParams<{
      products: Array<{
        id: string;
        name: string;
        sku: string;
        price: string;
        stock_quantity: number;
        image_url?: string;
      }>;
    }>(API_ROUTES.ORDERS.SEARCH_PRODUCTS, params);
    return response.data;
  },

  /**
   * Get all order tags
   */
  async getOrderTags(): Promise<{
    tags: Array<{ id: string; name: string; color?: string }>;
  }> {
    const response = await makeGetRequest<{
      tags: Array<{ id: string; name: string; color?: string }>;
    }>(API_ROUTES.ORDERS.TAGS);
    return response.data;
  },

  /**
   * Create a new order tag
   */
  async createOrderTag(data: {
    name: string;
    color?: string;
  }): Promise<{ tag: { id: string; name: string; color?: string } }> {
    const response = await makePostRequest<{
      tag: { id: string; name: string; color?: string };
    }>(API_ROUTES.ORDERS.CREATE_TAG, data);
    return response.data;
  },
};
