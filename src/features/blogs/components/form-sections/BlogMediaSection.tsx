import React, { useMemo } from 'react';
import { FileUpload } from '../FileUpload';

interface BlogMediaSectionProps {
  onMainImagePCChange: (file: File | null) => void;
  onMainImageMobileChange: (file: File | null) => void;
  mainImagePC: File | string | null;
  mainImageMobile: File | string | null;
}

export const BlogMediaSection: React.FC<BlogMediaSectionProps> = ({
  onMainImagePCChange,
  onMainImageMobileChange,
  mainImagePC,
  mainImageMobile
}) => {
  const pcPreview = useMemo(() => {
    if (typeof mainImagePC === 'string') return mainImagePC;
    return mainImagePC ? URL.createObjectURL(mainImagePC) : null;
  }, [mainImagePC]);

  const mobilePreview = useMemo(() => {
    if (typeof mainImageMobile === 'string') return mainImageMobile;
    return mainImageMobile ? URL.createObjectURL(mainImageMobile) : null;
  }, [mainImageMobile]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-8 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Main Blog Images</h2>
        <p className="text-sm text-slate-600 mt-1">Upload images for different devices</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FileUpload
          label="Main Blog PC Image"
          hint="Recommended: 1200x630px, PNG/JPG up to 5MB"
          onChange={onMainImagePCChange}
          preview={pcPreview}
        />

        <FileUpload
          label="Main Blog Mobile Image"
          hint="Recommended: 800x800px, PNG/JPG up to 5MB"
          onChange={onMainImageMobileChange}
          preview={mobilePreview}
        />
      </div>
    </div>
  );
};
