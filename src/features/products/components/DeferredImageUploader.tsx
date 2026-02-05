import { useRef, useEffect, useState, useCallback } from 'react';
import { Image as ImageIcon, Upload, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { notifySuccess, notifyError, notifyWarning } from '@/utils';
import { uploadService } from '@/services/uploadService';
import type { PendingImage } from '@/features/products/types/product.types';
import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE_MB = 10;
const MAX_ADDITIONAL_IMAGES = 5;

export interface DeferredImageUploaderProps {
    /** Pending primary image (not yet uploaded) */
    pendingPrimaryImage: PendingImage | null;
    /** Pending additional images (not yet uploaded) */
    pendingAdditionalImages: PendingImage[];
    /** Callback when pending primary image changes */
    onPendingPrimaryChange: (image: PendingImage | null) => void;
    /** Callback when pending additional images change */
    onPendingAdditionalChange: (images: PendingImage[]) => void;
    /** Existing primary image URL (already uploaded, for edit mode) */
    existingPrimaryImage?: string;
    /** Existing primary thumbnail URL */
    existingPrimaryThumbnail?: string;
    /** Existing additional image URLs (already uploaded, for edit mode) */
    existingAdditionalImages?: string[];
    /** Existing additional thumbnail URLs */
    existingAdditionalThumbnails?: string[];
    /** Callback when existing primary changes (removal) */
    onExistingPrimaryChange?: (url: string) => void;
    /** Callback when existing additional images change (removal) */
    onExistingAdditionalChange?: (urls: string[]) => void;
}

interface PreviewState {
    isOpen: boolean;
    currentIndex: number;
    images: { url: string; isPending: boolean }[];
}

/**
 * DeferredImageUploader - Matches original ImageUploader UI layout
 * 
 * Has separate sections for Primary and Additional images.
 * Files are stored locally until form submission.
 * Features: 5 image limit, image preview with navigation
 */
export function DeferredImageUploader({
    pendingPrimaryImage,
    pendingAdditionalImages,
    onPendingPrimaryChange,
    onPendingAdditionalChange,
    existingPrimaryImage = '',
    existingPrimaryThumbnail = '',
    existingAdditionalImages = [],
    existingAdditionalThumbnails = [],
    onExistingAdditionalChange,
}: DeferredImageUploaderProps) {
    const primaryInputRef = useRef<HTMLInputElement>(null);
    const additionalInputRef = useRef<HTMLInputElement>(null);

    // Image preview state
    const [preview, setPreview] = useState<PreviewState>({
        isOpen: false,
        currentIndex: 0,
        images: [],
    });

    // Calculate total additional images (existing + pending)
    const totalAdditionalImages = existingAdditionalImages.length + pendingAdditionalImages.length;
    const canAddMoreImages = totalAdditionalImages < MAX_ADDITIONAL_IMAGES;
    const remainingSlots = MAX_ADDITIONAL_IMAGES - totalAdditionalImages;

    // Cleanup blob URLs on unmount
    useEffect(() => {
        return () => {
            if (pendingPrimaryImage) {
                uploadService.revokeBlobPreview(pendingPrimaryImage.previewUrl);
            }
            pendingAdditionalImages.forEach(img => {
                uploadService.revokeBlobPreview(img.previewUrl);
            });
        };
    }, []); // Only on unmount

    // === PREVIEW HANDLERS ===

    const closePreview = () => {
        setPreview(prev => ({ ...prev, isOpen: false }));
    };

    const navigatePreview = useCallback((direction: -1 | 1) => {
        setPreview(prev => {
            if (prev.images.length <= 1) return prev;

            let newIndex = prev.currentIndex + direction;
            // Infinite loop logic
            if (newIndex < 0) {
                newIndex = prev.images.length - 1;
            } else if (newIndex >= prev.images.length) {
                newIndex = 0;
            }

            return { ...prev, currentIndex: newIndex };
        });
    }, []);

    const openPrimaryPreview = () => {
        const primaryUrl = pendingPrimaryImage?.previewUrl || existingPrimaryImage;
        if (!primaryUrl) return;

        setPreview({
            isOpen: true,
            currentIndex: 0,
            images: [{ url: primaryUrl, isPending: !!pendingPrimaryImage }],
        });
    };

    const openAdditionalPreview = (index: number) => {
        // Build combined list of all additional images
        const allImages: { url: string; isPending: boolean }[] = [
            ...existingAdditionalImages.map(url => ({ url, isPending: false })),
            ...pendingAdditionalImages.map(img => ({ url: img.previewUrl, isPending: true })),
        ];

        setPreview({
            isOpen: true,
            currentIndex: index,
            images: allImages,
        });
    };

    // Close preview on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!preview.isOpen) return;

            if (e.key === 'Escape') {
                closePreview();
            } else if (e.key === 'ArrowLeft') {
                navigatePreview(-1);
            } else if (e.key === 'ArrowRight') {
                navigatePreview(1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [preview.isOpen, preview.currentIndex, preview.images.length, closePreview, navigatePreview]);

    // === DELETE CONFIRMATION STATE ===
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<
        { type: 'primary-pending' } |
        { type: 'additional-pending', id: string } |
        { type: 'additional-existing', index: number } |
        null
    >(null);

    // === PRIMARY IMAGE HANDLERS ===

    const handlePrimaryFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate
        if (!uploadService.isValidImage(file)) {
            notifyError('Please select a valid image file');
            return;
        }
        if (!uploadService.isWithinSizeLimit(file, MAX_FILE_SIZE_MB)) {
            notifyError(`File must be under ${MAX_FILE_SIZE_MB}MB`);
            return;
        }

        // Revoke old blob URL if exists
        if (pendingPrimaryImage) {
            uploadService.revokeBlobPreview(pendingPrimaryImage.previewUrl);
        }

        // Create new pending image
        const previewUrl = uploadService.createBlobPreview(file);
        onPendingPrimaryChange({
            id: uuidv4(),
            file,
            previewUrl,
            isPrimary: true,
            status: 'pending',
        });

        notifySuccess('Primary image selected');

        // Reset input
        if (primaryInputRef.current) {
            primaryInputRef.current.value = '';
        }
    };

    const handleRemovePrimaryPending = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteTarget({ type: 'primary-pending' });
        setShowDeleteDialog(true);
    };



    // === ADDITIONAL IMAGES HANDLERS ===

    const handleAdditionalFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Check limit
        if (!canAddMoreImages) {
            notifyError(`Maximum ${MAX_ADDITIONAL_IMAGES} additional images allowed`);
            return;
        }

        const newImages: PendingImage[] = [];
        let addedCount = 0;

        for (const file of Array.from(files)) {
            // Check if we've hit the limit
            if (totalAdditionalImages + addedCount >= MAX_ADDITIONAL_IMAGES) {
                notifyWarning(`Maximum ${MAX_ADDITIONAL_IMAGES} images reached. Some files were skipped.`);
                break;
            }

            // Validate
            if (!uploadService.isValidImage(file)) {
                notifyError(`${file.name} is not a valid image`);
                continue;
            }
            if (!uploadService.isWithinSizeLimit(file, MAX_FILE_SIZE_MB)) {
                notifyError(`${file.name} exceeds ${MAX_FILE_SIZE_MB}MB limit`);
                continue;
            }

            // Check for duplicates
            const isDuplicate = pendingAdditionalImages.some(
                img => img.file.name === file.name &&
                    img.file.size === file.size
            );
            if (isDuplicate) {
                notifyWarning(`${file.name} is already added`);
                continue;
            }

            const previewUrl = uploadService.createBlobPreview(file);
            newImages.push({
                id: uuidv4(),
                file,
                previewUrl,
                isPrimary: false,
                status: 'pending',
            });
            addedCount++;
        }

        if (newImages.length > 0) {
            onPendingAdditionalChange([...pendingAdditionalImages, ...newImages]);
            notifySuccess(`${newImages.length} image(s) added`);
        }

        // Reset input
        if (additionalInputRef.current) {
            additionalInputRef.current.value = '';
        }
    };

    const handleRemoveAdditionalPending = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteTarget({ type: 'additional-pending', id });
        setShowDeleteDialog(true);
    };

    const handleRemoveAdditionalExisting = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteTarget({ type: 'additional-existing', index });
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;

        if (deleteTarget.type === 'primary-pending') {
            if (pendingPrimaryImage) {
                uploadService.revokeBlobPreview(pendingPrimaryImage.previewUrl);
                onPendingPrimaryChange(null);
                notifySuccess('Primary image removed');
            }
        } else if (deleteTarget.type === 'additional-pending') {
            const image = pendingAdditionalImages.find(img => img.id === deleteTarget.id);
            if (image) {
                uploadService.revokeBlobPreview(image.previewUrl);
                onPendingAdditionalChange(pendingAdditionalImages.filter(img => img.id !== deleteTarget.id));
                notifySuccess('Image removed');
            }
        } else if (deleteTarget.type === 'additional-existing') {
            onExistingAdditionalChange?.(existingAdditionalImages.filter((_, idx) => idx !== deleteTarget.index));
            notifySuccess('Image removed');
        }

        setShowDeleteDialog(false);
        setDeleteTarget(null);
    };

    // Determine what to show for primary
    const showPendingPrimary = pendingPrimaryImage !== null;
    const primaryPreviewUrl = showPendingPrimary
        ? pendingPrimaryImage!.previewUrl
        : (existingPrimaryThumbnail || existingPrimaryImage); // Use thumbnail if available for grid

    return (
        <div className="space-y-4">
            {/* Hidden file inputs */}
            <input
                ref={primaryInputRef}
                type="file"
                accept="image/*"
                onChange={handlePrimaryFileSelect}
                className="hidden"
            />
            <input
                ref={additionalInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalFilesSelect}
                className="hidden"
            />

            {/* Primary Image Section */}
            <div>
                <Label className="text-sm font-medium text-slate-700 mb-2 block">
                    Primary Product Image <span className="text-red-600">*</span>
                </Label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 hover:border-indigo-300 transition-colors">
                    {primaryPreviewUrl ? (
                        <div className="space-y-3">
                            <div
                                className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden cursor-pointer group"
                                onClick={openPrimaryPreview}
                            >
                                <img
                                    src={primaryPreviewUrl}
                                    alt="Primary product"
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                                {/* Hover overlay with zoom icon */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <ZoomIn className="size-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                {showPendingPrimary && (
                                    <button
                                        type="button"
                                        onClick={handleRemovePrimaryPending}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                )}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="rounded-lg w-full"
                                onClick={() => primaryInputRef.current?.click()}
                            >
                                <Upload className="size-3.5 mr-2" />
                                Change Image
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="cursor-pointer" onClick={() => primaryInputRef.current?.click()}>
                                <ImageIcon className="size-12 mx-auto text-slate-300 mb-3" />
                                <p className="text-sm text-slate-600 mb-3">
                                    No image uploaded
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="rounded-lg"
                                >
                                    <Upload className="size-3.5 mr-2" />
                                    Upload Image
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                    Recommended: 1200x1200px, JPG, PNG or WebP
                </p>
            </div>

            {/* Additional Images Section */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-slate-700">
                        Additional Images
                    </Label>
                    <span className="text-xs text-slate-500">
                        {totalAdditionalImages} / {MAX_ADDITIONAL_IMAGES}
                    </span>
                </div>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 hover:border-indigo-300 transition-colors">
                    {(existingAdditionalImages.length > 0 || pendingAdditionalImages.length > 0) ? (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {/* Existing additional images */}
                                {existingAdditionalImages.map((imageUrl, idx) => (
                                    <div
                                        key={`existing-${idx}`}
                                        className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden cursor-pointer group"
                                        onClick={() => openAdditionalPreview(idx)}
                                    >
                                        <img
                                            src={existingAdditionalThumbnails?.[idx] || imageUrl} // Use thumbnail if available
                                            alt={`Additional ${idx + 1}`}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                        {/* Hover overlay with zoom icon */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                            <ZoomIn className="size-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => handleRemoveAdditionalExisting(idx, e)}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    </div>
                                ))}

                                {/* Pending additional images */}
                                {pendingAdditionalImages.map((img, idx) => (
                                    <div
                                        key={img.id}
                                        className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden cursor-pointer group"
                                        onClick={() => openAdditionalPreview(existingAdditionalImages.length + idx)}
                                    >
                                        <img
                                            src={img.previewUrl}
                                            alt="Pending upload"
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                        {/* Hover overlay with zoom icon */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                            <ZoomIn className="size-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={(e) => handleRemoveAdditionalPending(img.id, e)}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {canAddMoreImages && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="rounded-lg w-full"
                                    onClick={() => additionalInputRef.current?.click()}
                                >
                                    <Upload className="size-3.5 mr-2" />
                                    Add More Images ({remainingSlots} remaining)
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="cursor-pointer" onClick={() => additionalInputRef.current?.click()}>
                                <ImageIcon className="size-12 mx-auto text-slate-300 mb-3" />
                                <p className="text-sm text-slate-600 mb-3">
                                    No additional images
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="rounded-lg"
                                >
                                    <Upload className="size-3.5 mr-2" />
                                    Upload Images (max {MAX_ADDITIONAL_IMAGES})
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                    Upload up to {MAX_ADDITIONAL_IMAGES} additional product images
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                    Recommended: 1200x1200px, JPG, PNG or WebP
                </p>
            </div >



            {/* Image Preview Modal / Lightbox */}
            {
                preview.isOpen && (
                    <div
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
                        onClick={closePreview}
                    >
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={closePreview}
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
                        >
                            <X className="size-6" />
                        </button>


                        {/* Image counter - Moved to bottom */}
                        {/* Repositioned below content */}


                        {/* Previous button */}
                        {preview.images.length > 1 && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigatePreview(-1);
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
                            >
                                <ChevronLeft className="size-8" />
                            </button>
                        )}

                        {/* Image */}
                        <div
                            className="max-w-[90vw] max-h-[90vh] relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={preview.images[preview.currentIndex]?.url}
                                alt={`Preview ${preview.currentIndex + 1}`}
                                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                            />

                        </div>


                        {/* Next button */}
                        {preview.images.length > 1 && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigatePreview(1);
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
                            >
                                <ChevronRight className="size-8" />
                            </button>
                        )}

                        {/* Image counter - Moved to bottom */}
                        {preview.images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full z-10">
                                {preview.currentIndex + 1} / {preview.images.length}
                            </div>
                        )}
                    </div>
                )
            }

            <ConfirmationDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={confirmDelete}
                title="Delete Image"
                description="Are you sure you want to delete this image? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </div >
    );
}

export default DeferredImageUploader;
