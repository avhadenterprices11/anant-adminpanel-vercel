import type { ActivityTimelineItem } from "@/components/features/activity/ActivityTimeline";
import type { TimelineItem, CustomerSegment, MatchingUser } from "../types/segment.types";

export const mockActivities: ActivityTimelineItem[] = [
  {
    id: 1,
    type: 'order',
    title: 'Placed Order #SS-2024-156',
    description: 'PlayStation 5 Console + 2 Controllers',
    amount: '₹52,999',
    timestamp: '2024-12-10 03:30 PM',
  },
  {
    id: 2,
    type: 'payment',
    title: 'Payment Received',
    description: 'Order #SS-2024-156 - Online Payment',
    amount: '₹52,999',
    timestamp: '2024-12-10 03:32 PM',
  },
  {
    id: 3,
    type: 'login',
    title: 'Account Login',
    description: 'Logged in from Chrome on Windows',
    amount: null,
    timestamp: '2024-12-09 11:20 AM',
  },
  {
    id: 4,
    type: 'order',
    title: 'Placed Order #SS-2024-142',
    description: 'Gaming Headset Pro + Controller',
    amount: '₹8,499',
    timestamp: '2024-11-28 05:15 PM',
  },
  {
    id: 5,
    type: 'payment',
    title: 'Payment Received',
    description: 'Order #SS-2024-142 - UPI Payment',
    amount: '₹8,499',
    timestamp: '2024-11-28 05:17 PM',
  }
];

export const mockUserTimeline: TimelineItem[] = [
  {
    id: 1,
    type: 'creation',
    user: 'Daisy (Admin)',
    action: 'initiated segment creation',
    timestamp: '2 mins ago'
  },
  {
    id: 2,
    type: 'update',
    user: 'Daisy (Admin)',
    action: 'updated basic details',
    timestamp: 'Just now'
  }
];

export const mockSegments: CustomerSegment[] = [
  {
    id: 'SEG-SS-001',
    segmentName: 'High-Value Distributors',
    type: 'Distributor',
    createdBy: 'Amit Kumar',
    filters: ['Order Value > ₹50L', 'Years Active > 3'],
    filteredUsers: 24
  },
  {
    id: 'SEG-SS-002',
    segmentName: 'New Retail Partners',
    type: 'Retail',
    createdBy: 'Priya Sharma',
    filters: ['Registration Date < 6 months', 'Store Count < 5'],
    filteredUsers: 42
  },
  {
    id: 'SEG-SS-003',
    segmentName: 'Wholesale Partners',
    type: 'Wholesale',
    createdBy: 'Rajesh Kumar',
    filters: ['Bulk Orders > 10', 'Payment Terms: 30 days'],
    filteredUsers: 18
  },
  {
    id: 'SEG-SS-004',
    segmentName: 'VIP Customers',
    type: 'Retail',
    createdBy: 'Sneha Reddy',
    filters: ['Total Spent > ₹1L', 'Loyalty Points > 5000'],
    filteredUsers: 67
  },
];

export const mockMatchingUsers: MatchingUser[] = [
  { id: '1', name: 'Rajesh Kumar', email: 'rajesh.kumar@email.com', tags: ['VIP', 'Distributor'] },
  { id: '2', name: 'Priya Sharma', email: 'priya.sharma@email.com', tags: ['Retail'] },
  { id: '3', name: 'Amit Patel', email: 'amit.patel@email.com', tags: ['B2B', 'Premium'] },
  { id: '4', name: 'Sneha Reddy', email: 'sneha.reddy@email.com', tags: ['Academy'] },
  { id: '5', name: 'Vikram Singh', email: 'vikram.singh@email.com', tags: ['Gym', 'Bulk'] },
];
