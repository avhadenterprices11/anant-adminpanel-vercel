import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Tag, X } from 'lucide-react';
import { SUGGESTED_TAGS } from '../../data/blog.constants';

interface TagsSectionProps {
  tags: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onSuggestedTagAdd: (tag: string) => void;
}

export const TagsSection: React.FC<TagsSectionProps> = ({
  tags,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onSuggestedTagAdd
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 space-y-5">
      <div>
        <h3 className="font-semibold text-slate-900 mb-1">Tags</h3>
        <p className="text-xs text-slate-600">Add tags for better discovery</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Enter tag name"
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), onAddTag())}
            className="flex-1"
          />
          <Button variant="outline" size="sm" onClick={onAddTag}>
            <Plus className="size-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Suggested Tags */}
        <div className="space-y-2">
          <Label className="text-xs text-slate-600">Suggested Tags</Label>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_TAGS
              .filter(suggestedTag => !tags.includes(suggestedTag))
              .map(suggestedTag => (
                <button
                  key={suggestedTag}
                  onClick={() => onSuggestedTagAdd(suggestedTag)}
                  className="text-xs px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-700 border border-slate-200 transition-colors"
                >
                  + {suggestedTag}
                </button>
              ))}
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium"
              >
                <Tag className="size-3" />
                {tag}
                <button
                  onClick={() => onRemoveTag(tag)}
                  className="hover:text-slate-900 transition-colors"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
