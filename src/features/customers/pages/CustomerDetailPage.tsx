import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/lib/constants";
import { CustomerForm } from "../components";
import type { CustomerFormData } from "../types/customer.types";
import { MOCK_CUSTOMERS } from "../data/mockCustomers";
import { useCustomersStore } from "../hooks/useCustomersStore";
import { customerService } from "../services/customerService";
import { toast } from "sonner";
import { useOrders } from "@/features/orders/hooks/useOrdersApi";
import { useCustomerPayments } from "../hooks/useCustomerPayments";

export default function CustomerDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { customers, updateCustomer, deleteCustomer } = useCustomersStore();
  const [fetchedCustomer, setFetchedCustomer] =
    useState<CustomerFormData | null>(null);

  // Fetch customer if not in store or to ensure fresh data
  useEffect(() => {
    const loadCustomer = async () => {
      if (!id) return;

      try {
        const data: any = await customerService.getCustomerById(id);

        // Map API response to CustomerFormData
        const details = data.details || {};
        const mappedData: CustomerFormData = {
          customerId: data.display_id || '',
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          displayName: data.display_name || '',
          email: data.email,
          phone: data.phone_number || '',
          secondaryEmail: data.secondary_email || '',
          secondaryPhone: data.secondary_phone_number || '',
          customerType: data.user_type === 'business' ? 'Distributor' : 'Retail',
          status: details.account_status === 'active' ? 'Active' : (details.account_status === 'banned' ? 'Banned' : 'Inactive'),
          gstNumber: details.tax_id || '',
          companyName: details.company_legal_name || '',
          sameAsShipping: false,
          profileImage: data.profile_image_url || null,

          // Additional fields mapping
          dateOfBirth: data.date_of_birth,
          gender: data.gender,
          language:
            data.languages ||
            (data.preferred_language ? [data.preferred_language] : []),
          internalTags: data.tags || [],
          internalNotes: details.notes || "",
          segment: details.segment ? [details.segment] : [],

          // Risk & Loyalty & Subscription
          riskProfile: details.risk_profile || "low",
          loyaltyEnrolled: details.loyalty_enrolled || false,
          loyaltyTier: details.loyalty_tier || "",
          loyaltyPoints: Number(details.loyalty_points || 0),
          loyaltyEnrollmentDate: details.loyalty_enrollment_date || undefined,

          subscriptionPlan: details.subscription_plan || "",
          subscriptionStatus: details.subscription_status || undefined,
          billingCycle: details.billing_cycle || undefined,
          subscriptionStartDate: details.subscription_start_date || undefined,
          autoRenew: details.auto_renew || false,

          // Addresses - map from backend format to frontend format
          addresses: (data.addresses || []).map((addr: any) => ({
            id: addr.id,
            name: addr.recipient_name || "",
            country: addr.country || "India",
            state: addr.state_province || "",
            city: addr.city || "",
            pincode: addr.postal_code || "",
            streetAddress1: addr.address_line1 || "",
            streetAddress2: addr.address_line2 || "",
            landmark: addr.delivery_instructions || "",
            addressType:
              addr.address_type === "company"
                ? "office"
                : addr.address_type === "shipping"
                  ? "home"
                  : "other",
            isDefaultBilling:
              (addr.address_type === "billing" ||
                addr.address_type === "both") &&
              addr.is_default,
            isDefaultShipping:
              (addr.address_type === "shipping" ||
                addr.address_type === "both") &&
              addr.is_default,
          })),

          // Defaults
          creditLimit: Number(details.credit_limit || 0),
          paymentTerms: details.payment_terms || "",
          notes: details.notes || "",
          tags: data.tags || [],
          alternatePhone: "",
          panNumber: "",

          // Verification & Compliance
          emailVerified: data.email_verified || false,
          secondaryEmailVerified: data.secondary_email_verified || false,
          phoneVerified: data.phone_verified || false,
          gdprStatus: data.metadata?.gdpr_status,
          privacyPolicyVersion: data.metadata?.privacy_policy_version,
          marketingConsentDate: data.metadata?.marketing_consent_date,

          // Security & Login
          lastLoginDate: data.metadata?.last_login_date,
          lastLoginIP: data.metadata?.last_login_ip,
          lastLogoutDate: data.metadata?.last_logout_date,
          failedLoginAttempts: data.metadata?.failed_login_attempts || 0,
          accountLockedUntil: data.metadata?.account_locked_until,
        };

        setFetchedCustomer(mappedData);
      } catch (error) {
        console.error("Failed to load customer:", error);
        toast.error("Failed to load customer details");
      }
    };

    loadCustomer();
  }, [id]);

  // Pagination state
  const [ordersPage, setOrdersPage] = useState(1);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const ORDERS_LIMIT = 10;
  const PAYMENTS_LIMIT = 10;

  // Fetch orders for this customer
  const { data: ordersWithPagination, isLoading: isOrdersLoading } = useOrders({
    user_id: id,
    limit: ORDERS_LIMIT,
    page: ordersPage,
    sort_by: "created_at",
    sort_order: "desc",
  });

  // Fetch payments for this customer
  const {
    payments,
    pagination: paymentsPagination,
    loading: isPaymentsLoading,
  } = useCustomerPayments({
    userId: id || "",
    limit: PAYMENTS_LIMIT,
    page: paymentsPage,
  });

  const orders = useMemo(() => {
    if (!ordersWithPagination?.data?.orders) return [];

    return ordersWithPagination.data.orders.map((order: any) => {
      // Map API status to UI status
      let status: "Delivered" | "Cancelled" | "Pending" | "Processing" =
        "Processing";
      const s = order.orderStatus?.toLowerCase();

      if (s === "delivered") status = "Delivered";
      else if (s === "cancelled" || s === "refunded") status = "Cancelled";
      else if (s === "pending") status = "Pending";
      else status = "Processing"; // confirmed, processing, shipped

      return {
        id: order.orderId,
        orderNumber: order.orderNumber,
        date: order.orderDate,
        itemCount: order.itemsCount || 0,
        status,
        amount: typeof order.grandTotal === "number" ? order.grandTotal : 0,
      };
    });
  }, [ordersWithPagination]);

  // Prefer fetched data, then store data, then mocks
  const customerData = useMemo(() => {
    if (fetchedCustomer) return fetchedCustomer;

    const found =
      customers.find((c) => c.id === id) ||
      MOCK_CUSTOMERS.find((c) => c.id === id);
    if (!found) return undefined;

    return {
      customerId: found.customerId,
      firstName: found.firstName,
      lastName: found.lastName,
      email: found.email,
      phone: found.phone,
      customerType: found.type as any,
      status: found.status as any,
      gstNumber: found.gstin || "",
      companyName: "",
      sameAsShipping: false,
      creditLimit: 0,
      paymentTerms: "",
      notes: "",
      tags: [],
      alternatePhone: "",
      panNumber: "",
    } as CustomerFormData;
  }, [id, customers, fetchedCustomer]);

  const customerName = customerData
    ? `${customerData.firstName} ${customerData.lastName}`
    : (() => {
        const cached = customers.find((c) => c.id === id);
        return cached ? `${cached.firstName} ${cached.lastName}` : "Loading...";
      })();

  const breadcrumbs = [
    { label: "Customers", href: ROUTES.CUSTOMERS.LIST },
    { label: customerName },
  ];

  const handleSubmit = async (data: CustomerFormData) => {
    if (!id) return;
    try {
      // Helper to convert empty strings to undefined
      const sanitize = <T,>(val: T): T | undefined => {
        if (val === "" || val === null) return undefined;
        if (Array.isArray(val) && val.length === 0) return undefined;
        return val;
      };

      // Helper to map gender to valid enum
      const mapGender = (
        g?: string,
      ): "male" | "female" | "other" | "prefer_not_to_say" | undefined => {
        if (!g) return undefined;
        const normalized = g.toLowerCase();
        const valid = ["male", "female", "other", "prefer_not_to_say"];
        return valid.includes(normalized) ? (normalized as any) : undefined;
      };

      // Helper to map payment terms to valid enum
      const mapPaymentTerms = (terms?: string): string | undefined => {
        if (!terms) return undefined;
        const normalized = terms
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace("net-", "net_");
        const valid = ["immediate", "net_15", "net_30", "net_60", "net_90"];
        return valid.includes(normalized) ? normalized : undefined;
      };

      // Helper to map segment to valid enum
      const mapSegment = (seg?: string): string | undefined => {
        if (!seg) return undefined;
        const normalized = seg.toLowerCase().replace(/\s+/g, "_");
        const valid = ["new", "regular", "vip", "at_risk"];
        return valid.includes(normalized) ? normalized : undefined;
      };

      const payload = {
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        display_name: sanitize(data.displayName),
        email: data.email,
        phone_number: sanitize(data.phone),
        user_type: data.customerType === "Retail" ? "individual" : "business",
        tags:
          data.internalTags && data.internalTags.length > 0
            ? data.internalTags
            : undefined,
        date_of_birth: sanitize(data.dateOfBirth),
        gender: mapGender(data.gender),
        preferred_language: sanitize(data.language?.[0]),
        languages:
          data.language && data.language.length > 0 ? data.language : undefined,

        // Business Profile Fields
        company_legal_name: sanitize(data.companyName),
        tax_id: sanitize(data.gstNumber),
        credit_limit:
          data.creditLimit && data.creditLimit > 0
            ? data.creditLimit
            : undefined,
        payment_terms: mapPaymentTerms(data.paymentTerms),

        // Profile Image
        profile_image_url:
          typeof data.profileImage === "string" ? data.profileImage : undefined,

        // Customer Profile fields
        segment: mapSegment(data.segment?.[0]),
        notes: sanitize(data.internalNotes),
        account_status: data.status === 'Active' ? 'active' : data.status === 'Banned' ? 'banned' : 'inactive',
        store_credit_balance: data.creditBalance && data.creditBalance > 0 ? data.creditBalance : undefined,

        // Marketing
        marketing_opt_in:
          data.marketingPreferences?.includes("marketing") || undefined,
        sms_opt_in: data.marketingPreferences?.includes("sms") || undefined,
        email_opt_in: data.marketingPreferences?.includes("email") || undefined,
        whatsapp_opt_in:
          data.marketingPreferences?.includes("whatsapp") || undefined,

        // Risk & Loyalty & Subscription
        risk_profile: sanitize(data.riskProfile),
        loyalty_enrolled: data.loyaltyEnrolled || undefined,
        loyalty_tier: sanitize(data.loyaltyTier),
        loyalty_points:
          data.loyaltyPoints && data.loyaltyPoints > 0
            ? data.loyaltyPoints
            : undefined,
        loyalty_enrollment_date: sanitize(data.loyaltyEnrollmentDate),
        subscription_plan: sanitize(data.subscriptionPlan),
        subscription_status: sanitize(data.subscriptionStatus),
        billing_cycle: sanitize(data.billingCycle),
        subscription_start_date: sanitize(data.subscriptionStartDate),
        auto_renew: data.autoRenew || undefined,

        // Secondary contacts with verified status
        secondary_email: sanitize(data.secondaryEmail),
        secondary_phone_number: sanitize(data.secondaryPhone),
        // Include verified status for primary/secondary swap support
        email_verified: data.emailVerified ?? undefined,
        secondary_email_verified: data.secondaryEmailVerified ?? undefined,
      };

      // Remove undefined values
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v !== undefined),
      );

      console.log("Sending update payload:", cleanPayload);

      // Call API to update customer
      await customerService.updateCustomer(id, cleanPayload);

      // Save addresses if present
      if (data.addresses && data.addresses.length > 0) {
        const mapAddressType = (type?: string): "Home" | "Office" | "Other" => {
          if (!type) return "Home";
          const lower = type.toLowerCase();
          if (lower === "home") return "Home";
          if (lower === "office") return "Office";
          return "Other";
        };

        const addressPromises = data.addresses.map(async (addr) => {
          const addressPayload = {
            type: mapAddressType(addr.addressType),
            name:
              addr.name ||
              `${data.firstName} ${data.lastName}`.trim() ||
              "Customer",
            phone: data.phone || "N/A",
            addressLine1: addr.streetAddress1 || "Address",
            addressLine2: addr.streetAddress2 || undefined,
            city: addr.city || "City",
            state: addr.state || "State",
            pincode: addr.pincode || "000000",
            country: addr.country || "India",
            isDefault: addr.isDefaultBilling || addr.isDefaultShipping || false,
            isDefaultBilling: addr.isDefaultBilling,
            isDefaultShipping: addr.isDefaultShipping,
          };

          try {
            // Check if this is a real database UUID (not a temp/frontend ID)
            const isRealDbId =
              addr.id &&
              /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
                addr.id,
              );

            if (isRealDbId) {
              // Update existing address
              await customerService.updateAddress(id, addr.id, addressPayload);
            } else {
              // Create new address
              await customerService.createAddress(id, addressPayload);
            }
          } catch (addrError) {
            console.error("Failed to save address:", addrError);
          }
        });

        // Handle deleted addresses
        // Identify addresses that were in fetchedCustomer but are NOT in the current data.addresses
        // and have a real UUID (were not temp addresses)
        if (fetchedCustomer && fetchedCustomer.addresses) {
          const currentAddressIds = new Set(data.addresses.map((a) => a.id));
          const deletedAddresses = fetchedCustomer.addresses.filter(
            (originalAddr) => {
              const isRealDbId =
                originalAddr.id &&
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
                  originalAddr.id,
                );
              return isRealDbId && !currentAddressIds.has(originalAddr.id);
            },
          );

          deletedAddresses.forEach((addr) => {
            addressPromises.push(
              (async () => {
                try {
                  console.log("Deleting address:", addr.id);
                  await customerService.deleteAddress(id, addr.id);
                } catch (err) {
                  console.error("Failed to delete address:", err);
                }
              })(),
            );
          });
        }

        await Promise.all(addressPromises);
      }

      toast.success("Customer updated successfully");

      // Update local store as well to keep UI in sync without refresh if needed
      updateCustomer(id, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        type: data.customerType,
        status: data.status,
        gstin: data.gstNumber || undefined,
      });

      // Redirect to list page
      navigate(ROUTES.CUSTOMERS.LIST);
    } catch (error: any) {
      console.error(error);

      // Extract error message, ensuring it's a string
      const rawMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "";
      const errorMessage =
        typeof rawMessage === "string"
          ? rawMessage
          : JSON.stringify(rawMessage);
      const errorLower = errorMessage.toLowerCase();

      // Check for duplicate email error
      const isDuplicateEmail =
        (errorLower.includes("email") ||
          errorLower.includes("unique_email") ||
          errorLower.includes("users_email_key")) &&
        (errorLower.includes("exist") ||
          errorLower.includes("duplicate") ||
          errorLower.includes("unique") ||
          errorLower.includes("already") ||
          errorLower.includes("constraint"));

      if (isDuplicateEmail || error?.response?.status === 409) {
        toast.error("Email already exists");
      } else {
        toast.error(errorMessage || "Failed to update customer");
      }
    } finally {
      // Finished
    }
  };

  const handleNavigateToOrder = (orderId: string) => {
    navigate(ROUTES.ORDERS.DETAIL(orderId));
  };

  // Removed loading spinner to faster perceived performance

  // The form will populate when data arrives

  return (
    <CustomerForm
      initialData={customerData}
      onSubmit={handleSubmit}
      isEditMode={true}
      breadcrumbs={breadcrumbs}
      customerName={customerName}
      customerId={id}
      orders={orders} // Pass orders
      payments={payments} // Pass payments
      ordersPagination={{
        currentPage: ordersPage,
        totalPages: ordersWithPagination?.data?.pagination?.totalPages || 1,
        onPageChange: setOrdersPage,
        isLoading: isOrdersLoading,
      }}
      paymentsPagination={{
        currentPage: paymentsPage,
        totalPages: paymentsPagination?.total_pages || 1,
        onPageChange: setPaymentsPage,
        isLoading: isPaymentsLoading,
      }}
      onNavigateToOrder={handleNavigateToOrder}
      onDelete={async () => {
        if (!id) return;
        try {
          // 1. Call API
          await customerService.deleteCustomer(id);

          // 2. Remove from local store
          deleteCustomer(id);

          // 3. Success & Redirect
          toast.success("Customer deleted successfully");
          navigate(ROUTES.CUSTOMERS.LIST);
        } catch (error) {
          console.error("Failed to delete customer:", error);
          toast.error("Failed to delete customer");
        }
      }}
    />
  );
}
