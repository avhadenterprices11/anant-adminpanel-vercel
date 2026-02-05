import React from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface BlogDetailsSectionProps {
  title: string;
  quote?: string;
  excerpt?: string;
  description: string;
  onTitleChange: (value: string) => void;
  onQuoteChange?: (value: string) => void;
  onExcerptChange?: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  errors?: any;
}

export const BlogDetailsSection: React.FC<BlogDetailsSectionProps> = ({
  title,
  quote,
  excerpt,
  description,
  onTitleChange,
  onQuoteChange,
  onExcerptChange,
  onDescriptionChange,
  errors
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-8 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Blog Details</h2>
        <p className="text-sm text-slate-600 mt-1">Essential information about your blog post</p>
      </div>
      <div className="space-y-5">
        <div className='flex flex-col gap-3'>
          <Label htmlFor="blog-title">Title <span className="text-red-500 ml-1">*</span></Label>
          <Input
            id="blog-title"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
          {errors?.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
        </div>
        {onQuoteChange && (
          <div className='flex flex-col gap-3'>
            <Label>Quote</Label>
            <Input
              placeholder="Enter a memorable quote or tagline"
              value={quote}
              onChange={(e) => onQuoteChange(e.target.value)}
            />
          </div>
        )}
        {onExcerptChange && (
          <div className='flex flex-col gap-3'>
            <Label>Excerpt</Label>
            <Textarea
              placeholder="Short summary..."
              value={excerpt}
              onChange={(e) => onExcerptChange(e.target.value)}
              rows={2}
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="blog-description" className="text-slate-700">
            Description <span className="text-red-500 ml-1">*</span>
          </Label>
          <Textarea
            id="blog-description"
            placeholder="Brief description of the blog post (max 150 characters)"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={3}
            maxLength={150}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">This will appear in blog previews and search results</p>
            <p className="text-xs text-slate-500">{description.length}/150</p>
          </div>
          {errors?.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
        </div>
      </div>
    </div>
  );
};
