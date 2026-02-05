import { Users, Info } from 'lucide-react';
import { Switch } from '@/components/ui';
import { SidebarSection } from '@/components/layouts';
import type { SegmentInsightsProps } from '../types/segment.types';

export const SegmentInsightsSidebar = ({
  estimatedUsers,
  lastRefreshed,
  createdBy,
  segmentStatus,
  setSegmentStatus
}: SegmentInsightsProps) => {
  return (
    <div className="space-y-6">
      {/* Publishing & Control Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
        <SidebarSection
          title="Publishing & Control"
          description="Manage segment availability"
        >
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Segment Status</p>
              <p className="text-xs text-slate-600 mt-0.5">
                {segmentStatus ? 'Segment is active and visible' : 'Segment is inactive'}
              </p>
            </div>
            <Switch checked={segmentStatus} onCheckedChange={setSegmentStatus} />
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800 flex items-start gap-2">
              <Info className="size-4 flex-shrink-0 mt-0.5" />
              <span>Only active segments will automatically update their user membership based on rules.</span>
            </p>
          </div>
        </SidebarSection>
      </div>

      {/* Segment Insights Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
        <SidebarSection
          title="Segment Insights"
          description="Real-time segment statistics"
        >
          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-indigo-600 font-medium">Estimated Users</p>
              <Users className="size-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-indigo-900">{estimatedUsers}</p>
            <p className="text-xs text-indigo-600 mt-1">users match this segment</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Last Refreshed</span>
              <span className="font-medium text-slate-900">{lastRefreshed}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Created By</span>
              <span className="font-medium text-slate-900">{createdBy}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Created On</span>
              <span className="font-medium text-slate-900">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Last Modified</span>
              <span className="font-medium text-slate-900">Just now</span>
            </div>
          </div>
        </SidebarSection>
      </div>
    </div>
  );
};
