import type { InvitationStatus, RoleOption } from './types';

export const INVITATION_STATUS_OPTIONS: { value: InvitationStatus; label: string }[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'revoked', label: 'Revoked' },
    { value: 'expired', label: 'Expired' },
];

// Role options for the dropdown - these should match your RBAC system
// TODO: Ideally fetch these from API, but hardcoded for now based on backend docs
export const ROLE_OPTIONS: RoleOption[] = [
    { id: '1', name: 'Super Admin', description: 'Full system access' },
    { id: '2', name: 'Admin', description: 'Administrative access' },
];

export const INVITATION_STATUS_COLORS: Record<InvitationStatus, { bg: string; text: string; border: string }> = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    accepted: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    revoked: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    expired: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
};

export const INVITATION_TABLE_COLUMNS = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'assigned_role_name', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'created_at', label: 'Invited On' },
];
