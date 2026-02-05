import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { ProductFormData, FAQItem, ProductImage } from '@/features/products/types/product.types';

/**
 * Standard form hook options interface
 * Follows the established pattern for all form hooks
 */
interface UseProductFormOptions {
  mode?: 'create' | 'edit';
  initialData?: Partial<ProductFormData>;
  productId?: string;
}

/**
 * Default form data for new products
 */
const getDefaultFormData = (): ProductFormData => ({
  productTitle: '',
  secondaryTitle: '',
  shortDescription: '',
  fullDescription: '',
  costPrice: '',
  sellingPrice: '',
  compareAtPrice: '',
  sku: '',
  hsnNumber: '',
  barcode: '',
  inventoryQuantity: '',
  weight: '',
  length: '',
  breadth: '',
  height: '',
  tier1Category: '',
  tier2Category: '',
  tier3Category: '',
  tier4Category: '',
  productStatus: 'draft',
  featured: false,
  productImages: [],
  // productImages: [
  //   {
  //     id: 'default-primary',
  //     url: getRandomProductImage(),
  //     isPrimary: true,
  //     uploadStatus: 'success'
  //   }
  // ],
  productUrl: '',
  metaTitle: '',
  metaDescription: '',
  faqs: [],
  tags: [],
  slug: '',
});

/**
 * Helper to get a random high-quality product image from Unsplash
 */
/*
const getRandomProductImage = (): string => {
  const images = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop', // Headphones
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop', // Watch
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1000&auto=format&fit=crop', // Camera
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop', // Red Shoe
    'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1000&auto=format&fit=crop', // Lamp
  ];
  return images[Math.floor(Math.random() * images.length)];
};
*/

/**
 * Standard product form hook following the established pattern
 * 
 * @example
 * // Creating new product
 * const { formData, updateField, handlers } = useProductForm({ mode: 'create' });
 * 
 * @example
 * // Editing existing product
 * const { formData, updateField, handlers } = useProductForm({ 
 *   mode: 'edit',
 *   initialData: productData,
 *   productId: '123'
 * });
 */
/**
 * Standard product form hook following the established pattern
 * Supports legacy signature: useProductForm(initialData)
 * Supports new signature: useProductForm(options)
 */
