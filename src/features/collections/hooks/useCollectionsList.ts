import { useState, useMemo, useCallback, useEffect } from 'react';
import { usePagination, useSearch, useDateRange } from '@/hooks';
import { mockCollections } from '../data/mockCollections';
import type { Collection } from '../types/collection.types';

export const useCollectionsList = () => {
  const { dateRange, setDateRange } = useDateRange();
  const { search, setSearch } = useSearch();
  const { page, rowsPerPage, setPage, setRowsPerPage } = usePagination();
  const [status, setStatus] = useState("");
  const [collectionType, setCollectionType] = useState("");
  const [sortKey, setSortKey] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial data load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Visible Columns
  const [visibleColumns, setVisibleColumns] = useState([
    { key: "title", label: "Collection", visible: true },
    { key: "collectionType", label: "Type", visible: true },
    { key: "productCount", label: "Products", visible: true },
    { key: "status", label: "Status", visible: true },
    { key: "tags", label: "Tags", visible: true },
    { key: "createdAt", label: "Created", visible: true },
  ]);

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c))
    );
  };

  // Filter and sort collections
  const filteredCollections = useMemo(() => {
    let result = [...mockCollections];

    if (search) {
      result = result.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (status) {
      result = result.filter(c =>
        c.status?.toLowerCase() === status.toLowerCase()
      );
    }

    if (collectionType) {
      result = result.filter(c =>
        c.collectionType?.toLowerCase() === collectionType.toLowerCase()
      );
    }

    // Sort collections
    if (sortKey) {
      result.sort((a, b) => {
        const aValue = a[sortKey as keyof Collection];
        const bValue = b[sortKey as keyof Collection];

        if (aValue === bValue) return 0;
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (sortDirection === 'asc') {
          return (aValue as number) < (bValue as number) ? -1 : 1;
        } else {
          return (aValue as number) > (bValue as number) ? -1 : 1;
        }
      });
    }

    return result;
  }, [search, status, collectionType, sortKey, sortDirection]);

  // Pagination
  const total = filteredCollections.length;
  const totalPages = Math.ceil(total / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const collections = filteredCollections.slice(startIndex, endIndex);

  // Metrics
  const metrics = useMemo(() => {
    const active = filteredCollections.filter((c) => c.status?.toLowerCase() === "active").length;
    const inactive = filteredCollections.filter((c) => c.status === "inactive").length;
    const automated = filteredCollections.filter((c) => c.collectionType === "automated").length;
    const manual = filteredCollections.filter((c) => c.collectionType === "manual").length;

    return {
      active,
      inactive,
      automated,
      manual,
      total
    };
  }, [filteredCollections, total]);

  const clearFilters = useCallback(() => {
    setStatus("");
    setCollectionType("");
    setSearch("");
    setSortKey("createdAt");
    setSortDirection("desc");
    setPage(1);
  }, [setSearch, setPage]);

  return {
    // Data
    collections,
    filteredCollections,
    metrics,

    // Pagination
    page,
    totalPages,
    rowsPerPage,
    total,
    setPage,
    setRowsPerPage,

    // Filters
    search,
    setSearch,
    status,
    setStatus,
    collectionType,
    setCollectionType,
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
    clearFilters,

    // Date Range
    dateRange,
    setDateRange,

    // Loading
    isLoading,

    // Columns
    visibleColumns,
    toggleColumn,
  };
};
