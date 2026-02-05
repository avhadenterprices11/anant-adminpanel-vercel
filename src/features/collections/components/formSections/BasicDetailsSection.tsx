import { FolderOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

interface BasicDetailsSectionProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  disabled?: boolean;
  useRichText?: boolean;
  errors?: {
    title?: string;
    description?: string;
  };
  touched?: {
    title?: boolean;
    description?: boolean;
  };
}

export function BasicDetailsSection({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  disabled = false,
  useRichText = false,
  errors,
  touched,
}: BasicDetailsSectionProps) {

  return (
    <div className="bg-white rounded-[20px] border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <FolderOpen className="size-5 text-gray-400" />
        <h2 className="font-semibold text-slate-900">Basic Details</h2>
      </div>

      <div className="space-y-4">
        {/* Collection Title */}
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-slate-700 mb-2 block">
            Collection Title *
          </Label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            disabled={disabled}
            className={`rounded-xl ${disabled ? 'bg-slate-50 text-slate-600 cursor-not-allowed' : ''
              }`}
            placeholder="e.g., Summer Sale, New Arrivals, Cricket Equipment"
          />
          {touched?.title && errors?.title && (
            <p className="text-xs text-red-600 mt-1.5">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="text-sm font-medium text-slate-700 mb-2 block">
            Description
          </Label>
          {useRichText ? (
            <RichTextEditor
              value={description}
              onChange={onDescriptionChange}
              placeholder="Describe this collection..."
              disabled={disabled}
            />
          ) : (
            <Textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              disabled={disabled}
              rows={4}
              className={`rounded-xl resize-none ${disabled ? 'bg-slate-50 text-slate-600 cursor-not-allowed' : ''
                }`}
              placeholder="Describe this collection..."
            />
          )}
          {touched?.description && errors?.description && (
            <p className="text-xs text-red-600 mt-1.5">{errors.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
