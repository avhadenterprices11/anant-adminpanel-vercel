import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Save,
  ArrowLeft,
  ExternalLink,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { Button as UIButton } from '@/components/ui/button';
import { toast } from 'sonner';
import { ROUTES } from '@/lib/constants';
import { DetailPageSkeleton } from '@/components/ui/loading-skeletons';

import { useProductForm, useDeferredUpload } from '@/features/products/hooks';
import { tagService } from '@/features/tags/services/tagService';
import { useProduct, useUpdateProduct, useDeleteProduct } from '@/features/products/hooks/useProducts';
import type { ProductImage } from '@/features/products/types/product.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UnsavedChangesDialog } from '@/components/dialogs/UnsavedChangesDialog';
import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';

// Import Modular Sections
import { BasicDetailsSection } from '../components/form-sections/BasicDetailsSection';
import { PricingInventorySection } from '../components/form-sections/PricingInventorySection';
import { ProductVariantsSection } from '../components/form-sections/ProductVariantsSection';
import { CategorizationSection } from '../components/form-sections/CategorizationSection';
import { AvailabilitySection } from '../components/form-sections/AvailabilitySection';
import { SeoSection } from '../components/form-sections/SeoSection';
import { AssociationsSection } from '../components/form-sections/AssociationsSection';
// import { SalesChannelsSection } from '../components/form-sections/SalesChannelsSection';
import { FaqSection } from '../components/form-sections/FaqSection';
import { ProductMetricsSection } from '../components/form-sections/ProductMetricsSection';
import { DeferredMediaSection } from '../components/form-sections/DeferredMediaSection';
import { NotesTags } from '@/components/features/notes/NotesTags';


