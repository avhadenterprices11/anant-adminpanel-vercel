/**
 * Tag List Page
 * 
 * Overview page for managing tags using reusable components
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useTagList } from '../hooks/useTagList';
import { tagService } from '../services/tagService';
import { notifyInfo, notifySuccess, notifyError } from '@/utils';
import { DateRangePicker } from '@/components/forms/inputs/DateRangePicker';
import { ActionButtons, FiltersBar, GenericTable, type MobileRecordCardProps } from '@/components/features/data-table';
import type { ImportMode } from '@/components/features/import-export/ImportDialog';
import { MetricsGrid } from '@/components/features/metrics';
import { Badge } from '@/components/ui/badge';
import {
    tagImportFields,
    tagExportColumns,
    tagTemplateUrl,
    tagModuleName
} from '../config/import-export.config';

import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog';

const TagListPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedTags, setSelectedTags] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        tags,
        total,
        isLoading,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        search,
        setSearch,
        setType,
        status,
        setStatus,
        sort,
        setSort,
        visibleColumns,
        toggleColumn,
        metrics,
        refetch,
        dateRange,
        setDateRange,
        handleBulkDelete,
        typeFilterOptions,
        usageFilterOptions,
        setUsage
    } = useTagList();

    // Helper to toggle selection (local copy for status filter)
    const toggleFilter = (current: string[], value: string) => {
        if (value === "") return [];
        if (current.includes(value)) {
            return current.filter(c => c !== value);
        }
        return [...current, value];
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await handleBulkDelete(selectedTags);
            setSelectedTags([]);
            setSelectedIds([]);
            setShowDeleteDialog(false);
        } catch (error) {
            console.error('Failed to delete tags:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const actions = [
        // { label: 'Edit Tag', icon: <Pencil size={16} />, onClick: () => notifyInfo('Edit not implemented') },
        // { label: 'Activate Tags', icon: <ToggleRight size={16} />, onClick: () => notifyInfo('Activate not implemented') },
        // { label: 'Deactivate Tags', icon: <ToggleLeft size={16} />, onClick: () => notifyInfo('Deactivate not implemented') },
        {
            label: 'Delete Tags',
            icon: <Trash2 size={16} />,
            danger: true,
            onClick: () => setShowDeleteDialog(true),
            disabled: selectedTags.length === 0
        },
    ];

    // Derived sort state for GenericTable
    const currentSortKey = useMemo(() => {
        if (sort === 'name_asc' || sort === 'name_desc') return 'name';
        if (sort === 'usage_high' || sort === 'usage_low') return 'usage_count';
        if (sort === 'newest' || sort === 'oldest') {
            return visibleColumns.find(c => c.key === 'updated_at' && c.visible) ? 'updated_at' : 'created_at';
        }
        if (sort === 'updated_desc' || sort === 'updated_asc') return 'updated_at';
        if (sort === 'type_asc' || sort === 'type_desc') return 'type';
        if (sort === 'status_asc' || sort === 'status_desc') return 'status';
        return 'created_at'; // default
    }, [sort, visibleColumns]);

    const currentSortDirection = useMemo(() => {
        if (sort === 'name_asc' || sort === 'oldest' || sort === 'usage_low' || sort === 'updated_asc' || sort === 'type_asc' || sort === 'status_asc') return 'asc';
        return 'desc';
    }, [sort]);

    const handleSortChange = (key: string, direction: 'asc' | 'desc') => {
        if (key === 'name') {
            setSort(direction === 'asc' ? 'name_asc' : 'name_desc');
        } else if (key === 'usage_count') {
            setSort(direction === 'asc' ? 'usage_low' : 'usage_high');
        } else if (key === 'created_at') {
            setSort(direction === 'asc' ? 'oldest' : 'newest');
        } else if (key === 'updated_at') {
            setSort(direction === 'asc' ? 'updated_asc' : 'updated_desc');
        } else if (key === 'type') {
            setSort(direction === 'asc' ? 'type_asc' : 'type_desc');
        } else if (key === 'status') {
            setSort(direction === 'asc' ? 'status_asc' : 'status_desc');
        }
        setPage(1);
    };

    const renderMobileCard = useCallback((row: any): MobileRecordCardProps => {
        const statusValue = row.status ? 'active' : 'inactive';
        const statusStyles = {
            active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            inactive: 'bg-slate-50 text-slate-700 border-slate-200'
        };
        return {
            title: row.name,
            subtitle: row.type,
            primaryValue: `${row.usage_count || 0} uses`,
            badges: (
                <span className={`px-2 py-0.5 rounded-full text-[10px] border ${statusStyles[statusValue]} capitalize`}>
                    {statusValue}
                </span>
            ),
            fields: [
                {
                    label: "Type",
                    value: row.type || "—",
                },
                {
                    label: "Updated",
                    value: new Date(row.updated_at).toLocaleDateString(),
                }
            ],
        };
    }, []);

    return (
        <div className="px-9 lg:px-8 pb-8 lg:pb-8 pt-2 space-y-7">
            {/* Date range + Actions */}
            <div className="flex justify-between items-center">
                <DateRangePicker
                    value={dateRange || { from: null, to: null }}
                    onChange={setDateRange}
                    className="w-full md:w-auto"
                />

                <ActionButtons
                    primaryLabel="Create Tag"
                    primaryTo="/tags/new"
                    moduleName={tagModuleName}
                    importFields={tagImportFields}
                    exportColumns={tagExportColumns}
                    allowUpdate={true}
                    supportsDateRange={true}
                    selectedItems={selectedTags}
                    totalItems={total}
                    templateUrl={tagTemplateUrl}
                    onImport={async (data: any[], mode: ImportMode) => {
                        try {
                            notifyInfo(`Importing ${data.length} tags in ${mode} mode...`);

                            // Map 'merge' to 'upsert' for backend
                            const backendMode = mode;

                            const result = await tagService.importTags(data, backendMode);

                            if (result.failed === 0 && result.skipped === 0) {
                                notifySuccess(`Successfully imported ${result.success} tags!`);
                            } else {
                                notifyInfo(
                                    `Import completed: ${result.success} successful, ${result.skipped} skipped, ${result.failed} failed`
                                );
                            }

                            // Refresh the tag list
                            refetch();
                        } catch (error: any) {
                            notifyError(error?.message || 'Failed to import tags');
                            throw error; // Re-throw so ImportDialog can show error
                        }
                    }}
                    onExport={async (options: any) => {
                        const exportCount = options.scope === 'selected' ? selectedTags.length : total;
                        notifyInfo(`Preparing export of ${exportCount} tags...`);

                        // Prepare export options
                        const exportOptions = {
                            scope: options.scope,
                            format: options.format,
                            selectedIds: options.scope === 'selected' ? selectedTags.map((tag: any) => tag.id) : undefined,
                            selectedColumns: options.selectedColumns,
                            dateRange: options.dateRange ? {
                                from: options.dateRange.from,
                                to: options.dateRange.to,
                            } : undefined,
                        };

                        // Call export API - let errors propagate to ExportDialog
                        const blob = await tagService.exportTags(exportOptions);

                        // Create download link
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `tags-export-${new Date().toISOString().split('T')[0]}.${options.format}`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);

                        notifySuccess(`Successfully exported ${exportCount} tags!`);
                    }}
                />
            </div>

            {/* Metrics */}
            <MetricsGrid metrics={metrics} />

            {/* Filters Bar */}
            <FiltersBar
                search={search}
                onSearchChange={(v) => {
                    setSearch(v);
                    setPage(1);
                }}
                filterGroups={[
                    {
                        id: 'status',
                        label: 'Status',
                        options: [
                            { label: 'All Status', value: '', onSelect: () => setStatus([]), isActive: status.length === 0 },
                            { label: 'Active', value: 'active', onSelect: () => setStatus(toggleFilter(status, 'active')), isActive: status.includes('active') },
                            { label: 'Inactive', value: 'inactive', onSelect: () => setStatus(toggleFilter(status, 'inactive')), isActive: status.includes('inactive') },
                        ]
                    },
                    {
                        id: 'type',
                        label: 'Type',
                        options: typeFilterOptions
                    },
                    {
                        id: 'usage',
                        label: 'Usage',
                        options: usageFilterOptions
                    }
                ]}
                sortOptions={[
                    /*
                    {
                        label: 'Newest First',
                        value: 'newest',
                        direction: 'desc',
                        isActive: sort === 'newest',
                        onSelect: () => {
                            setSort('newest');
                            setPage(1);
                        },
                    },
                    {
                        label: 'Oldest First',
                        value: 'oldest',
                        direction: 'asc',
                        isActive: sort === 'oldest',
                        onSelect: () => {
                            setSort('oldest');
                            setPage(1);
                        },
                    },
                    */
                    {
                        label: 'Newest First', // Was Last Updated
                        value: 'updated_desc',
                        direction: 'desc',
                        isActive: sort === 'updated_desc',
                        onSelect: () => {
                            setSort('updated_desc');
                            setPage(1);
                        },
                    },
                    {
                        label: 'Oldest First', // Was Last Updated
                        value: 'updated_asc',
                        direction: 'asc',
                        isActive: sort === 'updated_asc',
                        onSelect: () => {
                            setSort('updated_asc');
                            setPage(1);
                        },
                    },
                    {
                        label: 'Name (A-Z)',
                        value: 'name_asc',
                        direction: 'asc',
                        isActive: sort === 'name_asc',
                        onSelect: () => {
                            setSort('name_asc');
                            setPage(1);
                        },
                    },
                    {
                        label: 'Name (Z-A)',
                        value: 'name_desc',
                        direction: 'desc',
                        isActive: sort === 'name_desc',
                        onSelect: () => {
                            setSort('name_desc');
                            setPage(1);
                        },
                    },
                ]}
                visibleColumns={visibleColumns}
                onToggleColumn={toggleColumn}
                actions={actions}
                onClearFilters={() => {
                    setStatus([]);
                    setSearch('');
                    setSort('');
                    setType([]);
                    setUsage([]);
                    setDateRange(undefined);
                    setPage(1);
                }}
            />

            {/* Table */}
            <GenericTable
                data={tags}
                loading={isLoading}
                page={page}
                totalPages={Math.ceil(total / rowsPerPage)}
                rowsPerPage={rowsPerPage}
                totalItems={total}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                onSelectionChange={setSelectedTags}
                externalSelectionIds={selectedIds}
                onSelectionIdsChange={setSelectedIds}
                sortKey={currentSortKey}
                sortDirection={currentSortDirection as 'asc' | 'desc'}
                onSortChange={handleSortChange}
                getRowId={(row) => row.id}
                columns={visibleColumns
                    .filter((c) => c.visible)
                    .map((c) => ({
                        key: c.key,
                        label: c.label,
                        sortable: ['name', 'usage_count', 'updated_at', 'created_at', 'type', 'status'].includes(c.key),
                        render: (value, row) => {
                            if (c.key === 'status') {
                                const statusValue = row.status ? 'active' : 'inactive';
                                const statusStyles = {
                                    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                                    inactive: 'bg-slate-50 text-slate-700 border-slate-200'
                                };
                                return (
                                    <span className={`px-2 py-1 rounded-full text-xs border ${statusStyles[statusValue]} capitalize`}>
                                        {statusValue}
                                    </span>
                                );
                            }
                            if (c.key === 'type') {
                                return (
                                    <Badge variant="outline" className="capitalize">
                                        {row.type}
                                    </Badge>
                                );
                            }
                            if (c.key === 'usage_count') {
                                return <span className="font-medium">{row.usage_count || 0}</span>;
                            }
                            if (c.key === 'updated_at' || c.key === 'created_at') {
                                return <span className="text-sm text-gray-600">{new Date(row[c.key as keyof typeof row] as string).toLocaleDateString()}</span>;
                            }
                            return <span className="text-sm">{String(value || '')}</span>;
                        }
                    }))}
                onRowClick={(row) => navigate(`/tags/${row.id}`)}
                renderMobileCard={renderMobileCard}
            />

            <ConfirmationDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleConfirmDelete}
                title={`Delete ${selectedTags.length} Tag(s)`}
                description="Are you sure you want to delete the selected tags? This action cannot be undone."
                confirmText={isDeleting ? "Deleting..." : "Delete"}
                cancelText="Cancel"
                variant="destructive"
                isLoading={isDeleting}
            />
        </div>
    );
};

export default TagListPage;
