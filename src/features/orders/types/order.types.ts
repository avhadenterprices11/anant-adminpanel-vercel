// Order Type Definitions

export interface Customer {
  id: string;
  customerId?: string; // Display ID (e.g., CUST-001)
  name: string;
  email: string;
  phone: string;
  gstin?: string;
  type: "B2B" | "B2C";
}

// Alias for backward compatibility with old code
export type SelectedCustomer = Customer;

export type SalesChannel = Order['salesChannel'];

export interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productImage: string;
  quantity: number;
  costPrice: number;
  discountType: "" | "percentage" | "fixed";
  discountValue: number;
  availableStock: number;
}

export interface OrderPricing {
  subtotal: number;
  productDiscountsTotal: number;
  orderDiscount: number;
  orderDiscountType: "" | "percentage" | "fixed";
  orderDiscountValue: number;

  // Tax (GST)
  taxType: "cgst_sgst" | "igst" | "none";
  cgst: number;
  cgstRate: number;
  sgst: number;
  sgstRate: number;
  igst: number;
  igstRate: number;

  // Additional Charges
  shippingCharge: number;
  codCharge: number;
  giftCardCode: string;
  giftCardAmount: number;

  // Payment
  paymentMethod?: string;

  // Totals
  grandTotal: number;
  advancePaid: number;
  balanceDue: number;
}

// Order List View Model
export interface Order {
  orderId: string;
  orderNumber: string;
  orderDate: string;
  orderStatus: "draft" | "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded" | "returned";

  customer: Customer;

  items: OrderItem[];
  itemsCount?: number;

  grandTotal: number;
  currency: "INR" | "USD" | "EUR";

  fulfillmentStatus: "unfulfilled" | "fulfilled" | "returned" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded" | "failed" | "partially_refunded";

  salesChannel: "website" | "amazon" | "flipkart" | "retail" | "whatsapp";
  deliveryPartners: string[];
  deliveryPrice: number;
  returnAmount: number;
  discountAmount: number;

  // Address info (for detail view)
  shippingAddress?: Address | null;
  billingAddress?: Address | null;

  // Notes (for detail view)
  customerNote?: string;
  adminComment?: string;

  // Additional fields for complete order details
  amazonOrderRef?: string;
  trackingNumber?: string;
  orderTags?: string[];

  // Pricing details (optional, for detailed view)
  pricing?: OrderPricing;

  // System fields
  createdBy: string;
  createdOn: string;
  lastModified: string;
  modifiedBy: string;
}

// Order Form Data (for create/edit)
export interface OrderFormData {
  // Order Basics
  orderNumber: string;
  orderDate: string;
  orderStatus: "draft" | "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded" | "returned";
  salesChannel: "website" | "amazon" | "flipkart" | "retail" | "whatsapp";
  currency: "INR" | "USD" | "EUR";
  amazonOrderRef: string;
  isDraftOrder: boolean;
  isInternational: boolean;

  // Customer & Addresses
  customer: Customer | null;
  shippingAddress: Address | null;
  billingAddress: Address | null;
  billingSameAsShipping: boolean;

  // Order Items
  items: OrderItem[];

  // Pricing
  pricing: OrderPricing;

  // Fulfillment
  fulfillmentStatus: "unfulfilled" | "fulfilled" | "returned" | "cancelled";
  deliveryPartners: string[];
  trackingNumber: string;

  // Payment
  paymentStatus: "pending" | "paid" | "refunded" | "failed" | "partially_refunded";
  paymentMethod: "cod" | "prepaid" | "partial" | "credit";

  // Notes & Tags
  customerNote: string;
  adminComment: string;
  orderTags: string[];

  // System Fields
  createdBy: string;
  createdOn: string;
  lastModified: string;
  modifiedBy: string;
}

// Empty default order form data
export const emptyOrderFormData: OrderFormData = {
  orderNumber: "",
  orderDate: new Date().toISOString().split("T")[0],
  orderStatus: "draft",
  salesChannel: "website",
  currency: "INR",
  amazonOrderRef: "",
  isDraftOrder: true,
  isInternational: false,

  customer: null,
  shippingAddress: null,
  billingAddress: null,
  billingSameAsShipping: true,

  items: [],

  pricing: {
    subtotal: 0,
    productDiscountsTotal: 0,
    orderDiscount: 0,
    orderDiscountType: "",
    orderDiscountValue: 0,

    taxType: "cgst_sgst",
    cgst: 0,
    cgstRate: 9,
    sgst: 0,
    sgstRate: 9,
    igst: 0,
    igstRate: 18,

    shippingCharge: 0,
    codCharge: 0,
    giftCardCode: "",
    giftCardAmount: 0,

    grandTotal: 0,
    advancePaid: 0,
    balanceDue: 0,
  },

  fulfillmentStatus: "unfulfilled",
  deliveryPartners: [],
  trackingNumber: "",

  paymentStatus: "pending",
  paymentMethod: "prepaid",

  customerNote: "",
  adminComment: "",
  orderTags: [],

  createdBy: "Admin",
  createdOn: new Date().toISOString(),
  lastModified: new Date().toISOString(),
  modifiedBy: "Admin",
};

// API Query Params
export interface OrdersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  orderStatus?: string;
  fulfillmentStatus?: string;
  paymentStatus?: string;
  salesChannel?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// API Response
export interface OrdersApiResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Delivery Partner Options
export const DELIVERY_PARTNERS = [
  "BlueDart",
  "Delhivery",
  "DTDC",
  "FedEx",
  "DHL",
  "India Post",
  "Ecom Express",
  "Shadowfax",
  "XpressBees",
] as const;

// Sales Channel Options
export const SALES_CHANNELS = [
  { value: "website", label: "Website" },
  { value: "amazon", label: "Amazon" },
  { value: "flipkart", label: "Flipkart" },
  { value: "retail", label: "Retail Store" },
  { value: "whatsapp", label: "WhatsApp" },
] as const;

// Currency Options
export const CURRENCIES = [
  { value: "INR", label: "₹ INR", symbol: "₹" },
  { value: "USD", label: "$ USD", symbol: "$" },
  { value: "EUR", label: "€ EUR", symbol: "€" },
] as const;

// Payment Method Options
export const PAYMENT_METHODS = [
  { value: "cod", label: "Cash on Delivery (COD)" },
  { value: "prepaid", label: "Prepaid" },
  { value: "partial", label: "Partial Payment" },
  { value: "credit", label: "Credit" },
] as const;

// Tax Type Options
export const TAX_TYPES = [
  { value: "cgst_sgst", label: "CGST + SGST (Intra-State)" },
  { value: "igst", label: "IGST (Inter-State)" },
  { value: "none", label: "No Tax (International)" },
] as const;
