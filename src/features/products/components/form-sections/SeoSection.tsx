import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Link as LinkIcon } from 'lucide-react';
import { FormSection } from '@/components/forms';
import type { SeoSectionProps } from '@/features/products/types/component.types';

export function SeoSection({ formData, handleInputChange }: SeoSectionProps) {
  return (
    <FormSection icon={FileText} title="SEO & URL">
      <div>
        <Label htmlFor="productUrl" className="text-sm font-medium text-slate-700 mb-2 block">
          Product URL
        </Label>
        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-icon-muted" />
          <Input
            id="productUrl"
            value={formData.productUrl}
            onChange={(e) => handleInputChange('productUrl', e.target.value)}
            className="pl-9 rounded-xl"
            placeholder="product-url-slug"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1.5">
          Used in product URL: /products/{formData.productUrl || 'product-url-slug'}
        </p>
      </div>

      <div>
        <Label htmlFor="metaTitle" className="text-sm font-medium text-slate-700 mb-2 block">
          Meta Title
        </Label>
        <Input
          id="metaTitle"
          value={formData.metaTitle}
          onChange={(e) => handleInputChange('metaTitle', e.target.value)}
          className="rounded-xl"
          placeholder="Product meta title for search engines"
        />
        <p className="text-xs text-slate-500 mt-1.5">
          {formData.metaTitle.length}/60 characters recommended
        </p>
      </div>

      <div>
        <Label htmlFor="metaDescription" className="text-sm font-medium text-slate-700 mb-2 block">
          Meta Description
        </Label>
        <Textarea
          id="metaDescription"
          value={formData.metaDescription}
          onChange={(e) => handleInputChange('metaDescription', e.target.value)}
          rows={3}
          className="rounded-xl resize-none"
          placeholder="Product meta description for search engines"
        />
        <p className="text-xs text-slate-500 mt-1.5">
          {formData.metaDescription.length}/160 characters recommended
        </p>
      </div>

      {/* SERP Preview */}
      <div className="space-y-2 mt-6">
        <Label className="text-slate-700">SERP Preview</Label>
        <div className="p-5 border border-slate-200 rounded-lg bg-slate-50">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-slate-300"></div>
              <span className="text-xs text-slate-600">store.com</span>
            </div>
            <p className="text-sm text-blue-600 hover:underline cursor-pointer">
              {formData.productUrl || 'product-url-slug'} › {formData.metaTitle || 'Your Product Title'}
            </p>
            <p className="text-xs text-slate-700">
              {formData.metaDescription || 'Your meta description will appear here to give readers a preview of what the product page is about.'}
            </p>
          </div>
        </div>
      </div>
    </FormSection>
  );
}
