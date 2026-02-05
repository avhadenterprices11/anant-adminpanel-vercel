/**
 * useTagList Hook
 * 
 * State management for tags list page
 */

import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { Tag as TagIcon, CheckCircle, XCircle, ShoppingBag } from 'lucide-react';
import type { MetricItem } from '@/components/features/metrics';
import { logger } from '@/lib/utils/logger';
import { tagService } from '../services/tagService';
import type { Tag } from '../types/tag.types';

export interface UseTagListReturn {
    tags: Tag[];
    total: number;
    isLoading: boolean;
    error: Error | null;
    page: number;
    setPage: (page: number) => void;
    rowsPerPage: number;
    setRowsPerPage: (rows: number) => void;
    search: string;
    setSearch: (search: string) => void;
    type: string[];
    setType: (type: string[]) => void;
    status: string[];
    setStatus: (status: string[]) => void;
    sort: string;
    setSort: (sort: string) => void;
    visibleColumns: Array<{ key: string; label: string; visible: boolean }>;
    toggleColumn: (key: string) => void;
    metrics: MetricItem[];
    refetch: () => void;
    dateRange: any;
    setDateRange: (range: any) => void;
    handleBulkDelete: (selectedTags: Tag[]) => Promise<void>;
    usage: string[];
    setUsage: (usage: string[]) => void;
    typeFilterOptions: { label: string; value: string; onSelect: () => void; isActive: boolean }[];
    usageFilterOptions: { label: string; value: string; onSelect: () => void; isActive: boolean }[];
}

