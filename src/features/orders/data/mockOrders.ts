import type { Order, OrderFormData, OrderItem } from '../types/order.types';
import { MOCK_CUSTOMERS, getAddressesByCustomerId } from './mockCustomers';

const MOCK_PRODUCTS_LIST = [
  { name: 'Kashmir Willow Cricket Bat', sku: 'BAT-KW-PRO-001', price: 2499 },
  { name: 'Yonex Badminton Racket', sku: 'BDM-YNX-A99-003', price: 12999 },
  { name: 'Badminton Racket', sku: 'BDM-RCK-001', price: 1499 },
  { name: 'Gym Dumbbells', sku: 'GYM-DB-001', price: 1999 },
  { name: 'Camping Tent', sku: 'ADV-TENT-001', price: 7999 },
];

function createOrderItem(
  arg1: string | number,
  arg2: string | number,
  arg3?: number | string,
  arg4?: number,
  arg5: '' | 'percentage' | 'fixed' = '',
  arg6: number = 0
): OrderItem {
  let name, sku, quantity, price, discountType, discountValue;

  if (typeof arg1 === 'number') {
    // Overload: (index, quantity, discountType?, discountValue?)
    const product = MOCK_PRODUCTS_LIST[arg1] || MOCK_PRODUCTS_LIST[0];
    name = product.name;
    sku = product.sku;
    price = product.price;
    quantity = Number(arg2);
    // Shift optional args
    discountType = (typeof arg3 === 'string' ? arg3 : '') as any;
    discountValue = typeof arg3 === 'number' ? arg3 : (arg4 || 0);
    // Correction for specific calls like (0, 10, 'fixed', 100)
    if (arg3 && typeof arg3 === 'string') {
      discountValue = arg4 || 0;
    }
  } else {
    // Standard: (name, sku, quantity, price, ...)
    name = arg1;
    sku = String(arg2);
    quantity = Number(arg3);
    price = Number(arg4);
    discountType = arg5;
    discountValue = arg6;
  }

  return {
    id: `ITEM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    productId: `PRD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    productName: name,
    productSku: sku,
    productImage: '',
    quantity,
    costPrice: price,
    discountType,
    discountValue,
    availableStock: 100,
  };
}