export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Load product data from API
  const { data: productData, isLoading, error } = useProduct(id || '');
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  // Initialize hook with loaded data
  // Since useProduct now returns mapped ProductFormData, we can use it directly.
  const {
    formData,
    handleInputChange,
    validate,
    updateSnapshot,
    handleProductImagesChange,
    handleAddFAQ,
    handleRemoveFAQ,
    handleFAQChange,
    expandedVariantId,
    setExpandedVariantId,
    expandedFaqId,
    setExpandedFaqId,
    errors,
    hasChanges
  } = useProductForm(productData); // productData is directly compatible now

  // Local state for image validation error
  const [imageError, setImageError] = useState<string | null>(null);

  // Deferred upload hook for pending images (separate primary and additional)
  const {
    pendingPrimaryImage,
    setPendingPrimaryImage,
    pendingAdditionalImages,
    setPendingAdditionalImages,
    uploadPendingImages,
    uploadVariantImages,
  } = useDeferredUpload();

  // Calculate if there are any pending uploads
  const hasPendingUploads = pendingPrimaryImage !== null || pendingAdditionalImages.length > 0;
  const isDirty = (hasChanges || hasPendingUploads) && !isSaved;

  // Use the unsaved changes warning hook
  const { navigateWithConfirmation, proceedNavigation, cancelNavigation } =
    useUnsavedChangesWarning(isDirty, () => setShowDiscardDialog(true));

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
    const productId = formData?.id || id;
    if (!productId || !formData) return;

    // Validate form data
    const validationErrors = validate();

    // Strict validation for Primary Image (required)
    // In edit mode: valid if we have a pending upload OR an existing image
    const hasExistingImage = formData.productImages && formData.productImages.length > 0;
    const hasPendingImage = pendingPrimaryImage !== null;

    if (!hasExistingImage && !hasPendingImage) {
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
        tier1Category: 'section-categorization',
        productTitle: 'productTitle',
        sellingPrice: 'sellingPrice',
        costPrice: 'costPrice',
        inventoryQuantity: 'inventoryQuantity',
        sku: 'sku'
      };

      const targetId = fieldIdMap[firstErrorKey] || firstErrorKey;

      if (firstErrorKey && firstErrorKey.startsWith('variant-')) {
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

      if (firstErrorKey && firstErrorKey.startsWith('faq-')) {
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
        if (targetId !== 'section-media' && targetId !== 'section-categorization') {
          element.focus();
        }
      }
      return;
    }

    // Step 1: Upload pending images if any (deferred upload)
    const hasPendingImages = pendingPrimaryImage !== null || pendingAdditionalImages.length > 0;
    let uploadedPrimaryUrl: string | null = null;
    let uploadedPrimaryThumbnailUrl: string | null = null;
    let uploadedAdditionalUrls: string[] = [];
    let uploadedAdditionalThumbnailUrls: string[] = [];

    if (hasPendingImages) {
      // Use existing product slug for folder
      const folderPath = `products/${formData.slug || productId}`;

      const totalImages = (pendingPrimaryImage ? 1 : 0) + pendingAdditionalImages.length;
      toast.info(`Uploading ${totalImages} image(s)...`);

      const result = await uploadPendingImages(folderPath);
      uploadedPrimaryUrl = result.primaryUrl;
      uploadedPrimaryThumbnailUrl = result.primaryThumbnailUrl;
      uploadedAdditionalUrls = result.additionalUrls;
      uploadedAdditionalThumbnailUrls = result.additionalThumbnailUrls;
    }

    // Step 2: Upload Variant Images (NEW)
    const variantUploadResults = await uploadVariantImages(
      formData.productVariants || [],
      `products/${formData.slug || productId}`
    );

    // Step 3: Build updated product images array
    const productImages: ProductImage[] = [];

    // Primary image (new upload or existing)
    const existingPrimary = formData.productImages.find(img => img.isPrimary);
    const finalPrimaryUrl = uploadedPrimaryUrl || existingPrimary?.url;
    const finalPrimaryThumbnailUrl = uploadedPrimaryThumbnailUrl || existingPrimary?.thumbnailUrl;

    if (finalPrimaryUrl) {
      productImages.push({
        id: 'img-primary',
        url: finalPrimaryUrl,
        isPrimary: true,
        uploadStatus: 'success',
        thumbnailUrl: finalPrimaryThumbnailUrl,
      });
    }

    // Additional images (existing + newly uploaded)
    // Additional images (existing + newly uploaded)
    const existingAdditionalList = formData.productImages.filter(img => !img.isPrimary);

    // Process existing additional images to preserve their thumbnails
    existingAdditionalList.forEach((img, idx) => {
      productImages.push({
        id: `img-additional-existing-${idx}`,
        url: img.url,
        isPrimary: false,
        uploadStatus: 'success',
        thumbnailUrl: img.thumbnailUrl,
      });
    });

    // Add newly uploaded additional images
    uploadedAdditionalUrls.forEach((url, idx) => {
      productImages.push({
        id: `img-additional-new-${idx}`,
        url,
        isPrimary: false,
        uploadStatus: 'success',
        thumbnailUrl: uploadedAdditionalThumbnailUrls[idx],
      });
    });

    // Step 4: Update product with all image URLs
    const productData = {
      ...formData,
      productImages,
      // Update variants with uploaded image URLs
      productVariants: formData.productVariants?.map(v => {
        // If we uploaded a new image for this variant
        if (v.id && variantUploadResults[v.id]) {
          return {
            ...v,
            image: variantUploadResults[v.id].url,
            // Backend doesn't expect file objects
            imageFile: undefined,
            previewUrl: undefined,
            // Also update thumbnail if your backend supports it on variants
            thumbnail_url: variantUploadResults[v.id].thumbnail
          };
        }
        return v;
      })
    };

    updateProductMutation.mutate({ id: productId, data: productData }, {
      onSuccess: () => {
        setIsSaved(true);
        // Update snapshot to reflect saved state (prevents discard modal after save)
        updateSnapshot();
        toast.success('Product updated successfully!');
        // Small timeout to allow state to propagate before navigation
        setTimeout(() => {
          navigate(ROUTES.PRODUCTS.LIST);
        }, 0);
      },
      onError: (error: any) => {
        setIsSaved(false);
        const status = error?.response?.status;
        let errorMessage = 'Failed to update product';

        if (status === 409) {
          errorMessage = 'Product with this name already exists';
        } else if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        toast.error('Error updating product', { description: errorMessage });
      }
    });
  };

  const handleCancel = () => {
    navigateWithConfirmation(ROUTES.PRODUCTS.LIST);
  };

  const handleBack = () => {
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

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    const productId = formData?.id || id;
    if (!productId) return;

    deleteProductMutation.mutate(productId, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        navigateWithConfirmation(ROUTES.PRODUCTS.LIST);
      },
      onError: () => {
        // Dialog stays open on error, handle error state if needed
        toast.error('Failed to delete product');
      }
    });
  };

  // Preview button - opens product page on the website
  const handlePreview = () => {
    const storefrontUrl = import.meta.env.VITE_STOREFRONT_URL || 'https://example.com';
    window.open(`${storefrontUrl}/products/${formData.slug}`, '_blank');
  };

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (error || !productData) {
    return <div className="p-8 text-center text-red-500">Error loading product or product not found.</div>;
  }

  return (
    <div className="flex-1 w-full">
      {/* Sticky Header Section - Pinned below the main header (80px) */}
      <div id="product-sticky-header" className="sticky top-0 z-20 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 border-b border-slate-200 shadow-sm -mx-1 px-7 lg:px-9 py-4 mb-6 transition-all">
        <div className="space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={handleBack}
              className="text-slate-500 hover:text-slate-900 transition-colors"
            >
              Products
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-medium">{formData.productTitle || 'Product Details'}</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <UIButton
                variant="outline"
                size="icon"
                onClick={handleBack}
                className="rounded-full h-10 w-10"
              >
                <ArrowLeft className="size-4" />
              </UIButton>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-slate-900">{formData.productTitle || 'Product Details'}</h1>
                </div>
                {formData.sku && (
                  <p className="text-sm text-slate-600">
                    SKU: {formData.sku}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {(hasChanges || hasPendingUploads) ? (
                <>
                  <UIButton
                    variant="outline"
                    size="lg"
                    onClick={handleCancel}
                    className="rounded-xl"
                  >
                    Cancel
                  </UIButton>
                  <UIButton
                    size="lg"
                    onClick={handleSave}
                    disabled={updateProductMutation.isPending}
                    className="rounded-xl bg-[#0e042f] hover:bg-[#0e042f]/90"
                  >
                    <Save className="size-4 mr-2" />
                    {updateProductMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </UIButton>
                </>
              ) : (
                <UIButton
                  size="lg"
                  onClick={handlePreview}
                  className="rounded-xl bg-[#0e042f] hover:bg-[#0e042f]/90"
                >
                  <ExternalLink className="size-4 mr-2" />
                  Preview
                </UIButton>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <UIButton variant="outline" size="icon" className="rounded-xl h-10 w-10">
                    <MoreVertical className="size-4" />
                  </UIButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleDeleteClick}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 text-sm"
                  >
                    <Trash2 className="size-4 mr-2" />
                    Delete Product
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        isLoading={deleteProductMutation.isPending}
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
              existingPrimaryThumbnail={formData.productImages.find(img => img.isPrimary)?.thumbnailUrl}
              existingAdditionalImages={formData.productImages.filter(img => !img.isPrimary).map(img => img.url)}
              existingAdditionalThumbnails={formData.productImages.filter(img => !img.isPrimary).map(img => img.thumbnailUrl || '')}
              onExistingPrimaryChange={(url) => {
                if (!url) {
                  // Remove primary
                  handleProductImagesChange(formData.productImages.filter(img => !img.isPrimary));
                }
              }}
              onExistingAdditionalChange={(urls) => {
                const primary = formData.productImages.find(img => img.isPrimary);
                // Filter existing images to find matches for the kept URLs
                // This preserves thumbnails and other metadata
                const keptAdditional = formData.productImages.filter(img =>
                  !img.isPrimary && urls.includes(img.url)
                );

                // If the number of kept images doesn't match urls length, it might be due to duplicate URLs or new additions not yet in formData?
                // DeferredImageUploader returns the list of *urls* that should remain.
                // Since we use URLs as identifiers in this simplified view, filtering by URL is the best we can do.

                handleProductImagesChange(primary ? [primary, ...keptAdditional] : keptAdditional);
              }}
              error={imageError || undefined}
            />

            {/* 3. Pricing & Inventory */}
            <PricingInventorySection
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
              productId={formData.id}
            />

            {/* 3.5. Product Variants (Conditional) */}
            <ProductVariantsSection
              formData={formData}
              updateField={handleInputChange}
              errors={errors}
              isEditMode={true}
              expandedVariantId={expandedVariantId}
              onToggleExpand={setExpandedVariantId}
            />

            {/* 4. FAQ */}
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
            {/* 1. Product Analytics */}
            <ProductMetricsSection productMetadata={{
              createdAt: productData.createdAt || new Date().toISOString(),
              createdBy: 'Admin', // Placeholder as backend doesn't send this yet
              lastModified: productData.updatedAt || new Date().toISOString(),
              totalViews: 0,
              totalSales: 0
            }} />

            {/* 2. Availability & Flags */}
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

            {/* 4. Categorization */}
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
    </div >
  );
}