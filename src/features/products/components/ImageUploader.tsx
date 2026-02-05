import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { notifySuccess, notifyError } from '@/utils';
import type { ImageUploaderProps } from '@/features/products/types/component.types';
import { uploadService } from '@/services/uploadService';
import { useState, useRef } from 'react';
import { Progress } from '@/components/ui/progress';

export function ImageUploader({
  primaryImage,
  additionalImages,
  onPrimaryImageChange,
  onAdditionalImagesChange,
}: ImageUploaderProps) {
  const [uploadingPrimary, setUploadingPrimary] = useState(false);
  const [uploadingAdditional, setUploadingAdditional] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const primaryInputRef = useRef<HTMLInputElement>(null);
  const additionalInputRef = useRef<HTMLInputElement>(null);

  const handleUploadPrimaryImage = async (file: File) => {
    setUploadingPrimary(true);
    setUploadProgress(0);

    try {
      const response = await uploadService.uploadFile(file, (percentage) => {
        setUploadProgress(percentage);
      });

      onPrimaryImageChange(response.file_url);
      notifySuccess('Image uploaded successfully');
    } catch (error: any) {
      notifyError(error.message || 'Failed to upload image');
    } finally {
      setUploadingPrimary(false);
      setUploadProgress(0);
    }
  };

  const handleUploadAdditionalImages = async (files: FileList) => {
    setUploadingAdditional(true);
    setUploadProgress(0);

    try {
      const uploadPromises = Array.from(files).map((file, index) =>
        uploadService.uploadFile(file, (percentage) => {
          // Average progress across all files
          setUploadProgress(Math.round((percentage / files.length) + (index * 100 / files.length)));
        })
      );

      const responses = await Promise.all(uploadPromises);
      const newUrls = responses.map(r => r.file_url);

      onAdditionalImagesChange([...additionalImages, ...newUrls]);
      notifySuccess(`${files.length} image(s) uploaded successfully`);
    } catch (error: any) {
      notifyError(error.message || 'Failed to upload images');
    } finally {
      setUploadingAdditional(false);
      setUploadProgress(0);
    }
  };

  const handlePrimaryFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadPrimaryImage(file);
    }
    // Reset input
    if (primaryInputRef.current) {
      primaryInputRef.current.value = '';
    }
  };

  const handleAdditionalFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUploadAdditionalImages(files);
    }
    // Reset input
    if (additionalInputRef.current) {
      additionalInputRef.current.value = '';
    }
  };

  const handleRemovePrimaryImage = () => {
    onPrimaryImageChange('');
    notifySuccess('Primary image removed');
  };

  const handleRemoveAdditionalImage = (index: number) => {
    onAdditionalImagesChange(additionalImages.filter((_, idx) => idx !== index));
    notifySuccess('Image removed');
  };

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

      {/* Primary Image */}
      <div>
        <Label className="text-sm font-medium text-slate-700 mb-2 block">
          Primary Product Image *
        </Label>
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 hover:border-indigo-300 transition-colors">
          {primaryImage ? (
            <div className="space-y-3">
              <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden">
                <img
                  src={primaryImage}
                  alt="Primary product"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemovePrimaryImage}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-lg w-full"
                onClick={() => primaryInputRef.current?.click()}
                disabled={uploadingPrimary}
              >
                <Upload className="size-3.5 mr-2" />
                {uploadingPrimary ? 'Uploading...' : 'Change Image'}
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <div className="cursor-pointer" onClick={() => !uploadingPrimary && primaryInputRef.current?.click()}>
                <ImageIcon className="size-12 mx-auto text-slate-300 mb-3" />
                <p className="text-sm text-slate-600 mb-3">
                  {uploadingPrimary ? 'Uploading...' : 'No image uploaded'}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  disabled={uploadingPrimary}
                >
                  <Upload className="size-3.5 mr-2" />
                  Upload Image
                </Button>
              </div>
            </div>
          )}
          {uploadingPrimary && uploadProgress > 0 && (
            <div className="mt-3">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-slate-500 mt-1 text-center">{uploadProgress}%</p>
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-1.5">
          Recommended: 1200x1200px, JPG or PNG
        </p>
      </div>

      {/* Additional Images */}
      <div>
        <Label className="text-sm font-medium text-slate-700 mb-2 block">
          Additional Images
        </Label>
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 hover:border-indigo-300 transition-colors">
          {additionalImages.length > 0 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {additionalImages.map((imageUrl, idx) => (
                  <div
                    key={`${imageUrl}-${idx}`}
                    className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden"
                  >
                    <img
                      src={imageUrl}
                      alt={`Additional ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAdditionalImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-lg w-full"
                onClick={() => additionalInputRef.current?.click()}
                disabled={uploadingAdditional}
              >
                <Upload className="size-3.5 mr-2" />
                {uploadingAdditional ? 'Uploading...' : 'Add More Images'}
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <div className="cursor-pointer" onClick={() => !uploadingAdditional && additionalInputRef.current?.click()}>
                <ImageIcon className="size-12 mx-auto text-slate-300 mb-3" />
                <p className="text-sm text-slate-600 mb-3">
                  {uploadingAdditional ? 'Uploading...' : 'No additional images'}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  disabled={uploadingAdditional}
                >
                  <Upload className="size-3.5 mr-2" />
                  Upload Images
                </Button>
              </div>
            </div>
          )}
          {uploadingAdditional && uploadProgress > 0 && (
            <div className="mt-3">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-slate-500 mt-1 text-center">{uploadProgress}%</p>
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-1.5">Upload multiple product images</p>
      </div>
    </div>
  );
}