export function useProductForm(optionsOrData?: UseProductFormOptions | ProductFormData) {
  // Determine if using legacy signature or new options object
  const isLegacyCall = optionsOrData && !('mode' in optionsOrData) && !('initialData' in optionsOrData) && ('productTitle' in optionsOrData || Object.keys(optionsOrData).length > 0);

  const mode = isLegacyCall ? 'edit' : (optionsOrData as UseProductFormOptions)?.mode || 'create';
  const initialData = isLegacyCall ? (optionsOrData as ProductFormData) : (optionsOrData as UseProductFormOptions)?.initialData;

  // 1. Form data state (actual product data)
  const [formData, setFormData] = useState<ProductFormData>(() => {
    const defaultData = getDefaultFormData();
    const initial = {
      ...defaultData,
      ...initialData
    };

    // Ensure default image if empty
    if (!initial.productImages || initial.productImages.length === 0) {
      initial.productImages = defaultData.productImages;
    }

    console.log('🏗️ [useProductForm] Initial formData:', initial);
    return initial;
  });

  // Store initial snapshot for change detection
  const [initialFormSnapshot, setInitialFormSnapshot] = useState<ProductFormData | null>(() => {
    // Capture the exact starting state for both create and edit modes
    const baseData = initialData && Object.keys(initialData).length > 0
      ? { ...getDefaultFormData(), ...initialData }
      : getDefaultFormData();

    // Ensure productImages consistent with formData initialization
    if (!baseData.productImages || baseData.productImages.length === 0) {
      baseData.productImages = [];
    }

    return JSON.parse(JSON.stringify(baseData));
  });

  // Track if we need to capture snapshot after first render (for rich text editors)
  const [needsSnapshotCapture, setNeedsSnapshotCapture] = useState(false);

  // Sync formData when initialData changes (e.g. after async fetch)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const defaultData = getDefaultFormData();
      const mergedData = {
        ...defaultData,
        ...initialData
      };

      // Ensure productImages has at least the default if empty (even for existing products)
      if (!mergedData.productImages || mergedData.productImages.length === 0) {
        mergedData.productImages = defaultData.productImages;
      }

      setFormData(mergedData);
      // Mark that we need to capture snapshot after rich text editors normalize
      setNeedsSnapshotCapture(true);
    }
  }, [initialData]);

  // Capture snapshot after ReactQuill and other editors have normalized the content
  useEffect(() => {
    if (needsSnapshotCapture && mode === 'edit') {
      // Wait for next tick to ensure all editors have updated
      const timer = setTimeout(() => {
        setInitialFormSnapshot(JSON.parse(JSON.stringify(formData)));
        setNeedsSnapshotCapture(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [needsSnapshotCapture, formData, mode]);

  // 2. UI state (separate from form data)
  const [ui, setUi] = useState({
    isLoading: false,
    isSaving: false,
    expandedVariantId: null as string | null,
    expandedFaqId: null as string | null,
    showSizeDropdown: false,
    hasVariants: false,
  });

  // 3. Error state for validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // === CORE OPERATIONS ===

  /**
   * Generic field update handler with auto-derived values
   * Implements smart logic for category hierarchy and SEO
   */
  const updateField = <K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K]
  ) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      // Reset subcategories when parent category changes
      if (field === 'tier1Category') {
        updated.tier2Category = '';
        updated.tier3Category = '';
        updated.tier4Category = '';
      }
      if (field === 'tier2Category') {
        updated.tier3Category = '';
        updated.tier4Category = '';
      }
      if (field === 'tier3Category') {
        updated.tier4Category = '';
      }

      // Auto-fill SEO fields and slug from title
      if (field === 'productTitle') {
        const title = value as string;
        const slugValue = title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens

        updated.slug = slugValue;
        updated.productUrl = slugValue;
        updated.metaTitle = title.slice(0, 60);

        // Auto-generate SKU if not already set (create mode only)
        if (mode === 'create' && !updated.sku) {
          const timestamp = Date.now().toString().slice(-4);
          updated.sku = title.slice(0, 3).toUpperCase() + timestamp;
        }
      }

      // Auto-fill Meta Description from Short Description
      if (field === 'shortDescription') {
        updated.metaDescription = (value as string).slice(0, 160);
      }

      return updated;
    });

    // Clear error for this field when user updates it
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * Batch update multiple fields at once
   * Useful for complex operations that update multiple fields
   */
  const updateFields = (updates: Partial<ProductFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  /**
   * Reset form to default or initial state
   */
  const resetForm = () => {
    setFormData(initialData ? { ...getDefaultFormData(), ...initialData } : getDefaultFormData());
    setErrors({});
    setUi({
      isLoading: false,
      isSaving: false,
      expandedVariantId: null,
      expandedFaqId: null,
      showSizeDropdown: false,
      hasVariants: false,
    });
  };

  /**
   * Update the initial snapshot to current form data
   * Call this after a successful save to reset the "has changes" state
   */
  const updateSnapshot = () => {
    setInitialFormSnapshot(JSON.parse(JSON.stringify(formData)));
  };

  // === GROUPED HANDLERS ===

  /**
   * Media/Image management handlers
   */
  const mediaHandlers = {
    setImages: (images: ProductImage[]) => {
      setFormData(prev => ({ ...prev, productImages: images }));
    },

    addImage: (image: ProductImage) => {
      setFormData(prev => ({
        ...prev,
        productImages: [...prev.productImages, image]
      }));
    },

    removeImage: (imageId: string) => {
      setFormData(prev => ({
        ...prev,
        productImages: prev.productImages.filter(img => img.id !== imageId)
      }));
    },

    reorderImages: (startIndex: number, endIndex: number) => {
      setFormData(prev => {
        const result = Array.from(prev.productImages);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return { ...prev, productImages: result };
      });
    }
  };

  /**
   * FAQ management handlers
   */
  const faqHandlers = {
    add: () => {
      const newFAQ: FAQItem = {
        id: `faq-${Date.now()}`,
        question: '',
        answer: ''
      };
      setFormData(prev => ({
        ...prev,
        faqs: [...prev.faqs, newFAQ]
      }));
    },

    remove: (id: string) => {
      setFormData(prev => ({
        ...prev,
        faqs: prev.faqs.filter(faq => faq.id !== id)
      }));
      toast.success('FAQ removed');
    },

    update: (id: string, field: 'question' | 'answer', value: string) => {
      setFormData(prev => ({
        ...prev,
        faqs: prev.faqs.map(faq =>
          faq.id === id ? { ...faq, [field]: value } : faq
        )
      }));
    },

    reorder: (startIndex: number, endIndex: number) => {
      setFormData(prev => {
        const result = Array.from(prev.faqs);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return { ...prev, faqs: result };
      });
    }
  };

  // === UI STATE HANDLERS ===

  const uiHandlers = {
    toggleSizeDropdown: () => {
      setUi(prev => ({ ...prev, showSizeDropdown: !prev.showSizeDropdown }));
    },

    setLoading: (isLoading: boolean) => {
      setUi(prev => ({ ...prev, isLoading }));
    },

    setSaving: (isSaving: boolean) => {
      setUi(prev => ({ ...prev, isSaving }));
    }
  };

  // === COMPUTED VALUES ===

  /**
   * Check if form has unsaved changes
   */
  const hasChanges = (() => {
    if (!initialFormSnapshot) return false;

    // Exclude metadata fields from comparison
    const metadataFields = ['updatedAt', 'createdAt'];
    const cleanFormData: any = {};
    const cleanSnapshot: any = {};

    Object.keys(formData).forEach((key) => {
      if (!metadataFields.includes(key)) {
        cleanFormData[key] = formData[key as keyof ProductFormData];
      }
    });

    Object.keys(initialFormSnapshot).forEach((key) => {
      if (!metadataFields.includes(key)) {
        cleanSnapshot[key] = initialFormSnapshot[key as keyof ProductFormData];
      }
    });

    const formDataStr = JSON.stringify(cleanFormData);
    const snapshotStr = JSON.stringify(cleanSnapshot);
    const changed = formDataStr !== snapshotStr;

    return changed;
  })();

  /**
   * Validate form data
   * Returns true if valid, false otherwise
   * Only validates fields that are required by backend
   */
  const validate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    // Required fields (matching backend schema)
    if (!formData.productTitle.trim()) {
      newErrors.productTitle = 'Product title is required';
    }

    // Validation Constants
    const MAX_SAFE_VALUE = 1000000000; // 1 Billion

    // Validate sellingPrice
    if (!formData.sellingPrice) {
      newErrors.sellingPrice = 'Selling Price is required';
    } else {
      const sellingPriceValue = parseFloat(formData.sellingPrice);
      if (isNaN(sellingPriceValue) || sellingPriceValue <= 0) {
        newErrors.sellingPrice = 'Selling Price must be a positive value';
      } else if (sellingPriceValue > MAX_SAFE_VALUE) {
        newErrors.sellingPrice = 'Selling Price is too big';
      } else if (!/^\d+(\.\d{1,2})?$/.test(formData.sellingPrice)) {
        newErrors.sellingPrice = 'Selling Price can have maximum 2 decimal places';
      }
    }

    // Validate costPrice
    if (!formData.costPrice) {
      newErrors.costPrice = 'Cost Price is required';
    } else {
      const costPriceValue = parseFloat(formData.costPrice);
      if (isNaN(costPriceValue) || costPriceValue <= 0) {
        newErrors.costPrice = 'Cost Price must be a positive value';
      } else if (costPriceValue > MAX_SAFE_VALUE) {
        newErrors.costPrice = 'Cost Price is too big';
      } else if (!/^\d+(\.\d{1,2})?$/.test(formData.costPrice)) {
        newErrors.costPrice = 'Cost Price can have maximum 2 decimal places';
      }
    }

    if (!formData.tier1Category) {
      newErrors.tier1Category = 'Primary category is required';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    // Validate compareAtPrice >= sellingPrice if both exist
    if (formData.compareAtPrice && formData.sellingPrice) {
      // First validate decimal format for compareAtPrice
      const compareAtValue = parseFloat(formData.compareAtPrice);
      if (!/^\d+(\.\d{1,2})?$/.test(formData.compareAtPrice)) {
        newErrors.compareAtPrice = 'Compare At Price can have maximum 2 decimal places';
      } else if (!isNaN(compareAtValue) && compareAtValue > MAX_SAFE_VALUE) {
        newErrors.compareAtPrice = 'Compare At Price is too big';
      } else {
        const compareAt = parseFloat(formData.compareAtPrice);
        const selling = parseFloat(formData.sellingPrice);
        if (!isNaN(compareAt) && !isNaN(selling) && compareAt < selling) {
          newErrors.compareAtPrice = 'Must be greater than selling price';
        }
      }
    }

    if (!formData.inventoryQuantity || formData.inventoryQuantity.trim() === '') {
      newErrors.inventoryQuantity = 'Inventory Quantity is required';
    } else {
      const inventoryValue = parseFloat(formData.inventoryQuantity);
      if (!isNaN(inventoryValue) && inventoryValue > MAX_SAFE_VALUE) {
        newErrors.inventoryQuantity = 'Inventory Quantity is too big';
      }
    }

    // Variant validation
    if (formData.productVariants && formData.productVariants.length > 0) {
      formData.productVariants.forEach((variant) => {
        if (!variant.optionName?.trim()) {
          newErrors[`variant-${variant.id}-optionName`] = 'Variant Name is required';
        }
        if (!variant.optionValue?.trim()) {
          newErrors[`variant-${variant.id}-optionValue`] = 'Variant Value is required';
        }
        if (!variant.sku?.trim()) {
          newErrors[`variant-${variant.id}-sku`] = 'Variant SKU is required';
        }
        // Validate variant selling price
        if (!variant.sellingPrice) {
          newErrors[`variant-${variant.id}-sellingPrice`] = 'Variant Selling Price is required';
        } else {
          const sellingPriceValue = parseFloat(variant.sellingPrice);
          if (isNaN(sellingPriceValue) || sellingPriceValue <= 0) {
            newErrors[`variant-${variant.id}-sellingPrice`] = 'Variant Selling Price must be positive';
          } else if (sellingPriceValue > MAX_SAFE_VALUE) {
            newErrors[`variant-${variant.id}-sellingPrice`] = 'Variant Selling Price is too big';
          } else if (!/^\d+(\.\d{1,2})?$/.test(variant.sellingPrice)) {
            newErrors[`variant-${variant.id}-sellingPrice`] = 'Variant Selling Price can have maximum 2 decimal places';
          }
        }

        // Validate variant cost price
        if (!variant.costPrice) {
          newErrors[`variant-${variant.id}-costPrice`] = 'Variant Cost Price is required';
        } else {
          const costPriceValue = parseFloat(variant.costPrice);
          if (isNaN(costPriceValue) || costPriceValue <= 0) {
            newErrors[`variant-${variant.id}-costPrice`] = 'Variant Cost Price must be positive';
          } else if (costPriceValue > MAX_SAFE_VALUE) {
            newErrors[`variant-${variant.id}-costPrice`] = 'Variant Cost Price is too big';
          } else if (!/^\d+(\.\d{1,2})?$/.test(variant.costPrice)) {
            newErrors[`variant-${variant.id}-costPrice`] = 'Variant Cost Price can have maximum 2 decimal places';
          }
        }
        if (!variant.inventoryQuantity || variant.inventoryQuantity.trim() === '') {
          newErrors[`variant-${variant.id}-inventoryQuantity`] = 'Inventory Quantity is required';
        } else {
          const variantInventoryValue = parseFloat(variant.inventoryQuantity);
          if (!isNaN(variantInventoryValue) && variantInventoryValue > MAX_SAFE_VALUE) {
            newErrors[`variant-${variant.id}-inventoryQuantity`] = 'Variant Inventory Quantity is too big';
          }
        }
      });
    }

    // FAQ validation
    if (Array.isArray(formData.faqs) && formData.faqs.length > 0) {
      formData.faqs.forEach((faq) => {
        const question = typeof faq.question === 'string' ? faq.question.trim() : '';
        const answer = typeof faq.answer === 'string' ? faq.answer.trim() : '';

        if (!question) {
          newErrors[`faq-${faq.id}-question`] = 'Question is required';
        }
        if (!answer) {
          newErrors[`faq-${faq.id}-answer`] = 'Answer is required';
        }
      });
    }

    // slug is auto-generated from productTitle, always valid

    setErrors(newErrors);
    return newErrors;
  };

  // === RETURN INTERFACE ===
  // Following standard pattern: formData, ui state, handlers grouped by domain

  return {
    // Form data (single source of truth)
    formData,

    // UI state
    ui,

    // Error state
    errors,

    // Computed values
    hasChanges,
    mode,

    // Core operations
    updateField,
    updateFields,
    resetForm,
    updateSnapshot,
    validate,

    // Legacy compatibility (deprecated, use updateField instead)
    handleInputChange: updateField,
    setFormData,

    // Legacy UI state (deprecated, use ui.* instead)
    expandedVariantId: ui?.expandedVariantId ?? null,
    setExpandedVariantId: (id: string | null) => setUi(prev => ({ ...prev, expandedVariantId: id })),
    expandedFaqId: ui?.expandedFaqId ?? null,
    setExpandedFaqId: (id: string | null) => setUi(prev => ({ ...prev, expandedFaqId: id })),
    showSizeDropdown: ui?.showSizeDropdown ?? false,
    setShowSizeDropdown: (show: boolean) => setUi(prev => ({ ...prev, showSizeDropdown: show })),
    hasVariants: ui?.hasVariants ?? false,
    setHasVariants: (has: boolean) => setUi(prev => ({ ...prev, hasVariants: has })),

    // Grouped handlers (organized by domain)
    handlers: {
      media: mediaHandlers,
      faqs: faqHandlers,
      ui: uiHandlers,
    },

    // Legacy handlers (deprecated, use handlers.* instead)
    handleProductImagesChange: mediaHandlers.setImages,
    handleAddFAQ: faqHandlers.add,
    handleRemoveFAQ: faqHandlers.remove,
    handleFAQChange: faqHandlers.update,
  };
}
