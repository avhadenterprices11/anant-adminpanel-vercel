import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { notifyInfo, notifySuccess } from '@/utils';
import { DateRangePicker } from '@/components/forms/inputs/DateRangePicker';
import { ActionButtons, FiltersBar } from '@/components/features/data-table';
import { MetricsGrid } from '@/components/features/metrics';
import { useInvitationList } from '../hooks/useInvitationList';
import { InvitationListTable } from '../components/InvitationListTable';
import { CreateInvitationModal } from '../components/CreateInvitationModal';
import { EditInvitationModal } from '../components/EditInvitationModal';
import { invitationService } from '../services';
import type { Invitation } from '../types';

import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog';

const InvitationListPage: React.FC = () => {
    const {
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
        getRowId,
        refreshData,
        isCreateModalOpen,
        setIsCreateModalOpen,
        visibleColumns,
        toggleColumn,
        dateRange,
        setDateRange,
        toggleFilter,
    } = useInvitationList();

    // Edit modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingInvitation] = useState<Invitation | null>(null);

    // Selection state
    const [selectedInvitations, setSelectedInvitations] = useState<Invitation[]>([]);
    // Dialog state
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Bulk delete handler - Open dialog
    const handleBulkDelete = () => {
        if (selectedInvitations.length === 0) return;
        setShowDeleteDialog(true);
    };

    // Confirm delete handler - Execute delete
    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await Promise.all(selectedInvitations.map(inv => invitationService.deleteInvitation(inv.id)));
            notifySuccess(`Successfully deleted ${selectedInvitations.length} invitations`);
            setSelectedInvitations([]);
            setShowDeleteDialog(false);
            refreshData();
        } catch (error) {
            console.error('Bulk delete failed:', error);
            notifyInfo('Failed to delete some invitations');
        } finally {
            setIsDeleting(false);
        }
    };

    // Global actions (Bulk)
    const globalActions = [
        {
            label: "Delete",
            icon: <Trash2 size={16} />,
            danger: true,
            disabled: selectedInvitations.length === 0,
            onClick: handleBulkDelete
        },
    ];

    const activeColumns = columns.filter(col =>
        visibleColumns.find(v => v.key === col.key && v.visible)
    );

    return (
        <div className="px-9 lg:px-8 pb-8 lg:pb-8 pt-2 space-y-7">
            {/* Header Actions */}
            <div className="flex justify-between items-center">
                <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    className="w-full md:w-auto"
                />

                <ActionButtons
                    primaryLabel="Create Invite"
                    onAddPrimary={() => setIsCreateModalOpen(true)}
                    onImport={async (data: any[], mode: any) => {
                        notifyInfo(`Importing ${data.length} invitations in ${mode} mode`);
                    }}
                    onExport={async (_options) => {
                        notifyInfo('Exporting invitations');
                    }}
                    totalItems={total}
                    moduleName="Invitations"
                />
            </div>

            {/* Metrics */}
            <MetricsGrid metrics={metrics} />

            {/* Filters */}
            <FiltersBar
                search={search}
                onSearchChange={setSearch}
                filterGroups={[
                    {
                        id: 'status',
                        label: 'Status',
                        options: [
                            {
                                label: 'All Status',
                                value: '',
                                onSelect: () => setStatusFilter([]),
                                isActive: statusFilter.length === 0
                            },
                            ...['pending', 'accepted', 'expired', 'revoked'].map(s => ({
                                label: s.charAt(0).toUpperCase() + s.slice(1),
                                value: s,
                                onSelect: () => setStatusFilter(toggleFilter(statusFilter, s)),
                                isActive: statusFilter.includes(s)
                            }))
                        ]
                    },
                    {
                        id: 'role',
                        label: 'Role',
                        options: [
                            {
                                label: 'All Roles',
                                value: '',
                                onSelect: () => setRoleFilter([]),
                                isActive: roleFilter.length === 0
                            },
                            ...availableRoles.map(role => {
                                let label = role.name;
                                if (label.toLowerCase() === 'admin') label = 'Admin';
                                else if (label.toLowerCase() === 'superadmin') label = 'Super Admin';
                                else label = label.charAt(0).toUpperCase() + label.slice(1);

                                return {
                                    label: label,
                                    value: role.id,
                                    onSelect: () => setRoleFilter(toggleFilter(roleFilter, role.id)),
                                    isActive: roleFilter.includes(role.id)
                                };
                            })
                        ]
                    }
                ]}
                sortOptions={[
                    {
                        label: "Newest First",
                        value: "created_at_desc",
                        direction: "desc",
                        isActive: sort.key === 'created_at' && sort.direction === 'desc',
                        onSelect: () => handleSortChange('created_at', 'desc')
                    },
                    {
                        label: "Oldest First",
                        value: "created_at_asc",
                        direction: "asc",
                        isActive: sort.key === 'created_at' && sort.direction === 'asc',
                        onSelect: () => handleSortChange('created_at', 'asc')
                    },
                    {
                        label: "Role (A-Z)",
                        value: "role_asc",
                        direction: "asc",
                        isActive: sort.key === 'assigned_role_name' && sort.direction === 'asc',
                        onSelect: () => handleSortChange('assigned_role_name', 'asc')
                    },
                    {
                        label: "Role (Z-A)",
                        value: "role_desc",
                        direction: "desc",
                        isActive: sort.key === 'assigned_role_name' && sort.direction === 'desc',
                        onSelect: () => handleSortChange('assigned_role_name', 'desc')
                    },
                    {
                        label: "Status (Asc)",
                        value: "status_asc",
                        direction: "asc",
                        isActive: sort.key === 'status' && sort.direction === 'asc',
                        onSelect: () => handleSortChange('status', 'asc')
                    },
                    {
                        label: "Status (Desc)",
                        value: "status_desc",
                        direction: "desc",
                        isActive: sort.key === 'status' && sort.direction === 'desc',
                        onSelect: () => handleSortChange('status', 'desc')
                    },
                    {
                        label: "Expires (Soonest)",
                        value: "expires_asc",
                        direction: "asc",
                        isActive: sort.key === 'expires_at' && sort.direction === 'asc',
                        onSelect: () => handleSortChange('expires_at', 'asc')
                    },
                    {
                        label: "Expires (Latest)",
                        value: "expires_desc",
                        direction: "desc",
                        isActive: sort.key === 'expires_at' && sort.direction === 'desc',
                        onSelect: () => handleSortChange('expires_at', 'desc')
                    },
                    {
                        label: "Email (A-Z)",
                        value: "email_asc",
                        direction: "asc",
                        isActive: sort.key === 'email' && sort.direction === 'asc',
                        onSelect: () => handleSortChange('email', 'asc')
                    },
                    {
                        label: "Email (Z-A)",
                        value: "email_desc",
                        direction: "desc",
                        isActive: sort.key === 'email' && sort.direction === 'desc',
                        onSelect: () => handleSortChange('email', 'desc')
                    }
                ]}
                visibleColumns={visibleColumns}
                onToggleColumn={toggleColumn}
                actions={globalActions}
                onClearFilters={onClearFilters}
            />

            {/* Table */}
            <InvitationListTable
                invitations={invitations}
                loading={loading}
                page={page}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                total={total}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                columns={activeColumns}
                getRowId={getRowId}
                sort={sort}
                onSortChange={handleSortChange}
                forceTableOnMobile={false}
                onSelectionChange={setSelectedInvitations}
                renderMobileCard={(row) => ({
                    title: row.email,
                    subtitle: row.assigned_role_name,
                    primaryValue: row.status,
                    badges: (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] border ${row.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            row.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                            {row.status}
                        </span>
                    ),
                    fields: [
                        {
                            label: "Expires",
                            value: row.expires_at ? new Date(row.expires_at).toLocaleDateString() : 'Never',
                        }
                    ],
                })}
            />

            {/* Create Invitation Modal */}
            <CreateInvitationModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onSuccess={refreshData}
            />

            {/* Edit Invitation Modal */}
            <EditInvitationModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                onSuccess={refreshData}
                invitation={editingInvitation}
            />

            <ConfirmationDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleConfirmDelete}
                title={`Delete ${selectedInvitations.length} Invitation(s)`}
                description="Are you sure you want to delete the selected invitations? This action cannot be undone."
                confirmText={isDeleting ? "Deleting..." : "Delete"}
                cancelText="Cancel"
                variant="destructive"
                isLoading={isDeleting}
            />
        </div>
    );
};

export default InvitationListPage;
