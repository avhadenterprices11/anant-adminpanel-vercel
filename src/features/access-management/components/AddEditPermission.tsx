import { useState, useEffect } from 'react';
import { ArrowLeft, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

const availableModules = [
  { value: 'orders', label: 'Orders', icon: '📦' },
  { value: 'products', label: 'Products', icon: '🏷️' },
  { value: 'customers', label: 'Customers', icon: '👥' },
  { value: 'inventory', label: 'Inventory', icon: '📊' },
  { value: 'discounts', label: 'Discounts', icon: '🎫' },
  { value: 'reports', label: 'Reports', icon: '📈' },
  { value: 'settings', label: 'Settings', icon: '⚙️' },
  { value: 'categories', label: 'Categories', icon: '📁' },
  { value: 'shipping', label: 'Shipping', icon: '🚚' },
];

interface AddEditPermissionProps {
  permissionId?: string;
  onBack: () => void;
  onSave: (permissionData: any) => void;
}

export function AddEditPermission({ permissionId, onBack, onSave }: AddEditPermissionProps) {
  const isEditMode = !!permissionId;

  // Permission details state
  const [selectedModule, setSelectedModule] = useState(isEditMode ? 'orders' : '');
  const [permissionLabel, setPermissionLabel] = useState(isEditMode ? 'Refund Orders' : '');
  const [permissionDescription, setPermissionDescription] = useState(
    isEditMode ? 'Can process refunds for orders' : ''
  );
  const [isCritical, setIsCritical] = useState(isEditMode ? true : false);
  const [permissionKey, setPermissionKey] = useState('');

  // Auto-generate permission key
  useEffect(() => {
    if (selectedModule && permissionLabel) {
      const slug = permissionLabel
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '');
      setPermissionKey(`${selectedModule}.${slug}`);
    } else {
      setPermissionKey('');
    }
  }, [selectedModule, permissionLabel]);

  const handleSave = () => {
    if (!selectedModule || !permissionLabel || !permissionKey) {
      alert('Please fill in all required fields');
      return;
    }

    const permissionData = {
      module: selectedModule,
      key: permissionKey,
      label: permissionLabel,
      description: permissionDescription,
      isCritical: isCritical,
    };
    onSave(permissionData);
  };

  const selectedModuleData = availableModules.find((m) => m.value === selectedModule);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-10 w-10">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-slate-900 text-2xl font-bold mb-1">
              {isEditMode ? 'Edit Permission' : 'Add New Permission'}
            </h1>
            <p className="text-slate-600">
              {isEditMode
                ? 'Modify permission definition'
                : 'Define a new system permission'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-slate-900 text-white hover:bg-slate-800">
            {isEditMode ? 'Update Permission' : 'Create Permission'}
          </Button>
        </div>
      </div>

      {/* Warning Banner */}
      <Alert className="bg-amber-50 border-amber-200">
        <AlertCircle className="w-5 h-5 text-amber-600" />
        <AlertDescription className="text-amber-900">
          <strong>System-Level Change:</strong> This permission will be available across the entire
          system. Once created, it can be assigned to any role. Ensure the permission key follows
          the naming convention: module.action (e.g., orders.refund).
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Permission Details */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-slate-200 sticky top-6">
            <CardHeader>
              <CardTitle className="text-slate-900">Permission Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="module" className="text-slate-700">
                  Module <span className="text-red-600">*</span>
                </Label>
                <Select value={selectedModule} onValueChange={setSelectedModule}>
                  <SelectTrigger id="module" className="bg-white border-slate-300 text-slate-900">
                    <SelectValue placeholder="Select a module" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModules.map((module) => (
                      <SelectItem key={module.value} value={module.value}>
                        <div className="flex items-center gap-2">
                          <span>{module.icon}</span>
                          <span>{module.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-slate-500 text-xs">
                  The functional area this permission belongs to
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="permission_label" className="text-slate-700">
                  Permission Label <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="permission_label"
                  placeholder="e.g., View Orders, Create Products"
                  value={permissionLabel}
                  onChange={(e) => setPermissionLabel(e.target.value)}
                  className="bg-white border-slate-300 text-slate-900"
                />
                <p className="text-slate-500 text-xs">
                  Human-readable name for the permission
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="permission_key" className="text-slate-700">
                  Permission Key <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="permission_key"
                  value={permissionKey}
                  disabled
                  className="bg-slate-100 border-slate-300 text-slate-600 font-mono text-sm"
                />
                <p className="text-slate-500 text-xs">
                  Auto-generated from module and label
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="permission_description" className="text-slate-700">
                  Description
                </Label>
                <Textarea
                  id="permission_description"
                  placeholder="Explain what this permission allows..."
                  value={permissionDescription}
                  onChange={(e) => setPermissionDescription(e.target.value)}
                  rows={4}
                  className="bg-white border-slate-300 text-slate-900 resize-none"
                />
                <p className="text-slate-500 text-xs">
                  Detailed explanation of what this permission grants
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50">
                <div className="space-y-0.5">
                  <Label htmlFor="is_critical" className="text-slate-900">
                    Critical Permission
                  </Label>
                  <p className="text-slate-600 text-xs">
                    Mark as sensitive/high-risk
                  </p>
                </div>
                <Switch
                  id="is_critical"
                  checked={isCritical}
                  onCheckedChange={setIsCritical}
                />
              </div>

              {isCritical && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                    <p className="text-red-900 text-xs">
                      Critical permissions should be assigned carefully as they grant access to
                      sensitive operations or data.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Permission Preview */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900">Permission Preview</CardTitle>
              <p className="text-slate-600 text-sm">
                How this permission will appear in the system
              </p>
            </CardHeader>
            <CardContent>
              {!permissionKey ? (
                <div className="text-center py-12 text-slate-500">
                  <p>Fill in the form to preview the permission</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Permission Display */}
                  <div className="p-6 rounded-lg border border-slate-200 bg-slate-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {selectedModuleData && (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl">
                            {selectedModuleData.icon}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-slate-900 font-semibold">{permissionLabel || 'Permission Label'}</h3>
                            {isCritical && (
                              <Badge variant="destructive" className="text-xs">
                                ⚠️ Critical
                              </Badge>
                            )}
                          </div>
                          <code className="text-xs text-slate-600 font-mono">
                            {permissionKey}
                          </code>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {selectedModule}
                      </Badge>
                    </div>
                    <p className="text-slate-600 text-sm">
                      {permissionDescription || 'No description provided'}
                    </p>
                  </div>

                  {/* Validation Checklist */}
                  <div className="space-y-2">
                    <h4 className="text-sm text-slate-900 font-medium">Validation Checklist</h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        {selectedModule ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                        )}
                        <span className={selectedModule ? 'text-slate-900' : 'text-slate-500'}>
                          Module selected
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {permissionLabel ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                        )}
                        <span className={permissionLabel ? 'text-slate-900' : 'text-slate-500'}>
                          Permission label provided
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {permissionKey && permissionKey.includes('.') ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                        )}
                        <span
                          className={
                            permissionKey && permissionKey.includes('.')
                              ? 'text-slate-900'
                              : 'text-slate-500'
                          }
                        >
                          Valid permission key format
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
