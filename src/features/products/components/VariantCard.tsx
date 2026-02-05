import { ChevronUp, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VariantImageUpload } from './VariantImageUpload';
import type { ProductVariant } from '@/features/products/types/product.types';

interface VariantCardProps {
    variant: ProductVariant;
    variantNumber: number;
    isExpanded: boolean;
    onUpdate: (field: keyof ProductVariant, value: any) => void;
    onUpdateMultiple: (updates: Partial<ProductVariant>) => void;
    onRemove: () => void;
    onToggleExpand: () => void;
    onMoveUp?: () => void;
    errors?: Record<string, string>;
    isEditMode?: boolean;
}

export function VariantCard({
    variant,
    isExpanded,
    onUpdate,
    onUpdateMultiple,
    onRemove,
    onToggleExpand,
    errors = {},
}: VariantCardProps) {
    // Validate compare_at_price >= selling_price
    const sellingPriceNum = parseFloat(variant.sellingPrice) || 0;
    const compareAtPriceNum = parseFloat(variant.compareAtPrice || '0') || 0;
    const hasPriceError = compareAtPriceNum > 0 && compareAtPriceNum < sellingPriceNum;

    // Collapsed View
    if (!isExpanded) {
        return (
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Image Placeholder */}
                    <div className="w-full sm:w-16 h-32 sm:h-16 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                        {(variant.previewUrl || variant.image) ? (
                            <img
                                src={variant.previewUrl || variant.image}
                                alt="Variant"
                                className="w-full h-full object-cover rounded-xl"
                            />
                        ) : (
                            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        )}
                    </div>

                    {/* Variant Value Only */}
                    <div className="flex-1 w-full">
                        <Label className="text-sm font-medium text-slate-700 mb-2 block">
                            Variant Value ({variant.optionName}) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            placeholder={`e.g., ${variant.optionName === 'Color' ? 'Red' : 'Medium'}`}
                            value={variant.optionValue || ''}
                            onChange={(e) => onUpdate('optionValue', e.target.value)}
                            className="rounded-xl bg-slate-50 border-0"
                        />
                        {errors[`variant-${variant.id}-optionValue`] && (
                            <p className="text-red-500 text-[10px] mt-1">{errors[`variant-${variant.id}-optionValue`]}</p>
                        )}
                    </div>

                    {/* Actions - Edit and Delete only */}
                    <div className="flex items-center justify-end sm:justify-start gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onToggleExpand}
                            className="h-8 w-8"
                        >
                            <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onRemove}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Expanded View - Grid Layout with Collapse Arrow, No Delete Button
    return (
        <div className="border border-slate-200 rounded-xl p-6 bg-white transition-all">
            {/* Grid Container: Responsive grid/flex layout */}
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_1fr_auto] gap-x-4 gap-y-6 items-start sm:items-center">
                {/* Image - centered on mobile, spans 2 rows on desktop */}
                <div className="sm:row-span-2 flex justify-center sm:block mb-2 sm:mb-0 sm:mr-4">
                    <VariantImageUpload
                        imageUrl={variant.previewUrl || variant.image} // Use preview first if available
                        onImageChange={(file) => {

                            if (file) {
                                // Create preview URL
                                const blobUrl = URL.createObjectURL(file);

                                // BATCH UPDATE: Update all image-related fields at once to prevent race condition
                                onUpdateMultiple({
                                    imageFile: file,
                                    previewUrl: blobUrl,
                                    image: '' // Clear old remote image URL since we have a new local one
                                });

                            } else {
                                // Handle removal - also batch update
                                if (variant.previewUrl) {
                                    URL.revokeObjectURL(variant.previewUrl);
                                }
                                onUpdateMultiple({
                                    imageFile: undefined,
                                    previewUrl: undefined,
                                    image: ''
                                });
                            }
                        }}
                    />
                </div>

                {/* Variant Value Only */}
                <div className="w-full">
                    <Label htmlFor={`option-value-${variant.id}`} className="text-sm font-medium text-slate-700 mb-2 block">
                        Variant Value ({variant.optionName}) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id={`option-value-${variant.id}`}
                        placeholder={`e.g., ${variant.optionName === 'Color' ? 'Red' : 'Medium'}`}
                        value={variant.optionValue || ''}
                        onChange={(e) => onUpdate('optionValue', e.target.value)}
                        className="rounded-xl bg-slate-50 border-0"
                    />
                    {errors[`variant-${variant.id}-optionValue`] && (
                        <p className="text-red-500 text-xs mt-1.5">{errors[`variant-${variant.id}-optionValue`]}</p>
                    )}
                </div>

                {/* Row 1: Collapse Arrow - Hidden on mobile row 1, shown differently or pushed */}
                <div className="flex items-center justify-end sm:items-end sm:h-full pb-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onToggleExpand}
                        className="h-10 w-10 sm:h-8 sm:w-8"
                    >
                        <ChevronUp className="h-5 w-5 sm:h-4 sm:w-4" />
                    </Button>
                </div>

                {/* Row 2: SKU */}
                <div>
                    <Label htmlFor={`sku-${variant.id}`} className="text-sm font-medium text-slate-700 mb-2 block">
                        SKU <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id={`sku-${variant.id}`}
                        placeholder="VARIANT-SKU"
                        value={variant.sku}
                        onChange={(e) => onUpdate('sku', e.target.value)}
                        className="rounded-xl bg-slate-50 border-0"
                    />
                    {errors[`variant-${variant.id}-sku`] && (
                        <p className="text-red-500 text-xs mt-1.5">{errors[`variant-${variant.id}-sku`]}</p>
                    )}
                </div>

                {/* Row 2: Barcode */}
                <div>
                    <Label htmlFor={`barcode-${variant.id}`} className="text-sm font-medium text-slate-700 mb-2 block">
                        Barcode
                    </Label>
                    <Input
                        id={`barcode-${variant.id}`}
                        placeholder="1234567890123"
                        value={variant.barcode || ''}
                        onChange={(e) => onUpdate('barcode', e.target.value)}
                        className="rounded-xl bg-slate-50 border-0"
                    />
                </div>

                {/* Row 2: Inventory */}
                <div>
                    <Label htmlFor={`inventory-${variant.id}`} className="text-sm font-medium text-slate-700 mb-2 block">
                        Inventory <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id={`inventory-${variant.id}`}
                        type="number"
                        value={variant.inventoryQuantity}
                        onChange={(e) => onUpdate('inventoryQuantity', e.target.value)}
                        className="rounded-xl bg-slate-50 border-0"
                        placeholder="0"
                        min={0}
                        onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                    />
                    {errors[`variant-${variant.id}-inventoryQuantity`] && (
                        <p className="text-red-500 text-xs mt-1.5">{errors[`variant-${variant.id}-inventoryQuantity`]}</p>
                    )}
                </div>
            </div>

            {/* Row 3: Pricing Section - Full Width Below */}
            <div className="mt-8 border-t border-slate-100 pt-6">
                <h5 className="text-xs font-semibold text-slate-700 mb-4 uppercase tracking-wide">Pricing Details</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                        <Label htmlFor={`cost-price-${variant.id}`} className="text-sm font-medium text-slate-700 mb-2 block">
                            Cost Price <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                            <Input
                                id={`cost-price-${variant.id}`}
                                type="number"
                                step="0.01"
                                value={variant.costPrice || ''}
                                onChange={(e) => onUpdate('costPrice', e.target.value)}
                                className="pl-7 rounded-xl bg-slate-50 border-0"
                                placeholder="0.00"
                                min={0}
                                onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                            />
                            {errors[`variant-${variant.id}-costPrice`] && (
                                <p className="text-red-500 text-xs mt-1.5">{errors[`variant-${variant.id}-costPrice`]}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <Label htmlFor={`selling-price-${variant.id}`} className="text-sm font-medium text-slate-700 mb-2 block">
                            Selling Price <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                            <Input
                                id={`selling-price-${variant.id}`}
                                type="number"
                                step="0.01"
                                value={variant.sellingPrice}
                                onChange={(e) => onUpdate('sellingPrice', e.target.value)}
                                className="pl-7 rounded-xl bg-slate-50 border-0"
                                placeholder="0.00"
                                min={0}
                                onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                            />
                            {errors[`variant-${variant.id}-sellingPrice`] && (
                                <p className="text-red-500 text-xs mt-1.5">{errors[`variant-${variant.id}-sellingPrice`]}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <Label htmlFor={`compare-price-${variant.id}`} className="text-sm font-medium text-slate-700 mb-2 block">
                            Compare At Price
                            {hasPriceError && (
                                <span className="ml-2 text-xs text-red-600 font-normal">Must be ≥ selling price</span>
                            )}
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                            {hasPriceError && (
                                <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
                            )}
                            <Input
                                id={`compare-price-${variant.id}`}
                                type="number"
                                step="0.01"
                                value={variant.compareAtPrice || ''}
                                onChange={(e) => onUpdate('compareAtPrice', e.target.value)}
                                className="pl-7 pr-10 rounded-xl bg-slate-50 border-0"
                                placeholder="0.00"
                                min={0}
                                onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
