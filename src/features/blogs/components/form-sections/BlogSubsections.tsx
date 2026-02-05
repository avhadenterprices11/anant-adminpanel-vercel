import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';
import { FileUpload } from '../FileUpload';
import type { SubSection } from '../../types/blog.types';

interface BlogSubsectionsProps {
  subsections: SubSection[];
  onAddSubsection: () => void;
  onRemoveSubsection: (id: string) => void;
  onSubsectionChange: (id: string, field: keyof SubSection, value: any) => void;
}

export const BlogSubsections: React.FC<BlogSubsectionsProps> = ({
  subsections,
  onAddSubsection,
  onRemoveSubsection,
  onSubsectionChange
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Blog Subsections</h2>
          <p className="text-sm text-slate-600 mt-1">Add structured content sections</p>
        </div>
        <Button variant="outline" size="sm" onClick={onAddSubsection}>
          <Plus className="size-4 mr-2" />
          Add Section
        </Button>
      </div>

      {subsections.length === 0 ? (
        <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-sm">No subsections added yet. Click "Add Section" to create one.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {subsections.map((subsection, index) => (
            <div key={subsection.id} className="p-6 border border-slate-200 rounded-lg bg-slate-50/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-700">Section {index + 1}</h3>
                <button
                  onClick={() => onRemoveSubsection(subsection.id!)}
                  className="p-1.5 hover:bg-red-50 rounded-md transition-colors text-slate-400 hover:text-red-600"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="space-y-4">

                <div className='flex flex-col gap-3'>
                  <Label>Subsection Title</Label>
                  <Input
                    placeholder="Enter subsection title"
                    value={subsection.title}
                    onChange={(e) => onSubsectionChange(subsection.id!, 'title', e.target.value)}
                  />
                </div>


                <div className="space-y-2">
                  <Label className="text-slate-700">Subsection Description</Label>
                  <Textarea
                    placeholder="Enter subsection description"
                    value={subsection.description}
                    onChange={(e) => onSubsectionChange(subsection.id!, 'description', e.target.value)}
                    rows={3}
                  />
                </div>
                <FileUpload
                  label="Section Image"
                  hint="PNG, JPG up to 5MB"
                  onChange={(file) => onSubsectionChange(subsection.id!, 'image', file)}
                  preview={
                    typeof subsection.image === 'string'
                      ? subsection.image
                      : subsection.image instanceof File
                        ? URL.createObjectURL(subsection.image)
                        : null
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
