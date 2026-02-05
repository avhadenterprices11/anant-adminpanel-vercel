import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, FileText, Archive, Trash2 } from 'lucide-react';
import { DateRangePicker } from '@/components/forms/inputs/DateRangePicker';
import { ActionButtons, FiltersBar, GenericTable, type ColumnConfig, type SortOption } from '@/components/features/data-table';
import { MetricsGrid } from '@/components/features/metrics';

import { ROUTES } from '@/lib/constants';
import { notifyInfo } from '@/utils';
import { useSegmentsList } from '../hooks/useSegmentsList';
import { useSegmentMetrics } from '../hooks/useSegmentMetrics';
import { useSegmentColumns } from '../hooks/useSegmentColumns';
import type { CustomerSegment } from '../types/segment.types';

export default function CustomerSegmentsPage() {
    const navigate = useNavigate();
    const segmentsList = useSegmentsList();
    const columns = useSegmentColumns();
    const metricsData = useSegmentMetrics(segmentsList.metrics);
    const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
    const [selectedSegment, setSelectedSegment] = useState<CustomerSegment | null>(null);


    // Filter Configuration
    const statusFilterOptions = [
        { label: 'All Types', value: '', onSelect: () => segmentsList.setStatus(''), isActive: segmentsList.status === '' },
        { label: 'Distributor', value: 'distributor', onSelect: () => segmentsList.setStatus('distributor'), isActive: segmentsList.status === 'distributor' },
        { label: 'Retail', value: 'retail', onSelect: () => segmentsList.setStatus('retail'), isActive: segmentsList.status === 'retail' },
        { label: 'Wholesale', value: 'wholesale', onSelect: () => segmentsList.setStatus('wholesale'), isActive: segmentsList.status === 'wholesale' },
    ];

    // Sort Options
    const sortOptions: SortOption[] = [
        { label: 'Newest First', value: 'newest', direction: 'desc', isActive: segmentsList.sort === 'newest', onSelect: () => { segmentsList.setSort('newest'); segmentsList.setPage(1); } },
        { label: 'Oldest First', value: 'oldest', direction: 'asc', isActive: segmentsList.sort === 'oldest', onSelect: () => { segmentsList.setSort('oldest'); segmentsList.setPage(1); } },
        { label: 'Name (A-Z)', value: 'name_asc', direction: 'asc', isActive: segmentsList.sort === 'name_asc', onSelect: () => { segmentsList.setSort('name_asc'); segmentsList.setPage(1); } },
        { label: 'Name (Z-A)', value: 'name_desc', direction: 'desc', isActive: segmentsList.sort === 'name_desc', onSelect: () => { segmentsList.setSort('name_desc'); segmentsList.setPage(1); } },
        { label: 'Most Users', value: 'users_desc', direction: 'desc', isActive: segmentsList.sort === 'users_desc', onSelect: () => { segmentsList.setSort('users_desc'); segmentsList.setPage(1); } },
    ];

    // Actions Menu
    const actions = [
        {
            label: 'Duplicate Segment',
            icon: <Copy size={16} />,
            onClick: () => selectedSegment && notifyInfo(`Duplicating: ${selectedSegment.segmentName}`),
            disabled: !selectedSegmentId
        },
        {
            label: 'Export Users',
            icon: <FileText size={16} />,
            onClick: () => selectedSegment && notifyInfo(`Exporting users from: ${selectedSegment.segmentName}`),
            disabled: !selectedSegmentId
        },
        {
            label: 'Archive Segment',
            icon: <Archive size={16} />,
            onClick: () => selectedSegment && notifyInfo(`Archiving: ${selectedSegment.segmentName}`),
            disabled: !selectedSegmentId
        },
        {
            label: 'Delete Segment',
            icon: <Trash2 size={16} />,
            danger: true,
            onClick: () => selectedSegment && notifyInfo(`Deleting: ${selectedSegment.segmentName}`),
            disabled: !selectedSegmentId
        },
    ];

    // Handle checkbox selection
    const handleSelectionChange = (selectedRows: CustomerSegment[]) => {
        if (selectedRows.length > 0) {
            const firstSelected = selectedRows[0];
            setSelectedSegmentId(firstSelected.id);
            setSelectedSegment(firstSelected);
        } else {
            setSelectedSegmentId(null);
            setSelectedSegment(null);
        }
    };

    // Filter visible columns
    const filteredColumns = useMemo(
        () => columns.filter((col: ColumnConfig<CustomerSegment>) => segmentsList.visibleColumns.find((v: { key: string; visible: boolean }) => v.key === col.key)?.visible),
        [columns, segmentsList.visibleColumns]
    );

    return (
        <div className="flex flex-col gap-4 px-4 pb-6 pt-4 md:px-6 lg:px-8">
            {/* Date Range + Actions */}
            <div className="flex flex-col md:flex-row md:items-center items-start justify-between gap-4">
                <DateRangePicker value={segmentsList.dateRange} onChange={segmentsList.setDateRange} className="w-full md:w-auto" />
                <ActionButtons
                    primaryLabel="Create Segment"
                    primaryTo={ROUTES.CUSTOMER_SEGMENTS.CREATE}
                    onImport={async (data, mode) => { notifyInfo(`Importing ${data.length} customer segments in ${mode} mode`); }}
                    onExport={async () => { notifyInfo("Exporting customer segments"); }}
                    totalItems={segmentsList.total}
                    templateUrl="/templates/customer-segments-template.csv"
                />
            </div>

            {/* Metrics */}
            <MetricsGrid metrics={metricsData} />

            {/* Filters Bar */}
            <FiltersBar
                search={segmentsList.search}
                onSearchChange={(v) => { segmentsList.setSearch(v); segmentsList.setPage(1); }}
                filterGroups={[
                    {
                        id: 'status',
                        label: 'Status',
                        options: statusFilterOptions
                    }
                ]}
                sortOptions={sortOptions}
                visibleColumns={segmentsList.visibleColumns}
                onToggleColumn={segmentsList.toggleColumn}
                actions={actions}
                onClearFilters={segmentsList.clearFilters}
            />

            {/* Table */}
            <GenericTable<CustomerSegment>
                data={segmentsList.segments}
                loading={false}
                page={segmentsList.page}
                totalPages={segmentsList.totalPages}
                rowsPerPage={segmentsList.rowsPerPage}
                totalItems={segmentsList.total}
                onPageChange={segmentsList.setPage}
                onRowsPerPageChange={segmentsList.setRowsPerPage}
                getRowId={(row) => row.id}
                columns={filteredColumns}
                selectable={true}
                onSelectionChange={handleSelectionChange}
                sortKey={segmentsList.sort.split('_')[0] || ''}
                sortDirection={(segmentsList.sort.split('_')[1] as 'asc' | 'desc') || 'asc'}
                onSortChange={(key, direction) => {
                    segmentsList.setSort(`${key}_${direction}`);
                    segmentsList.setPage(1);
                }}
                forceTableOnMobile={true}
                onRowClick={(row) => {
                    setSelectedSegmentId(row.id);
                    setSelectedSegment(row);
                    navigate(ROUTES.CUSTOMER_SEGMENTS.DETAIL(row.id));
                }}
            />
        </div>
    );
}
