import React, { useState } from 'react';
import { Plus, Edit, Trash2, AlertCircle, Shield, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GenericTable, type ColumnConfig } from '@/components/features/data-table';
import { FiltersBar } from '@/components/features/data-table';
import { Badge } from '@/components/ui/badge';
import { MetricsGrid, type MetricItem } from '@/components/features/metrics';
import { usePagination, useSearch } from '@/hooks';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AddEditPermission } from '../components/AddEditPermission';
import { notifySuccess } from '@/utils';

interface Permission {
  id: string;
  key: string;
  module: string;
  label: string;
  description: string;
  isCritical: boolean;
  createdDate: string;
}

const mockPermissions: Permission[] = [
  {
    id: '1',
    key: 'orders.view',
    module: 'orders',
    label: 'View Orders',
    description: 'Can view order list and details',
    isCritical: false,
    createdDate: '2024-01-10',
  },
  {
    id: '2',
    key: 'orders.create',
    module: 'orders',
    label: 'Create Orders',
    description: 'Can create new orders',
    isCritical: false,
    createdDate: '2024-01-10',
  },
  {
    id: '3',
    key: 'orders.refund',
    module: 'orders',
    label: 'Refund Orders',
    description: 'Can process refunds',
    isCritical: true,
    createdDate: '2024-01-10',
  },
  {
    id: '4',
    key: 'products.view',
    module: 'products',
    label: 'View Products',
    description: 'Can view product catalog',
    isCritical: false,
    createdDate: '2024-01-10',
  },
  {
    id: '5',
    key: 'products.edit_prices',
    module: 'products',
    label: 'Edit Prices',
    description: 'Can modify product prices',
    isCritical: true,
    createdDate: '2024-01-10',
  },
  {
    id: '6',
    key: 'products.archive',
    module: 'products',
    label: 'Archive Products',
    description: 'Can archive/delete products',
    isCritical: true,
    createdDate: '2024-01-10',
  },
  {
    id: '7',
    key: 'customers.view',
    module: 'customers',
    label: 'View Customers',
    description: 'Can view customer list',
    isCritical: false,
    createdDate: '2024-01-10',
  },
  {
    id: '8',
    key: 'customers.export',
    module: 'customers',
    label: 'Export Customer Data',
    description: 'Can export customer information',
    isCritical: true,
    createdDate: '2024-01-10',
  },
  {
    id: '9',
    key: 'reports.financial',
    module: 'reports',
    label: 'View Financial Reports',
    description: 'Can view sensitive financial data',
    isCritical: true,
    createdDate: '2024-01-10',
  },
];

