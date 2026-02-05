import { useMemo } from 'react';
import { Layers, Package } from 'lucide-react';
import type { ColumnConfig } from '@/components/features/data-table';
import type { Collection } from '../types/collection.types';

export const useCollectionColumns = (): ColumnConfig<Collection>[] => {
  return useMemo(() => [
    {
      key: "title",
      label: "Collection",
      type: "text",
      sortable: true,
      sortKey: "title",
      link: (row) => `/collections/${row.id}`,
      linkClassName: "text-black font-semibold",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          {row.bannerImage && (
            <img
              src={row.bannerImage}
              className="w-12 h-12 rounded-lg object-cover"
              alt={row.title}
              onError={(e) => {
                if (!e.currentTarget.dataset.fallback) {
                  e.currentTarget.dataset.fallback = "true";
                  e.currentTarget.src = 'https://via.placeholder.com/48?text=No+Image';
                }
              }}
            />
          )}
          {!row.bannerImage && (
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <Layers className="size-5 text-gray-400" />
            </div>
          )}
          <div>
            <p className="text-[13px] font-semibold">{row.title}</p>
            <p className="text-[11px] text-gray-500">{row.urlHandle}</p>
          </div>
        </div>
      ),
    },
    {
      key: "collectionType",
      label: "Type",
      type: "badge",
      sortable: true,
      sortKey: "collectionType",
      render: (value) => {
        const type = value as string;
        const badgeStyle = type === "automated"
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-amber-50 text-amber-700 border-amber-200";
        return (
          <span className={`px-2 py-0.5 rounded-full text-[10px] border ${badgeStyle} capitalize`}>
            {type}
          </span>
        );
      }
    },
    {
      key: "productCount",
      label: "Products",
      type: "number",
      sortable: true,
      sortKey: "productCount",
      render: (value) => {
        const count = (value as number) || 0;
        return (
          <div className="flex items-center gap-1.5">
            <Package className="size-3.5 text-gray-400" />
            <span className="text-[13px] font-medium">{count}</span>
          </div>
        );
      }
    },
    {
      key: "status",
      label: "Status",
      type: "badge",
      sortable: true,
      sortKey: "status",
      render: (value) => {
        const status = (value as string)?.toLowerCase();
        const badgeStyle = status === "active"
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-gray-100 text-gray-600 border-gray-200";
        return (
          <span className={`px-2 py-0.5 rounded-full text-[10px] border ${badgeStyle} capitalize`}>
            {status}
          </span>
        );
      }
    },
    {
      key: "tags",
      label: "Tags",
      type: "text",
      render: (value) => {
        const tags = value as string[];
        if (!tags || tags.length === 0) return <span className="text-gray-400 text-xs">—</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] border border-slate-200"
              >
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="text-[10px] text-gray-500">+{tags.length - 2}</span>
            )}
          </div>
        );
      }
    },
    {
      key: "createdAt",
      label: "Created",
      type: "date",
      sortable: true,
      sortKey: "createdAt",
      render: (value) => {
        if (!value) return <span className="text-gray-400 text-xs">—</span>;
        return (
          <span className="text-[12px] text-gray-600">
            {new Date(value as string).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        );
      }
    },
  ], []);
};
