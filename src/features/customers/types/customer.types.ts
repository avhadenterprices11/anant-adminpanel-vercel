export interface Customer {
  id: string; // Internal UUID
  customerId?: string; // Display ID (CUST-XXX)
  firstName: string;
  lastName: string;
  displayName?: string;
  email: string;
  phone: string;
  gstin?: string;
  type: "Distributor" | "Retail" | "Wholesale";
  segment?: string; // e.g., VIP, New, Regular
  created_at?: string;
  total_orders?: number;
  total_spent?: number;
  status: 'Active' | 'Inactive' | 'Banned';

  // Extended fields
  gender?: string;
  dateOfBirth?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;

  // Location (from default address)
  city?: string;
  state?: string;
  country?: string;

  // Security/Account
  lastLogin?: string;
  banReason?: string;
  isBanned?: boolean;
  tags?: string[];
}

export interface Address {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string; // or pincode
  country?: string;
  location?: string;
  landmark?: string;
}

export interface CustomersApiResponse {
  success: boolean;
  data: any[]; // The raw user objects from backend are mapped in the hook
  message: string;
  meta: {
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

export interface CustomerFilters {
  search?: string;
  type?: string;
  status?: string;
  gender?: string;
  tags?: string;
  sort_order?: string;
  from_date?: string;
  to_date?: string;
}

export interface CustomersQueryParams extends CustomerFilters {
  page: number;
  limit: number;
}

// ============================================
// CUSTOMER FORM TYPES
// ============================================

export interface CustomerFormData {
  // Basic Information
  customerId?: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  companyName?: string;
  language?: string[];

  // Contact Information
  email: string;
  phone: string;
  secondaryEmail?: string;
  secondaryPhone?: string;
  secondaryEmailVerified?: boolean;
  profileImage?: File | string | null;
  alternatePhone?: string;
  gender?: string;
  dateOfBirth?: string;
  // Customer Type & Status
  customerType: 'Distributor' | 'Retail' | 'Wholesale';
  status: 'Active' | 'Inactive' | 'Banned';

  // Business Details
  gstNumber?: string;
  panNumber?: string;

  // Address
  billingAddress?: Address;
  shippingAddress?: Address;
  addresses?: CustomerAddress[]; // All addresses for the customer
  sameAsShipping: boolean;

  // Financial
  creditLimit?: number;
  paymentTerms?: string;

  // Metadata
  notes?: string;
  tags?: string[];

  // Extended Fields for Edit Mode (Optional)
  internalTags?: string[];
  internalNotes?: string;

  // Classification
  segment?: string[];
  groups?: string[];
  riskProfile?: "low" | "medium" | "high";
  accountStatus?: "active" | "suspended" | "blocked";
  creditBalance?: number;

  // Loyalty
  loyaltyEnrolled?: boolean;
  loyaltyPoints?: number;
  loyaltyTier?: string;
  loyaltyEnrollmentDate?: string;

  // Subscription
  subscriptionPlan?: string;
  subscriptionStatus?: "active" | "paused" | "cancelled" | "expired";
  billingCycle?: "monthly" | "quarterly" | "yearly";
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  autoRenew?: boolean;

  // Preferences
  marketingPreferences?: string[];
  communicationChannels?: string[];
  emailSubscribed?: boolean;

  // Verification & Compliance
  emailVerified?: boolean;
  phoneVerified?: boolean;
  gdprStatus?: string;
  marketingConsentDate?: string;
  privacyPolicyVersion?: string;

  // Metrics (Read Only)
  totalOrders?: number;
  totalSpent?: number;
  averageOrderValue?: number;
  lastOrderDate?: string;

  // Security
  lastLoginDate?: string;
  lastLoginIP?: string;
  lastLogoutDate?: string;
  failedLoginAttempts?: number;
  accountLockedUntil?: string | null;
}

export const emptyCustomerFormData: CustomerFormData = {
  firstName: "",
  lastName: "",
  companyName: "",
  email: "",
  phone: "",
  alternatePhone: "",
  customerType: "Retail",
  status: "Active",
  gstNumber: "",
  panNumber: "",
  sameAsShipping: false,
  creditLimit: 0,
  paymentTerms: "",
  notes: "",
  tags: [],
  profileImage: null,
  billingAddress: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    location: "",
    landmark: "",
  },
  shippingAddress: {},
};

// ============================================
// CUSTOMER FORM UI TYPES
// ============================================

export interface CustomerEmail {
  id: string;
  email: string;
  type: "work" | "personal";
  isPrimary: boolean;
  isVerified: boolean;
  showOtp: boolean;
  otpValue: string;
}

export interface CustomerPhone {
  id: string;
  phone: string;
  type: "mobile" | "work";
  isPrimary: boolean;
  isVerified: boolean;
  showOtp: boolean;
  otpValue: string;
}

export interface CustomerAddress {
  id: string;
  name?: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  streetAddress1: string;
  streetAddress2: string;
  landmark: string;
  addressType: string;
  isDefaultBilling: boolean;
  isDefaultShipping: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}

// ============================================
// EDIT CUSTOMER FORM TYPES
// ============================================

export interface EditAddress {
  id: string;
  type: "home" | "office";
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: "card" | "upi";
  name: string;
  details: string;
  isDefault: boolean;
}

export interface ActivityItem {
  id: number;
  type: "order" | "payment" | "login";
  title: string;
  description: string;
  amount: string | null;
  timestamp: string;
  icon: any;
  iconColor: string;
}

export interface OrderProduct {
  name: string;
  qty: number;
  price: string;
}

export interface Order {
  id: string;
  date: string;
  items: number;
  total: string;
  status: string;
  statusColor: string;
  products: OrderProduct[];
  shippingAddress: string;
  paymentMethod: string;
}

export interface AbandonedCart {
  id: string;
  cartId: string;
  items: string[];
  totalValue: string;
  abandonedOn: string;
  itemCount: number;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export interface CustomerFormProps {
  initialData?: CustomerFormData;
  onSubmit: (data: CustomerFormData) => void;
  isEditMode?: boolean;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  customerName?: string;
  customerId?: string;
  onDelete?: () => void;
  orders?: any[]; // Mapped orders for OrderOverviewSection
  payments?: any[];
  ordersPagination?: PaginationState;
  paymentsPagination?: PaginationState;
  onNavigateToOrder?: (orderId: string) => void;
}
