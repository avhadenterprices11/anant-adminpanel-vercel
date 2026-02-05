import { X, CreditCard, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { PaymentMethod } from '../../types/customer.types';

interface ViewPaymentMethodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethods: PaymentMethod[];
}

export function ViewPaymentMethodsModal({ isOpen, onClose, paymentMethods }: ViewPaymentMethodsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">All Payment Methods</h2>
            <p className="text-sm text-slate-600 mt-0.5">{paymentMethods.length} saved payment methods</p>
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
          {paymentMethods.map((payment) => (
            <div
              key={payment.id}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <CreditCard className="size-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{payment.name}</p>
                    <p className="text-sm text-slate-600">{payment.details}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {payment.isDefault && (
                    <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                      <Star className="size-3 mr-1" />
                      Default
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs capitalize">
                    {payment.type}
                  </Badge>
                </div>
              </div>
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
