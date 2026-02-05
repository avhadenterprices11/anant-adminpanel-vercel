import {
    makeGetRequestWithParams,
    makeGetRequest,
    makePostRequest,
    makePutRequest,
    makeDeleteRequest,
    httpClient
} from "@/lib/api";
import { API_ROUTES } from '@/lib/constants';
import type {
    CustomersApiResponse,
    CustomersQueryParams,
    CustomerFormData,
    Customer
} from "../types/customer.types";

export const customerService = {
    getCustomers: async (params: CustomersQueryParams) => {
        // Note: Assuming API_ROUTES.CUSTOMERS.BASE exists. If not, this might need adjustment based on valid routes.
        // For now mirroring products pattern.
        const response = await makeGetRequestWithParams<CustomersApiResponse>(
            API_ROUTES.CUSTOMERS.BASE,
            params
        );
        return response.data;
    },

    getCustomerById: async (id: string) => {
        const response = await makeGetRequest<{ data: CustomerFormData }>(
            API_ROUTES.CUSTOMERS.BY_ID(id)
        );
        return response.data.data;
    },

    createCustomer: async (data: CustomerFormData) => {
        const response = await makePostRequest<{ data: Customer }>(
            API_ROUTES.CUSTOMERS.CREATE,
            data
        );
        return response.data.data;
    },

    updateCustomer: async (id: string, data: any) => {
        const response = await makePutRequest<{ data: CustomerFormData }>(
            API_ROUTES.CUSTOMERS.BY_ID(id),
            data
        );
        return response.data.data;
    },

    deleteCustomer: async (id: string) => {
        const response = await makeDeleteRequest<{ message: string }>(
            API_ROUTES.CUSTOMERS.BY_ID(id)
        );
        return response.data;
    },

    bulkDeleteCustomers: async (ids: string[]) => {
        const response = await makeDeleteRequest<{
            data: { deleted_count: number; ids: string[] };
            message: string;
        }>(
            `users/bulk`,
            { ids }
        );
        return response.data;
    },

    getCustomerMetrics: async () => {
        const response = await makeGetRequest<{
            data: { total: number; active: number; inactive: number }
        }>(`users/metrics`);
        return response.data.data;
    },

    getTags: async () => {
        const response = await makeGetRequest<{ data: string[] }>(
            `users/tags`
        );
        return response.data.data;
    },

    // ============================================
    // ADDRESS MANAGEMENT
    // ============================================

    createAddress: async (userId: string, addressData: {
        type: 'Home' | 'Office' | 'Other';
        name: string;
        phone: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        pincode: string;
        country?: string;
        isDefault?: boolean;
        isDefaultBilling?: boolean;
        isDefaultShipping?: boolean;
    }) => {
        const response = await makePostRequest<{ data: any }>(
            `users/${userId}/addresses`,
            addressData
        );
        return response.data.data;
    },

    updateAddress: async (userId: string, addressId: string, addressData: {
        type?: 'Home' | 'Office' | 'Other';
        name?: string;
        phone?: string;
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        state?: string;
        pincode?: string;
        country?: string;
        isDefault?: boolean;
        isDefaultBilling?: boolean;
        isDefaultShipping?: boolean;
    }) => {
        const response = await makePutRequest<{ data: any }>(
            `users/${userId}/addresses/${addressId}`,
            addressData
        );
        return response.data.data;
    },

    deleteAddress: async (userId: string, addressId: string) => {
        const response = await makeDeleteRequest<{ message: string }>(
            `users/${userId}/addresses/${addressId}`
        );
        return response.data;
    },

    // ============================================
    // EMAIL OTP VERIFICATION
    // ============================================

    /**
     * Send OTP to email for verification
     */
    sendEmailOtp: async (email: string) => {
        const response = await makePostRequest<{
            data: { success: boolean; expiresIn: number; message: string }
        }>(
            API_ROUTES.CUSTOMERS.SEND_OTP,
            { email }
        );
        return response.data.data;
    },

    /**
     * Verify OTP code
     */
    verifyEmailOtp: async (email: string, otp: string) => {
        const response = await makePostRequest<{
            data: { verified: boolean }
        }>(
            API_ROUTES.CUSTOMERS.VERIFY_OTP,
            { email, otp }
        );
        return response.data.data;
    },

    // ============================================
    // IMPORT/EXPORT METHODS
    // ============================================

    /**
     * Import customers from CSV/JSON data
     */
    importCustomers: async (
        data: any[],
        mode: 'create' | 'update' | 'upsert'
    ) => {
        const response = await makePostRequest<{
            success: number;
            failed: number;
            skipped: number;
            errors: Array<{ row: number; name: string; error: string }>;
        }>(
            'users/customers/import',
            { data, mode }
        );
        return response.data;
    },

    /**
     * Export customers with various filters and formats
     * POST /api/users/customers/export
     */
    exportCustomers: async (options: {
        scope: 'all' | 'selected';
        format: 'csv' | 'xlsx';
        selectedIds?: string[];
        selectedColumns: string[];
        dateRange?: {
            from: string;
            to: string;
        };
    }): Promise<Blob> => {
        try {
            const response = await httpClient.post(
                API_ROUTES.CUSTOMERS.EXPORT || 'users/customers/export',
                options,
                {
                    responseType: 'blob',
                }
            );

            return response.data;
        } catch (error) {
            console.error('Failed to export customers', error);
            throw error;
        }
    },

    /**
     * Fetch customer payment history
     */
    getCustomerPaymentHistory: async (userId: string, params: { page?: number; limit?: number; status?: string }) => {
        const response = await makeGetRequestWithParams<{
            data: {
                transactions: any[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    total_pages: number;
                }
            }
        }>(
            API_ROUTES.CUSTOMERS.PAYMENTS(userId),
            params
        );
        return response.data.data;
    },
};
