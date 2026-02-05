
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { notifySuccess, notifyError } from '@/utils';
import type { MetricItem } from '@/components/features/metrics';
import type { DateRangeValue } from '@/components/forms/inputs/DateRangePicker';
import type { ColumnConfig, RowAction } from '@/components/features/data-table/GenericTable';
import type { Invitation, InvitationStatus } from '../types';
import { invitationService } from '../services';
import { INVITATION_STATUS_OPTIONS, INVITATION_STATUS_COLORS } from '../constants';

interface VisibleColumn {
    key: string;
    label: string;
    visible: boolean;
}

export interface UseInvitationListReturn {
    invitations: Invitation[];
    total: number;
    totalPages: number;
    loading: boolean;
    page: number;
    setPage: (page: number) => void;
    rowsPerPage: number;
    setRowsPerPage: (rows: number) => void;
    search: string;
    setSearch: (search: string) => void;
    statusFilter: string[];
    setStatusFilter: (status: string[]) => void;
    roleFilter: string[];
    setRoleFilter: (roleIds: string[]) => void;
    availableRoles: { id: string, name: string }[];
    onClearFilters: () => void;
    sort: { key: string; direction: 'asc' | 'desc' };
    handleSortChange: (key: string, direction: 'asc' | 'desc') => void;
    metrics: MetricItem[];
    columns: ColumnConfig<Invitation>[];
    rowActionsBuilder: (row: Invitation) => RowAction<Invitation>[];
    getRowId: (row: Invitation) => string;
    refreshData: () => void;
    handleDelete: (invitation: Invitation) => Promise<void>;
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (open: boolean) => void;
    statusFilterOptions: { value: string; label: string }[];
    visibleColumns: VisibleColumn[];
    toggleColumn: (key: string) => void;
    dateRange: DateRangeValue;
    setDateRange: (range: DateRangeValue) => void;
    toggleFilter: (current: string[], value: string) => string[];
}

