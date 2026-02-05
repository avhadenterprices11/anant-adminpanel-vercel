import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Package } from 'lucide-react';
import { FormSection } from '@/components/forms';
import type { BasicDetailsSectionProps } from '@/features/products/types/component.types';

export function BasicDetailsSection({ formData, handleInputChange, errors }: BasicDetailsSectionProps) {
  return (
    <FormSection icon={Package} title="Basic Product Details">
      <div>
        <Label htmlFor="productTitle" className="text-sm font-medium text-slate-700 mb-2 block">
          Product Title <span className="text-amber-600">*</span>
        </Label>
        <Input
          id="productTitle"
          value={formData.productTitle}
          onChange={(e) => handleInputChange('productTitle', e.target.value)}
          className="rounded-xl"
          placeholder="Enter product name..."
        />
        {errors.productTitle && (
          <p className="text-red-400 text-xs mt-1.5">{errors.productTitle}</p>
        )}
      </div>

      <div>
        <Label htmlFor="secondaryTitle" className="text-sm font-medium text-slate-700 mb-2 block">
          Secondary Title
        </Label>
        <Input
          id="secondaryTitle"
          value={formData.secondaryTitle}
          onChange={(e) => handleInputChange('secondaryTitle', e.target.value)}
          className="rounded-xl"
          placeholder="Alternative or subtitle..."
        />
      </div>

      <div>
        <Label htmlFor="shortDescription" className="text-sm font-medium text-slate-700 mb-2 block">
          Short Description
        </Label>
        <Textarea
          id="shortDescription"
          value={formData.shortDescription}
          onChange={(e) => handleInputChange('shortDescription', e.target.value)}
          rows={3}
          className="rounded-xl resize-none"
          placeholder="Brief product description (shown in listings)..."
        />
      </div>

      <div>
        <Label htmlFor="fullDescription" className="text-sm font-medium text-slate-700 mb-2 block">
          Full Description
        </Label>
        <RichTextEditor
          value={formData.fullDescription}
          onChange={(value) => handleInputChange('fullDescription', value)}
          placeholder="Complete product description with features, benefits, and specifications..."
        />
      </div>
    </FormSection>
  );
}
