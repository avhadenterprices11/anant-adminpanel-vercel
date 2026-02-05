import { Input } from '@/components/ui/input';
import { generateVariantSKU } from '@/features/products/utils/skuGenerator';
import { Label } from '@/components/ui/label';
import { DollarSign, History } from 'lucide-react';
import { FormSection } from '@/components/forms';
import { VariantToggle } from '@/features/products/components/VariantToggle';
import type { PricingInventorySectionProps } from '@/features/products/types/component.types';
import type { ProductVariant } from '@/features/products/types/product.types';
import { useState } from 'react';
import { InventoryHistoryDialog } from '@/features/products/components/InventoryHistoryDialog';

export function PricingInventorySection({
  formData,
  handleInputChange,
  errors,
  productId
}: PricingInventorySectionProps) {
  const hasVariants = formData.productVariants && formData.productVariants.length > 0;
  const isEditMode = !!productId;

  const handleVariantToggle = (enabled: boolean) => {

    if (enabled) {
      // Initialize with one empty variant
      const newVariant: ProductVariant = {
        id: `variant-${Date.now()}`,
        optionName: '',
        optionValue: '',
        sku: generateVariantSKU(formData.sku, 0),
        costPrice: '',
        sellingPrice: '',
        compareAtPrice: '',
        inventoryQuantity: '0',
        enabled: true
      };
      handleInputChange('productVariants', [newVariant]);
    } else {
      // Clear all variants
      handleInputChange('productVariants', []);
    }
  };


  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <>
      <InventoryHistoryDialog
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        productId={productId}
      />
      <FormSection icon={DollarSign} title="Pricing & Inventory">

        <div className="space-y-6">
          {/* Pricing Section */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Pricing</h3>
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
                    value={formData.costPrice}
                    onChange={(e) => handleInputChange('costPrice', e.target.value)}
                    className="pl-7 rounded-xl"
                    placeholder="0.00"
                    min={0}
                    onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
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
                    value={formData.sellingPrice}
                    onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                    className="pl-7 rounded-xl"
                    placeholder="0.00"
                    min={0}
                    onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
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
                    value={formData.compareAtPrice}
                    onChange={(e) => handleInputChange('compareAtPrice', e.target.value)}
                    className="pl-7 rounded-xl"
                    placeholder="0.00"
                    min={0}
                    onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                  />
                </div>
                {errors.compareAtPrice ? (
                  <p className="text-red-400 text-xs mt-1.5">{errors.compareAtPrice}</p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Original price to show comparison (strikethrough)
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Inventory Section - always visible (base product + variants both have inventory) */}
          <div>
            <Label htmlFor="inventoryQuantity" className="text-sm font-medium text-slate-700 mb-2 block">
              Base Inventory Quantity <span className="text-amber-600">*</span>
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="inventoryQuantity"
                type="number"
                value={formData.inventoryQuantity}
                onChange={(e) => handleInputChange('inventoryQuantity', e.target.value)}
                className={`rounded-xl flex-1 ${isEditMode ? 'bg-slate-50 cursor-not-allowed text-slate-500' : ''}`}
                placeholder="0"
                min={0}
                readOnly={isEditMode}
                onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
              />
              {isEditMode && (
                <div
                  className="p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors group"
                  title="View Adjustment History"
                  onClick={() => setIsHistoryOpen(true)}
                >
                  <History className="w-4 h-4 text-slate-500 group-hover:text-slate-700" />
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              {hasVariants
                ? "Base product inventory. Each variant also has its own inventory below."
                : "Available stock quantity for this product"
              }
            </p>
            {errors.inventoryQuantity && (
              <p className="text-red-400 text-xs mt-1.5">{errors.inventoryQuantity}</p>
            )}
          </div>

          {/* Dimensions Section */}
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
                  min={0}
                  onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
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
                  min={0}
                  onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
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
                  min={0}
                  onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
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
                  min={0}
                  onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                />
              </div>
            </div>
          </div>

          {/* Product Identification Section */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Product Identification</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="sku" className="text-sm font-medium text-slate-700 mb-2 block">
                  SKU
                </Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  readOnly={isEditMode}
                  className={`rounded-xl ${isEditMode ? 'bg-slate-50 cursor-not-allowed border-0' : ''} ${errors.sku ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
                  placeholder="PROD-001"
                />
                {errors.sku && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.sku}</p>
                )}
              </div>

              <div>
                <Label htmlFor="hsnNumber" className="text-sm font-medium text-slate-700 mb-2 block">
                  HSN Number
                </Label>
                <Input
                  id="hsnNumber"
                  value={formData.hsnNumber}
                  onChange={(e) => handleInputChange('hsnNumber', e.target.value)}
                  className="rounded-xl"
                  placeholder="12345678"
                />
              </div>

              <div>
                <Label htmlFor="barcode" className="text-sm font-medium text-slate-700 mb-2 block">
                  Barcode
                </Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => handleInputChange('barcode', e.target.value)}
                  className="rounded-xl"
                  placeholder="1234567890123"
                />
              </div>
            </div>

            {/* Variant Toggle */}
            <div className="mt-4">
              <VariantToggle
                hasVariants={!!hasVariants}
                onToggle={handleVariantToggle}
              />
            </div>
          </div>
        </div>
      </FormSection>
    </>
  );
}
