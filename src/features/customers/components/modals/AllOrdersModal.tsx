import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface OrderItem {
  id: string;
  orderNumber: string;
  date: string;
  itemCount: number;
  status: 'Delivered' | 'Cancelled' | 'Pending' | 'Processing';
  amount: number;
}

interface AllOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderItem[];
  onViewOrder: (orderId: string) => void;
}

export function AllOrdersModal({
  isOpen,
  onClose,
  orders,
  onViewOrder,
}: AllOrdersModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter((order) =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const statusColors: Record<string, string> = {
    Delivered: 'text-green-600 bg-green-50 border-green-100',
    Cancelled: 'text-red-600 bg-red-50 border-red-100',
    Pending: 'text-yellow-600 bg-yellow-50 border-yellow-100',
    Processing: 'text-blue-600 bg-blue-50 border-blue-100',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden rounded-xl">
        <DialogHeader className="px-8 py-6 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
          <div>
            <DialogTitle className="text-xl font-bold text-slate-900">Order History</DialogTitle>
            <p className="text-sm text-slate-500 mt-1">View all past orders for this customer.</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-full" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <div className="p-4 px-8 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white border-slate-200 focus-visible:ring-indigo-500"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <Table>
            <TableHeader className="bg-transparent">
              <TableRow className="hover:bg-transparent border-b border-slate-100/50">
                <TableHead className="pl-8 w-[180px] h-12 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</TableHead>
                <TableHead className="h-12 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</TableHead>
                <TableHead className="h-12 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-right pr-8 h-12 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-slate-50 border-slate-100 group"
                    onClick={() => onViewOrder(order.id)}
                  >
                    {/* Date Column like "Jan 31, 11:41 AM" in screenshot */}
                    <TableCell className="pl-8 py-5 align-top">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-slate-700 text-sm">
                          {formatDate(order.date)}, {formatTime(order.date)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Item Column -> Order # and Count */}
                    <TableCell className="py-5 align-top">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-slate-900 text-sm">
                          Order #{order.orderNumber}
                        </span>
                        <span className="text-xs text-indigo-500 font-medium bg-indigo-50 w-fit px-1.5 py-0.5 rounded">
                          {order.itemCount} items
                        </span>
                      </div>
                    </TableCell>

                    {/* Activity Column -> Status */}
                    <TableCell className="py-5 align-top">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${statusColors[order.status]?.split(' ')[0]}`}>
                            {order.status}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          Updated {formatDate(order.date)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="pr-8 py-5 text-right align-top">
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(order.amount)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <Search className="h-5 w-5 text-slate-400" />
                      </div>
                      <p>No orders found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