// Mock Orders (Full OrderFormData format)
export const MOCK_ORDERS_FULL: OrderFormData[] = [
  // Order 1: Draft order, Website, B2C customer
  {
    orderNumber: 'SS-ORD-2024-001',
    orderDate: '2024-12-20',
    orderStatus: 'draft',
    salesChannel: 'website',
    currency: 'INR',
    amazonOrderRef: '',
    isDraftOrder: true,
    isInternational: false,

    customer: MOCK_CUSTOMERS[1], // Priya Sharma (B2C)
    shippingAddress: getAddressesByCustomerId('CUST-002')[0],
    billingAddress: getAddressesByCustomerId('CUST-002')[0],
    billingSameAsShipping: true,

    items: [
      createOrderItem('Kashmir Willow Cricket Bat', 'BAT-KW-PRO-001', 2, 2499, 'percentage', 10),
      createOrderItem('Yonex Badminton Racket', 'BDM-YNX-A99-003', 1, 12999),
    ],

    pricing: {
      subtotal: 9148,
      productDiscountsTotal: 250,
      orderDiscount: 0,
      orderDiscountType: '',
      orderDiscountValue: 0,

      taxType: 'cgst_sgst',
      cgst: 800.82,
      cgstRate: 9,
      sgst: 800.82,
      sgstRate: 9,
      igst: 0,
      igstRate: 18,

      shippingCharge: 100,
      codCharge: 0,
      giftCardCode: '',
      giftCardAmount: 0,

      grandTotal: 10599.64,
      advancePaid: 0,
      balanceDue: 10599.64,
    },

    fulfillmentStatus: 'unfulfilled',
    deliveryPartners: [],
    trackingNumber: '',

    paymentStatus: 'pending',
    paymentMethod: 'prepaid',

    customerNote: 'Please pack carefully',
    adminComment: 'First time customer',
    orderTags: ['new-customer', 'website'],

    createdBy: 'Admin',
    createdOn: '2024-12-20T10:30:00Z',
    lastModified: '2024-12-20T10:30:00Z',
    modifiedBy: 'Admin',
  },

  // Order 2: Confirmed, Amazon, B2B customer, Inter-state (IGST)
  {
    orderNumber: 'SS-ORD-2024-002',
    orderDate: '2024-12-18',
    orderStatus: 'confirmed',
    salesChannel: 'amazon',
    currency: 'INR',
    amazonOrderRef: 'AMZ-408-1234567-1234567',
    isDraftOrder: false,
    isInternational: false,

    customer: MOCK_CUSTOMERS[2], // SportZone Retail (B2B)
    shippingAddress: getAddressesByCustomerId('CUST-003')[1], // Delhi
    billingAddress: getAddressesByCustomerId('CUST-003')[0], // UP (different state = IGST)
    billingSameAsShipping: false,

    items: [
      createOrderItem(0, 10, 'fixed', 100), // Bulk order with fixed discount
      createOrderItem(1, 5),
    ],

    pricing: {
      subtotal: 30499,
      productDiscountsTotal: 1000,
      orderDiscount: 1474.95,
      orderDiscountType: 'percentage',
      orderDiscountValue: 5,

      taxType: 'igst',
      cgst: 0,
      cgstRate: 9,
      sgst: 0,
      sgstRate: 9,
      igst: 5044.53,
      igstRate: 18,

      shippingCharge: 500,
      codCharge: 0,
      giftCardCode: '',
      giftCardAmount: 0,

      grandTotal: 33568.58,
      advancePaid: 10000,
      balanceDue: 23568.58,
    },

    fulfillmentStatus: 'unfulfilled',
    deliveryPartners: ['BlueDart', 'Delhivery'],
    trackingNumber: 'BLUD1234567890',

    paymentStatus: 'pending',
    paymentMethod: 'partial',

    customerNote: 'Urgent delivery required',
    adminComment: 'VIP B2B customer, priority shipping',
    orderTags: ['bulk-order', 'amazon', 'b2b'],

    createdBy: 'Admin',
    createdOn: '2024-12-18T14:20:00Z',
    lastModified: '2024-12-19T09:15:00Z',
    modifiedBy: 'Admin',
  },

  // Order 3: Paid, Retail, Cash order
  {
    orderNumber: 'SS-ORD-2024-003',
    orderDate: '2024-12-15',
    orderStatus: 'confirmed',
    salesChannel: 'retail',
    currency: 'INR',
    amazonOrderRef: '',
    isDraftOrder: false,
    isInternational: false,

    customer: MOCK_CUSTOMERS[7], // Vikram Singh
    shippingAddress: getAddressesByCustomerId('CUST-008')[0],
    billingAddress: getAddressesByCustomerId('CUST-008')[0],
    billingSameAsShipping: true,

    items: [
      createOrderItem(3, 2), // Gym Dumbbells
    ],

    pricing: {
      subtotal: 3998,
      productDiscountsTotal: 0,
      orderDiscount: 0,
      orderDiscountType: '',
      orderDiscountValue: 0,

      taxType: 'cgst_sgst',
      cgst: 359.82,
      cgstRate: 9,
      sgst: 359.82,
      sgstRate: 9,
      igst: 0,
      igstRate: 18,

      shippingCharge: 0,
      codCharge: 50,
      giftCardCode: '',
      giftCardAmount: 0,

      grandTotal: 4767.64,
      advancePaid: 4767.64,
      balanceDue: 0,
    },

    fulfillmentStatus: 'fulfilled',
    deliveryPartners: ['Self Pickup'],
    trackingNumber: '',

    paymentStatus: 'paid',
    paymentMethod: 'cod',

    customerNote: '',
    adminComment: 'Walk-in customer, paid in full',
    orderTags: ['retail', 'walk-in'],

    createdBy: 'Store Manager',
    createdOn: '2024-12-15T11:45:00Z',
    lastModified: '2024-12-15T11:50:00Z',
    modifiedBy: 'Store Manager',
  },

  // Order 4: Draft, WhatsApp order, with gift card
  {
    orderNumber: 'SS-ORD-2024-004',
    orderDate: '2024-12-22',
    orderStatus: 'draft',
    salesChannel: 'whatsapp',
    currency: 'INR',
    amazonOrderRef: '',
    isDraftOrder: true,
    isInternational: false,

    customer: MOCK_CUSTOMERS[5], // Sneha Reddy
    shippingAddress: getAddressesByCustomerId('CUST-006')[0],
    billingAddress: getAddressesByCustomerId('CUST-006')[0],
    billingSameAsShipping: true,

    items: [
      createOrderItem(4, 1), // Camping Tent
      createOrderItem(1, 2, 'percentage', 15),
    ],

    pricing: {
      subtotal: 16198,
      productDiscountsTotal: 600,
      orderDiscount: 0,
      orderDiscountType: '',
      orderDiscountValue: 0,

      taxType: 'cgst_sgst',
      cgst: 1403.82,
      cgstRate: 9,
      sgst: 1403.82,
      sgstRate: 9,
      igst: 0,
      igstRate: 18,

      shippingCharge: 150,
      codCharge: 0,
      giftCardCode: 'GIFT500',
      giftCardAmount: 500,

      grandTotal: 18655.64,
      advancePaid: 0,
      balanceDue: 18155.64,
    },

    fulfillmentStatus: 'unfulfilled',
    deliveryPartners: [],
    trackingNumber: '',

    paymentStatus: 'pending',
    paymentMethod: 'prepaid',

    customerNote: 'Gift wrapping required',
    adminComment: 'WhatsApp order, gift card applied',
    orderTags: ['whatsapp', 'gift-wrap'],

    createdBy: 'Sales Team',
    createdOn: '2024-12-22T16:00:00Z',
    lastModified: '2024-12-22T16:05:00Z',
    modifiedBy: 'Sales Team',
  },

  // Order 5: Confirmed, Flipkart, Overdue payment
  {
    orderNumber: 'SS-ORD-2024-005',
    orderDate: '2024-12-10',
    orderStatus: 'confirmed',
    salesChannel: 'flipkart',
    currency: 'INR',
    amazonOrderRef: 'FKT-2024-9876543',
    isDraftOrder: false,
    isInternational: false,

    customer: MOCK_CUSTOMERS[3], // Amit Patel
    shippingAddress: getAddressesByCustomerId('CUST-004')[0],
    billingAddress: getAddressesByCustomerId('CUST-004')[0],
    billingSameAsShipping: true,

    items: [
      createOrderItem(2, 3), // Badminton Rackets
    ],

    pricing: {
      subtotal: 14997,
      productDiscountsTotal: 0,
      orderDiscount: 749.85,
      orderDiscountType: 'percentage',
      orderDiscountValue: 5,

      taxType: 'cgst_sgst',
      cgst: 1282.27,
      cgstRate: 9,
      sgst: 1282.27,
      sgstRate: 9,
      igst: 0,
      igstRate: 18,

      shippingCharge: 80,
      codCharge: 0,
      giftCardCode: '',
      giftCardAmount: 0,

      grandTotal: 16891.59,
      advancePaid: 5000,
      balanceDue: 11891.59,
    },

    fulfillmentStatus: 'unfulfilled',
    deliveryPartners: ['DTDC'],
    trackingNumber: 'DTDC9876543210',

    paymentStatus: 'pending',
    paymentMethod: 'credit',

    customerNote: 'Deliver between 2-4 PM',
    adminComment: 'Payment overdue, follow up required',
    orderTags: ['flipkart', 'overdue'],

    createdBy: 'Admin',
    createdOn: '2024-12-10T09:30:00Z',
    lastModified: '2024-12-20T14:00:00Z',
    modifiedBy: 'Finance Team',
  },

  // Order 6: Paid, Website, Large B2B order
  {
    orderNumber: 'SS-ORD-2024-006',
    orderDate: '2024-12-12',
    orderStatus: 'confirmed',
    salesChannel: 'website',
    currency: 'INR',
    amazonOrderRef: '',
    isDraftOrder: false,
    isInternational: false,

    customer: MOCK_CUSTOMERS[6], // Champion Sports Academy
    shippingAddress: getAddressesByCustomerId('CUST-007')[0],
    billingAddress: getAddressesByCustomerId('CUST-007')[0],
    billingSameAsShipping: true,

    items: [
      createOrderItem(0, 20, 'percentage', 15), // Bulk bats
      createOrderItem(1, 15, 'percentage', 10), // Bulk footballs
      createOrderItem(2, 10, 'percentage', 10), // Bulk rackets
    ],

    pricing: {
      subtotal: 109485,
      productDiscountsTotal: 15747.75,
      orderDiscount: 4686.86,
      orderDiscountType: 'percentage',
      orderDiscountValue: 5,

      taxType: 'cgst_sgst',
      cgst: 8009.05,
      cgstRate: 9,
      sgst: 8009.05,
      sgstRate: 9,
      igst: 0,
      igstRate: 18,

      shippingCharge: 1000,
      codCharge: 0,
      giftCardCode: '',
      giftCardAmount: 0,

      grandTotal: 106068.49,
      advancePaid: 106068.49,
      balanceDue: 0,
    },

    fulfillmentStatus: 'fulfilled',
    deliveryPartners: ['BlueDart', 'FedEx'],
    trackingNumber: 'BLUD-ACAD-123456, FEDEX-789012',

    paymentStatus: 'paid',
    paymentMethod: 'prepaid',

    customerNote: 'Bulk order for academy, invoice required',
    adminComment: 'High value B2B order, priority fulfillment done',
    orderTags: ['bulk-order', 'b2b', 'academy'],

    createdBy: 'Admin',
    createdOn: '2024-12-12T10:00:00Z',
    lastModified: '2024-12-16T15:30:00Z',
    modifiedBy: 'Fulfillment Team',
  },

  // Order 7: Cancelled
  {
    orderNumber: 'SS-ORD-2024-007',
    orderDate: '2024-12-08',
    orderStatus: 'draft',
    salesChannel: 'website',
    currency: 'INR',
    amazonOrderRef: '',
    isDraftOrder: true,
    isInternational: false,

    customer: MOCK_CUSTOMERS[8], // Ananya Iyer
    shippingAddress: getAddressesByCustomerId('CUST-009')[0],
    billingAddress: getAddressesByCustomerId('CUST-009')[0],
    billingSameAsShipping: true,

    items: [
      createOrderItem(4, 1),
    ],

    pricing: {
      subtotal: 7999,
      productDiscountsTotal: 0,
      orderDiscount: 0,
      orderDiscountType: '',
      orderDiscountValue: 0,

      taxType: 'cgst_sgst',
      cgst: 719.91,
      cgstRate: 9,
      sgst: 719.91,
      sgstRate: 9,
      igst: 0,
      igstRate: 18,

      shippingCharge: 100,
      codCharge: 0,
      giftCardCode: '',
      giftCardAmount: 0,

      grandTotal: 9538.82,
      advancePaid: 0,
      balanceDue: 9538.82,
    },

    fulfillmentStatus: 'cancelled',
    deliveryPartners: [],
    trackingNumber: '',

    paymentStatus: 'pending',
    paymentMethod: 'cod',

    customerNote: '',
    adminComment: 'Customer cancelled before confirmation',
    orderTags: ['cancelled'],

    createdBy: 'Admin',
    createdOn: '2024-12-08T12:00:00Z',
    lastModified: '2024-12-09T10:00:00Z',
    modifiedBy: 'Admin',
  },

  // Order 8: International order (USD, no tax)
  {
    orderNumber: 'SS-ORD-2024-008',
    orderDate: '2024-12-14',
    orderStatus: 'confirmed',
    salesChannel: 'website',
    currency: 'USD',
    amazonOrderRef: '',
    isDraftOrder: false,
    isInternational: true,

    customer: {
      id: 'CUST-INT-001',
      name: 'John Williams',
      email: 'john.williams@example.com',
      phone: '+1 555-123-4567',
      type: 'B2C',
    },
    shippingAddress: {
      id: 'ADDR-INT-001',
      label: 'Home',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      pincode: '10001',
    },
    billingAddress: {
      id: 'ADDR-INT-001',
      label: 'Home',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      pincode: '10001',
    },
    billingSameAsShipping: true,

    items: [
      createOrderItem(0, 3),
      createOrderItem(2, 2),
    ],

    pricing: {
      subtotal: 164.91, // Converted to USD
      productDiscountsTotal: 0,
      orderDiscount: 0,
      orderDiscountType: '',
      orderDiscountValue: 0,

      taxType: 'none',
      cgst: 0,
      cgstRate: 0,
      sgst: 0,
      sgstRate: 0,
      igst: 0,
      igstRate: 0,

      shippingCharge: 50,
      codCharge: 0,
      giftCardCode: '',
      giftCardAmount: 0,

      grandTotal: 214.91,
      advancePaid: 214.91,
      balanceDue: 0,
    },

    fulfillmentStatus: 'unfulfilled',
    deliveryPartners: ['DHL'],
    trackingNumber: 'DHL-INT-456789',

    paymentStatus: 'paid',
    paymentMethod: 'prepaid',

    customerNote: 'Please declare lower value for customs',
    adminComment: 'International shipment, customs docs prepared',
    orderTags: ['international', 'usa'],

    createdBy: 'Admin',
    createdOn: '2024-12-14T08:00:00Z',
    lastModified: '2024-12-15T12:00:00Z',
    modifiedBy: 'International Team',
  },
];

