
import React, { useState } from 'react';
import { Plus, Eye, Edit, MoreHorizontal, CheckCircle, XCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GenericTable, type ColumnConfig } from '@/components/features/data-table';
import { FiltersBar } from '@/components/features/data-table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MetricsGrid, type MetricItem } from '@/components/features/metrics';
import { usePagination, useSearch } from '@/hooks';
import { notifySuccess } from '@/utils';
import { CreateEditRole } from '../components/CreateEditRole';

interface Role {
  id: string;
  name: string;
  label: string;
  description: string;
  usersCount: number;
  createdDate: string;
  status: 'active' | 'inactive';
  isSystem: boolean;
}

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'ADMIN',
    label: 'Administrator',
    description: 'Full system access with all permissions',
    usersCount: 5,
    createdDate: '2024-01-15',
    status: 'active',
    isSystem: true,
  },
  {
    id: '2',
    name: 'MANAGER',
    label: 'Manager',
    description: 'Can manage orders, products, and view reports',
    usersCount: 12,
    createdDate: '2024-02-10',
    status: 'active',
    isSystem: false,
  },
  {
    id: '3',
    name: 'SALES_REP',
    label: 'Sales Representative',
    description: 'Can create and manage orders and customers',
    usersCount: 28,
    createdDate: '2024-03-05',
    status: 'active',
    isSystem: false,
  },
  {
    id: '4',
    name: 'SUPPORT',
    label: 'Support Agent',
    description: 'Can view orders and customer information',
    usersCount: 15,
    createdDate: '2024-03-12',
    status: 'active',
    isSystem: false,
  },
  {
    id: '5',
    name: 'GUEST',
    label: 'Guest',
    description: 'Read-only access to basic information',
    usersCount: 3,
    createdDate: '2024-04-01',
    status: 'inactive',
    isSystem: true,
  },
];

const RolesManagementPage: React.FC = () => {
  const { search, setSearch } = useSearch();
  const { page, rowsPerPage, setPage, setRowsPerPage } = usePagination();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'view' | 'edit' | 'create' | null>(null);

  // Show form if editing/viewing/creating
  if (viewMode) {
    return (
      <CreateEditRole
        roleId={selectedRoleId || undefined}
        mode={viewMode}
        onBack={() => {
          setSelectedRoleId(null);
          setViewMode(null);
        }}
        onSave={(roleData) => {
          console.log('Role saved:', roleData);
          notifySuccess(
            viewMode === 'create' ? 'Role created successfully' : 'Role updated successfully'
          );
          setSelectedRoleId(null);
          setViewMode(null);
        }}
      />
    );
  }

  // Filter data
  let filteredRoles = [...mockRoles];

  if (search) {
    filteredRoles = filteredRoles.filter(
      (role) =>
        role.name.toLowerCase().includes(search.toLowerCase()) ||
        role.label.toLowerCase().includes(search.toLowerCase()) ||
        role.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (statusFilter === 'active') {
    filteredRoles = filteredRoles.filter((role) => role.status === 'active');
  } else if (statusFilter === 'inactive') {
    filteredRoles = filteredRoles.filter((role) => role.status === 'inactive');
  } else if (statusFilter === 'system') {
    filteredRoles = filteredRoles.filter((role) => role.isSystem);
  }

  // Pagination
  const total = filteredRoles.length;
  const totalPages = Math.ceil(total / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRoles = filteredRoles.slice(startIndex, endIndex);

  // Metrics
  const metrics: MetricItem[] = [
    {
      title: 'Total Roles',
      value: mockRoles.length,
      helperText: 'All defined roles',
      icon: Shield,
      iconBg: '#3B82F6',
    },
    {
      title: 'Active Roles',
      value: mockRoles.filter((r) => r.status === 'active').length,
      helperText: 'Currently active',
      icon: CheckCircle,
      iconBg: '#10B981',
    },
    {
      title: 'Inactive Roles',
      value: mockRoles.filter((r) => r.status === 'inactive').length,
      helperText: 'Deactivated roles',
      icon: XCircle,
      iconBg: '#F59E0B',
    },
  ];

  // Columns
  const columns: ColumnConfig<Role>[] = [
    {
      key: 'label',
      label: 'ROLE NAME',
      type: 'text',
      render: (_val, row) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900">{row.label}</span>
            {row.isSystem && (
              <Badge variant="outline" className="text-xs">
                System
              </Badge>
            )}
          </div>
          <span className="text-slate-500 text-xs">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'DESCRIPTION',
      type: 'text',
      render: (val) => (
        <span className="text-slate-600 line-clamp-2 max-w-md">{val as string}</span>
      ),
    },
    {
      key: 'usersCount',
      label: 'USERS',
      type: 'text',
      align: 'center',
      render: (val) => <Badge variant="secondary">{val as number}</Badge>,
    },
    {
      key: 'createdDate',
      label: 'CREATED DATE',
      type: 'date',
      render: (val) => (
        <span className="text-slate-600">
          {new Date(val as string).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      type: 'text',
      render: (val) => (
        <Badge variant={val === 'active' ? 'emerald' : 'slate'} className="capitalize">
          {val as string}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      align: 'center',
      render: (_, row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {
              setSelectedRoleId(row.id);
              setViewMode('view');
            }}>
              <Eye className="mr-2 h-4 w-4" />
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setSelectedRoleId(row.id);
              setViewMode('edit');
            }}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit Role</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filterOptions = [
    { label: 'All Roles', value: '', onSelect: () => setStatusFilter(''), isActive: statusFilter === '' },
    { label: 'Active', value: 'active', onSelect: () => setStatusFilter('active'), isActive: statusFilter === 'active' },
    { label: 'Inactive', value: 'inactive', onSelect: () => setStatusFilter('inactive'), isActive: statusFilter === 'inactive' },
    { label: 'System Roles', value: 'system', onSelect: () => setStatusFilter('system'), isActive: statusFilter === 'system' },
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
              Roles Management
            </h1>
            <p className="text-slate-600 text-sm">Manage system roles and their permissions</p>
          </div>
          <Button
            className="bg-slate-900 text-white hover:bg-slate-800"
            onClick={() => {
              setSelectedRoleId(null);
              setViewMode('create');
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Role
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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
          searchPlaceholder="Search roles by name, label, or description..."
          onClearFilters={() => {
            setSearch('');
            setStatusFilter('');
            setPage(1);
          }}
        />

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <GenericTable<Role>
            columns={columns}
            data={currentRoles}
            loading={false}
            page={page}
            rowsPerPage={rowsPerPage}
            totalPages={totalPages}
            totalItems={total}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
            getRowId={(row) => row.id}
            selectable={false}
            renderMobileCard={(role) => ({
              title: role.label,
              subtitle: role.name,
              fields: [
                { label: 'Description', value: role.description },
                { label: 'Users', value: role.usersCount.toString() },
                { label: 'Status', value: role.status, badge: true },
                { label: 'Created', value: new Date(role.createdDate).toLocaleDateString() },
              ],
              actions: [
                {
                  label: 'View Details',
                  onClick: () => {
                    setSelectedRoleId(role.id);
                    setViewMode('view');
                  },
                  variant: 'outline',
                },
                {
                  label: 'Edit Role',
                  onClick: () => {
                    setSelectedRoleId(role.id);
                    setViewMode('edit');
                  },
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
              Showing {startIndex + 1} to {Math.min(endIndex, total)} of {total} roles
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

export default RolesManagementPage;
