import { useState, useMemo } from 'react';
import { usePagination, useSearch, useDateRange } from '@/hooks';
import { mockSegments } from '../data/mock-data';

export const useSegmentsList = () => {
  const { dateRange, setDateRange } = useDateRange();
  const { search, setSearch } = useSearch();
  const { page, rowsPerPage, setPage, setRowsPerPage } = usePagination();
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");

  // Visible Columns
  const [visibleColumns, setVisibleColumns] = useState([
    { key: "id", label: "ID", visible: true },
    { key: "segmentName", label: "Segment Name", visible: true },
    { key: "type", label: "Type", visible: true },
    { key: "createdBy", label: "Created By", visible: true },
    { key: "filters", label: "Filters", visible: true },
    { key: "filteredUsers", label: "Users", visible: true },
  ]);

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c))
    );
  };

  // Filter segments
  const filteredSegments = useMemo(() => {
    let filtered = [...mockSegments];

    if (search) {
      filtered = filtered.filter(segment =>
        segment.segmentName.toLowerCase().includes(search.toLowerCase()) ||
        segment.id.toLowerCase().includes(search.toLowerCase()) ||
        segment.createdBy.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filtered = filtered.filter(segment =>
        segment.type?.toLowerCase() === status.toLowerCase()
      );
    }

    // Sort segments
    if (sort === 'newest') {
      filtered.sort((a, b) => b.id.localeCompare(a.id));
    } else if (sort === 'oldest') {
      filtered.sort((a, b) => a.id.localeCompare(b.id));
    } else if (sort === 'segmentName_asc') {
      filtered.sort((a, b) => a.segmentName.localeCompare(b.segmentName));
    } else if (sort === 'segmentName_desc') {
      filtered.sort((a, b) => b.segmentName.localeCompare(a.segmentName));
    } else if (sort === 'type_asc') {
      filtered.sort((a, b) => a.type.localeCompare(b.type));
    } else if (sort === 'type_desc') {
      filtered.sort((a, b) => b.type.localeCompare(a.type));
    } else if (sort === 'createdBy_asc') {
      filtered.sort((a, b) => a.createdBy.localeCompare(b.createdBy));
    } else if (sort === 'createdBy_desc') {
      filtered.sort((a, b) => b.createdBy.localeCompare(a.createdBy));
    } else if (sort === 'filteredUsers_asc') {
      filtered.sort((a, b) => a.filteredUsers - b.filteredUsers);
    } else if (sort === 'filteredUsers_desc') {
      filtered.sort((a, b) => b.filteredUsers - a.filteredUsers);
    } else if (sort === 'id_asc') {
      filtered.sort((a, b) => a.id.localeCompare(b.id));
    } else if (sort === 'id_desc') {
      filtered.sort((a, b) => b.id.localeCompare(a.id));
    }

    return filtered;
  }, [search, status, sort]);

  // Pagination
  const total = filteredSegments.length;
  const totalPages = Math.ceil(total / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const segments = filteredSegments.slice(startIndex, endIndex);

  // Metrics
  const metrics = useMemo(() => {
    const distributor = filteredSegments.filter((s) => s.type === "Distributor").length;
    const retail = filteredSegments.filter((s) => s.type === "Retail").length;
    const wholesale = filteredSegments.filter((s) => s.type === "Wholesale").length;
    const totalUsers = filteredSegments.reduce((sum, s) => sum + s.filteredUsers, 0);

    return {
      distributor,
      retail,
      wholesale,
      totalUsers,
      total
    };
  }, [filteredSegments, total]);

  const clearFilters = () => {
    setStatus("");
    setSearch("");
    setSort("");
    setPage(1);
  };

  return {
    // Data
    segments,
    filteredSegments,
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
    sort,
    setSort,
    clearFilters,

    // Date Range
    dateRange,
    setDateRange,

    // Columns
    visibleColumns,
    toggleColumn,
  };
};
