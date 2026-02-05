import { useState, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type {
  OrderFormData,
  Customer,
  Address,
  OrderItem,
  OrderPricing,
} from "@/features/orders/types/order.types";
import { emptyOrderFormData } from "@/features/orders/types/order.types";
import { useCreateOrder, useUpdateOrder } from "./useOrdersApi";

export interface UseOrderFormOptions {
  mode?: "create" | "edit";
  initialData?: Partial<OrderFormData>;
  orderId?: string;
}

const getDefaultFormData = (): OrderFormData => ({
  ...emptyOrderFormData,
});

export const useOrderForm = (options: UseOrderFormOptions = {}) => {
  const { mode = "create", initialData, orderId } = options;
  const navigate = useNavigate();

  // API Mutations
  const createOrderMutation = useCreateOrder();
  const updateOrderMutation = useUpdateOrder();

  // 1. Primary form data state
  const [formData, setFormData] = useState<OrderFormData>({
    ...getDefaultFormData(),
    ...initialData,
  });

  // Store initial data for change detection
  const initialDataRef = useRef<OrderFormData>({
    ...getDefaultFormData(),
    ...initialData,
  });

  // 2. UI state
  const [ui] = useState({
    isLoading: false,
    isSubmitting:
      createOrderMutation.isPending || updateOrderMutation.isPending,
    isSaving: false,
  });

  // 3. Error state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 4. Track if form has changes
  const hasChanges = useMemo(() => {
    // Don't show unsaved changes if we're in the process of saving or already saved
    if (isSaved || isSaving) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialDataRef.current);
  }, [formData, isSaved, isSaving]);

  // === CORE OPERATIONS ===

  const updateField = <K extends keyof OrderFormData>(
    field: K,
    value: OrderFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  const updateFields = (updates: Partial<OrderFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setFormData(
      initialData
        ? { ...getDefaultFormData(), ...initialData }
        : getDefaultFormData(),
    );
    setErrors({});
  };

  // === CALCULATIONS ===

  const calculatePricing = (
    items: OrderItem[],
    currentPricing: OrderPricing,
  ): OrderPricing => {
    // 1. Calculate Item Subtotals and Discounts
    let subtotal = 0;
    let productDiscountsTotal = 0;

    items.forEach((item) => {
      // Defensive guards against undefined/null values
      const costPrice = item.costPrice ?? 0;
      const quantity = item.quantity ?? 0;
      const discountValue = item.discountValue ?? 0;

      let unitPrice = costPrice;
      if (item.discountType === "percentage") {
        unitPrice = unitPrice - (unitPrice * discountValue) / 100;
      } else if (item.discountType === "fixed") {
        unitPrice = Math.max(0, unitPrice - discountValue);
      }

      const lineTotal = unitPrice * quantity;
      const originalLineTotal = costPrice * quantity;

      subtotal += lineTotal;
      productDiscountsTotal += originalLineTotal - lineTotal;
    });

    // 2. Order Level Discount
    let orderDiscountAmount = 0;
    if (currentPricing.orderDiscountType === "percentage") {
      orderDiscountAmount =
        (subtotal * currentPricing.orderDiscountValue) / 100;
    } else if (currentPricing.orderDiscountType === "fixed") {
      orderDiscountAmount = currentPricing.orderDiscountValue;
    }

    const taxableAmount = Math.max(0, subtotal - orderDiscountAmount);

    // 3. Tax
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (currentPricing.taxType === "cgst_sgst") {
      cgst = (taxableAmount * currentPricing.cgstRate) / 100;
      sgst = (taxableAmount * currentPricing.sgstRate) / 100;
    } else if (currentPricing.taxType === "igst") {
      igst = (taxableAmount * currentPricing.igstRate) / 100;
    }

    const totalTax = cgst + sgst + igst;

    // 4. Final Total
    const grandTotal =
      taxableAmount +
      totalTax +
      (parseFloat(currentPricing.shippingCharge as any) || 0) +
      (parseFloat(currentPricing.codCharge as any) || 0) -
      (parseFloat(currentPricing.giftCardAmount as any) || 0);

    const balanceDue =
      grandTotal - (parseFloat(currentPricing.advancePaid as any) || 0);

    return {
      ...currentPricing,
      subtotal,
      productDiscountsTotal,
      orderDiscount: orderDiscountAmount,
      cgst,
      sgst,
      igst,
      grandTotal,
      balanceDue,
    };
  };

  // === HANDLERS ===

  // Customer Handlers
  const customerHandlers = {
    setCustomer: (customer: Customer) => {
      setFormData((prev) => ({
        ...prev,
        customer,
        // Reset addresses when customer changes
        shippingAddress: null,
        billingAddress: null,
      }));
    },

    setAddress: (type: "shipping" | "billing", address: Address) => {
      setFormData((prev) => {
        const updates: Partial<OrderFormData> = {
          [type === "shipping" ? "shippingAddress" : "billingAddress"]: address,
        };

        // If shipping changed and billing is same as shipping, update billing too
        if (type === "shipping" && prev.billingSameAsShipping) {
          updates.billingAddress = address;
        }

        return { ...prev, ...updates };
      });
    },

    setSameAsShipping: (checked: boolean) => {
      setFormData((prev) => ({
        ...prev,
        billingSameAsShipping: checked,
        billingAddress: checked ? prev.shippingAddress : prev.billingAddress,
      }));
    },
  };

  // Item Handlers
  const itemHandlers = {
    addItem: (newItem: OrderItem) => {
      setFormData((prev) => {
        const existingIndex = prev.items.findIndex(
          (p) => p.productId === newItem.productId,
        );
        const updatedItems = [...prev.items];

        if (existingIndex >= 0) {
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + newItem.quantity,
          };
        } else {
          updatedItems.push(newItem);
        }

        return {
          ...prev,
          items: updatedItems,
          pricing: calculatePricing(updatedItems, prev.pricing),
        };
      });
    },

    updateQuantity: (itemId: string, quantity: number) => {
      setFormData((prev) => {
        const updatedItems = prev.items.map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(1, quantity) }
            : item,
        );

        return {
          ...prev,
          items: updatedItems,
          pricing: calculatePricing(updatedItems, prev.pricing),
        };
      });
    },

    removeItem: (itemId: string) => {
      setFormData((prev) => {
        const updatedItems = prev.items.filter((item) => item.id !== itemId);

        // Reset order discount if no items remain
        const updatedPricing =
          updatedItems.length === 0
            ? {
              ...prev.pricing,
              orderDiscountType: "" as const,
              orderDiscountValue: 0,
            }
            : prev.pricing;

        return {
          ...prev,
          items: updatedItems,
          pricing: calculatePricing(updatedItems, updatedPricing),
        };
      });
    },

    applyDiscount: (
      itemIds: string[],
      discountType: "percentage" | "fixed",
      discountValue: number,
    ) => {
      setFormData((prev) => {
        const updatedItems = prev.items.map((item) => {
          if (itemIds.includes(item.id)) {
            return {
              ...item,
              discountType,
              discountValue,
            };
          }
          return item;
        });

        return {
          ...prev,
          items: updatedItems,
          pricing: calculatePricing(updatedItems, prev.pricing),
        };
      });
    },
  };

  // Pricing Handlers
  const pricingHandlers = {
    update: (
      field: keyof OrderPricing,
      value: OrderPricing[keyof OrderPricing],
    ) => {
      setFormData((prev) => {
        const newPricing = { ...prev.pricing, [field]: value };
        return {
          ...prev,
          pricing: calculatePricing(prev.items, newPricing),
        };
      });
    },

    applyOrderDiscount: (
      discountType: "" | "percentage" | "fixed",
      discountValue: number
    ) => {
      setFormData((prev) => {
        const newPricing = {
          ...prev.pricing,
          orderDiscountType: discountType,
          orderDiscountValue: discountValue
        };
        return {
          ...prev,
          pricing: calculatePricing(prev.items, newPricing),
        };
      });
    },

    applyShipping: (shippingCharge: number) => {
      setFormData((prev) => {
        const newPricing = {
          ...prev.pricing,
          shippingCharge: shippingCharge
        };
        return {
          ...prev,
          pricing: calculatePricing(prev.items, newPricing),
        };
      });
    },
  };

  // Submission Handlers
  const handleSaveDraft = useCallback(() => {
    const draftData: OrderFormData = { ...formData, isDraftOrder: true };
    createOrderMutation.mutate(draftData, {
      onSuccess: () => {
        setIsSaved(true);
        // Defer navigation to allow isSaved state update to propagate
        setTimeout(() => {
          navigate("/orders/draft");
        }, 0);
      },
    });
  }, [formData, createOrderMutation, navigate]);

  // Helper function to scroll to first error
  const scrollToFirstError = (errors: Record<string, string>) => {
    const firstErrorKey = Object.keys(errors)[0];
    if (!firstErrorKey) return;

    // Map error keys to DOM element IDs
    const fieldIdMap: Record<string, string> = {
      'salesChannel': 'sales-channel-field',
      'customer': 'customer-section',
      'items': 'items-section',
      'shippingAddress': 'shipping-address-section',
      'billingAddress': 'billing-address-section',
      'pricing.orderDiscountValue': 'order-discount-field',
      'pricing.codCharge': 'cod-charge-field',
      'pricing.advancePaid': 'advance-paid-field',
    };

    const targetId = fieldIdMap[firstErrorKey] || firstErrorKey;
    const element = document.getElementById(targetId);
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Focus if it's a focusable element
      if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
        setTimeout(() => element.focus(), 300);
      }
    }
  };

  const handleCreateOrder = useCallback(() => {
    // Comprehensive validation using Zod schema
    const newErrors: Record<string, string> = {};

    // Priority 1: Critical validations
    if (!formData.salesChannel) {
      newErrors.salesChannel = "Please select a sales channel";
    }
    if (!formData.customer) {
      newErrors.customer = "Please select a customer";
    }
    if (formData.items.length === 0) {
      newErrors.items = "Please add at least one product";
    }

    // Priority 1: Address validations (CRITICAL)
    if (!formData.shippingAddress) {
      newErrors.shippingAddress = "Please select a shipping address";
    }
    if (!formData.billingSameAsShipping && !formData.billingAddress) {
      newErrors.billingAddress = "Please select a billing address";
    }

    // Priority 1: Item stock validation (CRITICAL)
    formData.items.forEach((item, index) => {
      if (item.quantity > item.availableStock) {
        newErrors[`items.${index}.quantity`] =
          `Quantity (${item.quantity}) exceeds available stock (${item.availableStock}) for ${item.productName}`;
        // Also set a general items error for toast
        if (!newErrors.items) {
          newErrors.items = "Some items have insufficient stock";
        }
      }
      if (item.quantity <= 0) {
        newErrors[`items.${index}.quantity`] = "Quantity must be at least 1";
      }
    });

    // Priority 2: Discount validations
    formData.items.forEach((item, index) => {
      if (item.discountType === "percentage" && item.discountValue > 100) {
        newErrors[`items.${index}.discountValue`] =
          `Discount percentage cannot exceed 100% for ${item.productName}`;
      }
    });

    if (
      formData.pricing.orderDiscountType === "percentage" &&
      formData.pricing.orderDiscountValue > 100
    ) {
      newErrors["pricing.orderDiscountValue"] =
        "Order discount percentage cannot exceed 100%";
    }

    // Priority 2: COD charge validation
    if (formData.paymentMethod === "cod" && formData.pricing.codCharge === 0) {
      newErrors["pricing.codCharge"] =
        "COD charge is required for Cash on Delivery orders";
    }

    // Priority 2: Tax type for international orders
    if (formData.isInternational && formData.pricing.taxType !== "none") {
      newErrors["pricing.taxType"] =
        "International orders must have tax type set to 'None'";
    }
    if (!formData.isInternational && formData.pricing.taxType === "none") {
      newErrors["pricing.taxType"] =
        "Domestic orders must have applicable tax type (CGST+SGST or IGST)";
    }

    // Priority 3: Payment validations
    if (formData.pricing.advancePaid > formData.pricing.grandTotal) {
      newErrors["pricing.advancePaid"] =
        "Advance paid cannot exceed grand total";
    }

    // Priority 3: Gift card validation
    if (
      formData.pricing.giftCardCode &&
      formData.pricing.giftCardAmount === 0
    ) {
      newErrors["pricing.giftCardAmount"] =
        "Gift card amount is required when gift card code is provided";
    }

    // Priority 3: Customer field validations (if customer exists)
    // Relaxed validation: We trust the selected customer profile is sufficient
    // if (formData.customer) { .. } checks removed to allow customers with missing details

    // Priority 3: Address field validations (if addresses exist)
    if (formData.shippingAddress) {
      if (
        formData.shippingAddress.pincode &&
        !/^\d{6}$/.test(formData.shippingAddress.pincode)
      ) {
        newErrors["shippingAddress.pincode"] =
          "Pincode must be exactly 6 digits";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Count error types for better messaging
      const criticalErrors = Object.keys(newErrors).filter(
        (k) =>
          k.includes("shippingAddress") ||
          k.includes("billingAddress") ||
          k.includes("customer") ||
          k === "items" ||
          k === "salesChannel",
      ).length;

      const stockErrors = Object.keys(newErrors).filter((k) =>
        k.includes("quantity"),
      ).length;

      if (stockErrors > 0) {
        toast.error(`${stockErrors} item(s) have insufficient stock`);
      } else if (criticalErrors > 0) {
        // Build a friendly list of missing fields
        const missingFields: string[] = [];
        const errorKeys = Object.keys(newErrors);

        if (errorKeys.some(k => k.includes("customer"))) missingFields.push("Customer Details");
        if (errorKeys.some(k => k.includes("salesChannel"))) missingFields.push("Sales Channel");
        if (errorKeys.some(k => k.includes("items"))) missingFields.push("Items");
        if (errorKeys.some(k => k.includes("shippingAddress"))) missingFields.push("Shipping Address");
        if (errorKeys.some(k => k.includes("billingAddress"))) missingFields.push("Billing Address");

        if (missingFields.length === 0) {
          // Fallback for unknown critical errors
          missingFields.push(...errorKeys);
        }

        toast.error(`Missing required fields: ${Array.from(new Set(missingFields)).join(", ")}`);
        
        // Scroll to first error field
        scrollToFirstError(newErrors);
      } else {
        toast.error("Please fix the validation errors before creating order");
        scrollToFirstError(newErrors);
      }
      return;
    }

    // Set saving state to disable unsaved changes guard immediately
    setIsSaving(true);

    if (mode === "edit" && orderId) {
      // Update existing order
      updateOrderMutation.mutate(
        { id: orderId, data: formData },
        {
          onSuccess: () => {
            // Reset states - the mutation already shows success toast
            setIsSaved(true);
            setIsSaving(false);
            // Update the initial ref to sync with saved data
            initialDataRef.current = formData;
            // Don't navigate - stay on order details page
            // React Query will automatically refresh the data via invalidateQueries
          },
          onError: () => {
            // Reset saving state on error so user can try again
            setIsSaving(false);
          },
        },
      );
    } else {
      // Create new order
      createOrderMutation.mutate(formData, {
        onSuccess: () => {
          // Reset states - the mutation already shows success toast
          setIsSaved(true);
          setIsSaving(false);
          // Update the initial ref to prevent unsaved changes warning
          initialDataRef.current = formData;
          // Navigate to orders list after creating new order
          navigate("/orders");
        },
        onError: () => {
          // Reset saving state on error so user can try again
          setIsSaving(false);
        },
      });
    }
  }, [
    formData,
    mode,
    orderId,
    createOrderMutation,
    updateOrderMutation,
    navigate,
  ]);

  return {
    formData,
    ui,
    errors,
    mode,
    hasChanges,

    // Core Ops
    updateField,
    updateFields,
    resetForm,

    // Grouped Handlers
    handlers: {
      customer: customerHandlers,
      items: itemHandlers,
      pricing: pricingHandlers,
    },

    // Action Handlers
    saveDraft: handleSaveDraft,
    createOrder: handleCreateOrder,

    // Legacy support (Adapters for CreateOrderForm.tsx refactor)
    handleBasicInfoChange: updateField,
    handleCustomerChange: customerHandlers.setCustomer,
    handleAddressChange: customerHandlers.setAddress,
    handleSameAsShippingChange: customerHandlers.setSameAsShipping,
    handleAddItem: itemHandlers.addItem,
    handleUpdateQuantity: itemHandlers.updateQuantity,
    handleRemoveItem: itemHandlers.removeItem,
    handlePricingChange: pricingHandlers.update,
    handleApplyOrderDiscount: pricingHandlers.applyOrderDiscount,
    handleApplyShipping: pricingHandlers.applyShipping,
    handleApplyDiscount: itemHandlers.applyDiscount,
    handleNotesChange: updateField, // This might need type adjustment
    handleSaveDraft: handleSaveDraft, // duplicate
    handleCreateOrder: handleCreateOrder, // duplicate
    handleCancel: () => navigate(-1),
  };
};
