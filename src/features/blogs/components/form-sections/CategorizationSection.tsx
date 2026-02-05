import React from 'react';
import { Label } from '@/components/ui/label';


interface CategorizationSectionProps {
  category: string;
  tags: string[];
  onCategoryChange: (value: string) => void;
  onTagsChange: (value: string[]) => void;
}

export const CategorizationSection: React.FC<CategorizationSectionProps> = ({
  tags,
  onTagsChange
}) => {
  // Adapter for TagsSection
  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      onTagsChange([...tags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 space-y-6">
      <div>
        <h3 className="font-semibold text-slate-900 mb-1">Categorization</h3>
        <p className="text-xs text-slate-600">Organize your content</p>
      </div>

      <div className="space-y-4">
        {/* Commented out Category section
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        */}

        <div>
          {/* Reusing TagsSection but we need to supply input state if we want input. 
                TagsSection requires 'tagInput' and 'onTagInputChange'. 
                We can wrap it or just simplify.
                Since TagsSection is controlled, we need state. 
                For now, let's just make CategorizationSection use a simplified internal state for input or assume TagsSection is robust.
            */}
          <Label className="mb-2 block">Tags</Label>
          {/* Using a simplified version here to avoid complex state management issues in this adapter */}
          <SimpleTagsInput tags={tags} onAddTag={handleAddTag} onRemoveTag={handleRemoveTag} />
        </div>
      </div>
    </div>
  );
};


// Mini internal component to handle tags input if we don't want to use the full TagsSection which requires complex props
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SimpleTagsInput = ({ tags, onAddTag, onRemoveTag }: { tags: string[], onAddTag: (t: string) => void, onRemoveTag: (t: string) => void }) => {
  const [input, setInput] = React.useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim()) {
        onAddTag(input.trim());
        setInput('');
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag..."
          className="flex-1"
        />
        <Button
          type="button"
          size="sm"
          onClick={() => {
            if (input.trim()) {
              onAddTag(input.trim());
              setInput('');
            }
          }}
          variant="secondary"
        >
          <Plus className="size-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="px-2 py-1 flex items-center gap-1">
            {tag}
            <button type="button" onClick={() => onRemoveTag(tag)} className="hover:text-red-500">
              <X className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};
