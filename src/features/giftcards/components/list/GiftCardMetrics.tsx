import React from 'react';
import { MetricsGrid, type MetricItem } from "@/components/features/metrics";

interface GiftCardMetricsProps {
  metrics: MetricItem[];
}

export const GiftCardMetrics: React.FC<GiftCardMetricsProps> = ({ metrics }) => {
  return <MetricsGrid metrics={metrics} />;
};
