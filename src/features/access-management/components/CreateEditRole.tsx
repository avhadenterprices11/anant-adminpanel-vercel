import { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Permission {
  key: string;
  label: string;
  description: string;
  isCritical: boolean;
}

interface Module {
  name: string;
  label: string;
  icon: string;
  permissions: Permission[];
}

const permissionModules: Module[] = [
  {
    name: 'orders',
    label: 'Orders',
    icon: '📦',
    permissions: [
      { key: 'orders.view', label: 'View Orders', description: 'Can view order list and details', isCritical: false },
      { key: 'orders.create', label: 'Create Orders', description: 'Can create new orders', isCritical: false },
      { key: 'orders.update', label: 'Update Orders', description: 'Can modify existing orders', isCritical: false },
      { key: 'orders.refund', label: 'Refund Orders', description: 'Can process refunds', isCritical: true },
      { key: 'orders.export', label: 'Export Orders', description: 'Can export order data', isCritical: false },
    ],
  },
  {
    name: 'products',
    label: 'Products',
    icon: '🏷️',
    permissions: [
      { key: 'products.view', label: 'View Products', description: 'Can view product catalog', isCritical: false },
      { key: 'products.create', label: 'Create Products', description: 'Can add new products', isCritical: false },
      { key: 'products.update', label: 'Update Products', description: 'Can edit product information', isCritical: false },
      { key: 'products.edit_prices', label: 'Edit Prices', description: 'Can modify product prices', isCritical: true },
      { key: 'products.archive', label: 'Archive Products', description: 'Can archive/delete products', isCritical: true },
    ],
  },
  {
    name: 'customers',
    label: 'Customers',
    icon: '👥',
    permissions: [
      { key: 'customers.view', label: 'View Customers', description: 'Can view customer list', isCritical: false },
      { key: 'customers.edit', label: 'Edit Customer Info', description: 'Can modify customer details', isCritical: false },
      { key: 'customers.export', label: 'Export Customer Data', description: 'Can export customer information', isCritical: true },
    ],
  },
  {
    name: 'inventory',
    label: 'Inventory',
    icon: '📊',
    permissions: [
      { key: 'inventory.view', label: 'View Inventory', description: 'Can view stock levels', isCritical: false },
      { key: 'inventory.update', label: 'Update Inventory', description: 'Can adjust stock quantities', isCritical: false },
      { key: 'inventory.transfer', label: 'Transfer Stock', description: 'Can transfer between locations', isCritical: false },
    ],
  },
  {
    name: 'reports',
    label: 'Reports',
    icon: '📈',
    permissions: [
      { key: 'reports.view', label: 'View Reports', description: 'Can view business reports', isCritical: false },
      { key: 'reports.export', label: 'Export Reports', description: 'Can download report data', isCritical: false },
      { key: 'reports.financial', label: 'View Financial Reports', description: 'Can view sensitive financial data', isCritical: true },
    ],
  },
];

interface CreateEditRoleProps {
  roleId?: string;
  onBack: () => void;
  onSave: (roleData: any) => void;
  mode?: 'view' | 'edit' | 'create';
}

export function CreateEditRole({ roleId, onBack, onSave, mode = 'create' }: CreateEditRoleProps) {
  const isEditMode = mode === 'edit' || !!roleId;
  const isViewMode = mode === 'view';

  // Role details state
  const [roleName, setRoleName] = useState(isEditMode ? 'MANAGER' : '');
  const [roleLabel, setRoleLabel] = useState(isEditMode ? 'Manager' : '');
  const [roleDescription, setRoleDescription] = useState(
    isEditMode ? 'Can manage orders, products, and view reports' : ''
  );
  const [roleIsActive, setRoleIsActive] = useState(true);

  // Permission state
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    isEditMode
      ? new Set(['orders.view', 'orders.create', 'orders.update', 'products.view', 'products.update'])
      : new Set()
  );
  const [activeModule, setActiveModule] = useState<string>('orders');
  const [searchQuery, setSearchQuery] = useState('');

  const togglePermission = (permissionKey: string) => {
    if (isViewMode) return;
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permissionKey)) {
      newSelected.delete(permissionKey);
    } else {
      newSelected.add(permissionKey);
    }
    setSelectedPermissions(newSelected);
  };

  const toggleAllInModule = (module: Module, select: boolean) => {
    if (isViewMode) return;
    const newSelected = new Set(selectedPermissions);
    module.permissions.forEach((perm) => {
      if (select) {
        newSelected.add(perm.key);
      } else {
        newSelected.delete(perm.key);
      }
    });
    setSelectedPermissions(newSelected);
  };

  const handleSave = () => {
    if (isViewMode) {
      onBack();
      return;
    }
    const roleData = {
      name: roleName,
      label: roleLabel,
      description: roleDescription,
      isActive: roleIsActive,
      permissions: Array.from(selectedPermissions),
    };
    onSave(roleData);
  };

  const activeModuleData = permissionModules.find((m) => m.name === activeModule);
  const filteredPermissions =
    activeModuleData?.permissions.filter(
      (perm) =>
        perm.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        perm.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const selectedInModule =
    activeModuleData?.permissions.filter((perm) => selectedPermissions.has(perm.key)).length || 0;
  const totalInModule = activeModuleData?.permissions.length || 0;

  const totalCriticalPermissions = Array.from(selectedPermissions).filter((key) =>
    permissionModules.some((m) => m.permissions.some((p) => p.key === key && p.isCritical))
  ).length;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-10 w-10">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                {isViewMode ? 'View Role' : isEditMode ? 'Edit Role' : 'Create New Role'}
              </h1>
              <p className="text-slate-600 text-sm">
                {isViewMode
                  ? 'View role details and permissions'
                  : isEditMode
                  ? 'Modify role details and permissions'
                  : 'Define a new role with specific permissions'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}>
              Cancel
            </Button>
            {(mode === 'edit' || mode === 'create') && (
              <Button onClick={handleSave} className="bg-slate-900 text-white hover:bg-slate-800">
                {mode === 'edit' ? 'Update Role' : 'Create Role'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Role Details */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-slate-200 sticky top-6">
              <CardHeader>
                <CardTitle className="text-slate-900">Role Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role_name" className="text-slate-900">
                    Role Name <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="role_name"
                    placeholder="e.g., ADMIN, MANAGER"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="bg-white border-slate-300 text-slate-900"
                    disabled={isViewMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role_label" className="text-slate-900">
                    Role Label <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="role_label"
                    placeholder="e.g., Administrator, Manager"
                    value={roleLabel}
                    onChange={(e) => setRoleLabel(e.target.value)}
                    className="bg-white border-slate-300 text-slate-900"
                    disabled={isViewMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role_description" className="text-slate-900">
                    Description
                  </Label>
                  <Textarea
                    id="role_description"
                    placeholder="Explain what this role does..."
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    rows={4}
                    className="bg-white border-slate-300 text-slate-900 resize-none"
                    disabled={isViewMode}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="space-y-0.5">
                    <Label htmlFor="role_is_active" className="text-slate-900">
                      Active Status
                    </Label>
                    <p className="text-slate-600 text-xs">Enable this role for use</p>
                  </div>
                  <Switch
                    id="role_is_active"
                    checked={roleIsActive}
                    onCheckedChange={setRoleIsActive}
                    disabled={isViewMode}
                  />
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="text-slate-600 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Total Permissions:</span>
                      <span className="text-slate-900 font-medium">{selectedPermissions.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Critical Permissions:</span>
                      <span className="text-red-600 font-medium">{totalCriticalPermissions}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Permission Assignment Matrix */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Permission Assignment</CardTitle>
                <p className="text-slate-600 text-sm">
                  Select permissions for this role grouped by module
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Module Sidebar */}
                  <div className="md:col-span-1 space-y-1">
                    {permissionModules.map((module) => {
                      const selectedCount = module.permissions.filter((perm) =>
                        selectedPermissions.has(perm.key)
                      ).length;
                      const isActive = activeModule === module.name;

                      return (
                        <button
                          key={module.name}
                          onClick={() => setActiveModule(module.name)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-slate-900 text-white'
                              : 'hover:bg-slate-100 text-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span>{module.icon}</span>
                              <span className="text-sm">{module.label}</span>
                            </div>
                            {selectedCount > 0 && (
                              <Badge
                                variant="secondary"
                                className={`text-xs ${
                                  isActive ? 'bg-white/20 text-white' : ''
                                }`}
                              >
                                {selectedCount}
                              </Badge>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Permissions List */}
                  <div className="md:col-span-3 space-y-4">
                    {/* Search and Bulk Actions */}
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          placeholder="Search permissions..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-white border-slate-300 text-slate-900"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-600">
                          {selectedInModule} of {totalInModule} selected in {activeModuleData?.label}
                        </div>
                        {!isViewMode && (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                activeModuleData && toggleAllInModule(activeModuleData, true)
                              }
                            >
                              Select All
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                activeModuleData && toggleAllInModule(activeModuleData, false)
                              }
                            >
                              Deselect All
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Permission Checkboxes */}
                    <div className="space-y-2">
                      {filteredPermissions.map((permission) => {
                        const isSelected = selectedPermissions.has(permission.key);

                        return (
                          <div
                            key={permission.key}
                            className={`p-4 rounded-lg border transition-all ${
                              isViewMode ? '' : 'cursor-pointer'
                            } ${
                              isSelected
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                            onClick={() => togglePermission(permission.key)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex items-center h-5">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => togglePermission(permission.key)}
                                  className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 cursor-pointer disabled:cursor-not-allowed"
                                  onClick={(e) => e.stopPropagation()}
                                  disabled={isViewMode}
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <label
                                    className={`text-slate-900 ${
                                      isViewMode ? '' : 'cursor-pointer'
                                    }`}
                                  >
                                    {permission.label}
                                  </label>
                                  {permission.isCritical && (
                                    <Badge
                                      variant="destructive"
                                      className="text-xs bg-red-100 text-red-700"
                                    >
                                      ⚠️ Critical
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-slate-600 text-xs mt-1">{permission.description}</p>
                                <p className="text-slate-500 text-xs mt-1 font-mono">
                                  {permission.key}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
