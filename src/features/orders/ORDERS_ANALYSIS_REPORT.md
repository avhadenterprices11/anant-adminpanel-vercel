# Orders Dashboard - Complete Feature Analysis & API Development Guide

> **Document Purpose**: This comprehensive analysis identifies all features currently using mock data in the Admin Dashboard's Orders module, documents the complete data structures required, identifies feature gaps, and provides detailed specifications for backend API development.

---

## Table of Contents
1. [Overview](#overview)
2. [Current Features Using Mock Data](#current-features-using-mock-data)
3. [Detailed Mock Data Analysis](#detailed-mock-data-analysis)
4. [Required API Endpoints](#required-api-endpoints)
5. [Feature Gaps & Missing Functionality](#feature-gaps--missing-functionality)
6. [Database Schema Requirements](#database-schema-requirements)
7. [Implementation Priority](#implementation-priority)

---

## Overview

The Orders module contains **5 main pages** and manages **4 distinct order types**:

### Pages
1. **OrderListPage** - Main orders listing with filters
2. **OrderDetailPage** - View/edit individual order
3. **CreateOrderPage** - Create new orders
4. **DraftOrdersPage** - Manage draft/pending orders
5. **AbandonedOrdersPage** - Track and recover abandoned carts

### Order Types
- **Regular Orders** (mockOrders.ts)
- **Draft Orders** (mockDraftOrders.ts)
- **Abandoned Carts** (mockAbandonedOrders.ts)
- **Customers & Addresses** (mockCustomers.ts)

---

## Current Features Using Mock Data

### 1. Orders List (OrderListPage)

#### Mock Data Source
- `MOCK_ORDERS` from `mockOrders.ts`
- `MOCK_ORDER_METRICS` (implied)

#### Features
- **Search & Filtering**
  - Search by: Order number, customer name, email, phone
  - Filter by: Payment status (Paid, Pending, Overdue, Partially Paid)
  - Date range filtering
  
- **Sorting Options**
  - Newest/Oldest first (by date)
  - Total amount (High to Low)
  - Customer name (A-Z)
  
- **Metrics Dashboard** (4 metrics)
  - Active Orders (Pending + Partial)
  - Fulfilled Orders
  - Cancelled Orders
  - Total Revenue

- **Table Columns** (Configurable Visibility)
  - Order Number ✓ (visible by default)
  - Customer ✓
  - Order Date ✓
  - Items Count ✓
  - Grand Total ✓
  - Delivery Partners (hidden)
  - Delivery Price (hidden)
  - Return Amount (hidden)
  - Discount Amount (hidden)
  - Payment Status ✓

- **Bulk Actions**
  - Multi-select orders
  - Bulk delete with confirmation
  - Copy (placeholder)
  - CSV export (placeholder)
  - PDF export (placeholder)
  - Print (placeholder)

- **Row Actions**
  - Click to view order detail
  - Navigate to order edit page

#### Mock Data Fields Used
```typescript
{
  orderId: string
  orderNumber: string
  orderDate: string
  orderStatus: "draft" | "confirmed" | "paid"
  customer: Customer { id, name, email, phone, gstin?, type }
  items: OrderItem[]
  itemsCount: number
  grandTotal: number
  currency: "INR" | "USD" | "EUR"
  fulfillmentStatus: "Fulfilled" | "Pending" | "Partial" | "Cancelled"
  paymentStatus: "Paid" | "Pending" | "Overdue" | "Partially Paid"
  salesChannel: "website" | "amazon" | "flipkart" | "retail" | "whatsapp"
  deliveryPartners: string[]
  deliveryPrice: number
  returnAmount: number
  discountAmount: number
  createdBy: string
  createdOn: string
  lastModified: string
  modifiedBy: string
}
```

---

### 2. Order Detail & Create/Edit (OrderDetailPage, CreateOrderPage)

#### Mock Data Source
- `MOCK_ORDERS_FULL` from `mockOrders.ts`
- `MOCK_CUSTOMERS` from `mockCustomers.ts`
- `MOCK_ADDRESSES` from `mockCustomers.ts`
- `MOCK_PRODUCTS_LIST` (hardcoded in CreateOrderForm component)

#### Features

##### Customer Management
- **Customer Selection**
  - Search customers by name, email, phone, GSTIN
  - View customer type (B2B / B2C)
  - Create new customer (inline)
  - Remove customer

##### Address Management
- **Shipping Address**
  - Select from customer's saved addresses
  - Add new address
  - Fields: Label, Address, City, State, Pincode
  
- **Billing Address**
  - "Same as Shipping" toggle
  - Separate billing address selection
  - GSTIN validation for B2B

##### Order Items Management
- **Product Selection**
  - Search products
  - Select multiple products
  - View stock availability
  
- **Item Details**
  - Product name, SKU, image
  - Quantity adjustment
  - Base price (cost price)
  - Per-item discount (percentage or fixed)
  - Stock availability warning
  - Remove item

##### Pricing Calculation (Automatic)
- **Subtotal Calculation**
  - Sum of (quantity × cost price - item discounts)
  
- **Order-Level Discount**
  - Type: Percentage or Fixed
  - Applied to subtotal
  
- **Tax Calculation (GST)**
  - Tax type selection: CGST+SGST, IGST, or None
  - Automatic calculation based on:
    - Same state → CGST (9%) + SGST (9%)
    - Different state → IGST (18%)
    - International → No tax
  - Tax calculation: `(subtotal - orderDiscount) × taxRate`
  
- **Additional Charges**
  - Shipping charge (manual entry)
  - COD charge (if COD selected)
  
- **Gift Card**
  - Gift card code entry
  - Deduct gift card amount from total
  
- **Final Totals**
  - Grand Total = Subtotal - Product Discounts - Order Discount + Tax + Shipping + COD - Gift Card
  - Advance Paid (manual entry)
  - Balance Due = Grand Total - Advance Paid

##### Order Information
- **Basic Info**
  - Order number (auto-generated or manual)
  - Order date
  - Order status: Draft, Confirmed, Paid
  - Sales channel: Website, Amazon, Flipkart, Retail, WhatsApp
  - Currency: INR, USD, EUR
  - Amazon Order Reference (if Amazon)
  - Draft order flag
  - International order flag

##### Fulfillment
- **Fulfillment Status**: Pending, Fulfilled, Partial, Cancelled
- **Delivery Partners** (multi-select)
  - BlueDart, Delhivery, DTDC, FedEx, DHL, India Post, Ecom Express, Shadowfax, XpressBees
- **Tracking Number**

##### Payment
- **Payment Status**: Paid, Pending, Overdue, Partially Paid
- **Payment Method**: COD, Prepaid, Partial, Credit

##### Notes & Tags
- **Customer Note** (from customer)
- **Admin Comment** (internal notes)
- **Order Tags** (multi-select, custom tags)

##### System Fields
- Created By, Created On
- Last Modified, Modified By

##### Actions (Edit Mode Only)
- Duplicate Order
- Email Invoice (placeholder)
- Mark as Paid (placeholder)
- Mark as Pending (placeholder)
- Pay with Card (placeholder)
- More actions dropdown

#### Mock Data Fields Used
```typescript
{
  // All fields from Order +
  amazonOrderRef: string
  isDraftOrder: boolean
  isInternational: boolean
  shippingAddress: Address
  billingAddress: Address
  billingSameAsShipping: boolean
  items: OrderItem[] {
    id, productId, productName, productSku, productImage,
    quantity, costPrice, discountType, discountValue, availableStock
  }
  pricing: OrderPricing {
    subtotal, productDiscountsTotal, orderDiscount, orderDiscountType, orderDiscountValue,
    taxType, cgst, cgstRate, sgst, sgstRate, igst, igstRate,
    shippingCharge, codCharge, giftCardCode, giftCardAmount,
    grandTotal, advancePaid, balanceDue
  }
  trackingNumber: string
  paymentMethod: string
  customerNote: string
  adminComment: string
  orderTags: string[]
}
```

---

### 3. Draft Orders (DraftOrdersPage)

#### Mock Data Source
- `MOCK_DRAFT_ORDERS` from `mockDraftOrders.ts`

#### Features
- **Search** by order number
- **Filter by Status**: Pending, Awaiting, Unpaid
- **Sorting**: Newest/Oldest, ID (A-Z/Z-A), Channel (A-Z/Z-A)

- **Metrics Dashboard**
  - Total Drafts
  - Pending count
  - Overdue count
  - Partially Paid count

- **Table Columns**
  - Order Number
  - Order Date
  - Payment Status (badge)
  - Items count
  - Channel
  - Confirm button (action)

- **Confirm Draft Action**
  - Convert draft to confirmed order
  - Optional: Send confirmation email

#### Mock Data Fields Used
```typescript
{
  orderNumber: string
  orderDate: string
  paymentStatus: "Pending" | "Awaiting" | "Unpaid"
  items: DraftOrderItem[] { id, name, quantity }
  channel: string
}
```

---

### 4. Abandoned Carts (AbandonedOrdersPage)

#### Mock Data Source
- `MOCK_ABANDONED_ORDERS` from `mockAbandonedOrders.ts`
- `EMAIL_TEMPLATES` from `mockAbandonedOrders.ts`

#### Features
- **Search** by customer name, email, cart ID
- **Filter by Recovery Status**: Not Contacted, Email Sent, Recovered
- **Date Range Filter**
- **Sorting**: Newest/Oldest (by abandoned date)

- **Metrics Dashboard**
  - Total Abandoned Carts
  - Potential Revenue (sum of cart values)
  - Emails Sent count
  - Recovered count

- **Table Columns** (Configurable)
  - Cart ID
  - Customer Name
  - Email
  - Products (items count with tooltip)
  - Cart Value (currency)
  - Abandoned At (date + relative time)
  - Recovery Status (badge)
  - Channel (icon: web/app)

- **Bulk Actions**
  - Select multiple carts
  - Send bulk recovery email

- **Row Actions**
  - View cart details (drawer)
  - Send individual recovery email

- **Cart Details Drawer**
  - Full cart information
  - Product list with quantities & prices
  - Customer contact info
  - Send recovery email button

- **Email Modal**
  - Select email template (4 templates)
    1. Welcome Back
    2. Limited Stock Alert
    3. Special Discount Offer
    4. Last Chance Reminder
  - Preview subject & body
  - Confirm send

#### Mock Data Fields Used
```typescript
{
  id: string
  cartId: string
  customerName: string
  email: string
  phone: string
  products: AbandonedOrderProduct[] { id, name, quantity, price }
  cartValue: number
  abandonedAt: string (datetime)
  lastActivity: string (relative time)
  recoveryStatus: "not-contacted" | "email-sent" | "recovered"
  channel: "web" | "app"
  emailSentAt?: string
}

// Email Templates
{
  id: string
  name: string
  subject: string
  preview: string
}
```

---

### 5. Customer Management (mockCustomers.ts)

#### Mock Data Source
- `MOCK_CUSTOMERS` from `mockCustomers.ts`
- `MOCK_ADDRESSES` from `mockCustomers.ts`
- `INDIAN_STATES` constant

#### Features
- **Customer Search**
  - Search by name, email, phone, GSTIN
  
- **Customer Data**
  - 12 mock customers (mix of B2B and B2C)
  - Customer types: B2B (with GSTIN), B2C
  
- **Address Management**
  - Multiple addresses per customer
  - Address labels: Home, Office, Warehouse, etc.
  - 19 Indian states supported

#### Mock Data Fields Used
```typescript
// Customer
{
  id: string
  name: string
  email: string
  phone: string
  gstin?: string  // for B2B only
  type: "B2B" | "B2C"
}

// Address
{
  id: string
  label: string
  address: string
  city: string
  state: string  // from INDIAN_STATES
  pincode: string
}
```

---

## Detailed Mock Data Analysis

### Mock Orders Statistics

**Total Mock Orders**: 8 (including 1 international)

#### Order Breakdown
- **By Status**:
  - Draft: 3 orders
  - Confirmed: 3 orders
  - Paid: 2 orders

- **By Sales Channel**:
  - Website: 5 orders
  - Amazon: 1 order
  - Flipkart: 1 order
  - Retail: 1 order
  - WhatsApp: 1 order (draft)

- **By Payment Status**:
  - Pending: 3 orders
  - Paid: 3 orders
  - Partially Paid: 1 order
  - Overdue: 1 order

- **By Fulfillment**:
  - Pending: 3 orders
  - Fulfilled: 2 orders
  - Partial: 1 order
  - Cancelled: 1 order

- **By Tax Type**:
  - CGST+SGST (Intra-state): 6 orders
  - IGST (Inter-state): 1 order
  - None (International): 1 order

#### Currency Support
- INR: 7 orders
- USD: 1 order (international)

#### Special Cases Covered
1. **Bulk B2B Order** - Order 6 (45 items, ₹106K)
2. **International Order** - Order 8 (USD currency, no tax)
3. **Gift Card Usage** - Order 4 (GIFT500 code)
4. **Partial Payment** - Order 2 (₹10K advance)
5. **Overdue Payment** - Order 5
6. **Multi-Delivery Partners** - Order 2 & 6
7. **Product & Order Discounts** - Orders 1, 2, 4, 5, 6

### Mock Draft Orders
- **Total**: 12 draft orders
- **Channels**: Online Store (7), Mobile App (3), Phone (2)
- **Payment Statuses**: Pending, Awaiting, Unpaid
- **Items**: 1-4 items per draft

### Mock Abandoned Carts
- **Total**: 8 abandoned carts
- **Total Potential Revenue**: ~₹154K
- **Recovery Status**:
  - Not Contacted: 4 carts
  - Email Sent: 3 carts
  - Recovered: 1 cart
- **Channels**: Web (6), App (2)

### Mock Customers
- **Total**: 12 customers
- **B2B**: 6 customers (with GSTIN)
- **B2C**: 6 customers
- **Total Addresses**: 20 addresses across 11+ cities

---

## Required API Endpoints

### 1. Orders Management

#### GET /api/orders
**Purpose**: Fetch paginated orders list with filters

**Query Parameters**:
```typescript
{
  page?: number          // default: 1
  limit?: number         // default: 10
  search?: string        // search in order number, customer name, email
  order_status?: "draft" | "confirmed" | "paid"
  payment_status?: "paid" | "pending" | "overdue" | "partially_paid"
  fulfillment_status?: "fulfilled" | "pending" | "partial" | "cancelled"
  sales_channel?: "website" | "amazon" | "flipkart" | "retail" | "whatsapp"
  from_date?: string     // ISO date
  to_date?: string       // ISO date
  sort_by?: "date" | "total" | "customer"
  sort_order?: "asc" | "desc"
}
```

**Response**:
```typescript
{
  success: boolean
  data: {
    orders: Order[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}
```

#### GET /api/orders/metrics
**Purpose**: Get order metrics for dashboard

**Response**:
```typescript
{
  success: boolean
  data: {
    active_orders: number      // pending + partial
    fulfilled_orders: number
    cancelled_orders: number
    total_revenue: string      // decimal string
  }
}
```

#### GET /api/orders/:orderNumber
**Purpose**: Fetch single order details

**Response**:
```typescript
{
  success: boolean
  data: {
    order: OrderFormData  // Full order with all nested data
  }
}
```

#### POST /api/orders
**Purpose**: Create new order

**Request Body**: `OrderFormData`

**Response**:
```typescript
{
  success: boolean
  message: string
  data: {
    order: Order
  }
}
```

#### PUT /api/orders/:orderId
**Purpose**: Update existing order

**Request Body**: `Partial<OrderFormData>`

**Response**:
```typescript
{
  success: boolean
  message: string
  data: {
    order: Order
  }
}
```

#### DELETE /api/orders/:orderId
**Purpose**: Delete order

**Response**:
```typescript
{
  success: boolean
  message: string
}
```

---

### 2. Draft Orders

#### GET /api/orders/drafts
**Purpose**: Fetch draft orders

**Query Parameters**:
```typescript
{
  page?: number
  limit?: number
  search?: string
  payment_status?: "pending" | "awaiting" | "unpaid"
}
```

**Response**:
```typescript
{
  success: boolean
  data: {
    drafts: Order[]
    pagination: { page, limit, total, totalPages }
  }
}
```

#### POST /api/orders/drafts/:draftId/confirm
**Purpose**: Confirm draft order

**Request Body**:
```typescript
{
  send_email: boolean  // Send confirmation email to customer
}
```

**Response**:
```typescript
{
  success: boolean
  message: string
  data: {
    order: Order
  }
}
```

---

### 3. Abandoned Carts

#### GET /api/abandoned-carts
**Purpose**: Fetch abandoned carts

**Query Parameters**:
```typescript
{
  page?: number
  limit?: number
  search?: string        // customer name, email, cart ID
  status?: "not-contacted" | "email-sent" | "recovered"
  from_date?: string
  to_date?: string
  sort_by?: "abandoned_at" | "cart_value"
  sort_order?: "asc" | "desc"
}
```

**Response**:
```typescript
{
  success: boolean
  data: {
    carts: AbandonedOrder[]
    pagination: { page, limit, total, totalPages }
  }
}
```

#### GET /api/abandoned-carts/metrics
**Purpose**: Get abandoned cart metrics

**Response**:
```typescript
{
  success: boolean
  data: {
    total_carts: number
    potential_revenue: number
    emails_sent: number
    recovered_count: number
  }
}
```

#### GET /api/abandoned-carts/:cartId
**Purpose**: Get single cart details

**Response**:
```typescript
{
  success: boolean
  data: {
    cart: AbandonedOrder
  }
}
```

#### POST /api/abandoned-carts/send-email
**Purpose**: Send recovery emails to selected carts

**Request Body**:
```typescript
{
  cart_ids: string[]
  template_id: string  // "welcome-back" | "limited-stock" | "special-discount" | "last-chance"
}
```

**Response**:
```typescript
{
  success: boolean
  message: string
  data: {
    sent_count: number
    failed_count: number
  }
}
```

#### GET /api/abandoned-carts/email-templates
**Purpose**: Get available email templates

**Response**:
```typescript
{
  success: boolean
  data: {
    templates: EmailTemplate[]
  }
}
```

---

### 4. Customers

#### GET /api/customers
**Purpose**: Search/list customers

**Query Parameters**:
```typescript
{
  search?: string  // name, email, phone, GSTIN
  type?: "B2B" | "B2C"
  page?: number
  limit?: number
}
```

**Response**:
```typescript
{
  success: boolean
  data: {
    customers: Customer[]
    pagination: { page, limit, total, totalPages }
  }
}
```

#### GET /api/customers/:customerId
**Purpose**: Get customer details with addresses

**Response**:
```typescript
{
  success: boolean
  data: {
    customer: Customer
    addresses: Address[]
  }
}
```

#### POST /api/customers
**Purpose**: Create new customer

**Request Body**:
```typescript
{
  name: string
  email: string
  phone: string
  gstin?: string
  type: "B2B" | "B2C"
}
```

**Response**:
```typescript
{
  success: boolean
  data: {
    customer: Customer
  }
}
```

#### GET /api/customers/:customerId/addresses
**Purpose**: Get customer addresses

**Response**:
```typescript
{
  success: boolean
  data: {
    addresses: Address[]
  }
}
```

#### POST /api/customers/:customerId/addresses
**Purpose**: Add customer address

**Request Body**: `Omit<Address, "id">`

**Response**:
```typescript
{
  success: boolean
  data: {
    address: Address
  }
}
```

---

### 5. Products (For Order Creation)

#### GET /api/products
**Purpose**: Search products for order creation

**Query Parameters**:
```typescript
{
  search?: string     // name, SKU
  category?: string
  in_stock?: boolean
  page?: number
  limit?: number
}
```

**Response**:
```typescript
{
  success: boolean
  data: {
    products: Product[]
    pagination: { page, limit, total, totalPages }
  }
}

// Product
{
  id: string
  name: string
  sku: string
  price: number
  stock: number
  category: string
  image: string
}
```

---

### 6. Tags

#### GET /api/tags
**Purpose**: Get available tags for orders

**Query Parameters**:
```typescript
{
  search?: string
  category?: "order" | "product" | "customer"
}
```

**Response**:
```typescript
{
  success: boolean
  data: {
    tags: Tag[]
  }
}

// Tag
{
  id: string
  name: string
  color: string
  category: string
}
```

#### POST /api/tags
**Purpose**: Create new tag

**Request Body**:
```typescript
{
  name: string
  color?: string
  category: "order" | "product" | "customer"
}
```

---

### 7. Import/Export

#### POST /api/orders/import
**Purpose**: Bulk import orders from CSV

**Request Body**: `multipart/form-data`
```typescript
{
  file: File  // CSV file
  mode: "append" | "overwrite"
}
```

**Response**:
```typescript
{
  success: boolean
  message: string
  data: {
    imported: number
    failed: number
    errors?: Array<{ row: number, error: string }>
  }
}
```

#### GET /api/orders/export
**Purpose**: Export orders to CSV/PDF

**Query Parameters**:
```typescript
{
  format: "csv" | "pdf"
  // ... same filters as GET /api/orders
}
```

**Response**: File download

#### GET /api/orders/template
**Purpose**: Download CSV template for import

**Response**: CSV file download

---

## Feature Gaps & Missing Functionality

### Critical Gaps (High Priority)

#### 1. **Order Tracking & History**
- **Missing**: Order status change history/timeline
- **Impact**: Cannot track who changed what and when
- **Required**:
  - Order history log table
  - Track all field changes with timestamps
  - User attribution for each change
  - Display timeline in order detail view

#### 2. **Payment Processing Integration**
- **Missing**: Actual payment gateway integration
- **Impact**: "Pay with Card", "Mark as Paid" are placeholders
- **Required**:
  - Payment gateway integration (Razorpay/Stripe)
  - Payment transaction recording
  - Payment receipt generation
  - Refund processing
  - Payment link generation

#### 3. **Invoice Generation**
- **Missing**: PDF invoice generation and emailing
- **Impact**: "Email Invoice" is placeholder
- **Required**:
  - PDF invoice template
  - Invoice number generation
  - GST-compliant invoice format
  - Email delivery system
  - Invoice download API

#### 4. **Inventory Integration**
- **Missing**: Real-time stock checking and updates
- **Impact**: Stock availability is mock data
- **Required**:
  - Real-time stock availability check
  - Stock reservation on order creation
  - Stock deduction on order confirmation
  - Low stock warnings
  - Stock rollback on order cancellation

#### 5. **Shipping Integration**
- **Missing**: Real shipping provider integration
- **Impact**: Tracking numbers are manual entry
- **Required**:
  - Shipping provider API integration
  - Automatic shipping label generation
  - Real-time tracking updates
  - Shipping cost calculation
  - Delivery partner assignment logic

---

### Important Gaps (Medium Priority)

#### 6. **Order Returns & Refunds**
- **Missing**: Complete returns management system
- **Fields Present**: `returnAmount` (but no workflow)
- **Required**:
  - Return request creation
  - Return approval workflow
  - Return item tracking
  - Partial returns support
  - Refund processing integration
  - Return reasons & notes

#### 7. **Order Notifications**
- **Missing**: Customer email/SMS notifications
- **Required**:
  - Order confirmation email
  - Order status update notifications
  - Delivery notifications
  - Payment reminders for overdue
  - Admin notifications for new orders

#### 8. **Analytics & Reporting**
- **Missing**: Advanced analytics and reports
- **Current**: Basic metrics only
- **Required**:
  - Sales reports (daily, weekly, monthly)
  - Revenue analytics
  - Customer lifetime value
  - Channel performance
  - Product performance in orders
  - Export reports to PDF/Excel

#### 9. **Bulk Order Operations**
- **Missing**: Bulk status updates, bulk shipping
- **Current**: Bulk delete only
- **Required**:
  - Bulk status change
  - Bulk print labels
  - Bulk mark as paid
  - Bulk assign delivery partner

#### 10. **Gift Card Management**
- **Missing**: Gift card validation and balance checking
- **Current**: Gift card code is manual entry with no validation
- **Required**:
  - Gift card validation API
  - Balance checking
  - Multi-gift card support
  - Gift card usage history

---

### Nice-to-Have Features (Low Priority)

#### 11. **Order Templates**
- Save frequently ordered item combinations
- Quick order creation from templates

#### 12. **Automatic Order Assignment**
- Assign orders to team members
- Order ownership tracking

#### 13. **Order Scheduling**
- Schedule future orders
- Recurring order support

#### 14. **Advanced Filtering**
- Saved filter presets
- Complex filter combinations
- Filter by custom date ranges

#### 15. **Order Comments/Chat**
- Internal team communication per order
- Customer chat integration

#### 16. **Mobile App Support**
- Optimized mobile viewing (partially done)
- Mobile order creation

#### 17. **Multi-Currency Support Enhancement**
- Real-time currency conversion
- Currency-specific tax rules

#### 18. **Delivery Time Estimates**
- Estimated delivery date calculation
- Delivery time tracking

---

### Data Validation & Business Logic Gaps

#### 19. **Validation Logic Missing**
- **Customer Validation**:
  - Email format validation
  - Phone number format (India)
  - GSTIN format validation (for B2B)
  - Duplicate customer check
  
- **Order Validation**:
  - Minimum order value
  - Maximum order value limits
  - Stock availability check before order creation
  - Address completeness validation
  - Payment method compatibility with order type

- **Pricing Validation**:
  - Discount cannot exceed product price
  - Gift card cannot exceed order total
  - Negative amounts prevention

#### 20. **Tax Logic Enhancements**
- **Current**: Basic GSTIN/IGST logic
- **Missing**:
  - HSN code tracking per product
  - Tax exemption categories
  - Reverse charge mechanism (B2B)
  - Export order tax treatment
  - State-wise tax rates configuration

#### 21. **Commission Calculations**
- Platform commission for marketplace (Amazon/Flipkart)
- Sales team commission tracking
- Affiliate commission

---

### UI/UX Gaps

#### 22. **Print Functionality**
- **Missing**: Print order details, packing slip
- **Current**: Print button is placeholder

#### 23. **Order Duplication**
- **Present**: Basic duplication
- **Missing**: Option to duplicate with/without customer, with/without pricing

#### 24. **Quick Actions**
- Missing keyboard shortcuts
- Missing quick status toggles

#### 25. **Advanced Search**
- Search by product SKU
- Search by tracking number
- Search across all text fields

---

## Database Schema Requirements

### Core Tables

#### 1. `orders` table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  order_date DATE NOT NULL,
  order_status VARCHAR(20) NOT NULL, -- draft, confirmed, paid
  
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  
  sales_channel VARCHAR(20) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  amazon_order_ref VARCHAR(100),
  is_draft_order BOOLEAN DEFAULT false,
  is_international BOOLEAN DEFAULT false,
  
  shipping_address_id UUID REFERENCES addresses(id),
  billing_address_id UUID REFERENCES addresses(id),
  
  -- Pricing
  subtotal DECIMAL(10,2) NOT NULL,
  product_discounts_total DECIMAL(10,2) DEFAULT 0,
  order_discount DECIMAL(10,2) DEFAULT 0,
  order_discount_type VARCHAR(20),
  order_discount_value DECIMAL(10,2),
  
  tax_type VARCHAR(20) NOT NULL,
  cgst DECIMAL(10,2) DEFAULT 0,
  cgst_rate DECIMAL(5,2) DEFAULT 0,
  sgst DECIMAL(10,2) DEFAULT 0,
  sgst_rate DECIMAL(5,2) DEFAULT 0,
  igst DECIMAL(10,2) DEFAULT 0,
  igst_rate DECIMAL(5,2) DEFAULT 0,
  
  shipping_charge DECIMAL(10,2) DEFAULT 0,
  cod_charge DECIMAL(10,2) DEFAULT 0,
  gift_card_code VARCHAR(50),
  gift_card_amount DECIMAL(10,2) DEFAULT 0,
  
  grand_total DECIMAL(10,2) NOT NULL,
  advance_paid DECIMAL(10,2) DEFAULT 0,
  balance_due DECIMAL(10,2) NOT NULL,
  
  -- Fulfillment
  fulfillment_status VARCHAR(20) NOT NULL,
  tracking_number VARCHAR(100),
  
  -- Payment
  payment_status VARCHAR(20) NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  
  -- Notes
  customer_note TEXT,
  admin_comment TEXT,
  
  -- System
  created_by VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(100),
  
  INDEX idx_order_number (order_number),
  INDEX idx_customer_id (customer_id),
  INDEX idx_order_date (order_date),
  INDEX idx_payment_status (payment_status),
  INDEX idx_order_status (order_status),
  INDEX idx_sales_channel (sales_channel)
);
```

#### 2. `order_items` table
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(200) NOT NULL,
  product_sku VARCHAR(100) NOT NULL,
  product_image TEXT,
  
  quantity INT NOT NULL,
  cost_price DECIMAL(10,2) NOT NULL,
  discount_type VARCHAR(20) DEFAULT '',
  discount_value DECIMAL(10,2) DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_order_id (order_id),
  INDEX idx_product_id (product_id)
);
```

#### 3. `order_delivery_partners` table
```sql
CREATE TABLE order_delivery_partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  partner_name VARCHAR(100) NOT NULL,
  
  INDEX idx_order_id (order_id)
);
```

#### 4. `order_tags` table
```sql
CREATE TABLE order_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  
  UNIQUE(order_id, tag_id),
  INDEX idx_order_id (order_id)
);
```

#### 5. `customers` table
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  gstin VARCHAR(15), -- for B2B
  type VARCHAR(10) NOT NULL, -- B2B or B2C
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_phone (phone),
  INDEX idx_gstin (gstin)
);
```

#### 6. `addresses` table
```sql
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  
  label VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_customer_id (customer_id)
);
```

#### 7. `abandoned_carts` table
```sql
CREATE TABLE abandoned_carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id VARCHAR(50) UNIQUE NOT NULL,
  
  customer_name VARCHAR(200),
  email VARCHAR(200),
  phone VARCHAR(20),
  
  cart_value DECIMAL(10,2) NOT NULL,
  abandoned_at TIMESTAMP NOT NULL,
  
  recovery_status VARCHAR(20) DEFAULT 'not-contacted',
  channel VARCHAR(10) NOT NULL, -- web, app
  
  email_sent_at TIMESTAMP,
  recovered_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_cart_id (cart_id),
  INDEX idx_email (email),
  INDEX idx_abandoned_at (abandoned_at),
  INDEX idx_recovery_status (recovery_status)
);
```

#### 8. `abandoned_cart_items` table
```sql
CREATE TABLE abandoned_cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES abandoned_carts(id) ON DELETE CASCADE,
  
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(200) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  
  INDEX idx_cart_id (cart_id)
);
```

#### 9. `order_history` table (For tracking changes)
```sql
CREATE TABLE order_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  field_changed VARCHAR(100) NOT NULL,
  old_value TEXT,
  new_value TEXT,
  
  changed_by VARCHAR(100) NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_order_id (order_id),
  INDEX idx_changed_at (changed_at)
);
```

---

## Implementation Priority

### Phase 1: Core Order Management (Weeks 1-2)
**Priority**: CRITICAL

1. ✅ **Orders CRUD APIs**
   - GET /api/orders (with filters, pagination, search)
   - GET /api/orders/:orderNumber
   - POST /api/orders
   - PUT /api/orders/:orderId
   - DELETE /api/orders/:orderId
   - GET /api/orders/metrics

2. ✅ **Customer & Address APIs**
   - GET /api/customers (search)
   - GET /api/customers/:customerId
   - POST /api/customers
   - GET /api/customers/:customerId/addresses
   - POST /api/customers/:customerId/addresses

3. ✅ **Database Tables**
   - Create orders, order_items, customers, addresses tables
   - Set up relationships and indexes
   - Implement soft delete for orders

---

### Phase 2: Draft Orders & Products (Week 3)
**Priority**: HIGH

1. ✅ **Draft Orders APIs**
   - GET /api/orders/drafts
   - POST /api/orders/drafts/:draftId/confirm

2. ✅ **Products API** (for order creation)
   - GET /api/products (search, filter)

3. ✅ **Tags API**
   - GET /api/tags
   - POST /api/tags

---

### Phase 3: Abandoned Carts (Week 4)
**Priority**: HIGH

1. ✅ **Abandoned Carts APIs**
   - GET /api/abandoned-carts
   - GET /api/abandoned-carts/metrics
   - GET /api/abandoned-carts/:cartId
   - POST /api/abandoned-carts/send-email
   - GET /api/abandoned-carts/email-templates

2. ✅ **Email System Integration**
   - Email service setup (SendGrid/SES)
   - Email templates implementation
   - Email sending queue

---

### Phase 4: Essential Features (Weeks 5-6)
**Priority**: HIGH

1. ✅ **Invoice Generation**
   - PDF invoice generation
   - Email invoice API
   - GST-compliant format

2. ✅ **Order Change History**
   - Create order_history table
   - Track all changes
   - Display timeline in UI

3. ✅ **Stock Integration**
   - Real-time stock check
   - Stock reservation logic
   - Low stock warnings

---

### Phase 5: Import/Export & Payments (Week 7)
**Priority**: MEDIUM

1. ✅ **Import/Export**
   - POST /api/orders/import
   - GET /api/orders/export (CSV, PDF)
   - GET /api/orders/template

2. ✅ **Payment Integration (Basic)**
   - Payment gateway setup
   - Mark as paid functionality
   - Payment recording

---

### Phase 6: Advanced Features (Weeks 8-10)
**Priority**: MEDIUM

1. ⏳ **Returns Management**
   - Return request APIs
   - Return approval workflow
   - Refund processing

2. ⏳ **Notifications**
   - Order confirmation emails
   - Status update notifications
   - Payment reminders

3. ⏳ **Shipping Integration**
   - Shipping provider APIs
   - Label generation
   - Tracking updates

---

### Phase 7: Analytics & Optimization (Week 11+)
**Priority**: LOW

1. ⏳ **Advanced Analytics**
   - Sales reports
   - Revenue analytics
   - Customer analytics

2. ⏳ **Bulk Operations**
   - Bulk status updates
   - Bulk print labels
   - Bulk shipping

---

## API Response Standards

### Success Response Format
```typescript
{
  success: true,
  message?: string,  // Optional success message
  data: {
    // Response data
  }
}
```

### Error Response Format
```typescript
{
  success: false,
  message: string,    // User-friendly error message
  error?: {
    code: string,     // Error code for client handling
    details?: any     // Additional error details
  }
}
```

### Pagination Format
```typescript
{
  page: number,        // Current page (1-indexed)
  limit: number,       // Items per page
  total: number,       // Total items count
  totalPages: number   // Total pages count
}
```

---

## Notes for Backend Developers

### 1. **Data Validation**
- Implement comprehensive server-side validation for all inputs
- Validate GSTIN format for B2B customers
- Ensure email and phone format validation
- Check stock availability before order creation
- Validate discount values (cannot exceed product price)

### 2. **Tax Calculation Logic**
```javascript
// Tax logic pseudocode
if (billing_state === shipping_state) {
  // Intra-state: CGST + SGST
  taxType = 'cgst_sgst'
  cgst = taxableAmount * 0.09
  sgst = taxableAmount * 0.09
  igst = 0
} else if (is_international) {
  // International: No tax
  taxType = 'none'
  cgst = sgst = igst = 0
} else {
  // Inter-state: IGST
  taxType = 'igst'
  igst = taxableAmount * 0.18
  cgst = sgst = 0
}
```

### 3. **Order Number Generation**
```
Format: SS-ORD-YYYY-#### 
Example: SS-ORD-2024-0001
- SS: prefix (configurable)
- ORD: order type
- YYYY: year
- ####: sequential number (reset yearly)
```

### 4. **Performance Considerations**
- Index all frequently queried fields (see schema)
- Implement database query optimization
- Use pagination for all list endpoints
- Cache metrics data (refresh every 5 minutes)
- Consider read replicas for reporting queries

### 5. **Security**
- Sanitize all user inputs
- Implement rate limiting on APIs
- Validate user permissions for order modifications
- Audit log all order changes
- Encrypt sensitive customer data

### 6. **Transaction Management**
- Use database transactions for order creation (order + items + addresses)
- Rollback on any failure
- Implement idempotency for payment operations

### 7. **Testing Requirements**
- Unit tests for all calculation functions
- Integration tests for CRUD operations
- E2E tests for critical flows (create order, confirm draft)
- Load testing for list endpoints

---

## Conclusion

This document provides a complete blueprint for implementing the backend APIs for the Orders module. All features currently using mock data have been identified, and comprehensive API specifications have been provided.

**Summary Statistics**:
- **Total Pages Analyzed**: 5
- **Mock Data Files**: 4
- **Total API Endpoints Required**: 30+
- **Database Tables Required**: 9 core tables
- **Critical Feature Gaps**: 20+
- **Total Mock Orders**: 28 (8 regular + 12 drafts + 8 abandoned)

**Next Steps**:
1. Review this document with the backend team
2. Prioritize implementation phases
3. Set up database schema
4. Begin Phase 1 implementation
5. Iteratively test and deploy each phase
