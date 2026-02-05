import { Tag, Shield, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FormSection } from '@/components/forms';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { CustomerFormData } from '../../types/customer.types';
import { SmartTagInput } from '@/components/forms/inputs/SmartTagInput';

interface InternalTagsSectionProps {
  formData: CustomerFormData;
  setFormData: React.Dispatch<React.SetStateAction<CustomerFormData>>;
  isEditing: boolean;
  suggestedTags: string[];
  onAddNewTagToModel: (tag: string) => void;
}

export function InternalTagsSection({
  formData,
  setFormData,
  isEditing,
  suggestedTags,
  onAddNewTagToModel
}: InternalTagsSectionProps) {

  const handleTagsChange = (newTags: string[]) => {
    // Check for new tags and add to model
    newTags.forEach(tag => {
      if (!suggestedTags.includes(tag)) {
        onAddNewTagToModel(tag);
      }
    });

    setFormData(prev => ({
      ...prev,
      internalTags: newTags
    }));
  };

  const adminBadge = (
    <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
      <Shield className="size-3 mr-1" />
      Admin Only
    </Badge>
  );

  return (
    <FormSection icon={Tag} title="Tags and Notes" actions={adminBadge}>

      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            Tags
          </Label>
          <SmartTagInput
            value={formData.internalTags || []}
            onChange={handleTagsChange}
            availableTags={suggestedTags} // Using suggestedTags as the model source
            placeholder="Add tags..."
            className={`rounded-xl border-slate-200 focus-visible:ring-slate-400 ${!isEditing ? "pointer-events-none opacity-80" : ""}`}
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            Internal Notes
          </Label>
          <Textarea
            value={formData.internalNotes}
            onChange={(e) => setFormData(prev => ({ ...prev, internalNotes: e.target.value }))}
            disabled={!isEditing}
            rows={4}
            className={`rounded-xl resize-none border border-slate-200 bg-white focus-visible:ring-2 focus-visible:ring-slate-200 focus-visible:border-slate-300 ${!isEditing ? "bg-slate-50 text-slate-600 cursor-not-allowed" : ""}`}
            placeholder="Add internal notes about this customer..."
          />
          <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
            <AlertCircle className="size-3" />
            These notes are internal only and not visible to customers
          </p>
        </div>
      </div>
    </FormSection>
  );
}
