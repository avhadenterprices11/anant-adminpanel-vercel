import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import { notifySuccess, notifyError } from '@/utils';
import type { OrdersQueryParams, OrderFormData } from '../types/order.types';

// Query keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (params: OrdersQueryParams) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

/**
 * Get all orders with filtering
 */
export function useOrders(params: OrdersQueryParams = {}) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => orderService.getOrders(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get single order by ID
 */
export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
  });
}

/**
 * Create new order
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OrderFormData) => orderService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      notifySuccess('Order created successfully!');
    },
    onError: (error: Error) => {
      notifyError(error?.message || 'Failed to create order');
    },
  });
}

/**
 * Update order
 */
export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<OrderFormData> }) =>
      orderService.updateOrder(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: orderKeys.detail(id) });
      const previousOrder = queryClient.getQueryData(orderKeys.detail(id));
      queryClient.setQueryData(orderKeys.detail(id), (old: OrderFormData | undefined) => ({
        ...old,
        ...data,
      }));
      return { previousOrder };
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      notifySuccess('Order updated successfully!');
    },
    onError: (error: Error, { id }, context) => {
      if (context?.previousOrder) {
        queryClient.setQueryData(orderKeys.detail(id), context.previousOrder);
      }
      notifyError(error?.message || 'Failed to update order');
    },
  });
}

/**
 * Delete order
 */
export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orderService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      notifySuccess('Order deleted successfully!');
    },
    onError: (error: Error) => {
      notifyError(error?.message || 'Failed to delete order');
    },
  });
}

/**
 * Create payment order
 */
export function useCreatePaymentOrderMutation() {
  return useMutation({
    mutationFn: (data: { orderId: string, paymentMethod: string }) =>
      orderService.createPaymentOrder(data),
    onError: (error: Error) => {
      console.error("Payment Order Creation Failed:", error);
      // notifyError handled in component or hook
    },
  });
}

/**
 * Verify payment
 */
export function useVerifyPaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => orderService.verifyPayment(data),
    onSuccess: () => {
      // Invalidate relevant queries to refresh order status
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.details() });
      notifySuccess('Payment verified successfully!');
    },
    onError: (error: Error) => {
      notifyError(error?.message || 'Payment verification failed');
    },
  });
}
