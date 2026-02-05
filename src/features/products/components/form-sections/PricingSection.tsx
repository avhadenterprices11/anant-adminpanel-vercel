import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign } from 'lucide-react';
import { FormSection } from '@/components/forms';
import type { PricingSectionProps } from '@/features/products/types/component.types';

export function PricingSection({ formData, handleInputChange, errors }: PricingSectionProps) {
  return (
    <FormSection icon={DollarSign} title="Pricing">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="costPrice" className="text-sm font-medium text-slate-700 mb-2 block">
            Cost Price <span className="text-amber-600">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
            <Input
              id="costPrice"
              type="number"
              step="0.01"
              value={formData.costPrice}
              onChange={(e) => handleInputChange('costPrice', e.target.value)}
              className={`pl-7 rounded-xl ${errors.costPrice ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
              placeholder="0.00"
            />
          </div>
          {errors.costPrice && (
            <p className="text-red-400 text-xs mt-1.5">{errors.costPrice}</p>
          )}
        </div>

        <div>
          <Label htmlFor="sellingPrice" className="text-sm font-medium text-slate-700 mb-2 block">
            Selling Price <span className="text-amber-600">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
            <Input
              id="sellingPrice"
              type="number"
              step="0.01"
              value={formData.sellingPrice}
              onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
              className={`pl-7 rounded-xl ${errors.sellingPrice ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
              placeholder="0.00"
            />
          </div>
          {errors.sellingPrice && (
            <p className="text-red-400 text-xs mt-1.5">{errors.sellingPrice}</p>
          )}
        </div>

        <div>
          <Label htmlFor="compareAtPrice" className="text-sm font-medium text-slate-700 mb-2 block">
            Compare At Price
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
            <Input
              id="compareAtPrice"
              type="number"
              step="0.01"
              value={formData.compareAtPrice}
              onChange={(e) => handleInputChange('compareAtPrice', e.target.value)}
              className={`pl-7 rounded-xl ${errors.compareAtPrice ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
              placeholder="0.00"
            />
          </div>
          {errors.compareAtPrice && (
            <p className="text-red-400 text-xs mt-1.5">{errors.compareAtPrice}</p>
          )}
          <p className="text-xs text-slate-500 mt-1.5">
            Original price to show comparison (strikethrough)
          </p>
        </div>
      </div>
    </FormSection>
  );
}
