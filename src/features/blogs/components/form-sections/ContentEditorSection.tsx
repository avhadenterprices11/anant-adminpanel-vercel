import React from 'react';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

interface ContentEditorSectionProps {
  content: string;
  onContentChange: (value: string) => void;
}

export const ContentEditorSection: React.FC<ContentEditorSectionProps> = ({
  content,
  onContentChange
}) => {
  return (
    <div id="blog-content-section" className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-8 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Content Editor <span className="text-red-500 ml-1">*</span></h2>
        <p className="text-sm text-slate-600 mt-1">Write and format your blog content with rich text formatting</p>
      </div>

      {/* Rich Text Editor */}
      {/* Rich Text Editor */}
      <RichTextEditor
        value={content}
        onChange={onContentChange}
        placeholder="Start writing your blog content here..."
        minHeight={300}
      />
    </div>
  );
};
