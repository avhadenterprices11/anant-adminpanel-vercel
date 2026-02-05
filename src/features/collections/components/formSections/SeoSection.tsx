import { FileText, Link as LinkIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SeoSectionProps {
  urlHandle: string;
  metaTitle: string;
  metaDescription: string;
  onUrlHandleChange: (value: string) => void;
  onMetaTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
  disabled?: boolean;
  showUrlPreview?: boolean;
  errors?: {
    urlHandle?: string;
    metaTitle?: string;
    metaDescription?: string;
  };
  touched?: {
    urlHandle?: boolean;
    metaTitle?: boolean;
    metaDescription?: boolean;
  };
}

export function SeoSection({
  urlHandle,
  metaTitle,
  metaDescription,
  onUrlHandleChange,
  onMetaTitleChange,
  onMetaDescriptionChange,
  disabled = false,
  showUrlPreview = true,
  errors,
  touched,
}: SeoSectionProps) {
  return (
    <div className="bg-white rounded-[20px] border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <FileText className="size-5 text-gray-400" />
        <h2 className="font-semibold text-slate-900">SEO Metadata</h2>
      </div>

      <div className="space-y-4">
        {/* URL Handle */}
        <div>
          <Label htmlFor="urlHandle" className="text-sm font-medium text-slate-700 mb-2 block">
            URL Handle
          </Label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              id="urlHandle"
              name="urlHandle"
              value={urlHandle}
              onChange={(e) => onUrlHandleChange(e.target.value)}
              disabled={disabled}
              className={`pl-9 rounded-xl ${disabled ? 'bg-slate-50 text-slate-600 cursor-not-allowed' : ''
                }`}
              placeholder="collection-url-slug"
            />
          </div>
          {showUrlPreview && (
            <div className="mt-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600 break-all">
                <span className="text-slate-400">https://yourstore.com</span>
                <span className="font-medium text-slate-700">/collections/{urlHandle || 'handle'}</span>
              </p>
            </div>
          )}
          {touched?.urlHandle && errors?.urlHandle && (
            <p className="text-xs text-red-600 mt-1.5">{errors.urlHandle}</p>
          )}
        </div>

        {/* Meta Title */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="metaTitle" className="text-sm font-medium text-slate-700">
              Meta Title
            </Label>
            <span
              className={`text-xs font-medium ${metaTitle.length > 60 ? 'text-red-600' : 'text-slate-500'
                }`}
            >
              {metaTitle.length}/60
            </span>
          </div>
          <Input
            id="metaTitle"
            name="metaTitle"
            value={metaTitle}
            onChange={(e) => onMetaTitleChange(e.target.value)}
            disabled={disabled}
            className={`rounded-xl ${disabled ? 'bg-slate-50 text-slate-600 cursor-not-allowed' : ''
              }`}
            placeholder="Collection meta title for search engines"
            maxLength={70}
          />
          {metaTitle.length > 60 && (
            <p className="text-xs text-red-600 mt-1.5">Title may be truncated in search results</p>
          )}
          {touched?.metaTitle && errors?.metaTitle && (
            <p className="text-xs text-red-600 mt-1.5">{errors.metaTitle}</p>
          )}
        </div>

        {/* Meta Description */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="metaDescription" className="text-sm font-medium text-slate-700">
              Meta Description
            </Label>
            <span
              className={`text-xs font-medium ${metaDescription.length > 160 ? 'text-red-600' : 'text-slate-500'
                }`}
            >
              {metaDescription.length}/160
            </span>
          </div>
          <Textarea
            id="metaDescription"
            name="metaDescription"
            value={metaDescription}
            onChange={(e) => onMetaDescriptionChange(e.target.value)}
            disabled={disabled}
            rows={3}
            className={`rounded-xl resize-none ${disabled ? 'bg-slate-50 text-slate-600 cursor-not-allowed' : ''
              }`}
            placeholder="Collection meta description for search engines"
            maxLength={180}
          />
          {metaDescription.length > 160 && (
            <p className="text-xs text-red-600 mt-1.5">
              Description may be truncated in search results
            </p>
          )}
          {touched?.metaDescription && errors?.metaDescription && (
            <p className="text-xs text-red-600 mt-1.5">{errors.metaDescription}</p>
          )}
        </div>

        {/* SEO Preview */}
        {(metaTitle || metaDescription) && (
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-600 mb-2 font-medium">Search Preview</p>
            <div className="space-y-1">
              <p className="text-sm text-blue-600 font-medium line-clamp-1">
                {metaTitle || 'Collection Title'}
              </p>
              <p className="text-xs text-emerald-700">
                yourstore.com › collections › {urlHandle || 'handle'}
              </p>
              <p className="text-xs text-slate-600 line-clamp-2">
                {metaDescription || 'Collection description'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