// Convert OrderFormData to Order (for list view)
export function convertToOrderList(orderFormData: OrderFormData, index: number): Order {
  return {
    orderId: `ORD-${String(index + 1).padStart(5, '0')}`,
    orderNumber: orderFormData.orderNumber,
    orderDate: orderFormData.orderDate,
    orderStatus: orderFormData.orderStatus,

    customer: orderFormData.customer!,

    items: orderFormData.items,
    itemsCount: orderFormData.items.length,

    grandTotal: orderFormData.pricing.grandTotal,
    currency: orderFormData.currency,

    fulfillmentStatus: orderFormData.fulfillmentStatus,
    paymentStatus: orderFormData.paymentStatus,

    salesChannel: orderFormData.salesChannel,
    deliveryPartners: orderFormData.deliveryPartners,
    deliveryPrice: orderFormData.pricing.shippingCharge,
    returnAmount: 0, // Can be calculated based on business logic
    discountAmount: orderFormData.pricing.orderDiscount + orderFormData.pricing.productDiscountsTotal,

    createdBy: orderFormData.createdBy,
    createdOn: orderFormData.createdOn,
    lastModified: orderFormData.lastModified,
    modifiedBy: orderFormData.modifiedBy,
  };
}

// Export list-ready orders
export const MOCK_ORDERS: Order[] = MOCK_ORDERS_FULL.map((order, index) =>
  convertToOrderList(order, index)
);

// Helper functions
export function getOrderById(orderId: string): OrderFormData | undefined {
  const index = MOCK_ORDERS.findIndex(order => order.orderId === orderId);
  return index !== -1 ? MOCK_ORDERS_FULL[index] : undefined;
}

export function getOrderByNumber(orderNumber: string): OrderFormData | undefined {
  return MOCK_ORDERS_FULL.find(order => order.orderNumber === orderNumber);
}
