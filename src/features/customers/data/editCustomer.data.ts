import { ShoppingBag, DollarSign, Lock } from 'lucide-react';

// Mock data for edit customer form

export const mockActivityTimeline = [
  {
    id: 1,
    type: 'order' as const,
    title: 'Placed Order #SS-2024-156',
    description: 'PlayStation 5 Console + 2 Controllers',
    amount: '₹52,999',
    timestamp: '2024-12-10 03:30 PM',
    icon: ShoppingBag,
    iconColor: 'bg-green-100 text-slate-400'
  },
  {
    id: 2,
    type: 'payment' as const,
    title: 'Payment Received',
    description: 'Order #SS-2024-156 - Online Payment',
    amount: '₹52,999',
    timestamp: '2024-12-10 03:32 PM',
    icon: DollarSign,
    iconColor: 'bg-blue-100 text-slate-400'
  },
  {
    id: 3,
    type: 'login' as const,
    title: 'Account Login',
    description: 'Logged in from Chrome on Windows',
    amount: null,
    timestamp: '2024-12-09 11:20 AM',
    icon: Lock,
    iconColor: 'bg-purple-100 text-slate-400'
  },
  {
    id: 4,
    type: 'order' as const,
    title: 'Placed Order #SS-2024-142',
    description: 'Gaming Headset Pro + Controller',
    amount: '₹8,499',
    timestamp: '2024-11-28 05:15 PM',
    icon: ShoppingBag,
    iconColor: 'bg-green-100 text-slate-400'
  },
  {
    id: 5,
    type: 'payment' as const,
    title: 'Payment Received',
    description: 'Order #SS-2024-142 - UPI Payment',
    amount: '₹8,499',
    timestamp: '2024-11-28 05:17 PM',
    icon: DollarSign,
    iconColor: 'bg-blue-100 text-slate-400'
  },
];

export const mockAddresses = [
  {
    id: 'addr-1',
    type: 'home' as const,
    name: 'Home',
    address: '123, MG Road, Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560034',
    phone: '+91 98765 43210',
    isDefault: true,
  },
  {
    id: 'addr-2',
    type: 'office' as const,
    name: 'Office',
    address: '456, Tech Park, Whitefield',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560066',
    phone: '+91 98765 43210',
    isDefault: false,
  },
  {
    id: 'addr-3',
    type: 'home' as const,
    name: 'Bangalore Home',
    address: '789, Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560038',
    phone: '+91 98765 43212',
    isDefault: false,
  },
];

export const mockPaymentMethods = [
  {
    id: 'pm-1',
    type: 'card' as const,
    name: 'HDFC Credit Card',
    details: '**** **** **** 4532',
    isDefault: true,
  },
  {
    id: 'pm-2',
    type: 'upi' as const,
    name: 'UPI',
    details: 'rajesh@paytm',
    isDefault: false,
  },
];

export const mockAbandonedCarts = [
  {
    id: 'cart-1',
    cartId: 'CART-2024-789',
    items: ['Nintendo Switch OLED', 'Joy-Con Controllers'],
    totalValue: '₹34,999',
    abandonedOn: '2024-12-15 08:30 PM',
    itemCount: 2,
  },
  {
    id: 'cart-2',
    cartId: 'CART-2024-654',
    items: ['Gaming Mouse', 'Keyboard'],
    totalValue: '₹12,499',
    abandonedOn: '2024-12-08 02:15 PM',
    itemCount: 2,
  },
];

export const mockRecentOrders = [
  {
    id: 'SS-2024-156',
    date: '2024-12-10',
    items: 3,
    total: '₹52,999',
    status: 'Delivered',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    products: [
      { name: 'PlayStation 5 Console', qty: 1, price: '₹49,999' },
      { name: 'DualSense Controller', qty: 2, price: '₹1,500' },
    ],
    shippingAddress: '123, MG Road, Koramangala, Bangalore - 560034',
    paymentMethod: 'Credit Card (**** 4532)',
  },
  {
    id: 'SS-2024-142',
    date: '2024-11-28',
    items: 2,
    total: '₹8,499',
    status: 'Delivered',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    products: [
      { name: 'Gaming Headset Pro', qty: 1, price: '₹5,999' },
      { name: 'Wireless Controller', qty: 1, price: '₹2,500' },
    ],
    shippingAddress: '123, MG Road, Koramangala, Bangalore - 560034',
    paymentMethod: 'UPI (rajesh@paytm)',
  },
  {
    id: 'SS-2024-128',
    date: '2024-11-15',
    items: 1,
    total: '₹45,999',
    status: 'Delivered',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    products: [
      { name: 'Xbox Series X', qty: 1, price: '₹45,999' },
    ],
    shippingAddress: '456, Tech Park, Whitefield, Bangalore - 560066',
    paymentMethod: 'Credit Card (**** 4532)',
  },
  {
    id: 'SS-2024-097',
    date: '2024-10-22',
    items: 4,
    total: '₹18,999',
    status: 'Cancelled',
    statusColor: 'bg-red-100 text-red-700 border-red-200',
    products: [
      { name: 'Gaming Mouse', qty: 2, price: '₹3,999' },
      { name: 'Keyboard', qty: 1, price: '₹8,999' },
      { name: 'Mousepad', qty: 1, price: '₹999' },
    ],
    shippingAddress: '123, MG Road, Koramangala, Bangalore - 560034',
    paymentMethod: 'UPI (rajesh@paytm)',
  }
];

export const suggestedTags = ['VIP', 'High Value', 'Reliable', 'Wholesale', 'Retail', 'Frequent Buyer', 'New Customer'];
