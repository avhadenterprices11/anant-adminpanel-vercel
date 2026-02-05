
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ExternalLink, Package } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';





interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any | null; // Using any for flexibility with mapped data
  onViewOrder?: (orderId: string) => void;
}

export function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  onViewOrder,
}: OrderDetailsModalProps) {
  if (!order) return null;

  const formatCurrency = (amount: number | string) => {
    const validAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(validAmount || 0);
  };

  const statusColors: Record<string, string> = {
    Delivered: 'bg-green-50 text-green-700 border-green-200',
    Cancelled: 'bg-red-50 text-red-700 border-red-200',
    Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Processing: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between mr-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Package className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <DialogTitle>Order #{order.orderNumber}</DialogTitle>
                <p className="text-sm text-slate-500 mt-1">
                  Placed on {new Date(order.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`rounded-full px-3 py-1 ${statusColors[order.status] || 'bg-slate-50 text-slate-700'}`}
            >
              {order.status}
            </Badge>
          </div>
        </DialogHeader>

        <Separator />

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Order Items */}
            <div>
              <h4 className="font-medium text-slate-900 mb-4">Order Items</h4>
              <div className="space-y-3">
                {/* 
                  Since we might not have products data in the summary view,
                  we show a placeholder or mapped items if available.
                  For now, we'll assume the API might need to fetch details separately
                  or we display what we have. 
                */}
                {order.items && order.items.length > 0 ? (
                  order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-start py-2 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="font-medium text-slate-900">{item.productName || 'Product Name'}</p>
                        <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-slate-900">{formatCurrency(item.price || 0)}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-500 italic">
                    Details for {order.itemCount} items not available in preview.
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(order.amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Shipping</span>
                <span className="font-medium">{formatCurrency(0)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.amount)}</span>
              </div>
            </div>
          </div>
        </ScrollArea>

        {onViewOrder && (
          <div className="mt-4 flex justify-end">
            <Button onClick={() => onViewOrder(order.id)} className="gap-2">
              View Full Order Details
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
