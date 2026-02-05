import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Search,
    Filter,
    ArrowUpDown,
    Columns,
    MoreHorizontal,

    X,
    Check,
    ChevronDown,
} from "lucide-react";

import DropdownMenu from "../../ui/CustomDropdownMenu";

export interface FilterOption {
    label: string;
    value: string;
    onSelect: (value: string) => void;
    isActive?: boolean;
    icon?: React.ReactNode;
}


export interface SortOption {
    label: string;
    value: string;
    onSelect: (value: string) => void;
    isActive?: boolean;
    direction?: "asc" | "desc";
}

interface ColumnItem {
    key: string;
    label: string;
    visible: boolean;
}

interface ActionItem {
    label: string;
    icon: React.ReactNode;
    danger?: boolean;
    disabled?: boolean;
    onClick: () => void;
}

export interface FilterGroup {
    id: string;
    label?: string;
    options: FilterOption[];
}

interface FiltersBarProps {
    search: string;
    onSearchChange: (value: string) => void;

    // Support both flat and grouped filters
    filters?: FilterOption[];
    filterGroups?: FilterGroup[];

    sortOptions: SortOption[];

    visibleColumns: ColumnItem[];
    onToggleColumn: (key: string) => void;

    actions: ActionItem[];

    onClearFilters?: () => void;

    /** Optional placeholder for search */
    searchPlaceholder?: string;

    /** Optional custom content (e.g. location selector) */
    customContent?: React.ReactNode;

    /** Optional extra content to render inside the expandable filter panel */
    extraFilterContent?: React.ReactNode;
}

