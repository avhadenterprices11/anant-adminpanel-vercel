import { useNavigate } from "react-router-dom";
import { Package, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import { ROUTES } from "@/lib/constants";

import { useOrderDetail } from "@/features/orders/hooks/useOrderDetail";
import { CreateOrderForm } from "@/features/orders/components/CreateOrderForm";
import { DetailPageSkeleton } from "@/components/ui/loading-skeletons";

export function OrderDetailPage() {
  const navigate = useNavigate();
  const { order, isLoading, isError } = useOrderDetail();

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (isError || !order) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Package className="size-16 mx-auto mb-4 text-slate-300" />
          <h2 className="text-2xl font-medium text-slate-900 mb-2">
            {isError ? "Error Loading Order" : "Order Not Found"}
          </h2>
          <p className="text-slate-500 mb-6">
            {isError
              ? "There was an error loading the order details. Please try again."
              : "The order you're looking for doesn't exist."}
          </p>
          <Button onClick={() => navigate(ROUTES.ORDERS.LIST)}>
            <ArrowLeft className="mr-2 size-4" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  // Map Order to OrderFormData
  const initialFormData: Partial<
    import("@/features/orders/types/order.types").OrderFormData
  > = {
    orderNumber: order.orderNumber,
    orderDate: order.orderDate,
    orderStatus: order.orderStatus,
    salesChannel: order.salesChannel,
    currency: order.currency,
    amazonOrderRef: order.amazonOrderRef || "",
    // If it's a draft, isDraftOrder is true. The API response usually implies this by status.
    isDraftOrder: order.orderStatus === "draft",
    isInternational: order.pricing?.taxType === "none", // Heuristic or from DB if available

    customer: order.customer,
    shippingAddress: order.shippingAddress || null,
    billingAddress: order.billingAddress || null,
    // Assuming if billing is null or matches shipping logic, but effectively default to false or infer
    billingSameAsShipping:
      !order.billingAddress ||
      JSON.stringify(order.shippingAddress) ===
        JSON.stringify(order.billingAddress),

    items: order.items,

    pricing: order.pricing || {
      // Fallback if pricing object is missing in Order type (legacy compatibility)
      subtotal: order.grandTotal ?? 0, // Approximate/Wrong, but safe fallback
      productDiscountsTotal: 0,
      orderDiscount: order.discountAmount ?? 0,
      orderDiscountType: "fixed",
      orderDiscountValue: order.discountAmount ?? 0,
      taxType: "cgst_sgst",
      cgst: 0,
      cgstRate: 0,
      sgst: 0,
      sgstRate: 0,
      igst: 0,
      igstRate: 0,
      shippingCharge: order.deliveryPrice ?? 0,
      codCharge: 0,
      giftCardCode: "",
      giftCardAmount: 0,
      paymentMethod: "prepaid", // default
      grandTotal: order.grandTotal ?? 0,
      advancePaid: 0,
      balanceDue: order.grandTotal ?? 0,
    },

    fulfillmentStatus: order.fulfillmentStatus,
    deliveryPartners: order.deliveryPartners,
    trackingNumber: order.trackingNumber || "",

    paymentStatus: order.paymentStatus,
    paymentMethod: (order.pricing as any)?.paymentMethod || "prepaid", // Cast if needed or mapped

    customerNote: order.customerNote || "",
    adminComment: order.adminComment || "",
    orderTags: order.orderTags || [],

    createdBy: order.createdBy,
    createdOn: order.createdOn,
    lastModified: order.lastModified,
    modifiedBy: order.modifiedBy,
  };

  return (
    <div className="space-y-6">
      <CreateOrderForm
        mode="edit"
        initialData={initialFormData}
        orderId={order.orderId} // Valid UUID for API operations
        lastModified={order.lastModified}
      />
    </div>
  );
}

export default OrderDetailPage;
