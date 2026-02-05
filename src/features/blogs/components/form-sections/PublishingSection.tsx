import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from 'lucide-react';
import { VISIBILITY_OPTIONS } from '../../data/blog.constants';
import type { BlogVisibility } from '../../types/blog.types';

interface PublishingSectionProps {
  visibility: BlogVisibility;
  publishDate: string;
  publishTime: string;
  featured: boolean;
  sticky: boolean;
  allowComments: boolean;
  onVisibilityChange: (value: BlogVisibility) => void;
  onPublishDateChange: (value: string) => void;
  onPublishTimeChange: (value: string) => void;
  onFeaturedChange: (value: boolean) => void;
  onStickyChange: (value: boolean) => void;
  onAllowCommentsChange: (value: boolean) => void;
}

export const PublishingSection: React.FC<PublishingSectionProps> = ({
  visibility,
  publishDate,
  publishTime,
  featured,
  sticky,
  allowComments,
  onVisibilityChange,
  onPublishDateChange,
  onPublishTimeChange,
  onFeaturedChange,
  onStickyChange,
  onAllowCommentsChange
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 space-y-6">
      <div>
        <h3 className="font-semibold text-slate-900 mb-1">Publishing</h3>
        <p className="text-xs text-slate-600">Control visibility and settings</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Visibility</Label>
          <Select value={visibility} onValueChange={(val) => onVisibilityChange(val as BlogVisibility)}>
            <SelectTrigger>
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              {VISIBILITY_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Publish Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="date"
              className="pl-9"
              value={publishDate}
              onChange={(e) => onPublishDateChange(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Publish Time</Label>
          <Input
            type="time"
            value={publishTime}
            onChange={(e) => onPublishTimeChange(e.target.value)}
          />
        </div>

        <div className="pt-4 space-y-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <Label className="cursor-pointer" htmlFor="featured">Featured Post</Label>
            <Switch id="featured" checked={featured} onCheckedChange={onFeaturedChange} />
          </div>

          <div className="flex items-center justify-between">
            <Label className="cursor-pointer" htmlFor="sticky">Sticky Post</Label>
            <Switch id="sticky" checked={sticky} onCheckedChange={onStickyChange} />
          </div>

          <div className="flex items-center justify-between">
            <Label className="cursor-pointer" htmlFor="comments">Allow Comments</Label>
            <Switch id="comments" checked={allowComments} onCheckedChange={onAllowCommentsChange} />
          </div>
        </div>
      </div>
    </div>
  );
};
