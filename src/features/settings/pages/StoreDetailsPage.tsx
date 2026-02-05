import React, { useState } from 'react';
import { Building2, MapPin, Globe, AlertCircle, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

import { PageHeader } from '@/components/layout/PageHeader';

const StoreDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [billingSame, setBillingSame] = useState(true);

  const handleBack = () => {
    navigate('/settings');
  };

  return (
    <div className="flex-1 w-full space-y-6">
      <PageHeader
        title="Store / Company Details"
        subtitle="Manage your public profile and company details."
        breadcrumbs={[
          { label: 'Settings', onClick: handleBack },
          { label: 'Store Details', active: true }
        ]}
        onBack={handleBack}
        actions={
          <>
            <Button variant="ghost" onClick={handleBack} className="text-slate-600 hover:text-slate-900 hidden sm:flex">
              Cancel
            </Button>
            <Button className="bg-[#2e1065] hover:bg-[#2e1065]/90 text-white shadow-sm">
              Save Changes
            </Button>
          </>
        }
      />

      <div className="container max-w-7xl mx-auto px-6 pb-8">
        <div className="space-y-6">

          {/* Block 1: Store Information */}
          <Card className="border-slate-200 shadow-sm rounded-[16px] overflow-hidden bg-white">
            <CardHeader className="bg-white px-6 py-5 border-b border-slate-100 flex flex-row gap-4 items-start">
              <div className="p-2 bg-purple-50 rounded-lg text-gray-400 mt-1">
                <Building2 size={20} />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold text-slate-900">Store Information</CardTitle>
                <CardDescription>Manage your public profile and company details.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name <span className="text-red-500">*</span></Label>
                  <Input id="storeName" placeholder="e.g. Acme Corp" className="bg-slate-50/50 focus:bg-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legalName">Legal Business Name</Label>
                  <Input id="legalName" placeholder="As registered" className="bg-slate-50/50 focus:bg-white transition-colors" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Store Email <span className="text-red-500">*</span></Label>
                  <Input id="storeEmail" type="email" placeholder="contact@company.com" className="bg-slate-50/50 focus:bg-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Store Phone Number</Label>
                  <Input id="storePhone" type="tel" placeholder="+1 (555) 000-0000" className="bg-slate-50/50 focus:bg-white transition-colors" />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description">Store Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us about your business..."
                    className="min-h-[100px] resize-none bg-slate-50/50 focus:bg-white transition-colors"
                  />
                  <p className="text-[13px] text-slate-500">This will be displayed on your profile page.</p>
                </div>
              </div>

              <Separator />

              {/* Business Type & Industry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Business Type</Label>
                  <Select>
                    <SelectTrigger className="bg-slate-50/50 focus:bg-white transition-colors">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="proprietorship">Sole Proprietorship</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="llp">Limited Liability Partnership (LLP)</SelectItem>
                      <SelectItem value="pvt_ltd">Private Limited Company</SelectItem>
                      <SelectItem value="public_ltd">Public Limited Company</SelectItem>
                      <SelectItem value="franchise">Franchise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Store Industry</Label>
                  <Select>
                    <SelectTrigger className="bg-slate-50/50 focus:bg-white transition-colors">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail & Fashion</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Logos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Company Logo</Label>
                  <div className="flex items-start gap-4">
                    <div className="size-24 rounded-lg border border-slate-200 bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
                      <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                        <ImageIcon className="text-gray-400 size-8" />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-9">Upload New</Button>
                        <Button variant="ghost" size="sm" className="h-9 text-red-600 hover:text-red-700 hover:bg-red-50">Remove</Button>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Recommended dimensions: 512x512px.<br />Supported formats: PNG, JPG.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Favicon</Label>
                  <div className="flex items-start gap-4">
                    <div className="size-16 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                      <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                        <div className="size-8 bg-slate-200 rounded-sm" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Button variant="outline" size="sm" className="h-9">Upload Favicon</Button>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Recommended dimensions: 32x32px.<br />Supported formats: ICO, PNG.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Registration Numbers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="gst">Registration / GST Number</Label>
                  <Input id="gst" placeholder="e.g. 22AAAAA0000A1Z5" className="uppercase font-mono bg-slate-50/50 focus:bg-white transition-colors" />
                  <p className="text-[13px] text-slate-500">Required for tax invoices.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN Number</Label>
                  <Input id="pan" placeholder="e.g. ABCDE1234F" className="uppercase font-mono bg-slate-50/50 focus:bg-white transition-colors" />
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Block 2: Business Address */}
          <Card className="border-slate-200 shadow-sm rounded-[16px] overflow-hidden bg-white">
            <CardHeader className="bg-white px-6 py-5 border-b border-slate-100 flex flex-row gap-4 items-start">
              <div className="p-2 bg-emerald-50 rounded-lg text-gray-400 mt-1">
                <MapPin size={20} />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold text-slate-900">Business Address</CardTitle>
                <CardDescription>The primary location of your business operations.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" placeholder="123 Main St, Suite 400" className="bg-slate-50/50 focus:bg-white transition-colors" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="New York" className="bg-slate-50/50 focus:bg-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <Label>State / Province</Label>
                  <Select>
                    <SelectTrigger className="bg-slate-50/50 focus:bg-white transition-colors">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ny">New York</SelectItem>
                      <SelectItem value="ca">California</SelectItem>
                      <SelectItem value="tx">Texas</SelectItem>
                      <SelectItem value="mh">Maharashtra</SelectItem>
                      <SelectItem value="dl">Delhi</SelectItem>
                      <SelectItem value="ka">Karnataka</SelectItem>
                      <SelectItem value="gj">Gujarat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select defaultValue="us">
                    <SelectTrigger className="bg-slate-50/50 focus:bg-white transition-colors">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="in">India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">Pincode / ZIP Code</Label>
                  <Input id="zip" placeholder="10001" className="bg-slate-50/50 focus:bg-white transition-colors" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-200 mt-2 hover:bg-slate-50 transition-colors">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium cursor-pointer" htmlFor="billing-toggle">Use same address for billing & operations</Label>
                  <p className="text-sm text-slate-500">Billing address will match the operations address.</p>
                </div>
                <Switch id="billing-toggle" checked={billingSame} onCheckedChange={setBillingSame} />
              </div>
            </CardContent>
          </Card>

          {/* Block 3: Store Profile & Preferences */}
          <Card className="border-slate-200 shadow-sm rounded-[16px] overflow-hidden bg-white">
            <CardHeader className="bg-white px-6 py-5 border-b border-slate-100 flex flex-row gap-4 items-start">
              <div className="p-2 bg-blue-50 rounded-lg text-gray-400 mt-1">
                <Globe size={20} />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold text-slate-900">Store Profile & Preferences</CardTitle>
                <CardDescription>Configure regional settings and store visibility.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">

              <div className="flex items-start gap-3 p-4 bg-amber-50 text-amber-900 rounded-xl border border-amber-100 mb-6">
                <AlertCircle className="size-5 shrink-0 mt-0.5 text-amber-600" />
                <p className="text-sm leading-relaxed">
                  <strong>Note:</strong> Changes to currency, language, or fiscal year settings may impact historical reporting and billing cycles. Proceed with caution.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Default Time Zone</Label>
                  <Select defaultValue="est">
                    <SelectTrigger className="bg-slate-50/50 focus:bg-white transition-colors">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Time (US & Canada)</SelectItem>
                      <SelectItem value="pst">Pacific Time (US & Canada)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger className="bg-slate-50/50 focus:bg-white transition-colors">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="inr">INR (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="bg-slate-50/50 focus:bg-white transition-colors">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select defaultValue="mdy">
                    <SelectTrigger className="bg-slate-50/50 focus:bg-white transition-colors">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fiscal Year Start</Label>
                  <Select defaultValue="jan">
                    <SelectTrigger className="bg-slate-50/50 focus:bg-white transition-colors">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jan">January</SelectItem>
                      <SelectItem value="apr">April</SelectItem>
                      <SelectItem value="jul">July</SelectItem>
                      <SelectItem value="oct">October</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-base">Store Status</Label>
                  <RadioGroup defaultValue="active" className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                      <RadioGroupItem value="active" id="active" />
                      <div className="flex-1">
                        <Label htmlFor="active" className="font-medium cursor-pointer block">Active</Label>
                        <span className="text-xs text-slate-500">Store is live and accepting orders</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                      <RadioGroupItem value="inactive" id="inactive" />
                      <div className="flex-1">
                        <Label htmlFor="inactive" className="font-medium cursor-pointer block">Inactive / Maintenance</Label>
                        <span className="text-xs text-slate-500">Store is hidden from customers</span>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                    <div className="space-y-0.5">
                      <Label className="text-base">Display Storefront?</Label>
                      <p className="text-sm text-slate-500">Make your store visible to public visitors.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StoreDetailsPage;
