import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRef, useState } from 'react';

interface CollectionMediaUploadProps {
  bannerImage: string;
  bannerImageMobile: string;
  onBannerImageChange?: (file: File | null, imageUrl: string | null) => void;
  onBannerImageMobileChange?: (file: File | null, imageUrl: string | null) => void;
}

export function CollectionMediaUpload({
  bannerImage,
  bannerImageMobile,
  onBannerImageChange,
  onBannerImageMobileChange,
}: CollectionMediaUploadProps) {
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const mobileFileInputRef = useRef<HTMLInputElement>(null);
  
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingMobile, setIsUploadingMobile] = useState(false);

  const handleFileSelect = (file: File, type: 'banner' | 'mobile') => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      
      if (type === 'banner') {
        setIsUploadingBanner(true);
        // Simulate upload delay
        setTimeout(() => {
          onBannerImageChange?.(file, imageUrl);
          setIsUploadingBanner(false);
          toast.success('Banner image uploaded successfully');
        }, 1000);
      } else {
        setIsUploadingMobile(true);
        // Simulate upload delay
        setTimeout(() => {
          onBannerImageMobileChange?.(file, imageUrl);
          setIsUploadingMobile(false);
          toast.success('Mobile banner image uploaded successfully');
        }, 1000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadBannerImage = () => {
    bannerFileInputRef.current?.click();
  };

  const handleUploadBannerImageMobile = () => {
    mobileFileInputRef.current?.click();
  };

  const handleRemoveBannerImage = () => {
    onBannerImageChange?.(null, null);
    toast.success('Banner image removed');
  };

  const handleRemoveBannerImageMobile = () => {
    onBannerImageMobileChange?.(null, null);
    toast.success('Mobile banner image removed');
  };

  return (
    <div className="bg-white rounded-[20px] border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <ImageIcon className="size-5 text-gray-400" />
        <h2 className="font-semibold text-slate-900">Media</h2>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={bannerFileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file, 'banner');
        }}
        className="hidden"
      />
      <input
        ref={mobileFileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file, 'mobile');
        }}
        className="hidden"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            Banner Image (Desktop)
          </Label>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 hover:border-indigo-300 transition-colors cursor-pointer">
            {bannerImage ? (
              <div className="space-y-3">
                <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden">
                  <img
                    src={bannerImage}
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={handleRemoveBannerImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    type="button"
                  >
                    <X className="size-3" />
                  </button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg w-full"
                  onClick={handleUploadBannerImage}
                  disabled={isUploadingBanner}
                  type="button"
                >
                  <Upload className="size-3.5 mr-2" />
                  {isUploadingBanner ? 'Uploading...' : 'Change Image'}
                </Button>
              </div>
            ) : (
              <div className="text-center" onClick={handleUploadBannerImage}>
                <ImageIcon className="size-10 mx-auto text-slate-300 mb-2" />
                <p className="text-xs text-slate-600 mb-2">No image uploaded</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  disabled={isUploadingBanner}
                  type="button"
                >
                  <Upload className="size-3.5 mr-2" />
                  {isUploadingBanner ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1.5">
            Recommended: 1920x600px, Max 5MB
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            Banner Image (Mobile)
          </Label>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 hover:border-indigo-300 transition-colors cursor-pointer">
            {bannerImageMobile ? (
              <div className="space-y-3">
                <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden">
                  <img
                    src={bannerImageMobile}
                    alt="Mobile Banner"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={handleRemoveBannerImageMobile}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    type="button"
                  >
                    <X className="size-3" />
                  </button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg w-full"
                  onClick={handleUploadBannerImageMobile}
                  disabled={isUploadingMobile}
                  type="button"
                >
                  <Upload className="size-3.5 mr-2" />
                  {isUploadingMobile ? 'Uploading...' : 'Change Image'}
                </Button>
              </div>
            ) : (
              <div className="text-center" onClick={handleUploadBannerImageMobile}>
                <ImageIcon className="size-10 mx-auto text-slate-300 mb-2" />
                <p className="text-xs text-slate-600 mb-2">No image uploaded</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  disabled={isUploadingMobile}
                  type="button"
                >
                  <Upload className="size-3.5 mr-2" />
                  {isUploadingMobile ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1.5">
            Recommended: 768x400px, Max 5MB
          </p>
        </div>
      </div>
    </div>
  );
}
