import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { DiscountFormData } from '../types/discount.types';
import { MOCK_DISCOUNTS } from '../data/discount.constants';

export const useDiscountForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<DiscountFormData>({
    code: '',
    title: '',
    description: '',
    value: '',
    usageLimit: '',
    usageCount: 0,
    status: 'active',
    startDate: undefined,
    endDate: undefined,
    genType: 'single',
    discountType: 'percentage',
    codeLength: '8',
    minPurchaseType: 'none',
    targetAudience: 'all',
    selectedCustomers: [],
    selectedSegments: [],
    geoRestriction: 'none',
    selectedCountries: [],
    appliesTo: 'entire-order',
    selectedProducts: [],
    selectedCollections: [],
    buyXTriggerType: 'quantity',
    buyXValue: '2',
    buyXAppliesTo: 'any',
    buyXSelectedProducts: [],
    buyXSelectedCollections: [],
    buyXSameProduct: false,
    buyXRepeat: true,
    getYType: 'free',
    getYAppliesTo: 'same',
    getYSelectedProducts: [],
    getYSelectedCollections: [],
    getYQuantity: '1',
    getYValue: '0',
    getYMaxRewards: '',
    shippingScope: 'all',
    shippingSelectedMethods: [],
    shippingSelectedZones: [],
    shippingMinAmount: '',
    shippingMinItems: '',
    shippingExcludeProducts: [],
    shippingExcludeCollections: [],
    shippingExcludePaymentMethods: [],
    shippingCap: '',
    excludeProducts: [],
    excludeCollections: [],
    excludePaymentMethods: [],
    excludeSalesChannels: [],
    usagePerDay: '',
    usagePerOrder: '',
    limitNewCustomers: false,
    limitReturningCustomers: false,
    timezone: 'utc',
    tags: [],
    adminComment: '',
  });

  useEffect(() => {
    if (isEditMode && id) {
      const discount = MOCK_DISCOUNTS.find((d) => d.id === id);
      if (discount) {
        // Map legacy/mock structure to new strict typed structure
        const typeMap: any = {
          percentage: "percentage",
          fixed: "fixed",
          buy_x_get_y: "buy-x",
          free_shipping: "shipping",
        };

        setFormData(prev => ({
          ...prev,
          code: discount.code,
          title: discount.title,
          value: discount.value.replace(/[^0-9.]/g, ""),
          usageLimit: discount.usage_limit?.toString() || "",
          usageCount: discount.usage_count,
          status: discount.status as any,
          discountType: typeMap[discount.type] || "percentage",
          startDate: discount.starts_at ? new Date(discount.starts_at) : undefined,
          endDate: discount.ends_at ? new Date(discount.ends_at) : undefined,
          tags: discount.tags || [],
          adminComment: discount.admin_comment || "",
        }));
      }
    }
  }, [isEditMode, id]);

  const updateField = <K extends keyof DiscountFormData>(field: K, value: DiscountFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Saving discount...", formData);
    // Add save logic here
  };

  const handleDiscard = () => {
    navigate("/discounts");
  };

  return {
    formData,
    updateField,
    handleSave,
    handleDiscard,
    isEditMode,
    id
  };
};
