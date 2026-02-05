import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SegmentPurpose, SegmentPriority } from '../types/segment.types';

interface SegmentBasicDetailsProps {
    segmentName: string;
    setSegmentName: (value: string) => void;
    segmentCode: string;
    setSegmentCode: (value: string) => void;
    segmentDescription: string;
    setSegmentDescription: (value: string) => void;
    segmentPurpose?: SegmentPurpose;
    setSegmentPurpose?: (value: SegmentPurpose) => void;
    segmentPriority?: SegmentPriority;
    setSegmentPriority?: (value: SegmentPriority) => void;
}

export const SegmentBasicDetails = ({
    segmentName,
    setSegmentName,
    segmentCode,
    setSegmentCode,
    segmentDescription,
    setSegmentDescription,
    segmentPurpose,
    setSegmentPurpose,
    segmentPriority,
    setSegmentPriority
}: SegmentBasicDetailsProps) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
            <div className="mb-6">
                <h2 className="text-lg font-semibold">Basic Segment Details</h2>
                <p className="text-sm text-slate-500 mt-1">Essential information about the customer segment</p>
            </div>
            
            {/* Row 1: Segment Name & Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                    <Label required>Segment Name</Label>
                    <Input
                        placeholder="e.g., High-Value Customers"
                        value={segmentName}
                        onChange={(e) => setSegmentName(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label required>Segment Code</Label>
                    <Input
                        placeholder="e.g., high-value-customers"
                        value={segmentCode}
                        onChange={(e) => setSegmentCode(e.target.value)}
                    />
                </div>
            </div>

            {/* Row 2: Description (Full Width) */}
            <div className="space-y-2 mb-4">
                <Label>Description</Label>
                <Input
                    placeholder="e.g., This segment includes high-value customers..."
                    value={segmentDescription}
                    onChange={(e) => setSegmentDescription(e.target.value)}
                />
            </div>

            {/* Row 3: Purpose & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label required>Segment Purpose</Label>
                    <Select value={segmentPurpose || ''} onValueChange={(val) => setSegmentPurpose?.(val as SegmentPurpose)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="marketing-campaign">Marketing Campaign</SelectItem>
                            <SelectItem value="email-campaign">Email Campaign</SelectItem>
                            <SelectItem value="sms-campaign">SMS Campaign</SelectItem>
                            <SelectItem value="loyalty-program">Loyalty Program</SelectItem>
                            <SelectItem value="risk-management">Risk Management</SelectItem>
                            <SelectItem value="analytics">Analytics</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label required>Segment Priority</Label>
                    <Select value={segmentPriority || ''} onValueChange={(val) => setSegmentPriority?.(val as SegmentPriority)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="critical">Critical (30)</SelectItem>
                            <SelectItem value="high">High (20)</SelectItem>
                            <SelectItem value="normal">Normal (10)</SelectItem>
                            <SelectItem value="low">Low (5)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};
