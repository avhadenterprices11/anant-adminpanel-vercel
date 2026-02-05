import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { countryOptions, stateOptions, addressTypeOptions } from '../data/customer.data';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAddressId: string | null;
  addressName: string;
  setAddressName: (value: string) => void;
  addressCountry: string;
  setAddressCountry: (value: string) => void;
  addressState: string;
  setAddressState: (value: string) => void;
  addressCity: string;
  setAddressCity: (value: string) => void;
  addressPincode: string;
  setAddressPincode: (value: string) => void;
  addressStreet1: string;
  setAddressStreet1: (value: string) => void;
  addressStreet2: string;
  setAddressStreet2: (value: string) => void;
  addressLandmark: string;
  setAddressLandmark: (value: string) => void;
  addressType: string;
  setAddressType: (value: string) => void;
  isDefaultBilling: boolean;
  setIsDefaultBilling: (value: boolean) => void;
  isDefaultShipping: boolean;
  setIsDefaultShipping: (value: boolean) => void;
  onSave: () => void;
}

export function AddressModal({
  isOpen,
  onClose,
  editingAddressId,
  addressName,
  setAddressName,
  addressCountry,
  setAddressCountry,
  addressState,
  setAddressState,
  addressCity,
  setAddressCity,
  addressPincode,
  setAddressPincode,
  addressStreet1,
  setAddressStreet1,
  addressStreet2,
  setAddressStreet2,
  addressLandmark,
  setAddressLandmark,
  addressType,
  setAddressType,
  isDefaultBilling,
  setIsDefaultBilling,
  isDefaultShipping,
  setIsDefaultShipping,
  onSave
}: AddressModalProps) {


  const handleTypeChange = (value: string) => {
    if (value === 'other') {
      setAddressType(''); // Clear it to show Input
    } else {
      setAddressType(value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-[20px] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-900">
            {editingAddressId ? 'Edit Address' : 'Add New Address'}
          </DialogTitle>
          <DialogDescription>
            {editingAddressId ? 'Update the details of the address below.' : 'Enter the details for the new address.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Address Name */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">Address Name</Label>
            <Input
              value={addressName}
              onChange={(e) => setAddressName(e.target.value)}
              placeholder="e.g. My Home, Dad's Office"
              className="rounded-xl"
            />
          </div>

          {/* Country & State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">Country</Label>
              <Select value={addressCountry} onValueChange={setAddressCountry}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {countryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">State</Label>
              <Select value={addressState} onValueChange={setAddressState} disabled={!addressCountry}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {stateOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* City & Pincode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">City *</Label>
              <Input
                value={addressCity}
                onChange={(e) => setAddressCity(e.target.value)}
                placeholder="Enter city"
                className="rounded-xl"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">Zip / Pincode *</Label>
              <Input
                value={addressPincode}
                onChange={(e) => setAddressPincode(e.target.value)}
                placeholder="Enter pincode"
                className="rounded-xl"
              />
            </div>
          </div>

          {/* Street Address 1 */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">Street Address 1 *</Label>
            <Input
              value={addressStreet1}
              onChange={(e) => setAddressStreet1(e.target.value)}
              placeholder="House/Flat number, Building name"
              className="rounded-xl"
            />
          </div>

          {/* Street Address 2 */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">Street Address 2</Label>
            <Input
              value={addressStreet2}
              onChange={(e) => setAddressStreet2(e.target.value)}
              placeholder="Street name, Area"
              className="rounded-xl"
            />
          </div>

          {/* Landmark */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">Landmark</Label>
            <Input
              value={addressLandmark}
              onChange={(e) => setAddressLandmark(e.target.value)}
              placeholder="Nearby landmark"
              className="rounded-xl"
            />
          </div>

          {/* Address Type */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">Address Type</Label>
            <div className="space-y-3">
              <Select
                value={['home', 'office'].includes(addressType) ? addressType : 'other'}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {addressTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(!['home', 'office'].includes(addressType)) && (
                <Input
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                  placeholder="Enter custom address type"
                  className="rounded-xl"
                  autoFocus
                />
              )}
            </div>
          </div>

          {/* Default Settings */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <Label className="text-sm font-medium text-slate-700">Set as Default Billing</Label>
              <Switch checked={isDefaultBilling} onCheckedChange={setIsDefaultBilling} />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <Label className="text-sm font-medium text-slate-700">Set as Default Shipping</Label>
              <Switch checked={isDefaultShipping} onCheckedChange={setIsDefaultShipping} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button onClick={onSave} className="rounded-xl bg-[#0e042f] hover:bg-[#0e042f]/90 text-white">
            <Save className="size-4 mr-2" />
            {editingAddressId ? 'Update Address' : 'Save Address'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
