
import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Copy,
    XCircle
} from 'lucide-react';
import { useProductList } from "../hooks/useProductList";
import { useTiers } from "@/features/tiers/hooks/useTiers";
// import { notifyInfo } from "@/utils"; // Removed duplicate
import { DateRangePicker } from '@/components/forms/inputs/DateRangePicker';
import { ActionButtons, FiltersBar, GenericTable, type MobileRecordCardProps } from "@/components/features/data-table";
import { MetricsGrid } from "@/components/features/metrics";
import { ROUTES } from "@/lib/constants";
import { useBulkDeleteProducts, useDuplicateProducts } from "../hooks/useProducts";
import { ConfirmationDialog } from "@/components/dialogs/ConfirmationDialog";
import {
    productImportFields,
    productExportColumns,
    productTemplateUrl,
    productModuleName
} from "../config/import-export.config";
import { productService } from "../services/productService";
import { notifySuccess, notifyError, notifyInfo } from "@/utils";

const ProductListPage: React.FC = () => {
    const navigate = useNavigate();

    const {
        products,
        total,
        isLoading,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        search,
        setSearch,
        status,
        setStatus,
        dateRange,
        setDateRange,
        sort,
        setSort,
        sortBy,
        sortOrder,
        onSortChange,
        quickFilters,
        setQuickFilters,
        category,
        setCategory,
        visibleColumns,
        toggleColumn,
        metrics,
        resetFilters
    } = useProductList();

    // Track selected rows for bulk actions
    const [selectedRows, setSelectedRows] = React.useState<any[]>([]);
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

    // Dialog state
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

    const bulkDeleteMutation = useBulkDeleteProducts();

    const duplicateProductMutation = useDuplicateProducts();

    const { data: tiersData } = useTiers({ level: 1, status: 'active' });
    const tiers = tiersData || [];

    const handleDeleteClick = () => {
        if (selectedRows.length === 0) return;
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = () => {
        const ids = selectedRows.map(row => row.id);

        bulkDeleteMutation.mutate(ids, {
            onSuccess: () => {
                setShowDeleteDialog(false);
                setSelectedRows([]); // Clear selection after delete
                setSelectedIds([]); // Clear selection IDs
            }
        });
    };

    const handleDuplicateProducts = () => {
        if (selectedRows.length === 0) return;

        const ids = selectedRows.map(row => row.id);
        duplicateProductMutation.mutate(ids, {
            onSuccess: () => {
                setSelectedIds([]); // Clear selection IDs
                setSelectedRows([]); // Clear selection
            }
        });
    };





    const actions = [
        {
            label: "Duplicate Product",
            icon: <Copy size={16} />,
            disabled: selectedRows.length === 0,
            onClick: handleDuplicateProducts
        },
        {
            label: "Delete Product",
            icon: <XCircle size={16} />,
            danger: true,
            disabled: selectedRows.length === 0,
            onClick: handleDeleteClick
        },
    ];

    const renderMobileCard = React.useCallback((row: any): MobileRecordCardProps => {
        const statusStr = (row.status || "").toLowerCase();
        const badgeStyle = statusStr === "active"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : statusStr === "draft"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-gray-100 text-gray-600 border-gray-200";

        return {
            title: row.product_title,
            subtitle: row.sku || row.id,
            primaryValue: row.selling_price ? `₹${row.selling_price}` : undefined,
            imageUrl: row.primary_image_url || undefined,
            badges: (
                <span className={`px-2 py-0.5 rounded-full text-[10px] border ${badgeStyle} capitalize`}>
                    {row.status || "—"}
                </span>
            ),
            fields: [
                {
                    label: "Stock",
                    value: String(row.total_stock ?? 0),
                },
                {
                    label: "Category",
                    value: row.category_tier_1 ? (tiers.find((t: any) => t.id === row.category_tier_1)?.name || "—") : "—",
                },
                {
                    label: "Updated",
                    value: row.updated_at ? new Date(row.updated_at).toLocaleDateString() : "—",
                },
            ],
        };
    }, [tiers]);

    return (
        <div className="px-9 lg:px-8 pb-8 lg:pb-8 pt-2 space-y-7">
            {/* Date range + Actions */}
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
                    primaryLabel="Create Product"
                    primaryTo="/products/add"
                    moduleName={productModuleName}
                    importFields={productImportFields}
                    exportColumns={productExportColumns}
                    allowUpdate={true}
                    supportsDateRange={true}
                    selectedItems={selectedRows}
                    totalItems={total}
                    templateUrl={productTemplateUrl}
                    onImport={async (data: any[], mode: string) => {
                        try {
                            notifyInfo(`Importing ${data.length} products in ${mode} mode...`);

                            const result = await productService.importProducts(data, mode as any);

                            if (result.failed === 0 && result.skipped === 0) {
                                notifySuccess(`Successfully imported ${result.success} products!`);
                            } else {
                                notifyInfo(
                                    `Import completed: ${result.success} successful, ${result.skipped} skipped, ${result.failed} failed`
                                );
                            }

                            // Refresh list - force refresh by resetting page or invalidating query
                            // useProductList uses useQuery, so simple refetch would be best, 
                            // but we don't have direct refetch exposed from useProductList.
                            // Resetting filter triggers effect effectively.
                            setPage(1);

                        } catch (error: any) {
                            notifyError(error?.message || 'Failed to import products');
                            throw error;
                        }
                    }}
                    onExport={async (options: any) => {
                        const exportCount = options.scope === 'selected' ? selectedRows.length : total;
                        notifyInfo(`Preparing export of ${exportCount} products...`);

                        // Derive stockStatus for export
                        const stockStatus: string[] = [];
                        if (quickFilters.includes('low-stock')) stockStatus.push('low_stock');
                        if (quickFilters.includes('zero-available')) stockStatus.push('out_of_stock');

                        const exportOptions = {
                            scope: options.scope,
                            format: options.format,
                            selectedIds: options.scope === 'selected' ? selectedRows.map((row: any) => row.id) : undefined,
                            selectedColumns: options.selectedColumns,
                            dateRange: options.dateRange ? {
                                from: options.dateRange.from,
                                to: options.dateRange.to,
                            } : undefined,
                            status: status || undefined,
                            stockStatus: stockStatus.length > 0 ? stockStatus : undefined,
                            categoryId: category || undefined,
                            search: search || undefined
                        };

                        const blob = await productService.exportProducts(exportOptions as any);

                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `products-export-${new Date().toISOString().split('T')[0]}.${options.format}`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);

                        notifySuccess(`Successfully exported ${exportCount} products!`);
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
                        id: "status",
                        label: "Status",
                        options: [
                            {
                                label: "All Status",
                                value: "",
                                onSelect: () => { setStatus([]); setPage(1); },
                                isActive: status.length === 0
                            },
                            {
                                label: "Active",
                                value: "active",
                                onSelect: () => {
                                    const newStatus = status.includes("active")
                                        ? status.filter(s => s !== "active")
                                        : [...status, "active"];
                                    setStatus(newStatus);
                                    setPage(1);
                                },
                                isActive: status.includes("active")
                            },
                            {
                                label: "Draft",
                                value: "draft",
                                onSelect: () => {
                                    const newStatus = status.includes("draft")
                                        ? status.filter(s => s !== "draft")
                                        : [...status, "draft"];
                                    setStatus(newStatus);
                                    setPage(1);
                                },
                                isActive: status.includes("draft")
                            },
                            {
                                label: "Archived",
                                value: "archived",
                                onSelect: () => {
                                    const newStatus = status.includes("archived")
                                        ? status.filter(s => s !== "archived")
                                        : [...status, "archived"];
                                    setStatus(newStatus);
                                    setPage(1);
                                },
                                isActive: status.includes("archived")
                            },
                        ]
                    },
                    {
                        id: "quick",
                        label: "Quick Filters",
                        options: [
                            {
                                label: "All Products",
                                value: "",
                                onSelect: () => { setQuickFilters([]); setPage(1); },
                                isActive: quickFilters.length === 0
                            },
                            {
                                label: "Low Stock",
                                value: "low-stock",
                                onSelect: () => {
                                    const newFilters = quickFilters.includes("low-stock")
                                        ? quickFilters.filter(f => f !== "low-stock")
                                        : [...quickFilters, "low-stock"];
                                    setQuickFilters(newFilters);
                                    setPage(1);
                                },
                                isActive: quickFilters.includes("low-stock")
                            },
                            {
                                label: "Zero Available",
                                value: "zero-available",
                                onSelect: () => {
                                    const newFilters = quickFilters.includes("zero-available")
                                        ? quickFilters.filter(f => f !== "zero-available")
                                        : [...quickFilters, "zero-available"];
                                    setQuickFilters(newFilters);
                                    setPage(1);
                                },
                                isActive: quickFilters.includes("zero-available")
                            },
                            // { 
                            //     label: "Blocked > 0", 
                            //     value: "blocked", 
                            //     onSelect: () => { ... }, 
                            //     isActive: quickFilters.includes("blocked") 
                            // },
                            {
                                label: "Recently Updated",
                                value: "recently-updated",
                                onSelect: () => {
                                    const newFilters = quickFilters.includes("recently-updated")
                                        ? quickFilters.filter(f => f !== "recently-updated")
                                        : [...quickFilters, "recently-updated"];
                                    setQuickFilters(newFilters);
                                    setPage(1);
                                },
                                isActive: quickFilters.includes("recently-updated")
                            },
                        ]
                    },
                    {
                        id: "category",
                        label: "Category",
                        options: [
                            {
                                label: "All Categories",
                                value: "",
                                onSelect: () => { setCategory([]); setPage(1); },
                                isActive: category.length === 0
                            },
                            ...tiers.map(t => ({
                                label: t.name,
                                value: t.id,
                                onSelect: () => {
                                    const newCategory = category.includes(t.id)
                                        ? category.filter(c => c !== t.id)
                                        : [...category, t.id];
                                    setCategory(newCategory);
                                    setPage(1);
                                },
                                isActive: category.includes(t.id)
                            }))
                        ]
                    }
                ]}
                sortOptions={[
                    { label: "Newest First", value: "newest", direction: "desc", isActive: sort === "newest", onSelect: () => { setSort("newest"); setPage(1); } },
                    { label: "Oldest First", value: "oldest", direction: "asc", isActive: sort === "oldest", onSelect: () => { setSort("oldest"); setPage(1); } },
                    { label: "Price (High-Low)", value: "price_desc", direction: "desc", isActive: sort === "price_desc", onSelect: () => { setSort("price_desc"); setPage(1); } },
                    { label: "Price (Low-High)", value: "price_asc", direction: "asc", isActive: sort === "price_asc", onSelect: () => { setSort("price_asc"); setPage(1); } },
                ]}
                visibleColumns={visibleColumns}
                onToggleColumn={toggleColumn}
                actions={actions}
                onClearFilters={resetFilters}
            />

            {/* Table */}
            <GenericTable
                data={products}
                loading={isLoading}
                externalSelectionIds={selectedIds}
                onSelectionIdsChange={setSelectedIds}
                onSelectionChange={setSelectedRows}
                page={page}
                totalPages={Math.ceil(total / rowsPerPage)}
                rowsPerPage={rowsPerPage}
                totalItems={total}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                getRowId={(row) => row.id}
                columns={visibleColumns.filter((c: { visible: boolean }) => c.visible).map((c: { key: string; label: string }) => {
                    let type: "text" | "number" | "currency" | "date" | "badge" | "image" = "text";
                    let className = "";
                    let render: ((value: any, row: any) => React.ReactNode) | undefined;

                    if (c.key === 'product_title') {
                        className = ""; // Let the render function handle width
                        render = (value: any) => (
                            <div className="w-[200px]">
                                <p className="font-medium text-slate-700 truncate" title={value}>{value}</p>
                            </div>
                        );
                    } else if (c.key === 'status') {
                        type = 'badge';
                        className = "w-auto whitespace-nowrap";
                    } else if (c.key === 'selling_price' || c.key === 'cost_price' || c.key === 'compare_at_price') {
                        type = 'currency';
                        className = "w-auto whitespace-nowrap";
                    } else if (c.key === 'total_stock') {
                        className = "w-auto whitespace-nowrap";
                        render = (value: any) => (
                            <span className="font-medium text-slate-700">
                                {value ?? 0}
                            </span>
                        );
                    } else if (c.key === 'featured') {
                        type = 'badge';
                        className = "w-auto whitespace-nowrap";
                    } else if (c.key === 'sku' || c.key === 'barcode' || c.key === 'hsn_code') {
                        className = "min-w-[100px] max-w-[200px] truncate";
                    } else if (c.key === 'primary_image_url') {
                        type = 'image';
                        className = "w-[60px]";
                    } else if (c.key === 'category_tier_1') {
                        className = "min-w-[120px] max-w-[200px] truncate text-slate-600";
                        render = (value: any) => {
                            const category = tiers.find(t => t.id === value);
                            return category ? category.name : "—";
                        };
                    } else if (c.key === 'tags') {
                        // FIX: Allow tags to flexible
                        className = "min-w-[150px]";
                        render = (value: any) => {
                            if (!Array.isArray(value) || value.length === 0) return "—";
                            return (
                                <div className="flex flex-wrap gap-1">
                                    {value.slice(0, 3).map((tag: string, idx: number) => (
                                        <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] uppercase border border-slate-200">
                                            {tag}
                                        </span>
                                    ))}
                                    {value.length > 3 && <span className="text-[10px] text-slate-400">+{value.length - 3}</span>}
                                </div>
                            );
                        };
                    }

                    if (c.key === 'created_at' || c.key === 'updated_at') {
                        type = 'date';
                        className = "w-auto whitespace-nowrap";
                    }

                    const nonSortableKeys = ['barcode', 'hsn_code', 'primary_image_url', 'weight', 'tags'];

                    return {
                        key: c.key,
                        label: c.label,
                        sortable: !nonSortableKeys.includes(c.key),
                        type,
                        className,
                        render
                    };
                })}
                sortKey={sortBy}
                sortDirection={sortOrder}
                onSortChange={onSortChange}
                onRowClick={(row) => navigate(ROUTES.PRODUCTS.DETAIL(row.id))}
                renderMobileCard={renderMobileCard}
            />

            <ConfirmationDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleConfirmDelete}
                title={`Delete ${selectedRows.length} Product(s)`}
                description="Are you sure you want to delete the selected products? This action cannot be undone."
                confirmText={bulkDeleteMutation.isPending ? "Deleting..." : "Delete"}
                cancelText="Cancel"
                variant="destructive"
                isLoading={bulkDeleteMutation.isPending}
            />
        </div>
    );
};

export default ProductListPage;
