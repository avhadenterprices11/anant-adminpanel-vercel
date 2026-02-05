import React from 'react';
import { Controller, type Control } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { VISIBILITY_OPTIONS } from '../../data/blog.constants';
import type { BlogFormData } from '../../types/blog.types';

// Support both Controller pattern (with form control) and manual props pattern
interface VisibilityCategorySectionProps {
  control?: Control<BlogFormData>;
  // Manual props (for backward compatibility with non-react-hook-form usage)
  visibility?: string;
  category?: string;
  onVisibilityChange?: (value: string) => void;
  onCategoryChange?: (value: string) => void;
}

export const VisibilityCategorySection: React.FC<VisibilityCategorySectionProps> = ({
  control,
  visibility,
  onVisibilityChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 space-y-5">
      <div>
        <h3 className="font-semibold text-slate-900 mb-1">Visibility & Category</h3>
        <p className="text-xs text-slate-600">Control blog publication settings</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-slate-700">Visibility <span className="text-red-500 ml-1">*</span></Label>
          {control ? (
            // React Hook Form Controller pattern
            <Controller
              name="visibility"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    {VISIBILITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          ) : (
            // Manual props pattern (backward compatibility)
            <Select value={visibility} onValueChange={onVisibilityChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                {VISIBILITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Category field commented out as per request
        <div className="space-y-2">
          <Label className="text-slate-700">Category <span className="text-red-500 ml-1">*</span></Label>
          <div className="flex items-center gap-2">
            {control ? (
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            ) : (
              <Select value={category} onValueChange={onCategoryChange}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        */}
      </div>
    </div>
  );
};
