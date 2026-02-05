import { Image as ImageIcon } from 'lucide-react';
import { ProductMediaUploader } from '../ProductMediaUploader';
import { FormSection } from '@/components/forms';
import type { MediaSectionProps } from '@/features/products/types/component.types';

export function MediaSection({
  images,
  onImagesChange,
}: MediaSectionProps) {
  return (
    <FormSection icon={ImageIcon} title="Media">
      <ProductMediaUploader
        images={images}
        onChange={onImagesChange}
        maxImages={10}
        maxFileSize={5}
      />
    </FormSection>
  );
}
