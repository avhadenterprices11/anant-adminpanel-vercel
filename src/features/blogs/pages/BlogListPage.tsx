import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { notifyInfo, notifySuccess, notifyError } from "@/utils";
import {
    BookOpen,
    Eye,
    Edit,
    // Activity,
    XCircle
} from "lucide-react";
import { DateRangePicker } from '@/components/forms/inputs/DateRangePicker';
import { ActionButtons, FiltersBar, GenericTable, type ColumnConfig, type SortOption, type MobileRecordCardProps } from '@/components/features/data-table';
import { MetricsGrid, type MetricItem } from '@/components/features/metrics';
import { Badge } from "@/components/ui/badge";

import { useQueryClient } from "@tanstack/react-query";
import { usePagination, useSearch, useDateRange } from "@/hooks";
import { useBlogs, blogKeys } from "../hooks/useBlogs";
import { blogService } from "../services/blogService";
import { blogImportFields, blogExportColumns, blogTemplateUrl, blogModuleName } from "../config/import-export.config";
import type { Blog } from "../types/blog.types";
import type { ImportMode } from '@/components/features/import-export/ImportDialog';

import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog';
import { ROUTES } from '@/lib/constants/routes';

const BlogListPage: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { dateRange, setDateRange } = useDateRange();
    const { search, setSearch } = useSearch();
    const { page, rowsPerPage, setPage, setRowsPerPage } = usePagination();
    const [visibility, setVisibility] = useState<string[]>([]);
    const [category, setCategory] = useState("");
    const [tagSearch, setTagSearch] = useState<string[]>([]);
    const [minViews, setMinViews] = useState<string>("");
    const [sort, setSort] = useState("");
    const [selectedBlogs, setSelectedBlogs] = useState<Blog[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Dialog state
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Sorting parameters parsing
    const { sortBy, sortOrder } = useMemo(() => {
        if (!sort) return { sortBy: undefined, sortOrder: undefined };
        if (sort === 'newest') return { sortBy: 'created_at', sortOrder: 'desc' as const };
        if (sort === 'oldest') return { sortBy: 'created_at', sortOrder: 'asc' as const };

        const parts = sort.split('_');
        const direction = parts[parts.length - 1];

        if (direction === 'asc' || direction === 'desc') {
            return {
                sortBy: parts.slice(0, -1).join('_'),
                sortOrder: direction as 'asc' | 'desc'
            };
        }

        return { sortBy: sort, sortOrder: undefined };
    }, [sort]);

    // Fetch blogs using React Query
    const { data: queryData, isLoading, error } = useBlogs({
        page,
        limit: rowsPerPage,
        search: search || undefined,
        tags: tagSearch.length > 0 ? tagSearch.join(',') : undefined,
        visibility: visibility.length > 0 ? visibility.join(',') as any : undefined,
        category: category || undefined,
        startDate: dateRange?.from ? new Date(dateRange.from).toISOString() : undefined,
        endDate: dateRange?.to ? new Date(dateRange.to).toISOString() : undefined,
        minViews: minViews ? parseInt(minViews) : undefined,
        sortOrder,
        sortBy,
    });

    const blogs = queryData?.blogs || [];
    const meta = queryData?.meta;

    // Fetch Metrics Data (Counts only via limit: 1)
    const { data: allMetricsData } = useBlogs({ limit: 1 });
    const { data: publicMetricsData } = useBlogs({ limit: 1, visibility: 'Public' });
    const { data: draftMetricsData } = useBlogs({ limit: 1, visibility: 'Draft' });
    const { data: privateMetricsData } = useBlogs({ limit: 1, visibility: 'Private' });

    const filteredBlogs = blogs;

    // Calculate metrics using server-side totals
    const metrics: MetricItem[] = useMemo(() => {
        return [
            {
                title: "Total Blogs",
                value: allMetricsData?.meta?.total || 0,
                helperText: "All blogs",
                icon: BookOpen,
                iconBg: "#3B82F6",
            },
            {
                title: "Published",
                value: publicMetricsData?.meta?.total || 0,
                helperText: "Live on website",
                icon: Eye,
                iconBg: "#10B981",
            },
            {
                title: "Drafts",
                value: draftMetricsData?.meta?.total || 0,
                helperText: "Unpublished",
                icon: Edit,
                iconBg: "#F59E0B",
            },
            {
                title: "Private",
                value: privateMetricsData?.meta?.total || 0,
                helperText: "Visible only to admins",
                icon: Eye,
                iconBg: "#EF4444",
            }
        ];
    }, [allMetricsData, publicMetricsData, draftMetricsData, privateMetricsData]);

    // -----------------------------
    // Filters Configuration
    // -----------------------------
    const visibilityFilterOptions = [
        {
            label: "All Visibility",
            value: "",
            onSelect: () => { setVisibility([]); setPage(1); },
            isActive: visibility.length === 0
        },
        {
            label: "Public",
            value: "Public",
            onSelect: () => {
                setVisibility(prev => prev.includes('Public') ? prev.filter(v => v !== 'Public') : [...prev, 'Public']);
                setPage(1);
            },
            isActive: visibility.includes("Public")
        },
        {
            label: "Draft",
            value: "Draft",
            onSelect: () => {
                setVisibility(prev => prev.includes('Draft') ? prev.filter(v => v !== 'Draft') : [...prev, 'Draft']);
                setPage(1);
            },
            isActive: visibility.includes("Draft")
        },
        {
            label: "Private",
            value: "Private",
            onSelect: () => {
                setVisibility(prev => prev.includes('Private') ? prev.filter(v => v !== 'Private') : [...prev, 'Private']);
                setPage(1);
            },
            isActive: visibility.includes("Private")
        },
    ];



    const sortOptions = [
        {
            label: "Newest First",
            value: "newest",
            direction: "desc",
            isActive: sort === "newest",
            onSelect: () => { setSort("newest"); setPage(1); },
        },
        {
            label: "Oldest First",
            value: "oldest",
            direction: "asc",
            isActive: sort === "oldest",
            onSelect: () => { setSort("oldest"); setPage(1); },
        },
        {
            label: "Title (A-Z)",
            value: "title_asc",
            direction: "asc",
            isActive: sort === "title_asc",
            onSelect: () => { setSort("title_asc"); setPage(1); },
        },
        {
            label: "Title (Z-A)",
            value: "title_desc",
            direction: "desc",
            isActive: sort === "title_desc",
            onSelect: () => { setSort("title_desc"); setPage(1); },
        },
        /*
        {
            label: "Most Views",
            value: "views_desc",
            direction: "desc",
            isActive: sort === "views_desc",
            onSelect: () => { setSort("views_desc"); setPage(1); },
        },
        {
            label: "Least Views",
            value: "views_asc",
            direction: "asc",
            isActive: sort === "views_asc",
            onSelect: () => { setSort("views_asc"); setPage(1); },
        },
        */
        {
            label: "Author (A-Z)",
            value: "author_asc",
            direction: "asc",
            isActive: sort === "author_asc",
            onSelect: () => { setSort("author_asc"); setPage(1); },
        },
        {
            label: "Author (Z-A)",
            value: "author_desc",
            direction: "desc",
            isActive: sort === "author_desc",
            onSelect: () => { setSort("author_desc"); setPage(1); },
        },
        {
            label: "Status (Asc)",
            value: "visibility_asc",
            direction: "asc",
            isActive: sort === "visibility_asc",
            onSelect: () => { setSort("visibility_asc"); setPage(1); },
        },
        {
            label: "Status (Desc)",
            value: "visibility_desc",
            direction: "desc",
            isActive: sort === "visibility_desc",
            onSelect: () => { setSort("visibility_desc"); setPage(1); },
        },
        {
            label: "Tags (A-Z)",
            value: "tags_asc",
            direction: "asc",
            isActive: sort === "tags_asc",
            onSelect: () => { setSort("tags_asc"); setPage(1); },
        },
        // {
        //     label: "Tags (Z-A)",
        //     value: "tags_desc",
        //     direction: "desc",
        //     isActive: sort === "tags_desc",
        //     onSelect: () => { setSort("tags_desc"); setPage(1); },
        // },
    ] as const satisfies SortOption[];

    // Visible Columns
    const [visibleColumns, setVisibleColumns] = useState([
        { key: "title", label: "Title", visible: true },
        { key: "description", label: "Description", visible: true },
        { key: "visibility", label: "Visibility", visible: true },
        { key: "tags", label: "Tags", visible: true },
        { key: "author", label: "Author", visible: true },
        { key: "category", label: "Category", visible: true },
        // { key: "views", label: "Views", visible: true },
        { key: "created_at", label: "Created At", visible: false },
        // { key: "publish_date", label: "Publish Date & Time", visible: true },
    ]);

    const toggleColumn = (key: string) => {
        setVisibleColumns((prev) =>
            prev.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c))
        );
    };

    // Extract unique tags from loaded blogs for the filter list
    const uniqueTags = useMemo(() => {
        if (!queryData?.blogs) return [];
        const tags = new Set<string>();
        queryData.blogs.forEach(blog => {
            if (blog.tags) {
                if (Array.isArray(blog.tags)) {
                    blog.tags.forEach(t => tags.add(t));
                } else if (typeof blog.tags === 'string') {
                    // Handle potential comma-separated tags or single string
                    (blog.tags as string).split(',').forEach(t => tags.add(t.trim()));
                }
            }
        });
        return Array.from(tags).sort();
    }, [queryData?.blogs]);

    const tagFilterOptions = useMemo(() => {
        return [
            { label: "All Tags", value: "", onSelect: () => { setTagSearch([]); setPage(1); }, isActive: tagSearch.length === 0 },
            ...uniqueTags.map(tag => ({
                label: tag,
                value: tag,
                onSelect: (val: string) => {
                    setTagSearch(prev =>
                        prev.includes(val)
                            ? prev.filter(t => t !== val)
                            : [...prev, val]
                    );
                    setPage(1);
                },
                isActive: tagSearch.includes(tag)
            }))
        ];
    }, [uniqueTags, tagSearch]);

    // -----------------------------
    // Table Columns
    // -----------------------------
    const columns: ColumnConfig<Blog>[] = [
        {
            key: "title",
            label: "Title",
            type: "text",
            sortable: true,
            sortKey: "title",
            link: (row) => `/blogs/${row.blog_id}`,
            linkClassName: "text-black font-semibold",
            render: (_, row) => (
                <div className="w-[200px]">
                    <p className="text-[13px] font-semibold truncate" title={row.title}>{row.title}</p>
                </div>
            ),
        },
        {
            key: "description",
            label: "Description",
            type: "text",
            sortable: true,
            sortKey: "description",
            render: (_, row) => (
                <div className="w-[300px]">
                    <p className="text-[12px] text-gray-600 truncate" title={row.description}>{row.description}</p>
                </div>
            ),
        },
        /* Commented out Category column
        {
            key: "category",
            label: "Category",
            type: "text",
            sortable: true,
            sortKey: "category",
            render: (_, row) => (
                <span className="text-sm text-gray-700 capitalize">{row.category}</span>
            ),
        },
        */
        /* Commented out Views column
        {
            key: "views",
            label: "Views",
            type: "text",
            sortable: true,
            sortKey: "views",
            render: (_, row) => (
                <span className="text-sm text-gray-700">{row.views}</span>
            ),
        },
        */
        {
            key: "visibility",
            label: "Status",
            type: "badge",
            sortable: true,
            sortKey: "visibility",
            render: (_, row) => {
                const statusMap: Record<string, string> = {
                    Public: 'Published',
                    Draft: 'Draft',
                    Private: 'Private',
                };
                const label = statusMap[row.visibility] || row.visibility;

                const visibilityStyles: Record<string, string> = {
                    Public: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    Draft: "bg-gray-100 text-gray-600 border-gray-200",
                    Private: "bg-amber-50 text-amber-700 border-amber-200",
                };

                return (
                    <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${visibilityStyles[row.visibility] || visibilityStyles.Draft}`}
                    >
                        {label}
                    </span>
                );
            },
        },
        {
            key: "tags",
            label: "Tags",
            type: "text",
            sortable: true,
            sortKey: "tags",
            render: (_, row) => (
                <div className="flex flex-wrap gap-1 max-w-xs">
                    {(row.tags || []).slice(0, 2).map((tag, idx) => (
                        <Badge
                            key={idx}
                            variant="outline"
                            className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 border-blue-200"
                        >
                            {tag}
                        </Badge>
                    ))}
                    {(row.tags || []).length > 2 && (
                        <span className="text-[10px] text-gray-500">+{row.tags.length - 2}</span>
                    )}
                </div>
            ),
        },
        {
            key: "author",
            label: "Author",
            type: "text",
            sortable: true,
            sortKey: "author",
            render: (_, row) => (
                <span className="text-[12px] text-gray-700">{row.author || 'N/A'}</span>
            ),
        },
        /* Commented out Publish Date & Time
        {
            key: "publish_date",
            label: "Publish Date & Time",
            type: "text",
            sortable: true,
            sortKey: "publish",
            render: (_, row) => (
                <div className="text-[12px]">
                    {row.publish_date ? (
                        <>
                            <div className="text-gray-900">
                                {new Date(row.publish_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                })}
                            </div>
                            <div className="text-gray-500">
                                {new Date(row.publish_date).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                })}
                            </div>
                        </>
                    ) : (
                        <span className="text-gray-400">Not published</span>
                    )}
                </div>
            ),
        },
        */
        {
            key: "created_at",
            label: "Created At",
            type: "text",
            sortable: true,
            sortKey: "created_at",
            render: (_, row) => (
                <span className="text-xs text-gray-500">
                    {new Date(row.created_at).toLocaleDateString()}
                </span>
            ),
        },
    ];

    const renderMobileCard = React.useCallback((row: Blog): MobileRecordCardProps => {
        const visibilityStyles: Record<string, string> = {
            Public: "bg-emerald-50 text-emerald-700 border-emerald-200",
            Draft: "bg-gray-100 text-gray-600 border-gray-200",
            Private: "bg-amber-50 text-amber-700 border-amber-200",
        };

        return {
            title: row.title,
            subtitle: row.author || 'N/A',
            primaryValue: row.category,
            badges: (
                <span className={`px-2 py-0.5 rounded-full text-[10px] border ${visibilityStyles[row.visibility] || visibilityStyles.Draft}`}>
                    {row.visibility}
                </span>
            ),
            fields: [
                {
                    label: "Created",
                    value: new Date(row.created_at).toLocaleDateString(),
                },
                {
                    label: "Tags",
                    value: (row.tags || []).join(', ') || "—",
                }
            ],
        };
    }, []);

    // Filter actual columns based on visibility
    const filteredColumns = useMemo(
        () => columns.filter((col) =>
            visibleColumns.find((v) => v.key === col.key)?.visible
        ),
        [visibleColumns]
    );

    // -----------------------------
    // Import Handler
    // -----------------------------
    const handleImport = async (data: any[], mode: ImportMode) => {
        try {
            notifyInfo(`Importing ${data.length} blogs in ${mode} mode...`);

            // Map ImportMode to backend mode type
            const backendMode = mode as 'create' | 'update' | 'upsert';
            const result = await blogService.importBlogs(data, backendMode);

            const { success, failed, skipped, errors } = result;

            if (failed === 0 && skipped === 0) {
                notifySuccess(`Successfully imported ${success} blogs!`);
            } else {
                notifyInfo(
                    `Import completed: ${success} successful, ${skipped} skipped, ${failed} failed`
                );
                if (failed > 0) {
                    console.error('Import errors:', errors);
                }
            }

            // Refetch all blog data (list and stats) after import
            queryClient.invalidateQueries({ queryKey: blogKeys.all });
        } catch (error: any) {
            notifyError(error?.message || 'Failed to import blogs');
            throw error; // Re-throw so ImportDialog can show error
        }
    };

    // -----------------------------
    // Export Handler
    // -----------------------------
    const handleExport = async (options: any) => {
        try {
            // Map ExportDialog options to backend service options
            const exportScope = options.scope === 'current' ? 'all' : options.scope;
            const exportFormat = options.format === 'pdf' || options.format === 'json' ? 'csv' : options.format;

            const blob = await blogService.exportBlogs({
                scope: exportScope,
                format: exportFormat,
                selectedIds: options.selectedIds,
                selectedColumns: options.selectedColumns,
                dateRange: options.dateRange ? {
                    from: options.dateRange.from,
                    to: options.dateRange.to,
                } : undefined,
            });

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `blogs-export-${Date.now()}.${exportFormat}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            notifySuccess(`Successfully exported ${exportScope === 'all' ? 'all' : 'selected'} blogs`);
        } catch (error: any) {
            notifyError(error?.message || 'Failed to export blogs');
        }
    };

    // -----------------------------
    // Actions Menu (Row Options)
    // -----------------------------
    // Handle bulk delete
    const handleBulkDelete = () => {
        if (selectedBlogs.length === 0) return;
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            const ids = selectedBlogs.map(b => b.blog_id);
            await blogService.bulkDeleteBlogs(ids);
            notifyInfo(`Successfully deleted ${selectedBlogs.length} blogs`);

            // Clear selection and refresh list
            setSelectedBlogs([]);
            setSelectedIds([]);
            setShowDeleteDialog(false);
            window.location.reload();
        } catch (error) {
            console.error('Bulk delete failed:', error);
            notifyInfo('Failed to delete blogs');
        } finally {
            setIsDeleting(false);
        }
    };

    const globalActions = [
        // {
        //     label: "Duplicate Blog",
        //     icon: <Copy size={16} />,
        //     disabled: selectedBlogs.length === 0,
        //     onClick: () => notifyInfo("Duplicate not implemented")
        // },
        {
            label: "Delete",
            icon: <XCircle size={16} />,
            danger: true,
            disabled: selectedBlogs.length === 0,
            onClick: handleBulkDelete
        },
    ];

    return (
        <div className="px-9 lg:px-8 pb-8 lg:pb-8 pt-2 space-y-7">
            {/* Date range + Actions */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="w-auto">
                        <DateRangePicker value={dateRange} onChange={setDateRange} />
                    </div>
                </div>

                <ActionButtons
                    primaryLabel="Create Blog"
                    primaryTo="/blogs/add"
                    onImport={handleImport}
                    onExport={handleExport}
                    importFields={blogImportFields}
                    exportColumns={blogExportColumns}
                    templateUrl={blogTemplateUrl}
                    moduleName={blogModuleName}
                    totalItems={blogs?.length || 0}
                    supportsDateRange={true}
                    allowUpdate={true}
                />
            </div>

            {/* Metrics */}
            <MetricsGrid metrics={metrics} />

            {/* Error */}
            {error && (
                <div className="text-xs text-red-500 bg-red-50 p-2 rounded-lg border border-red-100">
                    Failed to load blogs. Please try again.
                </div>
            )}

            {/* Filters Bar */}
            <FiltersBar
                search={search}
                onSearchChange={(v) => { setSearch(v); setPage(1); }}
                filterGroups={[
                    {
                        id: "visibility",
                        label: "Visibility",
                        options: visibilityFilterOptions
                    },
                    {
                        id: "tags",
                        label: "Tags",
                        options: tagFilterOptions
                    }
                ]}
                sortOptions={sortOptions}
                visibleColumns={visibleColumns}
                onToggleColumn={toggleColumn}
                actions={globalActions}
                onClearFilters={() => {
                    setVisibility([]);
                    setCategory("");
                    setMinViews("");
                    setSearch("");
                    setTagSearch([]);
                    setSort("");
                    setDateRange({ from: null, to: null });
                    setPage(1);
                }}
            />

            {/* Table */}
            <GenericTable<Blog>
                data={filteredBlogs}
                loading={isLoading}
                page={page}
                totalPages={meta?.total ? Math.ceil(meta.total / rowsPerPage) : 1}
                rowsPerPage={rowsPerPage}
                totalItems={meta?.total || filteredBlogs.length}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                getRowId={(row) => row.blog_id}
                columns={filteredColumns}
                selectable={true}
                sortKey={sortBy || ''}
                sortDirection={sortOrder || 'asc'}
                onSortChange={(key, direction) => {
                    let sortKey = key;
                    if (key === 'views') sortKey = 'views_count';
                    if (key === 'publish_date') sortKey = 'published_at';
                    const sortValue = `${sortKey}_${direction}`;
                    setSort(sortValue);
                    setPage(1);
                }}
                onSelectionChange={(selected) => setSelectedBlogs(selected)}
                externalSelectionIds={selectedIds}
                onSelectionIdsChange={setSelectedIds}
                forceTableOnMobile={false}
                renderMobileCard={renderMobileCard}
                onRowClick={(row) => navigate(ROUTES.BLOGS.EDIT(row.blog_id))}
            />

            <ConfirmationDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleConfirmDelete}
                title={`Delete ${selectedBlogs.length} Blog(s)`}
                description="Are you sure you want to delete the selected blogs? This action cannot be undone."
                confirmText={isDeleting ? "Deleting..." : "Delete"}
                cancelText="Cancel"
                variant="destructive"
                isLoading={isDeleting}
            />
        </div>
    );
};

export default BlogListPage;
