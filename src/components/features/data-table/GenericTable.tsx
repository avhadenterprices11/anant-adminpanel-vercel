import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { ReactNode } from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, ArrowUpDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MobileRecordCard } from './MobileRecordCard';
import type { MobileRecordCardProps } from "./MobileRecordCard";

export type ColumnAlign = "left" | "center" | "right";
export type ColumnType = "text" | "number" | "currency" | "date" | "badge" | "image";

export type SelectionMode = "none" | "single" | "multiple";

export interface ColumnVisibilityConfig {
    sm?: boolean;
    md?: boolean;
    lg?: boolean;
}

export interface ColumnConfig<T> {
    key: keyof T | string;
    label: string;
    type?: ColumnType;
    align?: ColumnAlign;
    className?: string; // Additional classes for styling
    hiddenOnMobile?: boolean;
    hiddenOn?: ColumnVisibilityConfig;
    currencySymbol?: string;
    render?: (value: unknown, row: T) => ReactNode;
    link?: (row: T) => string;
    sortable?: boolean;
    sortKey?: string;
    linkClassName?: string;
}

export interface RowAction<T> {
    label: string;
    onClick: (row: T) => void;
    icon?: ReactNode;
    danger?: boolean;
}

export interface GenericTableProps<T> {
    data: T[];
    loading: boolean;

    page: number;
    totalPages: number;
    rowsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rows: number) => void;
    rowsPerPageOptions?: number[];

    getRowId: (row: T) => string;
    columns: ColumnConfig<T>[];

    selectable?: boolean;
    selectionMode?: SelectionMode;
    onSelectionChange?: (selected: T[]) => void;

    sortKey?: string;
    sortDirection?: "asc" | "desc";
    onSortChange?: (sortKey: string, direction: "asc" | "desc") => void;

    /** Row interactions */
    onRowClick?: (row: T) => void;
    selectOnRowClick?: boolean;
    getRowClass?: (row: T) => string;
    rowActionsBuilder?: (row: T) => RowAction<T>[];

    /** Expandable rows */
    expandable?: boolean;
    renderExpandedContent?: (row: T) => ReactNode;

    /** Mobile card renderer */
    renderMobileCard?: (row: T) => MobileRecordCardProps;

    /** External selection state */
    externalSelectionIds?: string[];
    onSelectionIdsChange?: (ids: string[]) => void;

    /** Custom states */
    emptyState?: ReactNode;
    loadingState?: ReactNode;
    /** Force table view on mobile */
    forceTableOnMobile?: boolean;
    /** Allow table to fill parent height */
    fullHeight?: boolean;
}

/* ======================================================
   DataTable UI helpers (same look & feel)
====================================================== */

function formatValue(
    value: unknown,
    type: ColumnType | undefined,
    currencySymbol = "₹"
): string {
    if (value == null) return "—";

    switch (type) {
        case "currency":
            return `${currencySymbol}${Number(value).toLocaleString()}`;
        case "number":
            return Number(value).toLocaleString();
        case "date": {
            const d = new Date(value as string | number | Date);
            if (Number.isNaN(d.getTime())) return "—";
            return d.toLocaleDateString();
        }
        case "badge":
            return String(value);
        default:
            return String(value);
    }
}

function alignClass(align?: ColumnAlign) {
    switch (align) {
        case "center":
            return "text-center";
        case "right":
            return "text-right";
        default:
            return "text-left";
    }
}

function visibilityClasses(col: ColumnConfig<any>) {
    const classes: string[] = [];

    // Legacy support
    if (col.hiddenOnMobile) {
        classes.push("hidden md:table-cell");
    }

    if (col.hiddenOn?.sm) {
        classes.push("hidden sm:table-cell");
    }
    if (col.hiddenOn?.md) {
        classes.push("sm:hidden md:table-cell");
    }
    if (col.hiddenOn?.lg) {
        classes.push("md:hidden lg:table-cell");
    }

    return classes.join(" ");
}

/** CustomCheckbox copied from your DataTable */
function CustomCheckbox({
    checked,
    partial = false,
    onChange,
}: {
    checked: boolean;
    partial?: boolean;
    onChange: () => void;
}) {
    return (
        <div
            role="checkbox"
            aria-checked={checked}
            onClick={onChange}
            className={clsx(
                "w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all",
                checked || partial
                    ? "bg-white border-purple-600"
                    : "bg-gray-50 border-gray-400 hover:border-gray-500 hover:bg-gray-100"
            )}
        >
            {checked && (
                <Check size={12} className="text-purple-600" strokeWidth={4} />
            )}
            {partial && !checked && (
                <div className="w-2.5 h-2.5 bg-purple-600 rounded-sm" />
            )}
        </div>
    );
}

