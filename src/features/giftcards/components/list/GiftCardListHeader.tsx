import React from 'react';
import { DateRangePicker } from '@/components/forms/inputs/DateRangePicker';
import { ActionButtons } from "@/components/features/data-table";
import type { DateRangeValue } from "@/hooks/useDateRange";

interface GiftCardListHeaderProps {
  dateRange: DateRangeValue;
  setDateRange: (range: DateRangeValue) => void;
  totalItems: number;
}

export const GiftCardListHeader: React.FC<GiftCardListHeaderProps> = ({
  dateRange,
  setDateRange,
  totalItems,
}) => {
  return (
    <div className="flex justify-between items-center">
      <DateRangePicker value={dateRange} onChange={setDateRange} />

      <ActionButtons
        primaryLabel="Create Gift Card"
        primaryTo="/giftcards/new"
        onImport={async () => {
          // Import gift cards
        }}
        onExport={async () => {
          // Export gift cards
        }}
        totalItems={totalItems}
        templateUrl="/templates/giftcards-template.csv"
      />
    </div>
  );
};
