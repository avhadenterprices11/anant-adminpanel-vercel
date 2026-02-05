import React from 'react';
import { FileUpload } from '../FileUpload';
import type { PendingBlogImage } from '../../hooks/useBlogDeferredUpload';

interface DeferredBlogMediaSectionProps {
  // Pending State (New Uploads)
  pendingMainImagePC: PendingBlogImage | null;
  pendingMainImageMobile: PendingBlogImage | null;
  onPendingMainImagePCChange: (image: PendingBlogImage | null) => void;
  onPendingMainImageMobileChange: (image: PendingBlogImage | null) => void;

  // Existing State (URLs from DB - for Edit Mode)
  existingMainImagePC?: string | null;
  existingMainImageMobile?: string | null;
}

export const DeferredBlogMediaSection: React.FC<DeferredBlogMediaSectionProps> = ({
  pendingMainImagePC,
  pendingMainImageMobile,
  onPendingMainImagePCChange,
  onPendingMainImageMobileChange,
  existingMainImagePC,
  existingMainImageMobile
}) => {

  // Helper to handle file selection
  const handleFileSelect = (file: File | null, type: 'pc' | 'mobile') => {
    if (!file) {
      if (type === 'pc') onPendingMainImagePCChange(null);
      else onPendingMainImageMobileChange(null);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const pendingImage: PendingBlogImage = { file, previewUrl };

    if (type === 'pc') onPendingMainImagePCChange(pendingImage);
    else onPendingMainImageMobileChange(pendingImage);
  };

  // Determine what to show
  const pcPreview = pendingMainImagePC?.previewUrl || existingMainImagePC;
  const mobilePreview = pendingMainImageMobile?.previewUrl || existingMainImageMobile;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-8 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Main Blog Images</h2>
        <p className="text-sm text-slate-600 mt-1">Upload images for different devices. Images are uploaded when you save.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FileUpload
          label="Main Blog PC Image"
          hint="Recommended: 1200x630px, PNG/JPG up to 5MB"
          onChange={(file) => handleFileSelect(file, 'pc')}
          preview={pcPreview}
        />

        <FileUpload
          label="Main Blog Mobile Image"
          hint="Recommended: 800x800px, PNG/JPG up to 5MB"
          onChange={(file) => handleFileSelect(file, 'mobile')}
          preview={mobilePreview}
        />
      </div>
    </div>
  );
};
