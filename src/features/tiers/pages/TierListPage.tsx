import React, { useMemo, useState, useCallback } from 'react';
import { Edit, Trash2, Layers, Users, TreePine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { DateRangePicker } from '@/components/forms/inputs/DateRangePicker';
import { ActionButtons, FiltersBar, GenericTable, type ColumnConfig } from '@/components/features/data-table';
import { MetricsGrid, type MetricItem } from '@/components/features/metrics';
import type { MobileRecordCardProps, SortOption } from '@/components/features/data-table';
import type { ImportMode } from '@/components/features/import-export/ImportDialog';

import type { Tier } from '../types/tier.types';
import { notifyInfo, notifySuccess, notifyError } from '@/utils';
import { ROUTES } from '@/lib/constants';
import { useTiers, QUERY_KEYS } from '../hooks/useTiers';
import { useQueryClient } from '@tanstack/react-query';
import { tierService } from '../services/tierService';
import {
  tierImportFields,
  tierExportColumns,
  tierTemplateUrl,
  tierModuleName
} from '../config/import-export.config';

interface DateRange {
  from?: Date;
  to?: Date;
}

/**
 * TierListPage Component
 * 
 * Main page component for tier management that provides a hierarchical
 * categorization system. Follows the same pattern as other list pages
 * in the application with DateRangePicker, ActionButtons, MetricsGrid, and FiltersBar.
 */
import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog';

/**
 * TierListPage Component
 * 
 * Main page component for tier management that provides a hierarchical
 * categorization system. Follows the same pattern as other list pages
 * in the application with DateRangePicker, ActionButtons, MetricsGrid, and FiltersBar.
 */
const TierListPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State management
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string[]>([]);
  const [tierLevel, setTierLevel] = useState<string[]>(['1']);
  const [usage, setUsage] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedTiers, setSelectedTiers] = useState<Tier[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('rowsPerPage');
      return stored ? Number(stored) : 10;
    }
    return 10;
  });
  const [sortKey, setSortKey] = useState<keyof Tier>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper to toggle selection
  const toggleFilter = (current: string[], value: string) => {
    if (value === "") return [];
    if (current.includes(value)) {
      return current.filter(c => c !== value);
    }
    return [...current, value];
  };

  // Filters for API
  const queryParams = useMemo(() => ({
    search: search || undefined,
    status: status.length > 0 ? status.join(',') : undefined,
    level: tierLevel.length > 0 ? tierLevel.join(',') : (search ? undefined : 1),
    usage: usage.length > 0 ? usage.join(',') : undefined
  }), [search, status, tierLevel, usage]);

  // Fetch with server-side filtering (for Table)
  const { data: tiers = [], isLoading } = useTiers(queryParams);

  // Fetch ALL tiers for Metrics (no filters) to get correct counts across all levels
  const { data: allTiers = [] } = useTiers({});

  // Metrics data
  const metrics: MetricItem[] = useMemo(() => [
    {
      title: 'Total Tiers',
      value: allTiers.length,
      tooltip: 'Total number of tiers across all levels',
      icon: Layers,
      iconBg: '#3B82F6',
    },
    {
      title: 'Tier 1 Categories',
      value: allTiers.filter(tier => tier.level === 1).length,
      tooltip: 'Number of top-level tier categories',
      icon: TreePine,
      iconBg: '#10B981',
    },
    {
      title: 'Active Tiers',
      value: allTiers.filter(tier => tier.status === 'active').length,
      tooltip: 'Number of active tiers',
      icon: Users,
      iconBg: '#8B5CF6',
    },
    {
      title: 'Inactive Tiers',
      value: allTiers.filter(tier => tier.status === 'inactive').length,
      tooltip: 'Number of inactive tiers',
      icon: Edit,
      iconBg: '#F59E0B',
    }
  ], [allTiers]);

  // Client-side sorting and filtering of fetched data
  const filteredTiers = useMemo(() => {
    let data = [...tiers];

    // Filter by date range if set
    if (dateRange?.from) {
      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0);

      data = data.filter((tier) => {
        if (!tier.createdAt) return false;
        const tierDate = new Date(tier.createdAt);
        tierDate.setHours(0, 0, 0, 0);

        if (dateRange.to) {
          const toDate = new Date(dateRange.to);
          toDate.setHours(23, 59, 59, 999);
          return tierDate >= fromDate && tierDate <= toDate;
        }

        // Single date - show tiers from that exact day
        return tierDate.getTime() === fromDate.getTime();
      });
    }

    return data.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (!aValue && !bValue) return 0;
      if (!aValue) return 1;
      if (!bValue) return -1;

      if (sortKey === 'createdAt' || sortKey === 'updatedAt') {
        return sortDirection === 'asc'
          ? new Date(aValue as string).getTime() - new Date(bValue as string).getTime()
          : new Date(bValue as string).getTime() - new Date(aValue as string).getTime();
      }

      const comparison = String(aValue).localeCompare(String(bValue));
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [tiers, sortKey, sortDirection, dateRange]);

  // Column configuration
  const columns: ColumnConfig<Tier>[] = useMemo(() => [
    {
      key: 'name',
      label: 'Tier Name',
      sortable: true,
      render: (_value: unknown, tier: Tier) => (
        <div>
          <button
            onClick={() => handleTierClick(tier)}
            className="font-medium text-slate-900 hover:text-[#0E042F] transition-colors text-left cursor-pointer"
          >
            {tier.name}
          </button>
          {tier.description && (
            <div className="text-sm text-slate-500 truncate max-w-[200px]">
              {tier.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'usageCount',
      label: 'Usage',
      sortable: true,
      render: (_value: unknown, tier: Tier) => (
        <span className="text-slate-700 font-medium">
          {tier.usageCount || 0} products
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (_value: unknown, tier: Tier) => {
        const statusStyles: Record<Tier['status'], string> = {
          active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          inactive: 'bg-slate-50 text-slate-700 border-slate-200'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs border ${statusStyles[tier.status]}`}>
            {tier.status}
          </span>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (_value: unknown, tier: Tier) => new Date(tier.createdAt || new Date()).toLocaleDateString(),
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      sortable: true,
      render: (_value: unknown, tier: Tier) => tier.updatedAt ? new Date(tier.updatedAt).toLocaleDateString() : '-',
    },
  ], [tiers]);

  // Visible columns state
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map(col => ({ key: col.key, label: col.label, visible: true }))
  );

  const toggleColumn = useCallback((key: string) => {
    setVisibleColumns(prev =>
      prev.map(col =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  }, []);

  // Filter options
  const statusFilterOptions = useMemo(() => [
    { label: "All Status", value: "", onSelect: () => setStatus([]), isActive: status.length === 0 },
    { label: "Active", value: "active", onSelect: () => setStatus(prev => toggleFilter(prev, "active")), isActive: status.includes("active") },
    { label: "Inactive", value: "inactive", onSelect: () => setStatus(prev => toggleFilter(prev, "inactive")), isActive: status.includes("inactive") },
  ], [status]);

  const levelFilterOptions = useMemo(() => [
    // { label: "All Levels", value: "", onSelect: () => setTierLevel([]), isActive: tierLevel.length === 0 },
    { label: "Level 1", value: "1", onSelect: () => setTierLevel(prev => toggleFilter(prev, "1")), isActive: tierLevel.includes("1") },
    { label: "Level 2", value: "2", onSelect: () => setTierLevel(prev => toggleFilter(prev, "2")), isActive: tierLevel.includes("2") },
    { label: "Level 3", value: "3", onSelect: () => setTierLevel(prev => toggleFilter(prev, "3")), isActive: tierLevel.includes("3") },
    { label: "Level 4", value: "4", onSelect: () => setTierLevel(prev => toggleFilter(prev, "4")), isActive: tierLevel.includes("4") },
  ], [tierLevel]);

  const usageFilterOptions = useMemo(() => [
    { label: "All Usage", value: "", onSelect: () => setUsage([]), isActive: usage.length === 0 },
    { label: "Used", value: "used", onSelect: () => setUsage(prev => toggleFilter(prev, "used")), isActive: usage.includes("used") },
    { label: "Unused", value: "unused", onSelect: () => setUsage(prev => toggleFilter(prev, "unused")), isActive: usage.includes("unused") },
  ], [usage]);

  // Sort options
  const sortOptions: SortOption[] = useMemo(() => [
    {
      label: "Newest First",
      value: "newest",
      direction: "desc",
      isActive: sortKey === "createdAt" && sortDirection === "desc",
      onSelect: () => {
        setSortKey("createdAt");
        setSortDirection("desc");
        setPage(1);
      },
    },
    {
      label: "Oldest First",
      value: "oldest",
      direction: "asc",
      isActive: sortKey === "createdAt" && sortDirection === "asc",
      onSelect: () => {
        setSortKey("createdAt");
        setSortDirection("asc");
        setPage(1);
      },
    },
    {
      label: "Name (A → Z)",
      value: "name_asc",
      direction: "asc",
      isActive: sortKey === "name" && sortDirection === "asc",
      onSelect: () => {
        setSortKey("name");
        setSortDirection("asc");
        setPage(1);
      },
    },
    {
      label: "Name (Z → A)",
      value: "name_desc",
      direction: "desc",
      isActive: sortKey === "name" && sortDirection === "desc",
      onSelect: () => {
        setSortKey("name");
        setSortDirection("desc");
        setPage(1);
      },
    },
  ], [sortKey, sortDirection]);

  // Actions menu
  // Handle bulk delete
  const handleBulkDelete = useCallback(() => {
    if (selectedTiers.length === 0) return;
    setShowDeleteDialog(true);
  }, [selectedTiers]);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const ids = selectedTiers.map(t => t.id);
      await tierService.bulkDeleteTiers(ids);
      notifyInfo(`Successfully deleted ${selectedTiers.length} tiers`);

      // Clear selection and refresh list
      setSelectedTiers([]);
      setShowDeleteDialog(false);
      window.location.reload();
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || error?.response?.data?.message || error.message || '';

      // If error is about sub-tiers, prompt for cascade
      if (message.includes('sub-tiers')) {
        // Close current dialog
        setShowDeleteDialog(false);
        // setShowCascadeDialog(true);
        notifyError('Cascade delete not implemented yet.');
      } else if (message.includes('assigned to products')) {
        // Explicitly handle "in use" error
        notifyError('Cannot delete: One or more tiers are assigned to products.');
      } else {
        notifyError(message || 'Failed to delete tiers');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  /*
  const [showCascadeDialog, setShowCascadeDialog] = useState(false);

  const handleCascadeDelete = async () => {
    setIsDeleting(true);
    try {
      const ids = selectedTiers.map(t => t.id);
      await tierService.bulkDeleteTiers(ids); // No second argument if we don't support it

      notifySuccess(`Successfully deleted tiers`);
      setSelectedTiers([]);
      setShowCascadeDialog(false);
      window.location.reload();
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || error?.response?.data?.message || error.message || '';
      notifyError(message || 'Failed to delete tiers');
    } finally {
      setIsDeleting(false);
    }
  };
  */

  // Actions menu
  const actions = useMemo(() => [
    {
      label: "Delete Tier",
      icon: <Trash2 size={16} />,
      danger: true,
      disabled: selectedTiers.length === 0,
      onClick: handleBulkDelete
    },
  ], [selectedTiers, handleBulkDelete]);

  // Handle tier name click to go to detail page
  const handleTierClick = useCallback((tier: Tier) => {
    navigate(`${ROUTES.TIERS?.DETAIL(tier.id) || `/tiers/${tier.id}`}`);
  }, [navigate]);

  // Mobile card render
  const renderMobileCard = useCallback((tier: Tier): MobileRecordCardProps => {
    const statusStyles: Record<Tier['status'], string> = {
      active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      inactive: 'bg-slate-50 text-slate-700 border-slate-200'
    };

    const parent = tier.parentId ? tiers.find((t: Tier) => t.id === tier.parentId)?.name : null;

    return {
      title: tier.name,
      subtitle: tier.description || '',
      primaryValue: `Level ${tier.level}`,
      badges: (
        <div className="flex gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-[10px] border ${statusStyles[tier.status]} capitalize`}>
            {tier.status}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] border bg-slate-100 text-slate-700">
            Level {tier.level}
          </span>
        </div>
      ),
      fields: [
        {
          label: "Parent",
          value: parent || "—",
        },
        {
          label: "Status",
          value: tier.status,
        },
        {
          label: "Created",
          value: new Date(tier.createdAt || new Date()).toLocaleDateString(),
        },
      ],
    };
  }, [handleTierClick, tiers]);

  const handleSelectionChange = useCallback((selected: Tier[]) => {
    setSelectedTiers(selected);
  }, []);

  // Filter visible columns
  const filteredColumns = useMemo(
    () => columns.filter(col => visibleColumns.find(v => v.key === col.key)?.visible),
    [columns, visibleColumns]
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredTiers.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedData = filteredTiers.slice(startIndex, startIndex + rowsPerPage);

  // Clear filters
  const clearFilters = useCallback(() => {
    setStatus([]);
    setTierLevel(['1']);
    setUsage([]);
    setSearch("");
    setDateRange(undefined);
    setPage(1);
    setSelectedTiers([]);
  }, []);

  return (
    <div className="px-9 lg:px-8 pb-8 lg:pb-8 pt-2 space-y-7">
      {/* Date Range + Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-auto">
            <DateRangePicker
              value={dateRange ? { from: dateRange.from ?? null, to: dateRange.to ?? null } : { from: null, to: null }}
              onChange={(val) => setDateRange(val.from ? { from: val.from, to: val.to ?? undefined } : undefined)}
            />
          </div>
        </div>

        <ActionButtons
          primaryLabel="Create Tier"
          primaryTo={ROUTES.TIERS?.CREATE || '/tiers/new'}
          moduleName={tierModuleName}
          importFields={tierImportFields}
          exportColumns={tierExportColumns}
          allowUpdate={true}
          supportsDateRange={true}
          selectedItems={selectedTiers}
          totalItems={filteredTiers.length}
          templateUrl={tierTemplateUrl}
          onImport={async (data: any[], mode: ImportMode) => {
            try {
              notifyInfo(`Importing ${data.length} tiers in ${mode} mode...`);

              // Map 'merge' to 'upsert' for backend
              const backendMode = mode;

              const result = await tierService.importTiers(data, backendMode);

              if (result.failed === 0 && result.skipped === 0) {
                notifySuccess(`Successfully imported ${result.success} tiers!`);
              } else {
                notifyInfo(
                  `Import completed: ${result.success} successful, ${result.skipped} skipped, ${result.failed} failed`
                );
              }

              // Refresh all tiers data (list and metrics)
              queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
            } catch (error: any) {
              notifyError(error?.message || 'Failed to import tiers');
              throw error;
            }
          }}
          onExport={async (options: any) => {
            const exportCount = options.scope === 'selected' ? selectedTiers.length : filteredTiers.length;
            notifyInfo(`Preparing export of ${exportCount} tiers...`);

            const exportOptions = {
              scope: options.scope,
              format: options.format,
              selectedIds: options.scope === 'selected' ? selectedTiers.map(tier => tier.id) : undefined,
              selectedColumns: options.selectedColumns,
              dateRange: options.dateRange ? {
                from: options.dateRange.from,
                to: options.dateRange.to,
              } : undefined,
            };

            const blob = await tierService.exportTiers(exportOptions);

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tiers-export-${new Date().toISOString().split('T')[0]}.${options.format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            notifySuccess(`Successfully exported ${exportCount} tiers!`);
          }}
        />
      </div>

      {/* Metrics */}
      <MetricsGrid metrics={metrics} />

      {/* Filters Bar */}
      <FiltersBar
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        filterGroups={[
          {
            id: 'status',
            label: 'Status',
            options: statusFilterOptions
          },
          {
            id: 'level',
            label: 'Level',
            options: levelFilterOptions
          },
          {
            id: 'usage',
            label: 'Usage',
            options: usageFilterOptions
          }
        ]}
        sortOptions={sortOptions}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
        actions={actions}
        onClearFilters={clearFilters}
      />

      {/* Table */}
      <GenericTable<Tier>
        data={paginatedData}
        columns={filteredColumns}
        loading={isLoading}
        page={page}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        totalItems={filteredTiers.length}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        getRowId={(tier) => tier.id}
        renderMobileCard={renderMobileCard}

        onRowClick={handleTierClick}
        selectable={true}
        onSelectionChange={handleSelectionChange}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={(key, direction) => {
          setSortKey(key as keyof Tier);
          setSortDirection(direction);
        }}
      />
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${selectedTiers.length} Tier(s)`}
        description="Are you sure you want to delete the selected tiers? This action cannot be undone."
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TierListPage;