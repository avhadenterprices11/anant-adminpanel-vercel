import React, { useMemo, useCallback } from "react";
import { Copy, Printer, Pencil, Archive, Trash2 } from "lucide-react";

import { DateRangePicker } from "@/components/forms/inputs/DateRangePicker";
import { ActionButtons } from "@/components/features/data-table";
import { MetricsGrid } from "@/components/features/metrics";
import { FiltersBar, type SortOption } from "@/components/features/data-table";
import { GenericTable, type ColumnConfig } from "@/components/features/data-table";
import type { MobileRecordCardProps } from "@/components/features/data-table";

import { useCollectionsList, useCollectionMetrics, useCollectionColumns } from "../hooks";
import type { Collection } from "../types/collection.types";
import { notifyInfo } from "@/utils";

const CollectionListPage: React.FC = () => {
    const collectionsList = useCollectionsList();
    const columns = useCollectionColumns();
    const metricsData = useCollectionMetrics(collectionsList.metrics);

    // Filter Configuration
    const statusFilterOptions = useMemo(() => [
        { label: "All Status", value: "", onSelect: () => collectionsList.setStatus(""), isActive: collectionsList.status === "" },
        { label: "Active", value: "active", onSelect: () => collectionsList.setStatus("active"), isActive: collectionsList.status === "active" },
        { label: "Inactive", value: "inactive", onSelect: () => collectionsList.setStatus("inactive"), isActive: collectionsList.status === "inactive" },
    ], [collectionsList]);

    const typeFilterOptions = useMemo(() => [
        { label: "All Types", value: "", onSelect: () => collectionsList.setCollectionType(""), isActive: collectionsList.collectionType === "" },
        { label: "Automated", value: "automated", onSelect: () => collectionsList.setCollectionType("automated"), isActive: collectionsList.collectionType === "automated" },
        { label: "Manual", value: "manual", onSelect: () => collectionsList.setCollectionType("manual"), isActive: collectionsList.collectionType === "manual" },
    ], [collectionsList]);

    // Sort Options
    const sortOptions: SortOption[] = useMemo(() => [
        {
            label: "Newest First",
            value: "newest",
            direction: "desc",
            isActive: collectionsList.sortKey === "createdAt" && collectionsList.sortDirection === "desc",
            onSelect: () => {
                collectionsList.setSortKey("createdAt");
                collectionsList.setSortDirection("desc");
                collectionsList.setPage(1);
            },
        },
        {
            label: "Oldest First",
            value: "oldest",
            direction: "asc",
            isActive: collectionsList.sortKey === "createdAt" && collectionsList.sortDirection === "asc",
            onSelect: () => {
                collectionsList.setSortKey("createdAt");
                collectionsList.setSortDirection("asc");
                collectionsList.setPage(1);
            },
        },
        {
            label: "Title (A → Z)",
            value: "title_asc",
            direction: "asc",
            isActive: collectionsList.sortKey === "title" && collectionsList.sortDirection === "asc",
            onSelect: () => {
                collectionsList.setSortKey("title");
                collectionsList.setSortDirection("asc");
                collectionsList.setPage(1);
            },
        },
        {
            label: "Title (Z → A)",
            value: "title_desc",
            direction: "desc",
            isActive: collectionsList.sortKey === "title" && collectionsList.sortDirection === "desc",
            onSelect: () => {
                collectionsList.setSortKey("title");
                collectionsList.setSortDirection("desc");
                collectionsList.setPage(1);
            },
        },
        {
            label: "Products (Low → High)",
            value: "products_asc",
            direction: "asc",
            isActive: collectionsList.sortKey === "productCount" && collectionsList.sortDirection === "asc",
            onSelect: () => {
                collectionsList.setSortKey("productCount");
                collectionsList.setSortDirection("asc");
                collectionsList.setPage(1);
            },
        },
        {
            label: "Products (High → Low)",
            value: "products_desc",
            direction: "desc",
            isActive: collectionsList.sortKey === "productCount" && collectionsList.sortDirection === "desc",
            onSelect: () => {
                collectionsList.setSortKey("productCount");
                collectionsList.setSortDirection("desc");
                collectionsList.setPage(1);
            },
        },
    ], [collectionsList]);

    // Filter visible columns
    const filteredColumns = useMemo(
        () => columns.filter((col: ColumnConfig<Collection>) => collectionsList.visibleColumns.find((v: { key: string; visible: boolean }) => v.key === col.key)?.visible),
        [columns, collectionsList.visibleColumns]
    );

    // Actions Menu
    const actions = useMemo(() => [
        { label: "Duplicate Collection", icon: <Copy size={16} />, onClick: () => notifyInfo("Feature not implemented yet") },
        { label: "Print Details", icon: <Printer size={16} />, onClick: () => notifyInfo("Feature not implemented yet") },
        { label: "Edit Collection", icon: <Pencil size={16} />, onClick: () => notifyInfo("Feature not implemented yet") },
        { label: "Archive Collection", icon: <Archive size={16} />, onClick: () => notifyInfo("Feature not implemented yet") },
        { label: "Delete Collection", icon: <Trash2 size={16} />, danger: true, onClick: () => notifyInfo("Feature not implemented yet") },
    ], []);

    // Mobile Card Render
    const renderMobileCard = useCallback((row: Collection): MobileRecordCardProps => {
        const status = (row.status || "").toLowerCase();
        const badgeStyle =
            status === "active"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-gray-100 text-gray-600 border-gray-200";

        const typeBadgeStyle = row.collectionType === "automated"
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : "bg-amber-50 text-amber-700 border-amber-200";

        return {
            title: row.title,
            subtitle: row.urlHandle,
            primaryValue: `${row.productCount || 0} products`,
            imageUrl: row.bannerImage || undefined,
            badges: (
                <div className="flex gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] border ${badgeStyle} capitalize`}>
                        {row.status || "—"}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] border ${typeBadgeStyle} capitalize`}>
                        {row.collectionType}
                    </span>
                </div>
            ),
            fields: [
                {
                    label: "Type",
                    value: row.collectionType || "—",
                },
                {
                    label: "Products",
                    value: `${row.productCount || 0}`,
                },
                {
                    label: "Tags",
                    value: row.tags.length > 0 ? row.tags.slice(0, 2).join(", ") : "—",
                },
                {
                    label: "Created",
                    value: row.createdAt
                        ? new Date(row.createdAt).toLocaleDateString()
                        : "—",
                },
            ],
        };
    }, []);

    return (
        <div className="px-9 lg:px-8 pb-8 lg:pb-8 pt-2 space-y-7">
            {/* Date Range + Actions */}
            <div className="flex justify-between items-center">
                <DateRangePicker value={collectionsList.dateRange} onChange={collectionsList.setDateRange} />
                <ActionButtons
                    primaryLabel="Create Collection"
                    primaryTo="/collections/new"
                    onImport={async (data, mode) => { notifyInfo(`Importing ${data.length} collections in ${mode} mode`); }}
                    onExport={async (_options) => { notifyInfo("Exporting collections"); }}
                    totalItems={collectionsList.total}
                    templateUrl="/templates/collections-template.csv"
                />
            </div>

            {/* Metrics */}
            <MetricsGrid metrics={metricsData} />

            {/* Filters Bar */}
            <FiltersBar
                search={collectionsList.search}
                onSearchChange={(v) => { collectionsList.setSearch(v); collectionsList.setPage(1); }}
                filters={[...statusFilterOptions, ...typeFilterOptions]}
                sortOptions={sortOptions}
                visibleColumns={collectionsList.visibleColumns}
                onToggleColumn={collectionsList.toggleColumn}
                actions={actions}
                onClearFilters={collectionsList.clearFilters}
            />

            {/* Table */}
            <GenericTable<Collection>
                data={collectionsList.collections}
                loading={collectionsList.isLoading}
                page={collectionsList.page}
                totalPages={collectionsList.totalPages}
                rowsPerPage={collectionsList.rowsPerPage}
                totalItems={collectionsList.total}
                onPageChange={collectionsList.setPage}
                onRowsPerPageChange={collectionsList.setRowsPerPage}
                getRowId={(row) => row.id}
                columns={filteredColumns}
                selectable={true}
                sortKey={collectionsList.sortKey}
                sortDirection={collectionsList.sortDirection}
                onSortChange={(key, direction) => {
                    collectionsList.setSortKey(key);
                    collectionsList.setSortDirection(direction);
                    collectionsList.setPage(1);
                }}
                renderMobileCard={renderMobileCard}
            />
        </div>
    );
};

export default CollectionListPage;
