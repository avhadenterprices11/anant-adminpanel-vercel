import { ImageUploader } from '../ImageUploader';
import type { ProductImage } from '@/features/products/types/product.types';
import type { ProductMediaUploaderProps } from '@/features/products/types/component.types';

export const ProductMediaUploader = ({ images, onChange }: ProductMediaUploaderProps) => {
  const primaryImage = images.find(img => img.isPrimary)?.url || '';
  const additionalImages = images.filter(img => !img.isPrimary).map(img => img.url);

  const handlePrimaryChange = (url: string) => {
    if (!url) {
      // Remove primary
      onChange(images.filter(img => !img.isPrimary));
      return;
    }

    const newPrimary: ProductImage = {
      id: `img-${Date.now()}-prime`,
      url,
      isPrimary: true
    };

    // Replace existing primary or add new
    const others = images.filter(img => !img.isPrimary);
    onChange([newPrimary, ...others]);
  };

  const handleAdditionalChange = (urls: string[]) => {
    const primary = images.find(img => img.isPrimary);

    // Create a map of existing images by URL to preserve IDs
    const existingImagesMap = new Map(images.map(img => [img.url, img]));
    const usedIds = new Set<string>();

    const newAdditional: ProductImage[] = urls.map((url, idx) => {
      const existing = existingImagesMap.get(url);

      // If found and ID not yet reused in this batch, keep the existing ID
      if (existing && !usedIds.has(existing.id)) {
        usedIds.add(existing.id);
        return {
          ...existing,
          isPrimary: false
        };
      }

      // Otherwise (new URL or duplicate existing URL), generate new ID
      return {
        id: `img-${Date.now()}-${idx}`,
        url,
        isPrimary: false
      };
    });

    onChange(primary ? [primary, ...newAdditional] : newAdditional);
  };

  return (
    <ImageUploader
      primaryImage={primaryImage}
      additionalImages={additionalImages}
      onPrimaryImageChange={handlePrimaryChange}
      onAdditionalImagesChange={handleAdditionalChange}
    />
  );
};

export type { ProductImage };
export default ProductMediaUploader;
