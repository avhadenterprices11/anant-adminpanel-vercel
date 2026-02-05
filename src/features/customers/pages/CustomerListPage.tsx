import React from 'react';
import { notifyInfo, notifySuccess, notifyError } from '@/utils';
import { DateRangePicker } from '@/components/forms/inputs/DateRangePicker';
import { ActionButtons } from '@/components/features/data-table';
import type { ImportMode, ExportOptions } from '@/components/features/import-export';
import { MetricsGrid } from '@/components/features/metrics';
import { useCustomerList } from '../hooks/useCustomerList';
import { customerService } from '../services/customerService';
import {
  customerImportFields,
  customerExportColumns,
  customerTemplateUrl,
  customerModuleName
} from '../config/import-export.config';
import CustomerListTable from '../components/CustomerListTable';
import CustomerListFilters from '../components/CustomerListFilters';

import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog';

// Main Customer List Page Component
const CustomerListPage: React.FC = () => {
  const {
    dateRange,
    setDateRange,
    search,
    setSearch,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    sort,
    customers,
    total,
    totalPages,
    metrics,
    onClearFilters,
    visibleColumns,
    toggleColumn,
    filteredColumns,
    renderMobileCard,
    handleSortChange,
    statusFilterOptions,
    genderFilterOptions,
    dateFilterOptions,
    ordersFilterOptions,
    tagsFilterOptions,
    sortOptions,
    actions,
    handleSelectionChange,
    refetch,
    showDeleteDialog,
    setShowDeleteDialog,
    isDeleting,
    handleConfirmDelete,
    selectedCustomers,
    selectedCustomerIds,
    handleSelectionIdsChange
  } = useCustomerList();

  // ============================================
  // Import Handler
  // ============================================
  const handleImport = async (data: any[], mode: ImportMode) => {
    try {
      // ImportMode is 'create' | 'update' | 'upsert'
      const result = await customerService.importCustomers(data, mode);

      const { success, failed, errors } = result;

      if (failed > 0) {
        const errorMsg = errors.slice(0, 3).map((e: any) =>
          `Row ${e.row} (${e.email || 'Unknown'}): ${e.error}`
        ).join('; ');
        notifyError(`Import completed with errors: ${success} succeeded, ${failed} failed. ${errorMsg}`);
      } else {
        notifySuccess(`Successfully imported ${success} customer(s)`);
      }

      // Refetch customers after import
      refetch();
    } catch (error: any) {
      notifyError(error?.message || 'Failed to import customers');
    }
  };

  // ============================================
  // Export Handler (Placeholder)
  // ============================================
  // ============================================
  // Export Handler
  // ============================================
  const handleExport = async (options: ExportOptions) => {
    const exportCount = options.scope === 'selected' ? (options.selectedIds?.length || 0) : total;
    notifyInfo(options.scope === 'selected'
      ? `Preparing export of ${exportCount} customers...`
      : `Preparing export of all customers...`
    );

    try {
      const blob = await customerService.exportCustomers({
        scope: (options.scope === 'current' ? 'all' : options.scope) as 'all' | 'selected',
        format: options.format as 'csv' | 'xlsx', // Cast explicitly
        selectedIds: options.selectedIds,
        selectedColumns: options.selectedColumns,
        dateRange: options.dateRange ? {
          from: options.dateRange.from,
          to: options.dateRange.to
        } : undefined
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customers-export-${new Date().toISOString().split('T')[0]}.${options.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      notifySuccess(options.scope === 'selected' ? `Successfully exported ${exportCount} customers!` : 'Successfully exported customers!');
    } catch (error: any) {
      notifyError(error?.message || 'Failed to export customers');
    }
  };

  return (
    <div className="px-9 lg:px-8 pb-8 lg:pb-8 pt-2 space-y-7">
      <div className="flex justify-between items-center">
        <DateRangePicker value={dateRange} onChange={setDateRange} />
        <ActionButtons
          primaryLabel="Create Customer"
          primaryTo="/customers/new"
          onImport={handleImport}
          onExport={handleExport}
          importFields={customerImportFields}
          exportColumns={customerExportColumns}
          templateUrl={customerTemplateUrl}
          moduleName={customerModuleName}
          totalItems={total}
          supportsDateRange={true}
          allowUpdate={true}
        />
      </div>

      <MetricsGrid metrics={metrics} />

      <CustomerListFilters
        search={search}
        page={page}
        onSearchChange={setSearch}
        setPage={setPage}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
        onClearFilters={onClearFilters}
        statusFilterOptions={statusFilterOptions}
        genderFilterOptions={genderFilterOptions}
        dateFilterOptions={dateFilterOptions}
        ordersFilterOptions={ordersFilterOptions}
        tagsFilterOptions={tagsFilterOptions}
        sortOptions={sortOptions}
        actions={actions}
      />

      <CustomerListTable
        customers={customers}
        page={page}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        total={total}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        sort={sort}
        onSortChange={handleSortChange}
        filteredColumns={filteredColumns}
        renderMobileCard={renderMobileCard}
        onSelectionChange={handleSelectionChange}
        selectedCustomerIds={selectedCustomerIds}
        onSelectionIdsChange={handleSelectionIdsChange}
      />

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${selectedCustomers.length} Customer(s)`}
        description="Are you sure you want to delete the selected customers? This action cannot be undone."
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default CustomerListPage;
