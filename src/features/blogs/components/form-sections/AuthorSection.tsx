import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AuthorSectionProps {
  author: string;
  authorBio?: string;
  authorImage?: string;
  onAuthorChange: (value: string) => void;
  onAuthorBioChange?: (value: string) => void;
  onAuthorImageChange?: (value: string) => void;
}

export const AuthorSection: React.FC<AuthorSectionProps> = ({
  author,
  authorBio,
  authorImage,
  onAuthorChange,
  onAuthorBioChange,
  onAuthorImageChange
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 space-y-5">
      <div>
        <h3 className="font-semibold text-slate-900 mb-1">Author</h3>
        <p className="text-xs text-slate-600">Blog post attribution</p>
      </div>

      <div className='flex flex-col gap-3'>
        <Label htmlFor="blog-author-name">Author Name</Label>
        <Input
          id="blog-author-name"
          placeholder="Enter author name"
          value={author}
          onChange={(e) => onAuthorChange(e.target.value)}
        />
        <p className="text-xs text-slate-500">The name that will appear as the blog author</p>
      </div>

      {onAuthorBioChange && (
        <div className='flex flex-col gap-3'>
          <Label>Author Bio</Label>
          <Input
            placeholder="Short bio"
            value={authorBio}
            onChange={(e) => onAuthorBioChange(e.target.value)}
          />
        </div>
      )}

      {onAuthorImageChange && (
        <div className='flex flex-col gap-3'>
          <Label>Author Image URL</Label>
          <Input
            placeholder="https://..."
            value={authorImage}
            onChange={(e) => onAuthorImageChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};
