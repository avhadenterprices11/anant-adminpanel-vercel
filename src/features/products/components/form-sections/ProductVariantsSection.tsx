import { useState } from 'react';
import { LayoutGrid, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VariantList } from '../VariantList';
import type { ProductFormData, ProductVariant } from '@/features/products/types/product.types';
import { generateVariantSKU } from '@/features/products/utils/skuGenerator';
import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const COMMON_ATTRIBUTES = [
    { label: 'Color', value: 'Color' },
    { label: 'Size', value: 'Size' },
];

interface ProductVariantsSectionProps {
    formData: ProductFormData;
    updateField: (field: keyof ProductFormData, value: any) => void;
    errors?: Record<string, string>;
    isEditMode?: boolean;
    expandedVariantId?: string | null;
    onToggleExpand?: (id: string | null) => void;
}

export function ProductVariantsSection({
    formData,
    updateField,
    errors = {},
    isEditMode = false,
    expandedVariantId = null,
    onToggleExpand = () => { }
}: ProductVariantsSectionProps) {
    const hasVariants = formData.productVariants && formData.productVariants.length > 0;

    const [deleteVariantIndex, setDeleteVariantIndex] = useState<number | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Local state for attribute name, initialized from first variant or form data
    const [selectedAttribute, setSelectedAttribute] = useState<string>(
        formData.productVariants?.[0]?.optionName || 'Color'
    );

    const handleGlobalNameChange = (newName: string) => {
        setSelectedAttribute(newName);
        const updatedVariants = (formData.productVariants || []).map(v => ({
            ...v,
            optionName: newName
        }));
        updateField('productVariants', updatedVariants);
    };

    const handleAddVariant = () => {
        const nextIndex = formData.productVariants?.length || 0;
        // Generate SKU based on product SKU + index
        const variantSku = generateVariantSKU(formData.sku, nextIndex);

        const newVariant: ProductVariant = {
            id: `variant-${Date.now()}`,
            optionName: selectedAttribute, // Use the locally selected attribute
            optionValue: '',
            sku: variantSku,
            barcode: '',
            costPrice: '',
            sellingPrice: '',
            compareAtPrice: '',
            inventoryQuantity: '0',
            enabled: true
        };

        updateField('productVariants', [...(formData.productVariants || []), newVariant]);
    };

    const handleUpdateVariant = (index: number, field: keyof ProductVariant, value: any) => {

        const updatedVariants = [...(formData.productVariants || [])];
        updatedVariants[index] = { ...updatedVariants[index], [field]: value };

        updateField('productVariants', updatedVariants);
    };

    // Batch update function to update multiple fields at once (prevents race condition)
    const handleUpdateVariantMultiple = (index: number, updates: Partial<ProductVariant>) => {

        const updatedVariants = [...(formData.productVariants || [])];
        updatedVariants[index] = { ...updatedVariants[index], ...updates };

        updateField('productVariants', updatedVariants);
    };

    const handleRemoveVariant = (index: number) => {
        setDeleteVariantIndex(index);
        setShowDeleteDialog(true);
    };

    const confirmDeleteVariant = () => {
        if (deleteVariantIndex === null) return;

        const updatedVariants = formData.productVariants?.filter((_, i) => i !== deleteVariantIndex) || [];
        updateField('productVariants', updatedVariants);

        setShowDeleteDialog(false);
        setDeleteVariantIndex(null);
    };

    if (!hasVariants) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            {/* Header with Title and Add Button */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <LayoutGrid className="size-5 text-icon-muted" />
                    <h2 className="font-semibold text-slate-900">Product Variants</h2>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-500 whitespace-nowrap">Attribute:</span>
                        <Select value={selectedAttribute} onValueChange={handleGlobalNameChange}>
                            <SelectTrigger className="w-[140px] h-9 rounded-xl border-slate-200">
                                <SelectValue placeholder="Select attribute" />
                            </SelectTrigger>
                            <SelectContent>
                                {COMMON_ATTRIBUTES.map((attr) => (
                                    <SelectItem key={attr.value} value={attr.value}>
                                        {attr.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="button" variant="outline" onClick={handleAddVariant} className="rounded-xl h-9">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Variant
                    </Button>
                </div>
            </div>

            {/* Variant List */}
            <VariantList
                variants={formData.productVariants || []}
                onUpdateVariant={handleUpdateVariant}
                onUpdateVariantMultiple={handleUpdateVariantMultiple}
                onRemoveVariant={handleRemoveVariant}
                errors={errors}
                isEditMode={isEditMode}
                expandedVariantId={expandedVariantId}
                onToggleExpand={onToggleExpand}
            />

            <ConfirmationDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={confirmDeleteVariant}
                title="Delete Variant"
                description="Are you sure you want to delete this variant? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </div>
    );
}
