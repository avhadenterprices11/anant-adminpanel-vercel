/**
 * Edit Order Mapper
 *
 * Maps backend Order API response to frontend OrderFormData for editing
 */

import type { OrderFormData, SalesChannel } from "../types/order.types";

/**
 * Map API order response to OrderFormData for the edit form
 */
export function mapOrderToFormData(apiOrder: any): Partial<OrderFormData> {
  return {
    // Order basics
    salesChannel: mapChannelToSales(apiOrder.channel) as SalesChannel,
    currency: apiOrder.currency || "INR",
    isDraftOrder: apiOrder.is_draft || false,
    isInternational: apiOrder.is_international_order || false,
    amazonOrderRef: apiOrder.amz_order_id || "",

    // Customer
    customer: apiOrder.customer || {
      id: apiOrder.user_id || "",
      name: apiOrder.customer_name || "",
      email: apiOrder.customer_email || "",
      phone: "",
      type: "B2C",
    },

    // Addresses
    shippingAddress: apiOrder.shipping_address || null,
    billingAddress: apiOrder.billing_address || null,
    billingSameAsShipping: false,

    // Items
    items: (apiOrder.items || []).map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      productSku: item.sku || "",
      productImage: item.product_image || "",
      costPrice: parseFloat(item.cost_price) || 0,
      quantity: item.quantity || 1,
      discountType: "" as const,
      discountValue: 0,
    })),

    // Pricing
    pricing: {
      subtotal: parseFloat(apiOrder.subtotal) || 0,
      productDiscountsTotal: 0,
      orderDiscountType: "",
      orderDiscountValue: 0,
      orderDiscount: parseFloat(apiOrder.discount_total) || 0,
      taxType: apiOrder.tax_type || "cgst_sgst",
      cgstRate: 9,
      sgstRate: 9,
      igstRate: 18,
      cgst: parseFloat(apiOrder.cgst_amount) || 0,
      sgst: parseFloat(apiOrder.sgst_amount) || 0,
      igst: parseFloat(apiOrder.igst_amount) || 0,
      shippingCharge: parseFloat(apiOrder.shipping_total) || 0,
      codCharge: parseFloat(apiOrder.cod_charges) || 0,
      giftCardCode: "", // Added default value
      giftCardAmount: parseFloat(apiOrder.giftcard_total) || 0,
      advancePaid: parseFloat(apiOrder.advance_paid_amount) || 0,
      grandTotal: parseFloat(apiOrder.total_amount) || 0,
      balanceDue: 0,
    },

    // Payment
    paymentMethod: apiOrder.payment_method || "",

    // Notes
    customerNote: apiOrder.customer_note || "",
    adminComment: apiOrder.admin_comment || "",
    orderTags: apiOrder.tags || [],
  };
}

/**
 * Map backend channel to frontend sales channel
 */
function mapChannelToSales(channel: string): SalesChannel {
  switch (channel) {
    case "web":
      return "website";
    case "marketplace":
      return "amazon";
    case "pos":
      return "retail";
    case "other":
      return "whatsapp";
    default:
      return "website";
  }
}
