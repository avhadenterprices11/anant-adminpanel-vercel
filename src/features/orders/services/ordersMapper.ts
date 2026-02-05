/**
 * Orders Data Mapper
 * 
 * Maps backend API responses to frontend UI types
 */

import type { OrderApiItem } from './ordersApi.types';
import type { Order } from '../types/order.types';

/**
 * Map backend order API item to frontend Order type
 */
export function mapApiToOrder(apiOrder: OrderApiItem): Order {
    return {
        orderId: apiOrder.id,
        orderNumber: apiOrder.order_number,
        orderDate: apiOrder.created_at,
        orderStatus: mapOrderStatus(apiOrder.order_status),

        customer: (apiOrder as any).customer || {
            id: apiOrder.user_id || '',
            name: apiOrder.customer_name || 'Guest',
            email: apiOrder.customer_email || '',
            phone: '',
            type: 'B2C',
        },

        items: ((apiOrder as any)['items'] || []).map(mapApiItemToOrderItem),
        // Use total_quantity (units) if available, otherwise fallback to unique items count
        itemsCount: Number(apiOrder.total_quantity || apiOrder.items_count || ((apiOrder as any)['items'] ? (apiOrder as any)['items'].length : 0)),

        grandTotal: parseFloat(apiOrder.total_amount),
        currency: 'INR',

        fulfillmentStatus: mapFulfillmentStatus(apiOrder.fulfillment_status),
        paymentStatus: mapPaymentStatus(apiOrder.payment_status),

        salesChannel: mapChannel(apiOrder.channel),
        deliveryPartners: [],
        deliveryPrice: 0, // TODO: Map from API if available
        returnAmount: 0,
        discountAmount: 0, // TODO: Map from API if available

        shippingAddress: (apiOrder as any).shipping_address,
        billingAddress: (apiOrder as any).billing_address,

        customerNote: (apiOrder as any).customer_note,
        adminComment: (apiOrder as any).admin_comment,

        createdBy: 'System',
        createdOn: apiOrder.created_at,
        lastModified: apiOrder.updated_at || apiOrder.created_at,
        modifiedBy: 'System',
    };
}

/**
 * Map backend order status to frontend status
 */
/**
 * Map backend order status to frontend status
 */
function mapOrderStatus(status: string): any {
    return status;
}

/**
 * Map backend fulfillment status to frontend status
 */
function mapFulfillmentStatus(status: string): any {
    return status;
}

/**
 * Map backend payment status to frontend status
 */
function mapPaymentStatus(status: string): any {
    return status;
}

/**
 * Map backend channel to frontend sales channel
 */
function mapChannel(channel: string): 'website' | 'amazon' | 'flipkart' | 'retail' | 'whatsapp' {
    switch (channel) {
        case 'web':
            return 'website';
        case 'app':
            return 'website';
        case 'marketplace':
            return 'amazon';
        case 'pos':
            return 'retail';
        case 'other':
        default:
            return 'website';
    }
}

/**
 * Map API item to OrderItem with defensive defaults
 */
function mapApiItemToOrderItem(apiItem: any): import("../types/order.types").OrderItem {
    // Get available stock - check for explicit 0 vs missing
    const stockValue = apiItem.available_stock ?? apiItem.availableStock;
    // Only use default if stock is undefined/null, not if it's explicitly 0
    const availableStock = stockValue !== undefined && stockValue !== null 
        ? Number(stockValue) 
        : 9999; // Default to high value if not provided (allows order, backend will validate)
    
    return {
        id: apiItem.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        productId: apiItem.product_id || apiItem.productId || "",
        productName: apiItem.product_name || apiItem.productName || "Unknown Product",
        productSku: apiItem.sku || apiItem.productSku || "",
        productImage: apiItem.product_image || apiItem.productImage || "",
        quantity: Number(apiItem.quantity) || 1,
        costPrice: parseFloat(apiItem.cost_price || apiItem.costPrice || "0") || 0,
        discountType: apiItem.discount_type || apiItem.discountType || "",
        discountValue: Number(apiItem.discount_value || apiItem.discountValue) || 0,
        availableStock,
    };
}
