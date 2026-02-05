import { useMemo } from 'react';
import { Layers, CheckCircle, XCircle, Package, AlertCircle } from 'lucide-react';
import type { MetricItem } from '@/components/features/metrics';

interface CollectionMetrics {
  active: number;
  inactive: number;
  automated: number;
  manual: number;
  total: number;
}

export const useCollectionMetrics = (metrics: CollectionMetrics): MetricItem[] => {
  return useMemo(() => [
    {
      title: "Total Collections",
      value: metrics.total,
      helperText: "All collections",
      icon: Layers,
      iconBg: "#735DFF"
    },
    {
      title: "Active",
      value: metrics.active,
      helperText: "Published collections",
      icon: CheckCircle,
      iconBg: "#2ECC71"
    },
    {
      title: "Inactive",
      value: metrics.inactive,
      helperText: "Unpublished",
      icon: XCircle,
      iconBg: "#E74C3C"
    },
    {
      title: "Automated",
      value: metrics.automated,
      helperText: "Rule-based",
      icon: AlertCircle,
      iconBg: "#3498DB"
    },
    {
      title: "Manual",
      value: metrics.manual,
      helperText: "Hand-picked",
      icon: Package,
      iconBg: "#F5A623"
    },
  ], [metrics]);
};
