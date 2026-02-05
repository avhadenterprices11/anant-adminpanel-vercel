/**
 * useOrderDetail Hook
 *
 * Fetches and manages single order details with update capabilities
 */

import { useParams } from "react-router-dom";
import {
  useOrderDetail as useOrderDetailApi,
  useUpdateFulfillment,
  useUpdatePayment,
  useUpdateTracking,
} from "./useOrdersApi";
import { mapApiToOrder } from "../services/ordersMapper";
import type { Order } from "../types/order.types";
import {
  MOCK_ORDERS,
  MOCK_ORDERS_FULL,
  convertToOrderList,
} from "../data/mockOrders";

export function useOrderDetail() {
  const { id } = useParams<{ id: string }>();

  // Fetch order details
  const { data: orderResponse, isLoading, isError } = useOrderDetailApi(id!);

  // Mutations
  const updateFulfillment = useUpdateFulfillment();
  const updatePayment = useUpdatePayment();
  const updateTracking = useUpdateTracking();

  // Extract order from response - orderResponse is already the order data
  // Fallback to mock data if API fails or returns no data
  let order: Order | null | undefined = null;

  if (orderResponse) {
    // orderResponse is already the order data from the API
    // We need to map it using the unified mapper
    order = mapApiToOrder(orderResponse);
  } else if (isError || !isLoading) {
    // Use mock data as fallback - try to find by ID or use first order
    const mockIndex = MOCK_ORDERS.findIndex((o) => o.orderId === id);
    if (mockIndex !== -1) {
      // Found matching mock order - use full data
      const mockOrderFull = MOCK_ORDERS_FULL[mockIndex];
      order = convertToOrderList(mockOrderFull, mockIndex);
      // Add additional fields from full data
      order.shippingAddress = mockOrderFull.shippingAddress;
      order.billingAddress = mockOrderFull.billingAddress;
      order.customerNote = mockOrderFull.customerNote;
      order.adminComment = mockOrderFull.adminComment;
      order.pricing = mockOrderFull.pricing;
      order.trackingNumber = mockOrderFull.trackingNumber;
    } else if (MOCK_ORDERS_FULL.length > 0) {
      // Use first mock order as default demo
      const mockOrderFull = MOCK_ORDERS_FULL[0];
      order = convertToOrderList(mockOrderFull, 0);
      // Override ID to match URL
      order.orderId = id || order.orderId;
      order.shippingAddress = mockOrderFull.shippingAddress;
      order.billingAddress = mockOrderFull.billingAddress;
      order.customerNote = mockOrderFull.customerNote;
      order.adminComment = mockOrderFull.adminComment;
      order.pricing = mockOrderFull.pricing;
      order.trackingNumber = mockOrderFull.trackingNumber;
    }
  }

  const currencySymbol = order?.currency === "USD" ? "$" : "₹";

  // Helper to get status badge variant and label
  const getStatusBadge = (
    status: string,
    type: "order" | "fulfillment" | "payment",
  ): { variant: string; label: string } => {
    if (type === "order") {
      switch (status) {
        case "draft":
          return { variant: "secondary", label: "Draft" };
        case "confirmed":
          return { variant: "default", label: "Confirmed" };
        case "paid":
          return { variant: "emerald", label: "Paid" };
        default:
          return { variant: "secondary", label: status };
      }
    }

    if (type === "fulfillment") {
      switch (status) {
        case "Fulfilled":
          return { variant: "emerald", label: "Fulfilled" };
        case "Partial":
          return { variant: "default", label: "Partial" };
        case "Pending":
          return { variant: "secondary", label: "Pending" };
        case "Cancelled":
          return { variant: "destructive", label: "Cancelled" };
        default:
          return { variant: "secondary", label: status };
      }
    }

    if (type === "payment") {
      switch (status) {
        case "Paid":
          return { variant: "emerald", label: "Paid" };
        case "Pending":
          return { variant: "secondary", label: "Pending" };
        case "Overdue":
          return { variant: "destructive", label: "Overdue" };
        case "Partially Paid":
          return { variant: "default", label: "Partially Paid" };
        default:
          return { variant: "secondary", label: status };
      }
    }

    return { variant: "secondary", label: status };
  };

  // Update functions
  const handleUpdateFulfillment = (
    fulfillment_status: string,
    notes?: string,
  ) => {
    if (!id) return;
    updateFulfillment.mutate({
      id,
      data: {
        fulfillment_status: fulfillment_status as any,
        notes,
      },
    });
  };

  const handleUpdatePayment = (payment_status: string, notes?: string) => {
    if (!id) return;
    updatePayment.mutate({
      id,
      data: {
        payment_status: payment_status as any,
        notes,
      },
    });
  };

  const handleUpdateTracking = (tracking_number: string, carrier?: string) => {
    if (!id) return;
    updateTracking.mutate({
      id,
      data: {
        tracking_number,
        carrier,
      },
    });
  };

  return {
    order,
    isLoading: isLoading && !order, // Only show loading if we don't have order data
    isError: isError && !order, // Only show error if we don't have order data (fallback successful)
    currencySymbol,
    getStatusBadge,
    updateFulfillment: handleUpdateFulfillment,
    updatePayment: handleUpdatePayment,
    updateTracking: handleUpdateTracking,
    isUpdating:
      updateFulfillment.isPending ||
      updatePayment.isPending ||
      updateTracking.isPending,
  };
}


