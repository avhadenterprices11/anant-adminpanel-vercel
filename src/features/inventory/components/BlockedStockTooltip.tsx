import React from 'react';
import type { BlockedBreakdown } from '../types';

export const BlockedStockTooltip: React.FC<{ breakdown?: BlockedBreakdown; total: number }> = ({ breakdown, total }) => {
    if (total === 0) return null;

    const items = [];
    if (breakdown) {
        if (breakdown.damaged > 0) items.push(`${breakdown.damaged} units — Damaged`);
        if (breakdown.quarantine > 0) items.push(`${breakdown.quarantine} units — Quarantine`);
        if (breakdown.qualityHold > 0) items.push(`${breakdown.qualityHold} units — Quality hold`);
    } else {
        items.push(`${total} units — Unknown`);
    }

    return (
        <div className="text-xs space-y-1">
            {items.map((item, index) => (
                <div key={index}>{item}</div>
            ))}
        </div>
    );
};