export function useTagList(): UseTagListReturn {
    // State Management
    const [tags, setTags] = useState<Tag[]>([]);
    const [allTags, setAllTags] = useState<Tag[]>([]); // For metrics
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('rowsPerPage');
            return stored ? Number(stored) : 10;
        }
        return 10;
    });
    const [search, setSearch] = useState('');
    const [type, setType] = useState<string[]>([]);
    const [status, setStatus] = useState<string[]>([]);
    const [sort, setSort] = useState('');
    const [usage, setUsage] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<any>(undefined);

    // Helper to toggle selection
    const toggleFilter = (current: string[], value: string) => {
        if (value === "") return [];
        if (current.includes(value)) {
            return current.filter(c => c !== value);
        }
        return [...current, value];
    };

    // Column Configuration
    const [visibleColumns, setVisibleColumns] = useState([
        { key: 'name', label: 'Tag Name', visible: true },
        { key: 'type', label: 'Type', visible: true },
        { key: 'status', label: 'Status', visible: true },
        { key: 'usage_count', label: 'Usage Count', visible: true },
        { key: 'updated_at', label: 'Last Updated', visible: true },
        { key: 'created_at', label: 'Created', visible: false },
    ]);

    const toggleColumn = (key: string) => {
        setVisibleColumns((prev) =>
            prev.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c))
        );
    };

    // Fetch Tags
    const fetchTags = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params: any = {
                page,
                limit: rowsPerPage,
            };

            if (search) params.search = search;
            if (type.length > 0) params.type = type.join(',');

            if (status.length > 0) {
                params.status = status.map(s => s === 'active' ? 'true' : s === 'inactive' ? 'false' : s).join(',');
            }

            if (usage.length > 0) params.usage = usage.join(',');
            if (sort) params.sort = sort;

            const response = await tagService.getAllTags(params);

            // Handle both array and paginated response
            if (Array.isArray(response)) {
                setTags(response);
                setTotal(response.length);
            } else {
                setTags(response.tags || []);
                setTotal(response.total || response.tags?.length || 0);
            }
        } catch (err) {
            setError(err as Error);
            logger.error('Failed to fetch tags', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, [page, rowsPerPage, search, type, status, usage, sort]);

    // Fetch All Tags for Metrics
    const fetchMetrics = async () => {
        try {
            const response = await tagService.getAllTags({ limit: 10000 });
            if (Array.isArray(response)) {
                setAllTags(response);
            } else {
                setAllTags(response.tags || []);
            }
        } catch (err) {
            logger.error('Failed to fetch all tags for metrics', err);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, []);

    // Client-side Date Filtering
    const filteredTags = useMemo(() => {
        // First, filter by date range if set
        let filtered = tags;

        if (dateRange?.from) {
            const fromDate = new Date(dateRange.from);
            fromDate.setHours(0, 0, 0, 0);

            filtered = filtered.filter((tag) => {
                const dateToCheck = tag.created_at || tag.updated_at;
                if (!dateToCheck) return false;

                const tagDate = new Date(dateToCheck);
                tagDate.setHours(0, 0, 0, 0);

                if (dateRange.to) {
                    const toDate = new Date(dateRange.to);
                    toDate.setHours(23, 59, 59, 999);
                    return tagDate >= fromDate && tagDate <= toDate;
                }

                // Single date - show tags from that exact day
                return tagDate.getTime() === fromDate.getTime();
            });
        }

        return filtered;
    }, [tags, dateRange]);

    // Metrics Calculation
    const metrics: MetricItem[] = useMemo(() => {
        // Use allTags for metrics to show global stats
        const activeCount = allTags.filter((t) => t.status).length;
        const inactiveCount = allTags.filter((t) => !t.status).length;
        const productTags = allTags.filter((t) => t.type === 'product').length;
        // Removed unused totalUsage variable

        return [
            {
                title: 'Total Tags',
                value: allTags.length,
                helperText: 'All tags',
                icon: TagIcon,
                iconBg: '#735DFF',
            },
            {
                title: 'Active',
                value: activeCount,
                helperText: 'Currently in use',
                icon: CheckCircle,
                iconBg: '#2ECC71',
            },
            {
                title: 'Inactive',
                value: inactiveCount,
                helperText: 'Disabled tags',
                icon: XCircle,
                iconBg: '#E74C3C',
            },
            {
                title: 'Product Tags',
                value: productTags,
                helperText: 'Used for products',
                icon: ShoppingBag,
                iconBg: '#F5A623',
            },
        ];
    }, [allTags]);

    const handleBulkDelete = async (selectedTags: Tag[]) => {
        if (selectedTags.length === 0) return;

        try {
            const ids = selectedTags.map(t => t.id);
            await tagService.bulkDeleteTags(ids);
            toast.success(`Successfully deleted ${selectedTags.length} tags`);

            // Refresh list
            fetchTags();
            // Refresh metrics too (optional, but good)
            const response = await tagService.getAllTags({ limit: 10000 });
            if (Array.isArray(response)) {
                setAllTags(response);
            } else {
                setAllTags(response.tags || []);
            }
        } catch (error) {
            logger.error('Failed to delete tags', error);
            toast.error('Failed to delete tags');
        }
    };

    const typeFilterOptions = [
        { label: 'All Types', value: '', onSelect: () => setType([]), isActive: type.length === 0 },
        { label: 'Product', value: 'product', onSelect: () => setType(toggleFilter(type, 'product')), isActive: type.includes('product') },
        { label: 'Order', value: 'order', onSelect: () => setType(toggleFilter(type, 'order')), isActive: type.includes('order') },
        { label: 'Customer', value: 'customer', onSelect: () => setType(toggleFilter(type, 'customer')), isActive: type.includes('customer') },
        { label: 'Blogs', value: 'blogs', onSelect: () => setType(toggleFilter(type, 'blogs')), isActive: type.includes('blogs') },
    ];

    const usageFilterOptions = [
        { label: 'All Usage', value: '', onSelect: () => setUsage([]), isActive: usage.length === 0 },
        { label: 'Used', value: 'used', onSelect: () => setUsage(toggleFilter(usage, 'used')), isActive: usage.includes('used') },
        { label: 'Unused', value: 'unused', onSelect: () => setUsage(toggleFilter(usage, 'unused')), isActive: usage.includes('unused') },
    ];

    return {
        tags: filteredTags,
        total,
        isLoading,
        error,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        search,
        setSearch,
        type,
        setType,
        status,
        setStatus,
        sort,
        setSort,
        dateRange,
        setDateRange,
        visibleColumns,
        toggleColumn,
        metrics,
        refetch: () => { fetchTags(); fetchMetrics(); },
        handleBulkDelete,
        usage,
        setUsage,
        typeFilterOptions,
        usageFilterOptions
    };
}
