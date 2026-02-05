import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  // FileText, // Removed unused
  ShoppingCart,
  // Mail, // Removed - invoice emailing now handled by InvoiceManager
  CreditCard,
  User,
  // ClipboardList, // Removed unused
  Truck,
  ReceiptText,
  MoreVertical,
  Copy,
  ArrowLeft,
  Save,
  Plus,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
  // CardDescription,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useOrderForm } from "@/features/orders/hooks/useOrderForm";
import { useRazorpay } from "@/features/orders/hooks/useRazorpay";
import { OrderItemsTable } from "@/features/orders/components/OrderItemsTable";
import { ProductSelectionModal } from "@/features/orders/components/modals/ProductSelectionModal";
import { OrderDiscountModal } from "@/features/orders/components/modals/OrderDiscountModal";
import { ShippingModal } from "@/features/orders/components/modals/ShippingModal";
import { CustomerSelector } from "@/features/orders/components/CustomerSelector";
import { AddressSelector } from "@/features/orders/components/AddressSelector";
import { OrderStatusActions } from "@/features/orders/components/order-detail/OrderStatusActions";
import { OrderStatusManagement } from "@/features/orders/components/order-detail/OrderStatusManagement";

import { ROUTES } from "@/lib/constants";
import { notifyInfo } from "@/utils";
import {
  formatCurrency,
  calculateItemsSubtotal,
} from "@/features/orders/utils/orderCalculations";
import { NotesTags } from "@/components/features/notes/NotesTags";
import { tagService } from "@/features/tags/services/tagService";
import { UnsavedChangesGuard } from "@/components/guards";
import { ConfirmationDialog } from "@/components/dialogs/ConfirmationDialog";
import { InvoiceManager } from "@/features/invoices/components/InvoiceManager";
import type {
  Address,
  OrderFormData,
  Customer,
  OrderItem,
} from "@/features/orders/types/order.types";
import { Badge } from "@/components/ui/badge"; // Keeping badge for ID label if needed, but StatusBadge covers status

const ENABLE_UNSAVED_CHANGES_WARNING = true;

interface CreateOrderFormProps {
  mode?: "create" | "edit";
  initialData?: Partial<OrderFormData>;
  orderId?: string;
  sourceOrderNumber?: string;
  headerActions?: React.ReactNode;
  /** Order's last modified timestamp for invoice regeneration logic */
  lastModified?: string;
}

