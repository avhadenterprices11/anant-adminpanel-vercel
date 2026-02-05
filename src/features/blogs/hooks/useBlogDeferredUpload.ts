import { useState, useCallback, useEffect } from 'react';
import { uploadService } from '@/services/uploadService';
import { toast } from 'sonner';

export interface PendingBlogImage {
  file: File;
  previewUrl: string;
}

export interface UseBlogDeferredUploadReturn {
  // PC Image State
  pendingMainImagePC: PendingBlogImage | null;
  setPendingMainImagePC: React.Dispatch<React.SetStateAction<PendingBlogImage | null>>;

  // Mobile Image State
  pendingMainImageMobile: PendingBlogImage | null;
  setPendingMainImageMobile: React.Dispatch<React.SetStateAction<PendingBlogImage | null>>;

  isUploading: boolean;

  // Actions
  uploadPendingImages: (folder: string) => Promise<{
    mainImagePCUrl: string | null;
    mainImageMobileUrl: string | null;
  }>;
  clearPendingImages: () => void;
  hasUnsavedImages: boolean;
}

export function useBlogDeferredUpload(): UseBlogDeferredUploadReturn {
  const [pendingMainImagePC, setPendingMainImagePC] = useState<PendingBlogImage | null>(null);
  const [pendingMainImageMobile, setPendingMainImageMobile] = useState<PendingBlogImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const hasUnsavedImages = !!pendingMainImagePC || !!pendingMainImageMobile;

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (pendingMainImagePC) {
        URL.revokeObjectURL(pendingMainImagePC.previewUrl);
      }
      if (pendingMainImageMobile) {
        URL.revokeObjectURL(pendingMainImageMobile.previewUrl);
      }
    };
  }, []);

  // Upload pending images
  const uploadPendingImages = useCallback(async (folder: string) => {
    setIsUploading(true);
    let mainImagePCUrl: string | null = null;
    let mainImageMobileUrl: string | null = null;

    try {
      // Optimize: Check if PC and Mobile images are the same file instance
      const isSameFile = pendingMainImagePC && pendingMainImageMobile &&
        pendingMainImagePC.file === pendingMainImageMobile.file;

      if (isSameFile && pendingMainImagePC) {
        // Upload once, use for both
        const response = await uploadService.uploadFile(pendingMainImagePC.file, {
          folder,
        });
        mainImagePCUrl = response.file_url;
        mainImageMobileUrl = response.file_url;
      } else {
        // Upload separately
        // 1. Upload PC Image if exists
        if (pendingMainImagePC) {
          const response = await uploadService.uploadFile(pendingMainImagePC.file, {
            folder,
          });
          mainImagePCUrl = response.file_url;
        }

        // 2. Upload Mobile Image if exists
        if (pendingMainImageMobile) {
          const response = await uploadService.uploadFile(pendingMainImageMobile.file, {
            folder,
          });
          mainImageMobileUrl = response.file_url;
        }
      }

      // Clear pending states on success (optional, but good practice if not navigating away immediately)
      // Here we rely on parent to navigate away or use the returned URLs

      return { mainImagePCUrl, mainImageMobileUrl };
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error('Image upload failed', {
        description: error.message || 'Please try again'
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [pendingMainImagePC, pendingMainImageMobile]);

  const clearPendingImages = useCallback(() => {
    if (pendingMainImagePC) URL.revokeObjectURL(pendingMainImagePC.previewUrl);
    if (pendingMainImageMobile) URL.revokeObjectURL(pendingMainImageMobile.previewUrl);

    setPendingMainImagePC(null);
    setPendingMainImageMobile(null);
  }, [pendingMainImagePC, pendingMainImageMobile]);

  return {
    pendingMainImagePC,
    setPendingMainImagePC,
    pendingMainImageMobile,
    setPendingMainImageMobile,
    isUploading,
    uploadPendingImages,
    clearPendingImages,
    hasUnsavedImages
  };
}
