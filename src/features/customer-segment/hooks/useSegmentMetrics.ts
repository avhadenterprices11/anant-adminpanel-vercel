import { useMemo } from 'react';
import { Users, Building, User } from 'lucide-react';
import type { MetricItem } from '@/components/features/metrics';

interface SegmentMetrics {
  distributor: number;
  retail: number;
  wholesale: number;
  totalUsers: number;
  total: number;
}

export const useSegmentMetrics = (metrics: SegmentMetrics): MetricItem[] => {
  return useMemo(() => [
    {
      title: "Total Segments",
      value: metrics.total,
      helperText: "All customer segments",
      icon: Users,
      iconBg: "#735DFF"
    },
    {
      title: "Distributor",
      value: metrics.distributor,
      helperText: "Distributor segments",
      icon: Building,
      iconBg: "#2ECC71"
    },
    {
      title: "Retail",
      value: metrics.retail,
      helperText: "Retail segments",
      icon: User,
      iconBg: "#E74C3C"
    },
    {
      title: "Wholesale",
      value: metrics.wholesale,
      helperText: "Wholesale segments",
      icon: Building,
      iconBg: "#3498DB"
    },
    {
      title: "Total Users",
      value: metrics.totalUsers,
      helperText: "Users in segments",
      icon: Users,
      iconBg: "#F5A623"
    },
  ], [metrics]);
};
