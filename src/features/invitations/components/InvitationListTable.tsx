import React from 'react';
import { GenericTable } from '@/components/features/data-table/GenericTable';
import type { ColumnConfig, RowAction } from '@/components/features/data-table/GenericTable';
import type { Invitation } from '../types';

interface InvitationListTableProps {
    invitations: Invitation[];
    loading: boolean;
    page: number;
    totalPages: number;
    rowsPerPage: number;
    total: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rows: number) => void;
    columns: ColumnConfig<Invitation>[];
    rowActionsBuilder?: (row: Invitation) => RowAction<Invitation>[];
    getRowId: (row: Invitation) => string;
    sort: { key: string; direction: 'asc' | 'desc' };
    onSortChange: (key: string, direction: 'asc' | 'desc') => void;
    forceTableOnMobile?: boolean; // Added optional prop
    onSelectionChange?: (selected: Invitation[]) => void;
    renderMobileCard?: (row: Invitation) => any;
}

export const InvitationListTable: React.FC<InvitationListTableProps> = ({
    invitations,
    loading,
    page,
    totalPages,
    rowsPerPage,
    total,
    onPageChange,
    onRowsPerPageChange,
    columns,
    rowActionsBuilder,
    getRowId,
    sort,
    onSortChange,
    forceTableOnMobile = false,
    onSelectionChange,
    renderMobileCard,
}) => {
    return (
        <GenericTable<Invitation>
            data={invitations}
            loading={loading}
            page={page}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            totalItems={total}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            columns={columns}
            getRowId={getRowId}
            rowActionsBuilder={rowActionsBuilder}
            sortKey={sort.key}
            sortDirection={sort.direction}
            onSortChange={onSortChange}
            selectable={true}
            onSelectionChange={onSelectionChange}
            forceTableOnMobile={forceTableOnMobile}
            renderMobileCard={renderMobileCard}
            emptyState={
                <div className="text-center py-8">
                    <p className="text-gray-500">No invitations found</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Create an invitation to get started
                    </p>
                </div>
            }
        />
    );
};
