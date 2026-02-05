import { useMemo } from 'react';
import { useListState } from '@/hooks/useListState';
import { MOCK_ORDERS } from "../data/mockOrders";
import { CheckCircle, XCircle, Server, UserCog } from 'lucide-react';
import type { MetricItem } from '@/components/features/metrics';
import type { Order } from '../types/order.types';
import type { DateRangeValue } from '@/hooks/useDateRange';

export interface UseOrderListReturn {
  search: string;
  status: string;
  sort: string;
  dateRange: DateRangeValue;
  page: number;
  rowsPerPage: number;
  orders: Order[];
  total: number;
  totalPages: number;
  metrics: MetricItem[];
  setSearch: (val: string) => void;
  setStatus: (status: string) => void;
  setSort: (sort: string) => void;
  setDateRange: (range: DateRangeValue) => void;
  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  handleClearFilters: () => void;
}

export const useOrderList = (): UseOrderListReturn => {
  // 1. Centralized State
  const {
    search,
    setSearch,
    status,
    setStatus,
    sort,
    setSort,
    dateRange,
    setDateRange,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    resetFilters
  } = useListState({
    defaultSort: "date_desc"
  });

  // Filter Logic (In-memory for mock data)
  const filteredOrders = useMemo(() => {
    let result = [...MOCK_ORDERS];

    // 1. Search Filter
    if (search) {
      result = result.filter(order =>
        order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        order.fulfillmentStatus.toLowerCase().includes(search.toLowerCase()) ||
        order.paymentStatus.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 2. Status Filter
    if (status) {
      result = result.filter(order =>
        order.paymentStatus.toLowerCase() === status.toLowerCase()
      );
    }

    // 3. Date Range Filter
    if (dateRange?.from) {
      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0);

      result = result.filter(order => {
        const orderDate = new Date(order.orderDate);
        orderDate.setHours(0, 0, 0, 0);

        if (dateRange.to) {
          const toDate = new Date(dateRange.to);
          toDate.setHours(23, 59, 59, 999);
          return orderDate >= fromDate && orderDate <= toDate;
        }

        return orderDate >= fromDate;
      });
    }

    // 4. Sorting
    return result.sort((a, b) => {
      const direction = sort.endsWith('_asc') ? 1 : -1;
      const key = sort.split('_')[0];

      if (key === 'date') return (new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()) * direction;
      if (key === 'id') return a.orderNumber.localeCompare(b.orderNumber) * direction;
      if (key === 'customer') return a.customer.name.localeCompare(b.customer.name) * direction;
      if (key === 'total') return (a.grandTotal - b.grandTotal) * direction;
      return 0;
    });
  }, [search, status, dateRange, sort]);

  // Pagination Logic
  const paginatedOrders = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, page, rowsPerPage]);

  const total = filteredOrders.length;
  const totalPages = Math.ceil(total / rowsPerPage);

  // Metrics Logic
  const metrics: MetricItem[] = useMemo(() => {
    const activeCount = MOCK_ORDERS.filter(o => ['Pending', 'Partial'].includes(o.fulfillmentStatus)).length;
    const inactiveCount = MOCK_ORDERS.filter(o => ['Fulfilled', 'Cancelled'].includes(o.fulfillmentStatus)).length;

    return [
      {
        title: "Active",
        value: activeCount,
        helperText: "Pending & Partial",
        icon: CheckCircle,
        iconBg: "#10B981",
      },
      {
        title: "Inactive",
        value: inactiveCount,
        helperText: "Fulfilled & Cancelled",
        icon: XCircle,
        iconBg: "#F59E0B",
      },
      {
        title: "Automated",
        value: 0,
        helperText: "System generated",
        icon: Server,
        iconBg: "#3B82F6",
      },
      {
        title: "Manual",
        value: 2,
        helperText: "Manually created",
        icon: UserCog,
        iconBg: "#8B5CF6",
      }
    ];
  }, []);

  return {
    // State
    search,
    status,
    sort,
    // Safe conversion from DateRange (react-day-picker) to DateRangeValue (app)
    dateRange: dateRange ? { from: dateRange.from || null, to: dateRange.to || null } : { from: null, to: null },
    page,
    rowsPerPage,

    // Data
    orders: paginatedOrders,
    total,
    totalPages,
    metrics,

    // Setters & Handlers
    setSearch: (v) => { setSearch(v); setPage(1); },
    setStatus: (v) => { setStatus(v); setPage(1); },
    setSort: (v) => { setSort(v); setPage(1); },
    setDateRange: (v: DateRangeValue) => setDateRange(v.from ? { from: v.from, to: v.to ?? undefined } : undefined),
    setPage,
    setRowsPerPage,
    handleClearFilters: resetFilters,
  };
};
