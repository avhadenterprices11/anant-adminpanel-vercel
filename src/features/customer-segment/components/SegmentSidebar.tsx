import { Label, Switch, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { SidebarSection } from '@/components/layouts';
import type { SegmentSidebarProps } from '../types/segment.types';

export const SegmentSidebar = ({
    segmentStatus,
    setSegmentStatus,
    autoRefreshInterval,
    setAutoRefreshInterval,
    lockRules,
    setLockRules,
    segmentNotes,
    setSegmentNotes
}: SegmentSidebarProps) => {
    return (
        <div className="space-y-6">
            <SidebarSection title="Publishing & Control" description="Manage segment availability">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="text-sm">
                        <p className="font-medium">Segment Status</p>
                        <p className="text-slate-500">{segmentStatus ? 'Active' : 'Inactive'}</p>
                    </div>
                    <Switch checked={segmentStatus} onCheckedChange={setSegmentStatus} />
                </div>
                <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-lg flex gap-2">
                    <span>Only active segments automatically update membership.</span>
                </div>
            </SidebarSection>

            <SidebarSection title="Advanced" description="Additional configuration options">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Auto Refresh</Label>
                        <Select value={autoRefreshInterval} onValueChange={setAutoRefreshInterval}>
                            <SelectTrigger><SelectValue placeholder="Select interval" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Lock Rules</span>
                        <Switch checked={lockRules} onCheckedChange={setLockRules} />
                    </div>
                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea value={segmentNotes} onChange={(e) => setSegmentNotes(e.target.value)} placeholder="Internal notes..." />
                    </div>
                </div>
            </SidebarSection>
        </div>
    );
};