export function CreateOrderForm({
  mode = "create",
  initialData,
  orderId,
  sourceOrderNumber,
  headerActions,
  lastModified,
}: CreateOrderFormProps) {
  const navigate = useNavigate();
  const {
    formData,
    ui,
    hasChanges,
    errors,
    handleCustomerChange,
    handleAddressChange,
    handleSameAsShippingChange,
    handleAddItem,
    handleUpdateQuantity,
    handleRemoveItem,
    handleNotesChange,
    handleSaveDraft,
    handleCancel,
    handleCreateOrder,
    handleApplyOrderDiscount,
    handleApplyShipping,
    updateFields,
  } = useOrderForm({ mode, initialData, orderId });

  // Payment Hook
  const { initiatePayment, status: razorpayStatus } = useRazorpay();

  // Add debug logging to verify handlers exist
  // console.log("useOrderForm handlers:", { handleCancel, handleSaveDraft, handleNotesChange });

  // Modal states
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showOrderDiscountModal, setShowOrderDiscountModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showRemoveCustomerConfirm, setShowRemoveCustomerConfirm] =
    useState(false);

  // Local UI states
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const fetchOrderTags = async () => {
    try {
      const response = await tagService.getAllTags({
        type: "order",
        status: "active",
      });
      if (response && response.tags) {
        setAvailableTags(response.tags.map((tag) => tag.name));
      }
    } catch (error) {
      console.error("Failed to fetch order tags", error);
    }
  };

  useEffect(() => {
    fetchOrderTags();
  }, []);

  const handleTagCreated = () => {
    fetchOrderTags();
  };

  const isEditMode = mode === "edit";
  const title = isEditMode
    ? formData.orderNumber || "Edit Order"
    : sourceOrderNumber
      ? "Duplicate Order"
      : "Create order";

  const handleDuplicateOrder = () => {
    navigate(ROUTES.ORDERS.CREATE, { state: { duplicateOrder: formData } });
  };

  // Calculate pricing values
  const {
    subtotal: grossSubtotal,
    discounts: productDiscounts,
    totalAfterDiscounts: itemsNetTotal,
  } = calculateItemsSubtotal(formData.items);

  const orderDiscount = formData.pricing?.orderDiscount || 0;
  const shipping = formData.pricing?.shippingCharge || 0;
  const taxes =
    (formData.pricing?.cgst || 0) +
    (formData.pricing?.sgst || 0) +
    (formData.pricing?.igst || 0);
  const total = itemsNetTotal - orderDiscount + shipping + taxes;

  // Handlers
  const handleAddProducts = (selectedProducts: any[]) => {
    selectedProducts.forEach((product) => {
      const item: OrderItem = {
        id: `ITEM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        productImage: product.image || "",
        quantity: product.quantity || 1,
        costPrice: product.price,
        discountType: "",
        discountValue: 0,
        availableStock: product.stock,
      };
      handleAddItem(item);
    });
  };

  const handlePayWithCard = async () => {
    if (!orderId) {
      notifyInfo("Please save the order first before accepting payment.");
      return;
    }
    await initiatePayment(orderId);
  };

  const handleAddShipping = () => setShowShippingModal(true);
  const confirmRemoveCustomer = () => {
    handleCustomerChange(null as any);
    setShowRemoveCustomerConfirm(false);
  };
  const handleCustomerSelect = (customer: Customer) => {
    handleCustomerChange(customer);
    setShowCustomerModal(false);
  };
  const handleShippingAddressSelect = (address: Address) => {
    handleAddressChange("shipping", address);
  };
  const handleBillingAddressSelect = (address: Address) => {
    handleAddressChange("billing", address);
  };

  // Header Actions - updated for direct usage in the new header layout
  const renderHeaderActions = () => (
    <>
      {(!isEditMode || hasChanges) && (
        <>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="rounded-xl h-9 sm:h-[44px] px-4 sm:px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={isEditMode ? handleCreateOrder : handleSaveDraft}
            disabled={ui.isSubmitting}
            className="rounded-xl bg-(--sidebar-bg) hover:bg-(--sidebar-hover) text-(--text-white)/90 h-9 sm:h-[44px] px-4 sm:px-6 gap-2 shadow-sm"
          >
            {isEditMode ? (
              <>
                <Save className="size-[18px]" />
                {ui.isSubmitting ? "Saving..." : "Save Changes"}
              </>
            ) : (
              <>
                <Plus className="size-[18px]" />
                {ui.isSubmitting ? "Adding..." : "Add draft order"}
              </>
            )}
          </Button>
        </>
      )}

      {/* Dropdown menu - Hidden for draft orders per user request */}
      {isEditMode && !formData.isDraftOrder && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl"
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={handleDuplicateOrder}
              className="text-sm"
            >
              <Copy className="size-4 mr-2" />
              Duplicate Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );

  return (
    <UnsavedChangesGuard
      hasChanges={hasChanges}
      enabled={ENABLE_UNSAVED_CHANGES_WARNING}
      title="Discard order changes?"
      description="You have unsaved changes to this order. If you leave now, all your changes will be lost."
    >
      <div className="flex-1 w-full">
        {/* Sticky Header Section - Pinned below the main header */}
        <div
          id="order-sticky-header"
          className="sticky top-0 z-20 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 border-b border-slate-200 shadow-sm -mx-1 px-7 lg:px-9 py-4 mb-6 transition-all"
        >
          <div className="space-y-4">
            {/* Breadcrumb */}
            {/* Breadcrumb - hide or simplify on extra small screens if needed, otherwise keep as is with flex-wrap */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <button
                onClick={() => navigate(ROUTES.ORDERS.LIST)}
                className="text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap"
                type="button"
              >
                Orders
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900 font-medium truncate">
                {isEditMode ? formData.orderNumber || "Edit" : "Create"}
              </span>
            </div>

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(ROUTES.ORDERS.LIST)}
                  className="rounded-full h-9 w-9 sm:h-10 sm:w-10 shrink-0"
                >
                  <ArrowLeft className="size-4" />
                </Button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
                      {title}
                    </h1>
                    {(sourceOrderNumber || isEditMode) && (
                      <div className="flex flex-wrap items-center gap-2">
                        {sourceOrderNumber && (
                          <Badge
                            variant="outline"
                            className="font-normal text-slate-500 bg-white"
                          >
                            Duplicated from {sourceOrderNumber}
                          </Badge>
                        )}
                        {isEditMode && !formData.isDraftOrder && orderId && (
                          <div className="flex flex-wrap items-center">
                            <OrderStatusActions
                              orderId={orderId}
                              orderStatus={formData.orderStatus}
                              paymentStatus={formData.paymentStatus}
                              fulfillmentStatus={formData.fulfillmentStatus}
                              onStatusChange={updateFields}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {!isEditMode && (
                    <p className="text-sm text-slate-600">
                      Create and manage order details
                    </p>
                  )}
                  {isEditMode && formData.orderDate && (
                    <p className="text-sm mt-1 text-slate-600">
                      {new Date(formData.orderDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                      <span className="mx-1" />
                      {new Date(formData.orderDate)
                        .toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                        .toUpperCase()}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {!hasChanges && headerActions}
                {renderHeaderActions()}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-8 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              {/* 1. ORDER DETAILS CARD */}
              <Card className="rounded-card shadow-sm border-slate-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="size-5 text-icon-muted" />
                    <CardTitle className="font-semibold text-slate-900">
                      Order Details
                      <span className="text-amber-600 ml-0.5">*</span>
                    </CardTitle>
                  </div>
                  <CardAction>
                    <Button
                      variant="outline"
                      onClick={() => setShowProductModal(true)}
                      className="text-slate-700"
                    >
                      Browse products
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent className="space-y-5" id="items-section">
                  {formData.items.length > 0 && (
                    <OrderItemsTable
                      items={formData.items}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemoveItem={handleRemoveItem}
                      // onApplyDiscount={handleApplyDiscount} // Commented out to hide product-level discounts per user request
                      currency={formData.currency}
                    />
                  )}

                  {/* Pricing Summary */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    {/* Subtotal */}
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="text-slate-900">
                        {formatCurrency(grossSubtotal, formData.currency)}
                      </span>
                    </div>

                    {/* Product Discounts */}
                    {productDiscounts > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-green-600">
                          Product Discounts
                        </span>
                        <span className="text-green-600">
                          -{formatCurrency(productDiscounts, formData.currency)}
                        </span>
                      </div>
                    )}

                    {/* Order Discount */}
                    <div className="flex justify-between items-center text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowOrderDiscountModal(true)}
                        className="h-auto p-0 text-indigo-600 hover:text-indigo-700 hover:bg-transparent font-medium"
                      >
                        {orderDiscount > 0 ? (
                          <>
                            <Pencil className="size-3 mr-1.5" />
                            Edit discount
                          </>
                        ) : (
                          <>
                            <Plus className="size-3 mr-1.5" />
                            Add discount
                          </>
                        )}
                      </Button>
                      <span className="text-slate-500">
                        {orderDiscount > 0
                          ? `-${formatCurrency(orderDiscount, formData.currency)}`
                          : ""}
                      </span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between items-center text-sm mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleAddShipping}
                        className="h-auto p-0 text-indigo-600 hover:text-indigo-700 hover:bg-transparent font-medium"
                      >
                        {shipping > 0 ? (
                          <>
                            <Pencil className="size-3 mr-1.5" />
                            Edit shipping
                          </>
                        ) : (
                          <>
                            <Plus className="size-3 mr-1.5" />
                            Add shipping
                          </>
                        )}
                      </Button>
                      <span className="text-slate-500">
                        {shipping > 0
                          ? formatCurrency(shipping, formData.currency)
                          : ""}
                      </span>
                    </div>

                    {/* Taxes */}
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-slate-700">Taxes</span>
                      <span className="text-slate-900">
                        {formatCurrency(taxes, formData.currency)}
                      </span>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center text-base font-bold pt-3 border-t border-slate-100">
                      <span className="text-slate-900">Total</span>
                      <span className="text-slate-900">
                        {formatCurrency(total, formData.currency)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 2. PAYMENT & INVOICE CARD - Hide for draft orders */}
              {!formData.isDraftOrder && (
                <Card className="rounded-card shadow-sm border-slate-200">
                  <CardContent className="pt-3 space-y-4">
                    {/* Invoice Management - shows list, regenerate, email, download */}
                    {orderId && (
                      <div className="pb-6 border-b border-slate-100">
                        <InvoiceManager
                          orderId={orderId}
                          lastModified={lastModified}
                          variant="embedded"
                        />
                      </div>
                    )}

                    {/* Accept Payment */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard className="size-5 text-slate-500" />
                          <span className="font-medium text-slate-900">
                            Accept Payment
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePayWithCard}
                          disabled={
                            formData.items.length === 0 ||
                            razorpayStatus !== "idle" ||
                            formData.paymentStatus === "paid"
                          }
                          className="rounded-lg border-slate-100 text-slate-400 font-normal hover:bg-slate-50 hover:text-slate-600 transition-colors"
                        >
                          {razorpayStatus === "loading_sdk" ||
                          razorpayStatus === "creating_order"
                            ? "Loading..."
                            : "Pay with credit card"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* 1. STATUS MANAGEMENT (Edit Mode Only) - Hide for draft orders */}
              {isEditMode && !formData.isDraftOrder && orderId && (
                <OrderStatusManagement
                  orderId={orderId}
                  orderStatus={formData.orderStatus || "pending"}
                  paymentStatus={formData.paymentStatus || "pending"}
                  fulfillmentStatus={
                    formData.fulfillmentStatus || "unfulfilled"
                  }
                  trackingNumber={formData.trackingNumber}
                  onStatusChange={updateFields}
                />
              )}

              {/* 2. CUSTOMER & ADDRESSES CARD */}
              <Card className="rounded-card shadow-sm border-slate-200 gap-4">
                <CardHeader>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <User className="size-5 text-icon-muted" />
                      <CardTitle className="font-semibold text-slate-900">
                        Customer<span className="text-amber-600 ml-0.5">*</span>
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Customer Section */}
                  <div id="customer-section">
                    {!formData.customer ? (
                      <Button
                        className="w-full h-[44px] bg-(--sidebar-bg) hover:bg-(--sidebar-hover) text-(--text-white)/90 rounded-xl text-sm font-medium transition-all shadow-sm gap-2"
                        onClick={() => setShowCustomerModal(true)}
                      >
                        <Plus className="size-[18px]" />
                        Select customer
                      </Button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold text-sm shrink-0">
                          {formData.customer.name?.charAt(0).toUpperCase() ||
                            "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {formData.customer.name}
                          </p>
                          <p className="text-sm text-slate-500 truncate">
                            {formData.customer.email}
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setShowCustomerModal(true)}
                          className="h-9 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5"
                        >
                          <Pencil className="size-3.5" />
                          <span>Change</span>
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* Shipping */}
                  <div id="shipping-address-section">
                    <div className="flex items-center gap-2 mb-3">
                      <Truck className="size-5 text-icon-muted" />
                      <h3 className="text-sm font-medium text-slate-700">
                        Shipping Address
                        {errors.shippingAddress && (
                          <span className="text-red-500 text-xs ml-2">
                            {errors.shippingAddress}
                          </span>
                        )}
                      </h3>
                    </div>
                    <div
                      className={
                        errors.shippingAddress
                          ? "border-2 border-red-300 rounded-xl p-2"
                          : ""
                      }
                    >
                      <AddressSelector
                        customer={formData.customer}
                        selectedAddress={formData.shippingAddress}
                        onSelect={handleShippingAddressSelect}
                        addressType="shipping"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* Billing */}
                  <div id="billing-address-section">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <ReceiptText className="size-5 text-icon-muted" />
                        <h3 className="text-sm font-medium text-slate-700">
                          Billing Address
                          {errors.billingAddress && (
                            <span className="text-red-500 text-xs ml-2">
                              {errors.billingAddress}
                            </span>
                          )}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">
                          Same as shipping
                        </span>
                        <Switch
                          checked={formData.billingSameAsShipping}
                          onCheckedChange={handleSameAsShippingChange}
                        />
                      </div>
                    </div>

                    {!formData.billingSameAsShipping && (
                      <div
                        className={
                          errors.billingAddress
                            ? "border-2 border-red-300 rounded-xl p-2"
                            : ""
                        }
                      >
                        <AddressSelector
                          customer={formData.customer}
                          selectedAddress={formData.billingAddress}
                          onSelect={handleBillingAddressSelect}
                          addressType="billing"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 3. NOTES & TAGS */}
              <NotesTags
                tags={formData.orderTags}
                availableTags={availableTags}
                onTagsChange={(val) => handleNotesChange("orderTags", val)}
                adminComment={formData.adminComment}
                onAdminCommentChange={(val) =>
                  handleNotesChange("adminComment", val)
                }
                customerNote={formData.customerNote}
                onCustomerNoteChange={(val) =>
                  handleNotesChange("customerNote", val)
                }
                showCustomerNote={false}
                tagType="order"
                onTagCreated={handleTagCreated}
              />
            </div>
          </div>
        </div>

        {/* --- MODALS --- */}
        <ProductSelectionModal
          isOpen={showProductModal}
          onClose={() => setShowProductModal(false)}
          onAddProducts={handleAddProducts}
        />

        <Dialog open={showCustomerModal} onOpenChange={setShowCustomerModal}>
          <DialogContent className="max-w-md rounded-xl">
            <DialogHeader>
              <DialogTitle>Select Customer</DialogTitle>
            </DialogHeader>
            <CustomerSelector
              selectedCustomer={formData.customer}
              onSelect={handleCustomerSelect}
              variant="embedded"
            />
          </DialogContent>
        </Dialog>

        <Dialog open={showTagsModal} onOpenChange={setShowTagsModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Manage Tags</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-slate-500">Tag management coming soon</p>
          </DialogContent>
        </Dialog>

        <OrderDiscountModal
          isOpen={showOrderDiscountModal}
          onClose={() => setShowOrderDiscountModal(false)}
          currentSubtotal={itemsNetTotal}
          currentDiscountType={formData.pricing?.orderDiscountType || ""}
          currentDiscountValue={formData.pricing?.orderDiscountValue || 0}
          onApplyDiscount={handleApplyOrderDiscount}
          currencySymbol={
            formData.currency === "USD"
              ? "$"
              : formData.currency === "EUR"
                ? "€"
                : "₹"
          }
        />

        <ShippingModal
          isOpen={showShippingModal}
          onClose={() => setShowShippingModal(false)}
          currentShipping={formData.pricing?.shippingCharge || 0}
          onApplyShipping={handleApplyShipping}
          currencySymbol={
            formData.currency === "USD"
              ? "$"
              : formData.currency === "EUR"
                ? "€"
                : "₹"
          }
        />

        <ConfirmationDialog
          isOpen={showRemoveCustomerConfirm}
          onClose={() => setShowRemoveCustomerConfirm(false)}
          onConfirm={confirmRemoveCustomer}
          title="Remove customer?"
          description={`Are you sure you want to remove "${formData.customer?.name || "this customer"}" from this order? This will also clear the shipping and billing addresses.`}
          confirmText="Remove"
          cancelText="Cancel"
          variant="destructive"
        />
      </div>
    </UnsavedChangesGuard>
  );
}