const FiltersBar: React.FC<FiltersBarProps> = ({
    search,
    onSearchChange,
    filters = [],
    filterGroups = [],
    sortOptions,
    visibleColumns,
    onToggleColumn,
    actions,
    onClearFilters,
    searchPlaceholder = "Search",
    customContent,
    extraFilterContent,
}) => {
    const [showFilters, setShowFilters] = useState(false);

    // Auto-expand filters if there are active filters on mount (optional, maybe too aggressive)
    // useEffect(() => {
    //     const hasActive = filters.some(f => f.isActive) || filterGroups.some(g => g.options.some(o => o.isActive));
    //     if (hasActive) setShowFilters(true);
    // }, []);


    const [mobileOpen, setMobileOpen] = useState(false);
    const [dragY, setDragY] = useState(0);
    const startY = useRef(0);
    const isDragging = useRef(false);

    // Debounced search state
    const [localSearch, setLocalSearch] = useState(search);

    useEffect(() => {
        setLocalSearch(search);
    }, [search]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (localSearch !== search) onSearchChange(localSearch);
        }, 300);

        return () => clearTimeout(timeout);
    }, [localSearch, search, onSearchChange]);

    const activeFiltersCount = useMemo(() => {
        const isActuallyActive = (f: FilterOption) => 
            f.isActive && f.value !== "" && f.value !== "all" && f.value !== "all-dates";
            
        let count = filters.filter(isActuallyActive).length;
        filterGroups.forEach((group) => {
            count += group.options.filter(isActuallyActive).length;
        });
        return count;
    }, [filters, filterGroups]);

    const activeSort = useMemo(
        () => sortOptions.find((s) => s.isActive),
        [sortOptions]
    );

    // TOUCH HANDLERS FOR MOBILE DRAWER ... (omitted for brevity, assume same logic)
    const handleTouchStart = (e: React.TouchEvent) => {
        startY.current = e.touches[0].clientY;
        isDragging.current = true;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging.current) return;
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY.current;
        if (diff > 0) setDragY(diff * 0.6);
    };

    const handleTouchEnd = () => {
        isDragging.current = false;
        if (dragY > 120) setMobileOpen(false);
        setDragY(0);
    };

    const handleShowAllColumns = () => {
        const hiddenCols = visibleColumns.filter((c) => !c.visible);
        hiddenCols.forEach((c) => onToggleColumn(c.key));
    };

    const handleHideAllColumns = () => {
        const visible = visibleColumns.filter((c) => c.visible);
        visible.forEach((c) => onToggleColumn(c.key));
    };

    const iconBtn =
        "h-[50px] w-[50px] rounded-xl border border-gray-200 bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors";
    const menuPanel =
        "px-1 py-1 rounded-xl"; // inner padding wrapper (DropdownMenu probably provides outer)
    const menuHeader =
        "text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2";

    return (
        <>
            {/* TOP BAR */}
            <div className="mb-4 flex items-center justify-between gap-4 flex-nowrap">
                {/* SEARCH */}
                <div className="flex-1">
                    <div
                        className="relative flex items-center bg-white border border-gray-200 rounded-xl shadow-sm"
                        style={{ height: 50 }}
                    >
                        <span className="pointer-events-none absolute left-4 text-gray-400">
                            <Search size={20} strokeWidth={1.5} />
                        </span>

                        <input
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="
                w-full h-full bg-transparent
                pl-12 pr-10
                text-[16px] font-medium
                text-gray-600 placeholder:text-gray-400
                rounded-xl
                focus:outline-none
              "
                            type="search"
                            aria-label="Search"
                        />

                        {localSearch && (
                            <button
                                type="button"
                                onClick={() => {
                                    setLocalSearch("");
                                    onSearchChange("");
                                }}
                                className="
                  absolute right-3
                  w-8 h-8 rounded-full
                  flex items-center justify-center
                  text-gray-400 hover:text-gray-600 hover:bg-gray-100
                  transition-colors
                "
                                aria-label="Clear search"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* CUSTOM CONTENT (e.g. Location Selector) */}
                {customContent && (
                    <div className="hidden md:block">
                        {customContent}
                    </div>
                )}

                {/* DESKTOP BUTTONS */}
                <div className="hidden md:flex items-center gap-3">
                    {/* FILTER TOGGLE (Replaces Dropdown) */}
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`h-[50px] w-[50px] rounded-xl border flex items-center justify-center shadow-sm transition-all ${showFilters || activeFiltersCount > 0
                            ? "bg-purple-50 border-purple-200 text-purple-700"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                            }`}
                        title="Toggle Filters"
                    >
                        <div className="relative">
                            <Filter size={20} strokeWidth={1.5} />
                            {activeFiltersCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] rounded-full bg-purple-600 text-white text-[10px] flex items-center justify-center border border-white">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </div>
                    </button>


                    {/* SORT */}
                    <DropdownMenu
                        trigger={
                            <button type="button" className={iconBtn} title="Sort">
                                <ArrowUpDown
                                    size={20}
                                    strokeWidth={1.5}
                                    className={activeSort ? "text-purple-700" : undefined}
                                />
                            </button>
                        }
                    >
                        <div className={menuPanel}>
                            <p className={menuHeader + " px-2"}>Sort By</p>

                            {sortOptions.map((item) => (
                                <button
                                    key={item.value}
                                    className={[
                                        "w-full flex justify-between items-center px-3 py-2 text-sm rounded-lg transition-colors",
                                        item.isActive
                                            ? "bg-purple-50 text-purple-700"
                                            : "text-gray-700 hover:bg-gray-50",
                                    ].join(" ")}
                                    onClick={() => item.onSelect(item.value)}
                                    type="button"
                                >
                                    <span>{item.label}</span>
                                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                                        {item.isActive && item.direction && (
                                            <span className="uppercase">{item.direction}</span>
                                        )}
                                        <ArrowUpDown size={14} />
                                    </span>
                                </button>
                            ))}
                        </div>
                    </DropdownMenu>

                    {/* COLUMNS */}
                    <DropdownMenu
                        trigger={
                            <button type="button" className={iconBtn} title="Visible Columns">
                                <Columns size={20} strokeWidth={1.5} />
                            </button>
                        }
                    >
                        <div className={menuPanel}>
                            <div className="flex items-center justify-between mb-2 px-2">
                                <p className={menuHeader}>Visible Columns</p>
                                <div className="flex gap-1">
                                    <button
                                        type="button"
                                        onClick={handleShowAllColumns}
                                        className="text-[10px] px-2 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        Show all
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleHideAllColumns}
                                        className="text-[10px] px-2 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        Hide all
                                    </button>
                                </div>
                            </div>

                            <div className="max-h-[300px] overflow-y-auto">
                                {visibleColumns.map((col) => (
                                    <label
                                        key={col.key}
                                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={col.visible}
                                            onChange={() => onToggleColumn(col.key)}
                                            className="accent-purple-600"
                                        />
                                        <span className="text-gray-700">{col.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </DropdownMenu>

                    {/* ACTIONS */}
                    <DropdownMenu
                        trigger={
                            <button type="button" className={iconBtn} title="More actions">
                                <MoreHorizontal size={20} strokeWidth={1.5} />
                            </button>
                        }
                    >
                        <div className={menuPanel}>
                            <p className={menuHeader + " px-2"}>Actions</p>

                            {actions.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={item.onClick}
                                    disabled={item.disabled}
                                    className={[
                                        "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                                        item.disabled
                                            ? "text-gray-400 cursor-not-allowed"
                                            : item.danger
                                                ? "text-red-500 hover:bg-red-50"
                                                : "text-gray-700 hover:bg-gray-50",
                                    ].join(" ")}
                                    type="button"
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </DropdownMenu>
                </div>

                {/* MOBILE 3 DOT BUTTON */}
                <button
                    onClick={() => setMobileOpen(true)}
                    className="md:hidden h-[50px] w-[50px] rounded-xl border border-gray-200 bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
                    type="button"
                    aria-label="Open filters & actions"
                >
                    <MoreHorizontal size={20} strokeWidth={1.5} />
                </button>
            </div >

            {/* EXPANDABLE FILTER PANEL */}
            {showFilters && (
                <div className="mb-3 p-3 bg-white rounded-xl border border-gray-200 shadow-sm animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-start sm:items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-3">
                              {filterGroups.map(group => {
                                  const activeCount = group.options.filter(o => 
                                      o.isActive && o.value !== "" && o.value !== "all" && o.value !== "all-dates"
                                  ).length;
                                  return (
                                    <div key={group.id} className="relative">
                                        <DropdownMenu
                                            trigger={
                                                <button
                                                    type="button"
                                                    className={`h-10 px-4 pr-10 rounded-xl border flex items-center gap-2 text-sm font-medium transition-all ${activeCount > 0
                                                        ? 'bg-purple-50 border-purple-200 text-purple-700'
                                                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {group.label}
                                                    {activeCount > 0 && (
                                                        <span className="ml-1 min-w-[18px] h-[18px] rounded-full bg-purple-600 text-white text-[10px] flex items-center justify-center">
                                                            {activeCount}
                                                        </span>
                                                    )}
                                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                </button>
                                            }
                                            align="left"
                                        >
                                            <div className="p-2 min-w-[200px] max-h-[300px] overflow-y-auto">
                                                {group.options.map(option => (
                                                    <label
                                                        key={option.value}
                                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                                    >
                                                        <div className={`
                                                        w-5 h-5 rounded border flex items-center justify-center transition-colors
                                                        ${option.isActive
                                                                ? 'bg-purple-600 border-purple-600'
                                                                : 'bg-white border-gray-300 hover:border-purple-400'
                                                            }
                                                    `}>
                                                            {option.isActive && <Check size={12} className="text-white" strokeWidth={3} />}
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            className="hidden"
                                                            checked={!!option.isActive}
                                                            onChange={() => option.onSelect(option.value)}
                                                        />
                                                        {option.icon && <span className="text-gray-500">{option.icon}</span>}
                                                        <span className={`text-sm ${option.isActive ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                                            {option.label}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </DropdownMenu>
                                    </div>
                                );
                            })}

                            {/* Extra Filter Content (e.g. Tags) */}
                            {extraFilterContent}

                            {/* Flat Filters (if any) as a dropdown */}
                            {filters.length > 0 && (
                                <div className="relative">
                                    <DropdownMenu
                                        trigger={
                                        <button
                                                type="button"
                                                className={`h-10 px-4 pr-10 rounded-xl border flex items-center gap-2 text-sm font-medium transition-all ${filters.filter(f => f.isActive && f.value !== "" && f.value !== "all").length > 0
                                                    ? 'bg-purple-50 border-purple-200 text-purple-700'
                                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                General
                                                {filters.filter(f => f.isActive && f.value !== "" && f.value !== "all").length > 0 && (
                                                    <span className="ml-1 min-w-[18px] h-[18px] rounded-full bg-purple-600 text-white text-[10px] flex items-center justify-center">
                                                        {filters.filter(f => f.isActive && f.value !== "" && f.value !== "all").length}
                                                    </span>
                                                )}
                                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            </button>
                                        }
                                        align="left"
                                    >
                                        <div className="p-2 min-w-[200px] max-h-[300px] overflow-y-auto">
                                            {filters.map(filter => (
                                                <label
                                                    key={filter.value}
                                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                                >
                                                    <div className={`
                                                    w-5 h-5 rounded border flex items-center justify-center transition-colors
                                                    ${filter.isActive
                                                            ? 'bg-purple-600 border-purple-600'
                                                            : 'bg-white border-gray-300 hover:border-purple-400'
                                                        }
                                                `}>
                                                        {filter.isActive && <Check size={12} className="text-white" strokeWidth={3} />}
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={!!filter.isActive}
                                                        onChange={() => filter.onSelect(filter.value)}
                                                    />
                                                    <span className={`text-sm ${filter.isActive ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                                        {filter.label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </DropdownMenu>
                                </div>
                            )}
                        </div>
                        {onClearFilters && (activeFiltersCount > 0 || (search && search.length > 0)) && (
                            <button
                                onClick={onClearFilters}
                                className="shrink-0 text-sm text-purple-600 hover:text-purple-700 font-medium hover:underline flex items-center gap-1"
                            >
                                <X size={14} />
                                Clear all
                            </button>
                        )}
                    </div>
                </div>
            )}


            {/* MOBILE BOTTOM SHEET */}
            {
                mobileOpen && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:hidden">
                        <div
                            className="w-full bg-white rounded-t-3xl p-5 h-[85vh] overflow-y-auto shadow-xl"
                            style={{
                                transform: `translateY(${dragY}px)`,
                                transition: dragY === 0 ? "transform 0.25s ease" : "none",
                            }}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {/* DRAG HANDLE + HEADER */}
                            <div className="flex flex-col items-center mb-4">
                                <div className="w-10 h-1.5 bg-gray-300 rounded-full mb-2" />
                                <div className="flex items-center justify-between w-full">
                                    <h2 className="text-sm font-semibold text-[#253154]">
                                        Filters & Sorting
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => setMobileOpen(false)}
                                        className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
                                        aria-label="Close"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* FILTERS */}
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Filters
                            </h3>

                            <div className="flex flex-col gap-4 mb-4">
                                {/* Filter Groups */}
                                {filterGroups.map((group) => (
                                    <div key={group.id}>
                                        <h4 className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-2">
                                            {group.label}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {group.options.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => option.onSelect(option.value)}
                                                    type="button"
                                                    className={[
                                                        "px-3 py-1.5 rounded-full text-xs border transition-colors",
                                                        option.isActive
                                                            ? "bg-purple-600 text-white border-transparent shadow-sm"
                                                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
                                                    ].join(" ")}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Flat Filters (if any) */}
                                {filters.length > 0 && (
                                    <div>
                                        {filterGroups.length > 0 && (
                                            <h4 className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-2">
                                                General
                                            </h4>
                                        )}
                                        <div className="flex flex-wrap gap-2">
                                            {filters.map((item) => (
                                                <button
                                                    key={item.value}
                                                    onClick={() => item.onSelect(item.value)}
                                                    type="button"
                                                    className={[
                                                        "px-3 py-1.5 rounded-full text-xs border transition-colors",
                                                        item.isActive
                                                            ? "bg-purple-600 text-white border-transparent shadow-sm"
                                                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
                                                    ].join(" ")}
                                                >
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {onClearFilters && activeFiltersCount > 0 && (
                                <button
                                    type="button"
                                    onClick={onClearFilters}
                                    className="text-[12px] text-purple-600 hover:underline mb-4"
                                >
                                    Clear all filters
                                </button>
                            )}

                            <hr className="my-4" />

                            {/* SORT */}
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Sort By
                            </h3>

                            <div className="flex flex-col gap-2 mb-4">
                                {sortOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => opt.onSelect(opt.value)}
                                        type="button"
                                        className={[
                                            "w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm border border-gray-100 transition-colors",
                                            opt.isActive
                                                ? "bg-purple-50 text-purple-700"
                                                : "bg-white text-gray-700 hover:bg-gray-50",
                                        ].join(" ")}
                                    >
                                        <span>{opt.label}</span>
                                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                                            {opt.isActive && opt.direction && (
                                                <span className="uppercase">{opt.direction}</span>
                                            )}
                                            <ArrowUpDown size={14} />
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <hr className="my-4" />

                            {/* VISIBLE COLUMNS */}
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Visible Columns
                            </h3>

                            <div className="flex flex-col gap-2 mb-4">
                                {visibleColumns.map((col) => (
                                    <label
                                        key={col.key}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100 bg-white"
                                    >
                                        <div className={`
                                            w-5 h-5 rounded border flex items-center justify-center transition-colors
                                            ${col.visible
                                                ? 'bg-purple-600 border-purple-600'
                                                : 'bg-white border-gray-300 hover:border-purple-400'
                                            }
                                        `}>
                                            {col.visible && <Check size={12} className="text-white" strokeWidth={3} />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={col.visible}
                                            onChange={() => onToggleColumn(col.key)}
                                        />
                                        <span className={`text-sm ${col.visible ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                            {col.label}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            <hr className="my-4" />

                            {/* ACTIONS */}
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Actions
                            </h3>

                            <div className="flex flex-col gap-2 mb-4">
                                {actions.map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={item.onClick}
                                        disabled={item.disabled}
                                        type="button"
                                        className={[
                                            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                                            item.disabled
                                                ? "text-gray-400 cursor-not-allowed"
                                                : item.danger
                                                    ? "text-red-500 hover:bg-red-50"
                                                    : "text-gray-700 hover:bg-gray-50",
                                        ].join(" ")}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </button>
                                ))}
                            </div>

                            {/* CLOSE BUTTON */}
                            <button
                                onClick={() => setMobileOpen(false)}
                                type="button"
                                className="w-full mt-2 bg-gray-100 text-gray-700 py-3 rounded-xl text-sm hover:bg-gray-200 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export { FiltersBar };
