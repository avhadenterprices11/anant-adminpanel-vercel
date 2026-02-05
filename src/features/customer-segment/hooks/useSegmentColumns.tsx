import { useMemo } from 'react';
import { Users } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import type { ColumnConfig } from '@/components/features/data-table';
import type { CustomerSegment } from '../types/segment.types';

export const useSegmentColumns = (): ColumnConfig<CustomerSegment>[] => {
  return useMemo(() => [
    {
      key: 'id',
      label: 'ID',
      type: 'text',
      sortable: true,
      sortKey: 'id',

      link: (row) => ROUTES.CUSTOMER_SEGMENTS.DETAIL(row.id),
      render: (_, row) => (
        <span className="text-xs font-medium text-slate-700">{row.id}</span>
      ),
    },
    {
      key: 'segmentName',
      label: 'Segment Name',
      type: 'text',
      sortable: true,
      sortKey: 'segmentName',
      link: (row) => ROUTES.CUSTOMER_SEGMENTS.DETAIL(row.id),
      linkClassName: 'text-black',
      render: (_, row) => (
        <span className="text-sm text-black font-normal">{row.segmentName}</span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      type: 'badge',
      sortable: true,
      sortKey: 'type',

      link: (row) => ROUTES.CUSTOMER_SEGMENTS.DETAIL(row.id),
      render: (_, row) => {
        const styles: Record<string, string> = {
          'Distributor': 'bg-blue-50 text-blue-700 border-blue-200',
          'Retail': 'bg-purple-50 text-purple-700 border-purple-200',
          'Wholesale': 'bg-orange-50 text-orange-700 border-orange-200',
        };
        const style = styles[row.type] || 'bg-gray-50 text-gray-600 border-gray-200';
        return (
          <span className={`px-2 py-0.5 rounded-full text-[11px] border inline-flex items-center font-medium ${style}`}>
            {row.type}
          </span>
        );
      }
    },
    {
      key: 'createdBy',
      label: 'Created By',
      type: 'text',
      sortable: true,
      sortKey: 'createdBy',

      link: (row) => ROUTES.CUSTOMER_SEGMENTS.DETAIL(row.id),
    },
    {
      key: 'filters',
      label: 'Filters',

      link: (row) => ROUTES.CUSTOMER_SEGMENTS.DETAIL(row.id),
      render: (filters: unknown) => {
        const filterArray = filters as string[];
        return (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {filterArray.slice(0, 2).map((f, i) => (
              <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                {f}
              </span>
            ))}
            {filterArray.length > 2 && <span className="text-xs text-gray-500">+{filterArray.length - 2} more</span>}
          </div>
        );
      }
    },
    {
      key: 'filteredUsers',
      label: 'Users',
      type: 'number',
      align: 'center',
      sortable: true,
      sortKey: 'filteredUsers',

      link: (row) => ROUTES.CUSTOMER_SEGMENTS.DETAIL(row.id),
      render: (count: unknown) => (
        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md font-medium text-xs">
          <Users className="w-3 h-3" />
          {Number(count)}
        </div>
      )
    },
  ], []);
};