export function useInvitationList(): UseInvitationListReturn {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const storedRowsPerPage = typeof window !== 'undefined' ? parseInt(localStorage.getItem('rowsPerPage') || '10', 10) : 10;
    const [rowsPerPage, setRowsPerPage] = useState(storedRowsPerPage);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [roleFilter, setRoleFilter] = useState<string[]>([]);

    // Helper to toggle selection
    const toggleFilter = (current: string[], value: string) => {
        if (value === "") return [];
        if (current.includes(value)) {
            return current.filter(c => c !== value);
        }
        return [...current, value];
    };
    const [availableRoles, setAvailableRoles] = useState<{ id: string, name: string }[]>([]);
    const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'created_at', direction: 'desc' });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [dateRange, setDateRange] = useState<DateRangeValue>({
        from: null,
        to: null,
    });

    useEffect(() => {
        const fetchAvailableRoles = async () => {
            try {
                const { data: { session } } = await import('@/lib/supabase').then(m => m.supabase.auth.getSession());
                const token = session?.access_token;

                if (!token) {
                    console.warn('No authentication token found for fetching roles');
                    return;
                }

                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/rbac/roles`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    setAvailableRoles(result.data
                        .filter((r: any) => r.name !== 'user')
                        .map((r: any) => ({ id: r.id, name: r.name }))
                    );
                } else {
                    console.error('Failed to fetch roles:', await response.text());
                }
            } catch (error) {
                console.error('Failed to fetch available roles:', error);
            }
        };
        fetchAvailableRoles();
    }, []);

    const [visibleColumns, setVisibleColumns] = useState<VisibleColumn[]>([
        { key: 'first_name', label: 'First Name', visible: true },
        { key: 'last_name', label: 'Last Name', visible: true },
        { key: 'email', label: 'Email', visible: true },
        { key: 'assigned_role_name', label: 'Role', visible: true },
        { key: 'status', label: 'Status', visible: true },
        { key: 'created_at', label: 'Invited On', visible: false },
    ]);

    const toggleColumn = useCallback((key: string) => {
        setVisibleColumns((prev) =>
            prev.map((col) =>
                col.key === key ? { ...col, visible: !col.visible } : col
            )
        );
    }, []);

    const totalPages = useMemo(() => Math.ceil(total / rowsPerPage), [total, rowsPerPage]);

    const fetchInvitations = useCallback(async () => {
        setLoading(true);
        try {
            const data = await invitationService.getInvitations({
                page,
                limit: rowsPerPage,
                status: statusFilter.length > 0 ? statusFilter.join(',') : undefined,
                roleId: roleFilter.length > 0 ? roleFilter.join(',') : undefined,
                startDate: dateRange.from?.toISOString(),
                endDate: dateRange.to?.toISOString(),
                sortBy: sort.key,
                sortOrder: sort.direction,
            });

            let filteredInvitations = data.invitations;

            if (search) {
                const searchLower = search.toLowerCase();
                filteredInvitations = filteredInvitations.filter(
                    (inv) =>
                        inv.first_name.toLowerCase().includes(searchLower) ||
                        inv.last_name.toLowerCase().includes(searchLower) ||
                        inv.email.toLowerCase().includes(searchLower)
                );
            }

            setInvitations(filteredInvitations);
            setTotal(data.total);
        } catch (error) {
            console.error('Failed to fetch invitations:', error);
            notifyError('Failed to load invitations');
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, statusFilter, roleFilter, search, dateRange, sort]);

    useEffect(() => {
        fetchInvitations();
    }, [fetchInvitations]);

    const metrics: MetricItem[] = useMemo(() => {
        const pending = invitations.filter((i) => i.status === 'pending').length;
        const accepted = invitations.filter((i) => i.status === 'accepted').length;
        const expired = invitations.filter((i) => i.status === 'expired' || i.status === 'revoked').length;

        return [
            { title: 'Total Invitations', value: total, icon: Users, iconBg: '#6C63FF', tooltip: 'Total number of invitations sent' },
            { title: 'Pending', value: pending, icon: Clock, iconBg: '#F59E0B', tooltip: 'Invitations awaiting acceptance' },
            { title: 'Accepted', value: accepted, icon: CheckCircle, iconBg: '#10B981', tooltip: 'Invitations that have been accepted' },
            { title: 'Expired/Revoked', value: expired, icon: XCircle, iconBg: '#EF4444', tooltip: 'Invitations that have expired or been revoked' },
        ];
    }, [invitations, total]);

    const columns: ColumnConfig<Invitation>[] = useMemo(
        () => [
            { key: 'first_name', label: 'First Name', sortable: true },
            { key: 'last_name', label: 'Last Name', sortable: true },
            { key: 'email', label: 'Email', sortable: true },
            {
                key: 'assigned_role_name',
                label: 'Role',
                sortable: true,
                render: (value: unknown) => {
                    const roleValue = value as string | undefined;
                    return (
                        <span className="px-2 py-1 rounded-full text-xs bg-purple-50 text-purple-700 border border-purple-200">
                            {roleValue || 'N/A'}
                        </span>
                    );
                },
            },
            {
                key: 'status',
                label: 'Status',
                sortable: true,
                render: (value: unknown) => {
                    const status = value as InvitationStatus;
                    const colors = INVITATION_STATUS_COLORS[status] || INVITATION_STATUS_COLORS.pending;
                    return (
                        <span className={`px-2 py-0.5 rounded-full text-[11px] uppercase border ${colors.bg} ${colors.text} ${colors.border}`}>
                            {status}
                        </span>
                    );
                },
            },
            { key: 'created_at', label: 'Invited On', type: 'date', hiddenOnMobile: true, sortable: true },
        ],
        []
    );

    const rowActionsBuilder = useCallback(
        (row: Invitation): RowAction<Invitation>[] => {
            const actions: RowAction<Invitation>[] = [];
            if (row.status === 'pending') {
                actions.push({ label: 'Delete', danger: true, onClick: () => handleDelete(row) });
            }
            return actions;
        },
        []
    );

    const handleDelete = async (invitation: Invitation) => {
        if (!confirm(`Are you sure you want to delete the invitation for ${invitation.email}?`)) return;
        try {
            await invitationService.deleteInvitation(invitation.id);
            notifySuccess('Invitation deleted successfully');
            fetchInvitations();
        } catch (error) {
            console.error('Failed to delete invitation:', error);
            notifyError('Failed to delete invitation');
        }
    };

    const onClearFilters = useCallback(() => {
        setSearch('');
        setStatusFilter([]);
        setRoleFilter([]);
        setPage(1);
    }, []);

    const handleSortChange = useCallback((key: string, direction: 'asc' | 'desc') => {
        setSort({ key, direction });
    }, []);

    const getRowId = useCallback((row: Invitation) => String(row.id), []);

    const statusFilterOptions = useMemo(
        () => [
            { value: '', label: 'All Status' },
            ...INVITATION_STATUS_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label })),
        ],
        []
    );

    return {
        invitations,
        total,
        totalPages,
        loading,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        roleFilter,
        setRoleFilter,
        availableRoles,
        onClearFilters,
        sort,
        handleSortChange,
        metrics,
        columns,
        rowActionsBuilder,
        getRowId,
        refreshData: fetchInvitations,
        handleDelete,
        isCreateModalOpen,
        setIsCreateModalOpen,
        statusFilterOptions,
        visibleColumns,
        toggleColumn,
        dateRange,
        setDateRange,
        toggleFilter,
    };
}
