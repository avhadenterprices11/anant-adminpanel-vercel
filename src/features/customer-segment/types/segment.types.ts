export type SegmentPurpose = 'marketing-campaign' | 'email-campaign' | 'sms-campaign' | 'loyalty-program' | 'risk-management' | 'analytics';
export type SegmentPriority = 'critical' | 'high' | 'normal' | 'low';

export interface CustomerSegment {
    id: string;
    segmentName: string;
    type: string;
    purpose?: SegmentPurpose;
    priority?: SegmentPriority;
    createdBy: string;
    filters: string[];
    filteredUsers: number;
}

export type SegmentSortField = 'id' | 'segmentName' | 'type' | 'createdBy' | 'filteredUsers';
export type SortDirection = 'asc' | 'desc';

export interface SegmentRule {
    id: string;
    field: string;
    condition: string;
    value: string;
}

export interface MatchingUser {
    id: string;
    name: string;
    email: string;
    tags: string[];
}

export interface SegmentInsightsProps {
    estimatedUsers: number;
    lastRefreshed: string;
    createdBy: string;
    segmentStatus: boolean;
    setSegmentStatus: (value: boolean) => void;
}

export interface SegmentSidebarProps {
    segmentStatus: boolean;
    setSegmentStatus: (value: boolean) => void;
    autoRefreshInterval: string;
    setAutoRefreshInterval: (value: string) => void;
    lockRules: boolean;
    setLockRules: (value: boolean) => void;
    segmentNotes: string;
    setSegmentNotes: (value: string) => void;
}

export interface TimelineItem {
    id: number;
    type: 'creation' | 'update' | 'note';
    user: string;
    action: string;
    timestamp: string;
}

export interface AdvancedSettingsSectionProps {
    autoRefreshInterval: string;
    setAutoRefreshInterval: (value: string) => void;
    lockRules: boolean;
    setLockRules: (value: boolean) => void;
}

export interface UsersPreviewSectionProps {
    matchingUsers: MatchingUser[];
    hasValidRule: boolean;
    applied?: boolean;
}
