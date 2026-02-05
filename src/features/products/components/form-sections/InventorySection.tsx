import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package } from 'lucide-react';
import { FormSection } from '@/components/forms';
import type { InventorySectionProps } from '@/features/products/types/component.types';

export function InventorySection({ formData, handleInputChange }: InventorySectionProps) {
  return (
    <FormSection icon={Package} title="Inventory & Shipping">
      <div>
        <Label htmlFor="inventoryQuantity" className="text-sm font-medium text-slate-700 mb-2 block">
          Inventory Quantity
        </Label>
        <Input
          id="inventoryQuantity"
          type="number"
          value={formData.inventoryQuantity}
          onChange={(e) => handleInputChange('inventoryQuantity', e.target.value)}
          className="rounded-xl"
          placeholder="0"
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Dimensions</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="weight" className="text-sm font-medium text-slate-700 mb-2 block">
              Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              className="rounded-xl"
              placeholder="0.0"
            />
          </div>

          <div>
            <Label htmlFor="length" className="text-sm font-medium text-slate-700 mb-2 block">
              Length (cm)
            </Label>
            <Input
              id="length"
              type="number"
              value={formData.length}
              onChange={(e) => handleInputChange('length', e.target.value)}
              className="rounded-xl"
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="breadth" className="text-sm font-medium text-slate-700 mb-2 block">
              Breadth (cm)
            </Label>
            <Input
              id="breadth"
              type="number"
              value={formData.breadth}
              onChange={(e) => handleInputChange('breadth', e.target.value)}
              className="rounded-xl"
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="height" className="text-sm font-medium text-slate-700 mb-2 block">
              Height (cm)
            </Label>
            <Input
              id="height"
              type="number"
              value={formData.height}
              onChange={(e) => handleInputChange('height', e.target.value)}
              className="rounded-xl"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
}
