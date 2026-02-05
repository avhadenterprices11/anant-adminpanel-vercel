import { Settings } from 'lucide-react';
import { FormSection } from '@/components/forms';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TagStatusSectionProps {
    formData: {
        status: boolean;
    };
    handleChange: (field: string, value: any) => void;
    disabled?: boolean;
}

export function TagStatusSection({ formData, handleChange, disabled = false }: TagStatusSectionProps) {
    return (
        <FormSection icon={Settings} title="Availability & Flags">
            <div className="space-y-3">
                <Label htmlFor="status" className="text-sm font-medium text-slate-700 mb-2 block">
                    Tag Status
                </Label>
                <Select
                    value={formData.status ? 'active' : 'inactive'}
                    onValueChange={(value) => handleChange('status', value === 'active')}
                    disabled={disabled}
                >
                    <SelectTrigger id="status" className="rounded-xl">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                    Control visibility of this tag in the system
                </p>
            </div>
        </FormSection>
    );
}
