import { Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CollectionStatus } from '../../types/collection.types';

interface PublishingSectionProps {
  status: CollectionStatus;
  publishDate: string;
  publishTime?: string;
  onStatusChange: (value: CollectionStatus) => void;
  onPublishDateChange: (value: string) => void;
  onPublishTimeChange?: (value: string) => void;
  disabled?: boolean;
  showScheduling?: boolean;
}

export function PublishingSection({
  status,
  publishDate,
  publishTime = '',
  onStatusChange,
  onPublishDateChange,
  onPublishTimeChange,
  disabled = false,
}: PublishingSectionProps) {
  return (
    <div className="bg-white rounded-[20px] border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <Calendar className="size-5 text-rose-600" />
        <h2 className="font-semibold text-slate-900">Publishing</h2>
      </div>

      <div className="space-y-4">
        {/* Status */}
        <div>
          <Label htmlFor="status" className="text-sm font-medium text-slate-700 mb-2 block">
            Status
          </Label>
          <Select value={status} onValueChange={onStatusChange} disabled={disabled}>
            <SelectTrigger id="status" className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Publish Date */}
        <div>
          <Label htmlFor="publishDate" className="text-sm font-medium text-slate-700 mb-2 block">
            Publish Date
          </Label>
          <Input
            id="publishDate"
            type="date"
            value={publishDate}
            onChange={(e) => onPublishDateChange(e.target.value)}
            className="rounded-xl"
          />
        </div>

        {/* Publish Time */}
        {onPublishTimeChange && (
          <div>
            <Label htmlFor="publishTime" className="text-sm font-medium text-slate-700 mb-2 block">
              Publish Time
            </Label>
            <Input
              id="publishTime"
              type="time"
              value={publishTime}
              onChange={(e) => onPublishTimeChange(e.target.value)}
              className="rounded-xl"
            />
          </div>
        )}
      </div>
    </div>
  );
}
