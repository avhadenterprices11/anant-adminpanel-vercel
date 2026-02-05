import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Link as LinkIcon } from 'lucide-react';
import { FormSection } from '@/components/forms';
import type { AssociationsSectionProps } from '@/features/products/types/component.types';

export function AssociationsSection({
  formData,
  handleInputChange
}: AssociationsSectionProps) {
  return (
    <FormSection icon={LinkIcon} title="Associations">
      <div className="space-y-4">
        {/* Featured Product */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
          <div>
            <Label htmlFor="featured" className="text-sm font-medium text-slate-900">
              Featured Product
            </Label>
            <p className="text-xs text-slate-500 mt-1">
              Mark as featured product
            </p>
          </div>
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => handleInputChange('featured', checked)}
          />
        </div>

        {/* Limited Edition */}
        {/* 
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
          <div>
            <Label htmlFor="limitedEdition" className="text-sm font-medium text-slate-900">
              Limited Edition
            </Label>
            <p className="text-xs text-slate-500 mt-1">
              Mark this product as limited edition
            </p>
          </div>
          <Switch
            id="limitedEdition"
            checked={formData.limitedEdition}
            onCheckedChange={(checked) => handleInputChange('limitedEdition', checked)}
          />
        </div>
        */}

        {/* Preorder Enabled */}
        {/* 
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
          <div>
            <Label htmlFor="preorderEnabled" className="text-sm font-medium text-slate-900">
              Preorder Enabled
            </Label>
            <p className="text-xs text-slate-500 mt-1">
              Allow customers to preorder this product
            </p>
          </div>
          <Switch
            id="preorderEnabled"
            checked={formData.preorderEnabled}
            onCheckedChange={(checked) => handleInputChange('preorderEnabled', checked)}
          />
        </div>
        */}

        {/* Delist Product */}
        {/*
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
          <div>
            <Label htmlFor="delistProduct" className="text-sm font-medium text-slate-900">
              Delist Product
            </Label>
            <p className="text-xs text-slate-500 mt-1">
              Temporarily hide this product from listings
            </p>
          </div>
          <Switch
            id="delistProduct"
            checked={formData.delistProduct}
            onCheckedChange={(checked) => handleInputChange('delistProduct', checked)}
          />
        </div>
        */}

        {/* Gift Wrap Available */}
        {/* 
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
          <div>
            <Label htmlFor="giftWrapAvailable" className="text-sm font-medium text-slate-900">
              Gift Wrap Available
            </Label>
            <p className="text-xs text-slate-500 mt-1">
              Allow gift wrapping for this product
            </p>
          </div>
          <Switch
            id="giftWrapAvailable"
            checked={formData.giftWrapAvailable}
            onCheckedChange={(checked) => handleInputChange('giftWrapAvailable', checked)}
          />
        </div>
        */}
      </div>
    </FormSection>
  );
}
