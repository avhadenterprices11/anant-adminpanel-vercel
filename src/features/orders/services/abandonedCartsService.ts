/**
 * Abandoned Carts API Service
 *
 * Service layer for abandoned carts API calls
 */

import {
  makeGetRequestWithParams,
  makeGetRequest,
  makePostRequest,
} from "@/lib/api";
import { API_ROUTES } from "@/lib/constants";
import type {
  AbandonedCartsListResponse,
  AbandonedCartDetailsResponse,
  AbandonedCartsMetricsResponse,
  AbandonedCartsQueryParams,
  SendRecoveryEmailRequest,
} from "./abandonedCartsApi.types";

export const abandonedCartsService = {
  /**
   * Get all abandoned carts with optional filtering and pagination
   */
  async getAbandonedCarts(
    params?: AbandonedCartsQueryParams,
  ): Promise<AbandonedCartsListResponse> {
    const response = await makeGetRequestWithParams<AbandonedCartsListResponse>(
      API_ROUTES.ABANDONED_CARTS.BASE,
      params || {},
    );
    return response.data;
  },

  /**
   * Get a single abandoned cart by ID
   */
  async getAbandonedCartById(
    id: string,
  ): Promise<AbandonedCartDetailsResponse> {
    const response = await makeGetRequest<AbandonedCartDetailsResponse>(
      API_ROUTES.ABANDONED_CARTS.BY_ID(id),
    );
    return response.data;
  },

  /**
   * Send recovery email to a single cart or multiple carts
   */
  async sendRecoveryEmail(
    data: SendRecoveryEmailRequest,
  ): Promise<{ success: boolean; message: string }> {
    const response = await makePostRequest<{
      success: boolean;
      message: string;
    }>(API_ROUTES.ABANDONED_CARTS.SEND_EMAILS, data);
    return response.data;
  },

  /**
   * Get email templates for abandoned cart recovery
   */
  async getEmailTemplates(): Promise<{
    templates: Array<{
      id: string;
      name: string;
      subject: string;
      category: string;
    }>;
  }> {
    const response = await makeGetRequest<{
      templates: Array<{
        id: string;
        name: string;
        subject: string;
        category: string;
      }>;
    }>(API_ROUTES.ABANDONED_CARTS.EMAIL_TEMPLATES);
    return response.data;
  },

  /**
   * Get abandoned carts metrics
   */
  async getMetrics(): Promise<AbandonedCartsMetricsResponse> {
    const response = await makeGetRequest<AbandonedCartsMetricsResponse>(
      API_ROUTES.ABANDONED_CARTS.METRICS,
    );
    return response.data;
  },
};
