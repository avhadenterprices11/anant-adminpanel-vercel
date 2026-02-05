/**
 * Create Order Request Mapper
 *
 * Maps frontend OrderFormData to backend API request format
 */

import type { OrderFormData, OrderItem } from "../types/order.types";

/**
 * Backend create order request structure (for /admin/orders/direct)
 */
export interface CreateOrderRequest {
  // User/Customer
  user_id?: string;

  // Addresses (by ID)
  shipping_address_id?: string;
  billing_address_id?: string;

  // Required state codes for tax calculation
  shipping_state: string; // 2-letter state code
  billing_state: string; // 2-letter state code

  // Order info
  channel?: "web" | "app" | "pos" | "marketplace" | "other";
  is_draft?: boolean;
  is_international?: boolean;
  amz_order_id?: string;
  currency?: string;

  // Payment
  payment_method?: string;
  advance_paid_amount?: number;

  // Notes
  customer_note?: string;
  admin_comment?: string;
  tags?: string[];

  // Discount/Gift codes (optional)
  discount_code?: string;
  giftcard_code?: string;

  // Shipping
  shipping_amount?: number;
  delivery_price?: number;

  // Items
  items: CreateOrderItemRequest[];
}

export interface CreateOrderItemRequest {
  product_id: string;
  quantity: number;
  unit_price: number;
  cost_price?: number;
  product_name: string;
  sku: string;
  product_image?: string;
  discount_percentage?: number;
  discount_amount?: number;
  tax_percentage?: number;
}

/**
 * Map sales channel from frontend to backend enum
 */
function mapSalesChannel(channel: string): CreateOrderRequest["channel"] {
  switch (channel) {
    case "website":
      return "web";
    case "amazon":
      return "marketplace";
    case "flipkart":
      return "marketplace";
    case "retail":
      return "pos";
    case "whatsapp":
      return "other";
    default:
      return "web";
  }
}

/**
 * Map order items to backend format
 */
function mapOrderItems(items: OrderItem[]): CreateOrderItemRequest[] {
  return items.map((item) => ({
    product_id: item.productId,
    quantity: item.quantity,
    unit_price: item.costPrice,
    cost_price: item.costPrice,
    product_name: item.productName,
    sku: item.productSku,
    product_image: item.productImage || undefined,
    // Apply item-level discounts if present
    discount_percentage: item.discountType === 'percentage' ? item.discountValue : undefined,
    discount_amount: item.discountType === 'fixed' ? item.discountValue : undefined,
  }));
}

/**
 * Extract 2-letter state code from address
 */
function getStateCode(address: any): string {
  // If state is already 2 letters, use it
  if (address?.state && address.state.length === 2) {
    return address.state.toUpperCase();
  }
  
  // Common state mappings (add more as needed)
  const stateMap: Record<string, string> = {
    'maharashtra': 'MH',
    'delhi': 'DL',
    'karnataka': 'KA',
    'tamil nadu': 'TN',
    'gujarat': 'GJ',
    'rajasthan': 'RJ',
    'west bengal': 'WB',
    'madhya pradesh': 'MP',
    'uttar pradesh': 'UP',
    'bihar': 'BR',
    'andhra pradesh': 'AP',
    'telangana': 'TG',
    'kerala': 'KL',
    'punjab': 'PB',
    'haryana': 'HR',
  };
  
  const stateLower = (address?.state || '').toLowerCase().trim();
  return stateMap[stateLower] || 'MH'; // Default to Maharashtra
}

/**
 * Map frontend OrderFormData to backend CreateOrderRequest
 */
export function mapFormToCreateRequest(
  form: OrderFormData,
): CreateOrderRequest {
  return {
    // User/Customer - optional for guest orders
    user_id: form.customer?.id || undefined,

    // Addresses - optional
    shipping_address_id: form.shippingAddress?.id || undefined,
    billing_address_id: form.billingAddress?.id || undefined,

    // Required: State codes for tax calculation
    shipping_state: getStateCode(form.shippingAddress),
    billing_state: getStateCode(form.billingAddress || form.shippingAddress),

    // Order info
    channel: mapSalesChannel(form.salesChannel),
    is_draft: form.isDraftOrder,
    is_international: form.isInternational,
    amz_order_id: form.amazonOrderRef || undefined,
    currency: form.currency,

    // Payment
    payment_method: form.paymentMethod || 'cod',
    advance_paid_amount: form.pricing.advancePaid || 0,

    // Notes
    customer_note: form.customerNote || undefined,
    admin_comment: form.adminComment || undefined,
    tags: form.orderTags.length > 0 ? form.orderTags : undefined,

    // Shipping
    shipping_amount: form.pricing.shippingCharge || 0,
    delivery_price: form.pricing.shippingCharge || 0,

    // Items
    items: mapOrderItems(form.items),
  };
}