const PermissionCataloguePage: React.FC = () => {
  const { search, setSearch } = useSearch();
  const { page, rowsPerPage, setPage, setRowsPerPage } = usePagination();
  const [moduleFilter, setModuleFilter] = useState<string>('');
  const [selectedPermissionId, setSelectedPermissionId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Show form if creating new or editing
  if (isCreatingNew || selectedPermissionId) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 p-6">
        <AddEditPermission
          permissionId={selectedPermissionId || undefined}
          onBack={() => {
            setIsCreatingNew(false);
            setSelectedPermissionId(null);
          }}
          onSave={(permissionData) => {
            console.log('Saving permission:', permissionData);
            notifySuccess(selectedPermissionId ? 'Permission updated successfully' : 'Permission created successfully');
            setIsCreatingNew(false);
            setSelectedPermissionId(null);
          }}
        />
      </div>
    );
  }

  // Filter data
  let filteredPermissions = [...mockPermissions];

  if (search) {
    filteredPermissions = filteredPermissions.filter(
      (perm) =>
        perm.key.toLowerCase().includes(search.toLowerCase()) ||
        perm.label.toLowerCase().includes(search.toLowerCase()) ||
        perm.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (moduleFilter) {
    filteredPermissions = filteredPermissions.filter((perm) => perm.module === moduleFilter);
  }

  // Pagination
  const total = filteredPermissions.length;
  const totalPages = Math.ceil(total / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPermissions = filteredPermissions.slice(startIndex, endIndex);

  // Get unique modules
  const modules = Array.from(new Set(mockPermissions.map((p) => p.module)));

  // Metrics
  const metrics: MetricItem[] = [
    {
      title: 'Total Permissions',
      value: mockPermissions.length,
      helperText: 'All defined permissions',
      icon: Shield,
      iconBg: '#3B82F6',
    },
    {
      title: 'Critical Permissions',
      value: mockPermissions.filter((p) => p.isCritical).length,
      helperText: 'Require special attention',
      icon: AlertCircle,
      iconBg: '#EF4444',
    },
    {
      title: 'Total Modules',
      value: modules.length,
      helperText: 'Permission categories',
      icon: Database,
      iconBg: '#10B981',
    },
  ];

  // Columns
  const columns: ColumnConfig<Permission>[] = [
    {
      key: 'key',
      label: 'PERMISSION KEY',
      type: 'text',
      render: (val) => (
        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-900">
          {val as string}
        </code>
      ),
    },
    {
      key: 'module',
      label: 'MODULE',
      type: 'text',
      render: (val) => (
        <Badge variant="outline" className="capitalize">
          {val as string}
        </Badge>
      ),
    },
    {
      key: 'label',
      label: 'LABEL',
      type: 'text',
      render: (val) => <span className="text-slate-900">{val as string}</span>,
    },
    {
      key: 'description',
      label: 'DESCRIPTION',
      type: 'text',
      render: (val) => (
        <span className="text-slate-600 line-clamp-2 max-w-sm">{val as string}</span>
      ),
    },
    {
      key: 'isCritical',
      label: 'CRITICAL',
      type: 'text',
      align: 'center',
      render: (val) =>
        val ? (
          <Badge variant="destructive">⚠️ Critical</Badge>
        ) : (
          <span className="text-slate-400 text-sm">—</span>
        ),
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      align: 'center',
      render: (_, row) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPermissionId(row.id);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Delete permission:', row.id);
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const filterOptions = [
    { label: 'All Modules', value: '', onSelect: () => setModuleFilter(''), isActive: moduleFilter === '' },
    ...modules.map((module) => ({
      label: module.charAt(0).toUpperCase() + module.slice(1),
      value: module,
      onSelect: () => setModuleFilter(module),
      isActive: moduleFilter === module,
    })),
  ];

  const sortOptions = [
    { label: 'Name (A-Z)', value: 'name_asc', direction: 'asc' as const, isActive: false, onSelect: () => { } },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Permissions Catalogue
            </h1>
            <p className="text-indigo-600 text-sm">
              System-wide permission definitions (Platform Owner Only)
            </p>
          </div>
          <Button className="bg-slate-900 text-white hover:bg-slate-800" onClick={() => setIsCreatingNew(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Permission
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Warning Banner */}
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <AlertDescription className="text-amber-900">
            <strong>Platform Owner Access Only:</strong> This catalogue defines all available
            permissions in the system. Changes here will affect all roles and users. Be careful
            when deleting or modifying permissions.
          </AlertDescription>
        </Alert>

        {/* Metrics */}
        <MetricsGrid metrics={metrics} />

        {/* Filters */}
        <FiltersBar
          search={search}
          onSearchChange={setSearch}
          filters={filterOptions}
          sortOptions={sortOptions}
          actions={[]}
          visibleColumns={[]}
          onToggleColumn={() => { }}
          searchPlaceholder="Search permissions by key, label, or description..."
          onClearFilters={() => {
            setSearch('');
            setModuleFilter('');
            setPage(1);
          }}
        />

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <GenericTable<Permission>
            columns={columns}
            data={currentPermissions}
            loading={false}
            page={page}
            rowsPerPage={rowsPerPage}
            totalPages={totalPages}
            totalItems={total}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
            getRowId={(row) => row.id}
            selectable={false}
            renderMobileCard={(permission) => ({
              title: permission.label,
              subtitle: permission.key,
              fields: [
                { label: 'Module', value: permission.module, badge: true },
                { label: 'Description', value: permission.description },
                { label: 'Critical', value: permission.isCritical ? 'Yes' : 'No', badge: permission.isCritical },
              ],
              actions: [
                {
                  label: 'Edit',
                  onClick: () => setSelectedPermissionId(permission.key),
                  variant: 'default',
                },
              ],
            })}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-slate-600 text-sm">
              Showing {startIndex + 1} to {Math.min(endIndex, total)} of {total} permissions
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={page === p ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionCataloguePage;
