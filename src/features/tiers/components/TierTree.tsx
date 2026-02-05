import {
  ChevronRight,
  ChevronDown,
  Plus,
  FolderTree
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { TierTreeProps, Tier } from '../types/tier.types';

export function TierTree({
  tiers,
  selectedTier,
  expandedTiers,
  onSelectTier,
  onToggleExpand,
  onAddSubTier
}: TierTreeProps) {

  const renderTierNode = (tier: Tier, depth: number = 0) => {
    const isExpanded = expandedTiers.has(tier.id);
    const hasChildren = tier.children && tier.children.length > 0;
    const isSelected = selectedTier?.id === tier.id;

    // Using Anant admin's primary color scheme
    const levelColors = {
      1: 'bg-purple-50 text-purple-700 border-purple-200',
      2: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      3: 'bg-blue-50 text-blue-700 border-blue-200',
      4: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };

    const levelBadges = {
      1: 'bg-purple-100 text-purple-700',
      2: 'bg-indigo-100 text-indigo-700',
      3: 'bg-blue-100 text-blue-700',
      4: 'bg-emerald-100 text-emerald-700'
    };

    return (
      <div key={tier.id}>
        <div
          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors group ${isSelected
            ? levelColors[tier.level]
            : 'hover:bg-slate-50'
            }`}
          style={{ marginLeft: `${depth * 20}px` }}
        >
          {/* Expand/Collapse Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (hasChildren) onToggleExpand(tier.id);
            }}
            className={`p-0.5 ${hasChildren ? 'opacity-100' : 'opacity-0'}`}
          >
            {hasChildren && (
              isExpanded ? (
                <ChevronDown className="size-4 text-slate-600" />
              ) : (
                <ChevronRight className="size-4 text-slate-600" />
              )
            )}
          </button>

          {/* Tier Info */}
          <div
            onClick={() => onSelectTier(tier)}
            className="flex-1 flex items-center gap-2"
          >
            <FolderTree className="size-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-900">{tier.name}</span>
            <Badge variant="secondary" className={`text-xs ${levelBadges[tier.level]}`}>
              T{tier.level}
            </Badge>
            {tier.usageCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {tier.usageCount} items
              </Badge>
            )}
            {tier.status === 'inactive' && (
              <Badge variant="destructive" className="text-xs">
                Inactive
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            {tier.level < 4 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddSubTier(tier);
                }}
                className="p-1.5 hover:bg-white rounded transition-colors"
                title="Add Sub-tier"
              >
                <Plus className="size-3.5 text-purple-600" />
              </button>
            )}
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {tier.children!.map(child => renderTierNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {tiers.map(tier => renderTierNode(tier, 0))}
    </div>
  );
}