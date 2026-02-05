import { useState } from 'react';
import { Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { GenericTable } from '@/components/features/data-table';
import { useCustomerList } from '../../customers/hooks/useCustomerList';
import type { Customer } from '../../customers/types/customer.types';

interface UserSelectorProps {
  onUserSearch?: (query: string) => void;
  onUsersSelected?: (users: Customer[]) => void;
}

export function UserSelector({ onUserSearch, onUsersSelected }: UserSelectorProps) {
  const [selectedUsers, setSelectedUsers] = useState<Customer[]>([]);

  const {
    search,
    setSearch,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    customers,
    total,
    totalPages,
    filteredColumns,
    renderMobileCard,
    handleSortChange,
    sort
  } = useCustomerList();

  const handleSelectionChange = (selected: Customer[]) => {
    setSelectedUsers(selected);
  };

  const handleAddSelectedUsers = () => {
    if (onUsersSelected && selectedUsers.length > 0) {
      onUsersSelected(selectedUsers);
      setSelectedUsers([]);
    }
  };

  return (
    <div className="border-t border-slate-200 pt-6 mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-slate-700">
          Add Users
        </Label>
        {selectedUsers.length > 0 && (
          <Button
            size="sm"
            onClick={handleAddSelectedUsers}
            className="bg-[#0e042f] hover:bg-[#0e042f]/90 text-white"
          >
            Add Selected ({selectedUsers.length})
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            placeholder="Search users..."
            className="pl-9 rounded-xl"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
              onUserSearch?.(e.target.value);
            }}
          />
        </div>

        <p className="text-xs text-slate-500">
          Select users from the table below to manually add to this segment
        </p>
      </div>

      {/* Users Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <GenericTable<Customer>
          data={customers}
          loading={false}
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalItems={total}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          getRowId={(row) => row.id}
          columns={filteredColumns}
          selectable={true}
          selectionMode="multiple"
          onSelectionChange={handleSelectionChange}
          sortKey={sort.split('_')[0] || ''}
          sortDirection={(sort.split('_')[1] as 'asc' | 'desc') || 'asc'}
          onSortChange={handleSortChange}
          renderMobileCard={renderMobileCard}
        />
      </div>
    </div>
  );
}