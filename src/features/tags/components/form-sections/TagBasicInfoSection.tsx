import { Tag } from 'lucide-react';
import { FormSection } from '@/components/forms';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TagBasicInfoSectionProps {
    formData: {
        name: string;
        type: string;
    };
    handleChange: (field: string, value: any) => void;
    errors?: Record<string, string>;
    disabled?: boolean;
}

export function TagBasicInfoSection({ formData, handleChange, errors = {}, disabled = false }: TagBasicInfoSectionProps) {
    return (
        <FormSection icon={Tag} title="Tag Information">
            {/* Tag Name */}
            <div className="space-y-2">
                <Label htmlFor="name" className="required">
                    Tag Name <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g., Summer, New Arrival, Featured"
                    className={errors.name ? 'border-red-500' : ''}
                    disabled={disabled}
                    maxLength={255}
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                )}
                <p className="text-sm text-gray-500">
                    Enter a unique name for this tag
                </p>
            </div>

            {/* Tag Type */}
            <div className="space-y-2" id="tag-type-section">
                <Label htmlFor="type" className="required">
                    Tag Type <span className="text-red-500">*</span>
                </Label>
                <Select
                    value={formData.type}
                    onValueChange={(value) => handleChange('type', value)}
                    disabled={disabled}
                >
                    <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select tag type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="order">Order</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="blogs">Blogs</SelectItem>
                    </SelectContent>
                </Select>
                {errors.type && (
                    <p className="text-sm text-red-500">{errors.type}</p>
                )}
                <p className="text-sm text-gray-500">
                    Choose the context where this tag will be used
                </p>
            </div>
        </FormSection>
    );
}