function GenericTable<T extends Record<string, any>>({
    data,
    loading,
    page,
    totalPages,
    rowsPerPage,
    totalItems,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPageOptions = [10, 25, 50],
    getRowId,
    columns,
    selectable = true,
    selectionMode = "multiple",
    onSelectionChange,
    sortKey,
    sortDirection,
    onSortChange,
    onRowClick,
    selectOnRowClick = false,
    getRowClass,
    rowActionsBuilder,
    expandable = false,
    renderExpandedContent,
    renderMobileCard,
    emptyState,
    loadingState,
    forceTableOnMobile,
    fullHeight = false,
    externalSelectionIds,
    onSelectionIdsChange,
}: GenericTableProps<T>) {
    const navigate = useNavigate();
    const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>([]);

    // Use external state if provided, otherwise fallback to internal
    const isControlled = externalSelectionIds !== undefined;
    const selectedIds = isControlled ? externalSelectionIds : internalSelectedIds;

    const setSelectedIds = (next: string[] | ((prev: string[]) => string[])) => {
        if (isControlled) {
            const nextVal = typeof next === 'function' ? next(externalSelectionIds) : next;
            onSelectionIdsChange?.(nextVal);
        } else {
            setInternalSelectedIds(next);
        }
    };

    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    const isSelectionEnabled = selectable && selectionMode !== "none";
    const showSkeleton = loading && data.length === 0;

    const allSelected = useMemo(
        () => data.length > 0 && selectedIds.length === data.length,
        [data, selectedIds]
    );

    const partiallySelected = useMemo(
        () => isSelectionEnabled && selectedIds.length > 0 && !allSelected,
        [isSelectionEnabled, selectedIds, allSelected]
    );

    const toggleSelectAll = () => {
        if (!isSelectionEnabled || selectionMode !== "multiple") return;

        if (allSelected) {
            // Remove all current page IDs from selection
            const currentPageIds = data.map(row => getRowId(row));
            const next = selectedIds.filter(id => !currentPageIds.includes(id));
            setSelectedIds(next);

            if (onSelectionChange) {
                // If we have access to all objects, we should return them, but we don't.
                // For now, we return empty if it's the only page, or the remaining objects if we had them.
                // But onSelectionChange signature is T[], and we don't have all objects.
                // This is a limitation. We'll return filtered data objects.
                onSelectionChange(data.filter(r => next.includes(getRowId(r))));
            }
        } else {
            // Add all current page IDs to selection, avoiding duplicates
            const currentPageIds = data.map(row => getRowId(row));
            const next = Array.from(new Set([...selectedIds, ...currentPageIds]));
            setSelectedIds(next);

            if (onSelectionChange) {
                // Return current items selected + whatever else is in selectedIds (if we had them)
                // Since we only have current page objects, we can only return those + what matches in current data
                onSelectionChange(data.filter(r => next.includes(getRowId(r))));
            }
        }
    };

    const toggleSelectOne = (row: T) => {
        if (!isSelectionEnabled) return;
        const id = getRowId(row);

        setSelectedIds((prev) => {
            let next: string[] = [];

            if (selectionMode === "single") {
                next = prev.includes(id) ? [] : [id];
            } else {
                const exists = prev.includes(id);
                next = exists ? prev.filter((pid) => pid !== id) : [...prev, id];
            }

            if (onSelectionChange) {
                const selectedRows = data.filter((r) => next.includes(getRowId(r)));
                onSelectionChange(selectedRows);
            }

            return next;
        });
    };

    const toggleExpand = (row: T) => {
        const id = getRowId(row);
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
        );
    };

    const goPrev = () => {
        if (page > 1) onPageChange(page - 1);
    };

    const goNext = () => {
        if (page < totalPages) onPageChange(page + 1);
    };

    const handleHeaderSortClick = (col: ColumnConfig<T>) => {
        if (!col.sortable || !onSortChange) return;

        const key = col.sortKey || String(col.key);
        const isActive = sortKey === key;
        const nextDirection: "asc" | "desc" =
            isActive && sortDirection === "asc" ? "desc" : "asc";

        onSortChange(key, nextDirection);
    };

    const renderSortIcon = (col: ColumnConfig<T>) => {
        if (!col.sortable) return null;

        const key = col.sortKey || String(col.key);
        const isActive = sortKey === key;

        return (
            <ArrowUpDown
                size={14}
                className={
                    "shrink-0 transition-opacity " +
                    (isActive ? "opacity-100 text-purple-600" : "opacity-40 group-hover:opacity-80")
                }
            />
        );
    };

    function renderBadge(value: any) {
        if (value === null || value === undefined || value === "") return "—";

        const val = String(value).toLowerCase();

        let styles =
            "px-2 py-0.5 rounded-full text-[11px] border inline-flex items-center uppercase";

        if (val === "active" || val === "true")
            styles += " bg-emerald-50 text-emerald-700 border-emerald-200";
        else if (val === "inactive" || val === "false")
            styles += " bg-gray-100 text-gray-700 border-gray-300";
        else if (val === "draft")
            styles += " bg-amber-50 text-amber-700 border-amber-200";
        else styles += " bg-gray-50 text-gray-600 border-gray-200";

        return <span className={styles}>{String(value)}</span>;
    }

    const renderDefaultCellContent = (col: ColumnConfig<T>, row: T) => {
        const rawValue = row[col.key as keyof T];

        let content: ReactNode;

        if (col.render) {
            content = col.render(rawValue, row);
        } else if (col.type === "image") {
            content = rawValue ? (
                <img
                    src={String(rawValue)}
                    className="w-10 h-10 rounded-lg object-cover"
                    alt=""
                />
            ) : (
                "—"
            );
        } else if (col.type === "badge") {
            content = renderBadge(rawValue);
        } else {
            content = formatValue(rawValue, col.type, col.currencySymbol);
        }

        if (col.link) {
            content = (
                <Link
                    to={col.link(row)}
                    className={col.linkClassName || "text-black font-medium"}
                    onClick={(e) => e.stopPropagation()}
                >
                    {content}
                </Link>
            );
        }

        return content;
    };

    const handleRowClick = (row: T, e: React.MouseEvent) => {
        // Don't navigate if clicking on interactive elements
        const target = e.target as HTMLElement;
        if (
            target.closest('input') ||
            target.closest('button') ||
            target.closest('a') ||
            target.closest('[role="checkbox"]')
        ) {
            return;
        }

        // If selectOnRowClick is enabled and selection is enabled, toggle selection
        if (selectOnRowClick && isSelectionEnabled) {
            toggleSelectOne(row);
            return;
        }

        // First check if onRowClick is provided
        if (onRowClick) {
            onRowClick(row);
            return;
        }

        // Otherwise, find the first column with a link and navigate to it
        const linkColumn = columns.find(col => col.link);
        if (linkColumn && linkColumn.link) {
            const url = linkColumn.link(row);
            navigate(url);
        }
    };

    const renderDesktopBodyContent = () => {
        if (showSkeleton && !loadingState) {
            // Skeleton rows
            const skeletonRows = Array.from({ length: 5 });
            const colsCount =
                columns.length +
                (isSelectionEnabled ? 1 : 0) +
                (expandable ? 1 : 0) +
                (rowActionsBuilder ? 1 : 0);

            return skeletonRows.map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="border-t border-gray-50">
                    {Array.from({ length: colsCount }).map((__, cIdx) => (
                        <td key={cIdx} className="px-6 py-4">
                            <div className="h-3 w-3/4 rounded bg-gray-100 animate-pulse" />
                        </td>
                    ))}
                </tr>
            ));
        }

        if (loading && loadingState) {
            return (
                <tr>
                    <td
                        colSpan={
                            columns.length +
                            (isSelectionEnabled ? 1 : 0) +
                            (expandable ? 1 : 0) +
                            (rowActionsBuilder ? 1 : 0)
                        }
                        className="px-6 py-8 text-center text-gray-400"
                    >
                        {loadingState}
                    </td>
                </tr>
            );
        }

        if (!loading && data.length === 0) {
            return (
                <tr>
                    <td
                        colSpan={
                            columns.length +
                            (isSelectionEnabled ? 1 : 0) +
                            (expandable ? 1 : 0) +
                            (rowActionsBuilder ? 1 : 0)
                        }
                        className="px-6 py-8 text-center text-gray-400"
                    >
                        {emptyState ?? "No records found."}
                    </td>
                </tr>
            );
        }

        return data.map((row) => {
            const id = getRowId(row);
            const isExpanded = expandedIds.includes(id);
            const rowClass = getRowClass?.(row) ?? "";

            const rowActions = rowActionsBuilder?.(row) ?? [];
            const isSelected = selectedIds.includes(id);

            return (
                <React.Fragment key={id}>
                    <tr
                        className={clsx(
                            "border-t border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer",
                            rowClass,
                            isSelected && "bg-purple-50/30"
                        )}
                        onClick={(e) => handleRowClick(row, e)}
                    >
                        {isSelectionEnabled && (
                            <td className="px-2 py-2.5 align-middle w-[48px] min-w-[48px] max-w-[48px]">
                                {selectionMode === "multiple" ? (
                                    <CustomCheckbox
                                        checked={isSelected}
                                        onChange={() => toggleSelectOne(row)}
                                    />
                                ) : (
                                    // Keep native radio semantics for single-select
                                    <input
                                        type="radio"
                                        className="rounded border-gray-300"
                                        checked={isSelected}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            toggleSelectOne(row);
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                )}
                            </td>
                        )}

                        {expandable && (
                            <td className="px-4 py-4 align-middle w-12">
                                <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-600 text-xs"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleExpand(row);
                                    }}
                                >
                                    {isExpanded ? "−" : "+"}
                                </button>
                            </td>
                        )}

                        {columns.map((col) => (
                            <td
                                key={String(col.key)}
                                className={
                                    clsx(
                                        "px-4 py-2.5 text-sm text-gray-700",
                                        alignClass(col.align),
                                        visibilityClasses(col),
                                        col.className
                                    )
                                }
                            >
                                {renderDefaultCellContent(col, row)}
                            </td>
                        ))}

                        {rowActions.length > 0 && (
                            <td className="px-6 py-4 text-right text-sm">
                                <div className="inline-flex gap-1">
                                    {rowActions.map((action, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            className={
                                                "inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[11px] transition-colors " +
                                                (action.danger
                                                    ? "border-red-200 text-red-600 hover:bg-red-50"
                                                    : "border-gray-200 text-gray-600 hover:bg-gray-50")
                                            }
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                action.onClick(row);
                                            }}
                                        >
                                            {action.icon}
                                            <span>{action.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </td>
                        )}
                    </tr>

                    {expandable && isExpanded && renderExpandedContent && (
                        <tr className="bg-gray-50/50">
                            <td
                                colSpan={
                                    columns.length +
                                    (isSelectionEnabled ? 1 : 0) +
                                    1 + // expand column
                                    (rowActionsBuilder ? 1 : 0)
                                }
                                className="px-6 py-4 text-sm"
                            >
                                {renderExpandedContent(row)}
                            </td>
                        </tr>
                    )}
                </React.Fragment>
            );
        });
    };

    return (
        <div className={clsx(
            "bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden",
            fullHeight && "flex flex-col h-full"
        )}>
            {/* Bulk selection bar (kept, but aligned to DataTable purple palette) */}
            {isSelectionEnabled && selectedIds.length > 0 && (
                <div className="px-6 py-3 bg-purple-50 border-b border-purple-100 text-xs text-[#253154] flex items-center justify-between">
                    <span>
                        {selectedIds.length} record
                        {selectedIds.length > 1 ? "s" : ""} selected.
                    </span>
                    <button
                        type="button"
                        className="font-semibold text-purple-700"
                        onClick={() => {
                            setSelectedIds([]);
                            onSelectionChange?.([]);
                        }}
                    >
                        Clear selection
                    </button>
                </div>
            )}

            {/* Desktop table */}
            <div className={clsx(
                "overflow-x-auto overflow-y-auto",
                fullHeight ? "flex-1" : "max-h-[600px]",
                forceTableOnMobile ? "block" : "hidden md:block"
            )}>
                <table className="w-full">
                    <thead className="sticky top-0 z-10 font-bold bg-white border-b border-gray-100">
                        <tr>
                            {isSelectionEnabled && (
                                <th className="px-2 py-3 w-[48px] min-w-[48px] max-w-[48px] bg-white font-bold">
                                    {selectionMode === "multiple" ? (
                                        <CustomCheckbox
                                            checked={allSelected}
                                            partial={partiallySelected}
                                            onChange={toggleSelectAll}
                                        />
                                    ) : (
                                        <span className="text-[11px] text-gray-400">Sel.</span>
                                    )}
                                </th>
                            )}

                            {expandable && (
                                <th className="px-4 py-4 w-12 bg-white" />
                            )}
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    className={
                                        `px-4 py-3 text-sm font-bold uppercase tracking-wider text-[#253154] group select-none whitespace-nowrap ${alignClass(
                                            col.align
                                        )} ` +
                                        visibilityClasses(col) +
                                        (col.sortable ? " cursor-pointer" : "")
                                    }
                                    onClick={() => handleHeaderSortClick(col)}
                                >
                                    <div className={clsx(
                                        "flex items-center gap-1.5",
                                        col.align === "center" ? "justify-center" :
                                            col.align === "right" ? "justify-end" : "justify-start"
                                    )}>
                                        {col.label}
                                        {renderSortIcon(col)}
                                    </div>
                                </th>
                            ))}

                            {rowActionsBuilder && (
                                <th className="px-6 py-4 text-right text-xs font-extrabold uppercase text-[#253154] bg-white">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">{renderDesktopBodyContent()}</tbody>
                </table>
            </div>

            {/* Mobile cards (kept; minor visual alignment only) */}
            <div className={clsx("p-4 space-y-3", forceTableOnMobile ? "hidden" : "md:hidden")}>
                {showSkeleton && !loadingState && (
                    <>
                        {Array.from({ length: 4 }).map((_, idx) => (
                            <div
                                key={`mobile-skeleton-${idx}`}
                                className="rounded-2xl border border-gray-100 p-4 bg-white shadow-sm"
                            >
                                <div className="flex gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gray-100 animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 w-3/4 bg-gray-100 rounded animate-pulse" />
                                        <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
                                        <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {loading && loadingState && !showSkeleton && (
                    <p className="text-center text-gray-400 text-sm">{loadingState}</p>
                )}

                {!loading && data.length === 0 && !showSkeleton && (
                    <p className="text-center text-gray-400 text-sm">
                        {emptyState ?? "No records found."}
                    </p>
                )}

                {!loading &&
                    data.map((row) => {
                        const id = getRowId(row);
                        const cardProps: MobileRecordCardProps | null = renderMobileCard
                            ? renderMobileCard(row)
                            : {
                                title: String(row[columns[0]?.key as keyof T] ?? "Record"),
                                fields: columns.slice(1).map((col) => ({
                                    label: col.label,
                                    value: formatValue(
                                        row[col.key as keyof T],
                                        col.type,
                                        col.currencySymbol
                                    ),
                                })),
                            };

                        if (!cardProps) return null;
                        return (
                            <MobileRecordCard
                                key={id}
                                {...cardProps}
                                onClick={onRowClick ? () => onRowClick(row) : undefined}
                            />
                        );
                    })}
            </div>

            {/* Pagination (aligned to DataTable footer style) */}
            <div className="border-t border-gray-100 h-[80px] px-6 flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="hidden sm:inline">Rows per page</span>
                    <Select
                        value={String(rowsPerPage)}
                        onValueChange={(value) => {
                            const val = Number(value);
                            onRowsPerPageChange(val);
                            // Global persistence
                            if (typeof window !== 'undefined') {
                                localStorage.setItem('rowsPerPage', String(val));
                            }
                        }}
                    >
                        <SelectTrigger className="h-9 w-[70px] rounded-lg">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {rowsPerPageOptions.map((opt) => (
                                <SelectItem key={opt} value={String(opt)}>
                                    {opt}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <span className="hidden md:inline text-sm text-gray-500">
                        {data.length > 0
                            ? `Showing ${(page - 1) * rowsPerPage + 1}-${Math.min(
                                page * rowsPerPage,
                                totalItems
                            )} of ${totalItems}`
                            : "Showing 0 of 0"}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={goPrev}
                        disabled={page <= 1}
                        className="w-10 h-10 rounded-lg"
                        aria-label="Previous page"
                    >
                        <ChevronLeft size={18} />
                    </Button>

                    <span className="text-sm text-gray-500">
                        Page {page} of {Math.max(totalPages, 1)}
                    </span>

                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={goNext}
                        disabled={page >= totalPages}
                        className="w-10 h-10 rounded-lg"
                        aria-label="Next page"
                    >
                        <ChevronRight size={18} />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export { GenericTable };
