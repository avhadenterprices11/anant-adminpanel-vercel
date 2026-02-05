import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { useState, useEffect } from 'react';
import { UnsavedChangesDialog } from '@/components/dialogs/UnsavedChangesDialog';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';

import { useProductForm, useDeferredUpload } from '../hooks';
import {
  BasicDetailsSection,
  DeferredMediaSection,
  PricingInventorySection,
  ProductVariantsSection,
  CategorizationSection,
  SeoSection,
  FaqSection,
  AvailabilitySection,
  AssociationsSection,
  // SalesChannelsSection
} from '../components/form-sections';
import { NotesTags } from '@/components/features/notes/NotesTags';
import { ROUTES } from '@/lib/constants';
import { productService } from '../services/productService';
import { tagService } from '@/features/tags/services/tagService';
import type { ProductImage } from '../types/product.types';

export default function AddProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  const {
    formData,
    handleInputChange,
    handleProductImagesChange,
    handleAddFAQ,
    handleRemoveFAQ,
    handleFAQChange,
    validate,
    expandedVariantId,
    setExpandedVariantId,
    expandedFaqId,
    setExpandedFaqId,
    errors,
    hasChanges
  } = useProductForm();

  // Local state for image validation error
  const [imageError, setImageError] = useState<string | null>(null);

  // Use the unsaved changes warning hook
  const { navigateWithConfirmation, proceedNavigation, cancelNavigation } =
    useUnsavedChangesWarning(hasChanges && !isSubmitting && !isSaveSuccess, () => setShowDiscardDialog(true));

  // Deferred upload hook for pending images (separate primary and additional)
  const {
    pendingPrimaryImage,
    setPendingPrimaryImage,
    pendingAdditionalImages,
    setPendingAdditionalImages,
    uploadPendingImages,
    uploadVariantImages,
  } = useDeferredUpload();

  const onBack = () => {
    navigateWithConfirmation(ROUTES.PRODUCTS.LIST);
  };

  /* Fetch Tags specific to Products */
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const fetchProductTags = async () => {
    try {
      const response = await tagService.getAllTags({ type: 'product', status: 'active' });
      if (response && response.tags) {
        setAvailableTags(response.tags.map(tag => tag.name));
      }
    } catch (error) {
      console.error('Failed to fetch product tags', error);
    }
  };

  useEffect(() => {
    fetchProductTags();
  }, []);

  const handleTagCreated = () => {
    // Refetch tags after a new one is created
    fetchProductTags();
  };

  const handleSave = async () => {
    // Validate form data
    // Validate form data
    const validationErrors = validate();

    // Strict validation for Primary Image (required)
    // Strict validation for Primary Image (required)
    if (!pendingPrimaryImage) {
      // For Add Product, we only check pending image since there are no existing images yet
      validationErrors.productImages = 'Primary product image is required';
      setImageError('Primary product image is required');
    } else {
      setImageError(null);
    }

    if (Object.keys(validationErrors).length > 0) {
      const firstErrorKey = Object.keys(validationErrors)[0];
      const errorMessage = validationErrors[firstErrorKey];

      // Show specific error message in toast
      toast.error(errorMessage);

      if (!firstErrorKey) return;

      // Map form fields to DOM IDs
      const fieldIdMap: Record<string, string> = {
        productImages: 'section-media',
        tier1Category: 'section-categorization', // Scrolls to the whole section
        productTitle: 'productTitle',
        sellingPrice: 'sellingPrice',
        costPrice: 'costPrice',
        inventoryQuantity: 'inventoryQuantity',
        sku: 'sku'
      };

      const targetId = fieldIdMap[firstErrorKey] || firstErrorKey;

      if (firstErrorKey.startsWith('variant-')) {
        const parts = firstErrorKey.split('-');
        const field = parts[parts.length - 1];
        // Extract variantId: remove 'variant-' prefix and '-field' suffix
        const variantId = firstErrorKey.replace('variant-', '').replace(`-${field}`, '');

        setExpandedVariantId(variantId);

        setTimeout(() => {
          // IDs follow pattern prefix-variantId
          const prefixMap: Record<string, string> = {
            optionName: 'option-name',
            optionValue: 'option-value',
            sku: 'sku',
            sellingPrice: 'selling-price',
            costPrice: 'cost-price',
            inventoryQuantity: 'inventory'
          };
          const elementPrefix = prefixMap[field] || field;
          const elementId = `${elementPrefix}-${variantId}`;
          const element = document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
          }
        }, 300);
        return;

      }

      if (firstErrorKey.startsWith('faq-')) {
        const match = firstErrorKey.match(/^faq-(.+)-(question|answer)$/);
        if (match) {
          const faqId = match[1];
          const field = match[2];

          setExpandedFaqId(faqId);

          setTimeout(() => {
            const elementId = `faq-${faqId}-${field}`;
            const element = document.getElementById(elementId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              element.focus();
            }
          }, 300);
          return;
        }
      }

      const element = document.getElementById(targetId);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Only focus if it's an input (has no children or is input) - simple heuristic
        if (targetId !== 'section-media' && targetId !== 'section-categorization') {
          element.focus();
        }
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Upload pending images first (deferred upload)
      const hasPendingImages = pendingPrimaryImage !== null || pendingAdditionalImages.length > 0;
      let uploadedPrimaryUrl: string | null = null;
      let uploadedAdditionalUrls: string[] = [];

      if (hasPendingImages) {
        // Generate folder path: products/{slug}
        const productSlug = formData.slug || formData.productTitle
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();

        const folderPath = `products/${productSlug}`;

        const totalImages = (pendingPrimaryImage ? 1 : 0) + pendingAdditionalImages.length;
        toast.info(`Uploading ${totalImages} image(s)...`);

        const result = await uploadPendingImages(folderPath);
        uploadedPrimaryUrl = result.primaryUrl;
        uploadedAdditionalUrls = result.additionalUrls;
      }

      // Step 2: Upload Variant Images (NEW)
      console.log('📦 [AddProductPage] formData.productVariants before upload:', formData.productVariants);
      console.log('📦 [AddProductPage] Variants with imageFile:', formData.productVariants?.filter(v => v.imageFile));

      const variantUploadResults = await uploadVariantImages(
        formData.productVariants || [],
        `products/${formData.slug || 'temp'}`
      );
      console.log('📦 [AddProductPage] variantUploadResults:', variantUploadResults);

      // Step 3: Build product images array
      const productImages: ProductImage[] = [];

      // Primary image (new upload or existing)
      const finalPrimaryUrl = uploadedPrimaryUrl || formData.productImages.find(img => img.isPrimary)?.url;
      if (finalPrimaryUrl) {
        productImages.push({
          id: 'img-primary',
          url: finalPrimaryUrl,
          isPrimary: true,
          uploadStatus: 'success',
        });
      }

      // Additional images (existing + newly uploaded)
      const existingAdditionalUrls = formData.productImages.filter(img => !img.isPrimary).map(img => img.url);
      const allAdditionalUrls = [...existingAdditionalUrls, ...uploadedAdditionalUrls];

      allAdditionalUrls.forEach((url, idx) => {
        productImages.push({
          id: `img-additional-${idx}`,
          url,
          isPrimary: false,
          uploadStatus: 'success',
        });
      });

      // Step 4: Create product with all image URLs
      const productData = {
        ...formData,
        productImages,
        // Update variants with uploaded image URLs
        productVariants: formData.productVariants?.map(v => {
          if (v.id && variantUploadResults[v.id]) {
            return {
              ...v,
              image: variantUploadResults[v.id].url,
              // Backend doesn't expect file objects
              imageFile: undefined,
              previewUrl: undefined
            };
          }
          return v;
        })
      };

      const response = await productService.createProduct(productData);

      setIsSaveSuccess(true);

      toast.success('Product created successfully!', {
        description: 'The product has been added to your catalog.',
      });

      // Navigate to product detail page directly
      // Check response structure - usually response.data contains the record
      const newProductId = response?.data?.id;

      if (newProductId) {
        navigateWithConfirmation(ROUTES.PRODUCTS.DETAIL(newProductId));
      } else {
        // Fallback to list if ID not found
        console.warn('Could not determine new product ID, redirecting to list');
        navigateWithConfirmation(ROUTES.PRODUCTS.LIST);
      }
    } catch (error: any) {
      const status = error?.response?.status;
      let errorMessage = error?.response?.data?.message || error?.message || 'Failed to create product';

      if (status === 409) {
        errorMessage = 'Product with this name already exists';
      }

      toast.error('Error creating product', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigateWithConfirmation(ROUTES.PRODUCTS.LIST);
  };

  const handleDiscardChanges = () => {
    setShowDiscardDialog(false);
    toast.info('Changes discarded');
    proceedNavigation();
  };

  const handleContinueEditing = () => {
    setShowDiscardDialog(false);
    cancelNavigation();
  };

  return (
    <div className="flex-1 w-full">
      <PageHeader
        title="Add New Product"
        subtitle="Create and manage product details"
        breadcrumbs={[
          { label: 'Products', onClick: onBack },
          { label: 'Add New', active: true }
        ]}
        backIcon="arrow"
        onBack={onBack}
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="rounded-xl h-[44px] px-6"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="rounded-xl bg-(--sidebar-bg) hover:bg-(--sidebar-hover) text-(--text-white)/90 h-[44px] px-6 gap-2 shadow-sm"
            >
              <Plus className="size-[18px]" />
              {isSubmitting ? 'Creating...' : 'Add Product'}
            </Button>
          </>
        }
      />

      <div className="px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Primary Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Basic Product Details */}
            <BasicDetailsSection
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
            />

            {/* 2. Media (Deferred Upload) */}
            <DeferredMediaSection
              pendingPrimaryImage={pendingPrimaryImage}
              pendingAdditionalImages={pendingAdditionalImages}
              onPendingPrimaryChange={setPendingPrimaryImage}
              onPendingAdditionalChange={setPendingAdditionalImages}
              existingPrimaryImage={formData.productImages.find(img => img.isPrimary)?.url}
              existingAdditionalImages={formData.productImages.filter(img => !img.isPrimary).map(img => img.url)}
              onExistingPrimaryChange={(url) => {
                if (!url) {
                  // Remove primary
                  handleProductImagesChange(formData.productImages.filter(img => !img.isPrimary));
                }
              }}
              onExistingAdditionalChange={(urls) => {
                const primary = formData.productImages.find(img => img.isPrimary);
                const additional = urls.map((url, idx) => ({ id: `add-${idx}`, url, isPrimary: false }));
                handleProductImagesChange(primary ? [primary, ...additional] : additional);
              }}
              error={imageError || undefined}
            />

            {/* 3. Pricing & Inventory (Combined) */}
            <PricingInventorySection
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
            />

            {/* 3.5. Product Variants (Conditional) */}
            <ProductVariantsSection
              formData={formData}
              updateField={handleInputChange}
              errors={errors}
              isEditMode={false}
              expandedVariantId={expandedVariantId}
              onToggleExpand={setExpandedVariantId}
            />

            {/* 4. FAQ Group */}
            <FaqSection
              formData={formData}
              handleAddFAQ={handleAddFAQ}
              handleRemoveFAQ={handleRemoveFAQ}
              handleFAQChange={handleFAQChange}
              expandedFaqId={expandedFaqId}
              setExpandedFaqId={setExpandedFaqId}
            />

            {/* 5. SEO & URL */}
            <SeoSection
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </div>

          {/* RIGHT COLUMN - Secondary Content */}
          <div className="space-y-6">
            {/* 1. Availability & Flags */}
            <AvailabilitySection
              formData={formData}
              handleInputChange={handleInputChange}
            />

            {/* 3. Associations */}
            <AssociationsSection
              formData={formData}
              handleInputChange={handleInputChange}
            />

            {/* 4. Sales Channels */}
            {/* <SalesChannelsSection
              formData={formData}
              handleInputChange={handleInputChange}
            /> */}

            {/* 5. Categorization */}
            <CategorizationSection
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
            />

            {/* 5. Notes & Tags */}
            <NotesTags
              tags={formData.tags}
              availableTags={availableTags}
              onTagsChange={(val) => handleInputChange('tags', val)}
              adminComment={formData.adminComment}
              onAdminCommentChange={(val) => handleInputChange('adminComment', val)}
              showCustomerNote={false}
              tagType="product"
              onTagCreated={handleTagCreated}
            />


          </div>
        </div>
      </div>

      {/* Unsaved Changes Confirmation Dialog */}
      <UnsavedChangesDialog
        open={showDiscardDialog}
        onOpenChange={setShowDiscardDialog}
        onDiscard={handleDiscardChanges}
        onContinueEditing={handleContinueEditing}
      />
    </div>
  );
}
