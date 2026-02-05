import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { FileUpload } from '../FileUpload';
import { Label } from '@/components/ui/label';

interface MediaSectionProps {
  featuredImage: string;
  galleryImages: string[];
  onFeaturedImageChange: (url: string) => void;
}

export const MediaSection: React.FC<MediaSectionProps> = ({
  featuredImage,
  galleryImages,
  onFeaturedImageChange
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-8 space-y-6">
      <div className="flex items-center gap-2 mb-5">
        <ImageIcon className="size-5" style={{ color: '#A1A1A1' }} />
        <h2 className="font-semibold text-slate-900">Media</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Featured Image</Label>
          <div className="mt-2">
            <FileUpload
              label="Featured Image"
              onChange={(file) => {
                if (file) {
                  const url = URL.createObjectURL(file);
                  onFeaturedImageChange(url);
                }
              }}
              preview={featuredImage}
              accept="image/*"
            />
          </div>
        </div>

        {/* Gallery - Simplified */}
        <div>
          <Label>Gallery Images ({galleryImages.length})</Label>
          <p className="text-xs text-slate-500 mb-2">Gallery management coming soon (requires multi-file upload support)</p>
        </div>
      </div>
    </div>
  );
};
