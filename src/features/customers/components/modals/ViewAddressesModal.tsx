import { X, MapPin, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { EditAddress } from '../../types/customer.types';

interface ViewAddressesModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: EditAddress[];
}

export function ViewAddressesModal({ isOpen, onClose, addresses }: ViewAddressesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">All Addresses</h2>
            <p className="text-sm text-slate-600 mt-0.5">{addresses.length} saved addresses</p>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="size-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-slate-400" />
                  <p className="font-medium text-slate-900">{address.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  {address.isDefault && (
                    <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                      <Star className="size-3 mr-1" />
                      Default
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs capitalize">
                    {address.type}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-slate-700 mb-1">
                {address.address}, {address.city}
              </p>
              <p className="text-sm text-slate-700 mb-1">
                {address.state} - {address.pincode}
              </p>
              <p className="text-xs text-slate-500">{address.phone}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
