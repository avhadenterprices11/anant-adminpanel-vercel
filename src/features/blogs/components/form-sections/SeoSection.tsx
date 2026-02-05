import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SeoSectionProps {
  metaTitle: string;
  metaURL: string;
  metaDescription: string;
  metaKeywords?: string[];
  onMetaTitleChange: (value: string) => void;
  onMetaURLChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
  onMetaKeywordsChange?: (value: string[]) => void;
}

export const SeoSection: React.FC<SeoSectionProps> = ({
  metaTitle,
  metaURL,
  metaDescription,
  onMetaTitleChange,
  onMetaURLChange,
  onMetaDescriptionChange
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-8 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">SEO / Meta Information</h2>
        <p className="text-sm text-slate-600 mt-1">Optimize for search engines</p>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className='flex flex-col gap-3'>
            <Label>Meta Title</Label>
            <Input
              placeholder="SEO-optimized page title"
              value={metaTitle}
              onChange={(e) => onMetaTitleChange(e.target.value)}
              maxLength={60}
            />
            <p className="text-xs text-slate-500">Recommended: 50-60 characters</p>
          </div>
          <div className='flex flex-col gap-3'>
            <Label>Meta URL</Label>
            <Input
              placeholder="custom-url-slug"
              value={metaURL}
              onChange={(e) => onMetaURLChange(e.target.value)}
            />
            <p className="text-xs text-slate-500">Will be used in the blog post URL</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-700">Meta Description</Label>
          <Textarea
            placeholder="Brief description for search engines"
            value={metaDescription}
            onChange={(e) => onMetaDescriptionChange(e.target.value)}
            rows={3}
            maxLength={160}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">Recommended: 150-160 characters</p>
            <p className="text-xs text-slate-500">{metaDescription.length}/160</p>
          </div>
        </div>

        {/* SERP Preview */}
        <div className="space-y-2">
          <Label className="text-slate-700">SERP Preview</Label>
          <div className="p-5 border border-slate-200 rounded-lg bg-slate-50">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-slate-300"></div>
                <span className="text-xs text-slate-600">store.com</span>
              </div>
              <p className="text-sm text-blue-600 hover:underline cursor-pointer">
                {metaURL || 'blog-url-slug'} › {metaTitle || 'Your Blog Title'}
              </p>
              <p className="text-xs text-slate-700">
                {metaDescription || 'Your meta description will appear here to give readers a preview of what the blog post is about.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
