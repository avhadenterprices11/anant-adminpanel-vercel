import React from 'react';
import {

  Save,
  FileText,
  Edit,
  Eye,
  Clock
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

const PoliciesPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/settings');
  };

  const policies = [
    { id: 1, name: 'Privacy Policy', status: 'published', lastUpdated: '2024-12-15', required: true },
    { id: 2, name: 'Terms of Service', status: 'published', lastUpdated: '2024-12-15', required: true },
    { id: 3, name: 'Refund Policy', status: 'published', lastUpdated: '2024-12-10', required: true },
    { id: 4, name: 'Shipping Policy', status: 'published', lastUpdated: '2024-12-10', required: false },
    { id: 5, name: 'Contact Information', status: 'draft', lastUpdated: '2024-12-05', required: false },
  ];

  return (
    <div className="flex-1 w-full space-y-6">
      <PageHeader
        title="Policies"
        subtitle="Manage legal and compliance policies for your store."
        breadcrumbs={[
          { label: 'Settings', onClick: handleBack },
          { label: 'Policies', active: true }
        ]}
        onBack={handleBack}
        actions={
          <>
            <Button variant="ghost" onClick={handleBack} className="text-slate-600 hover:text-slate-900">
              Cancel
            </Button>
            <Button className="bg-[#2e1065] hover:bg-[#2e1065]/90 text-white shadow-sm gap-2">
              <Save size={16} /> Save Changes
            </Button>
          </>
        }
      />

      <div className="container max-w-7xl mx-auto px-6 pb-8">
        <div className="space-y-6">

          {/* SECTION 1 — Store Policies */}
          <Card className="border-slate-200 shadow-sm rounded-[16px] overflow-hidden bg-white">
            <CardHeader className="bg-white px-6 py-5 border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="size-5 text-[#2e1065]" />
                Store Policies
              </CardTitle>
              <CardDescription>Manage legal and compliance policies for your store.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {policies.map((policy) => (
                  <div key={policy.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="size-10 bg-purple-50 rounded-lg flex items-center justify-center">
                          <FileText className="text-[#2e1065]" size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900">{policy.name}</h3>
                            {policy.required && (
                              <Badge variant="secondary" className="text-xs">Required</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <Clock size={12} />
                            <span>Updated {policy.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {policy.status === 'published' ? (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Published</Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                        <Button variant="ghost" size="icon">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SECTION 2 — Policy Settings */}
          <Card className="border-slate-200 shadow-sm rounded-[16px] overflow-hidden bg-white">
            <CardHeader className="bg-white px-6 py-5 border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-slate-900">Policy Settings</CardTitle>
              <CardDescription>Configure how policies are displayed.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between border border-slate-100 p-4 rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Show in footer</Label>
                    <p className="text-xs text-slate-500">Display policy links</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between border border-slate-100 p-4 rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Require acceptance</Label>
                    <p className="text-xs text-slate-500">At checkout</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between border border-slate-100 p-4 rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Show in emails</Label>
                    <p className="text-xs text-slate-500">Include in order emails</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between border border-slate-100 p-4 rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Cookie consent</Label>
                    <p className="text-xs text-slate-500">Display banner</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Checkout Disclaimer</Label>
                <Textarea
                  placeholder="Add disclaimer text shown at checkout..."
                  className="resize-none h-24 bg-slate-50/50 focus:bg-white transition-colors"
                  defaultValue="By placing an order, you agree to our Terms of Service and Privacy Policy."
                />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default PoliciesPage;
