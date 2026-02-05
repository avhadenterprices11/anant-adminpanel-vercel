import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTierHierarchy } from '@/features/tiers/hooks/useTiers';
import type { CategorySelectorProps } from '@/features/products/types/component.types';
import type { Tier } from '@/features/tiers/types/tier.types';

// Helper functions to extract categories from hierarchy
function getTier1Categories(hierarchy: Tier[]): string[] {
  return hierarchy.map(tier => tier.name);
}

function getTier2Categories(hierarchy: Tier[], tier1Name: string | null): string[] {
  if (!tier1Name || !hierarchy) return [];
  const tier1Node = hierarchy.find(tier => tier.name === tier1Name);
  return tier1Node?.children ? tier1Node.children.map(child => child.name) : [];
}

function getTier3Categories(hierarchy: Tier[], tier1Name: string | null, tier2Name: string | null): string[] {
  if (!tier1Name || !tier2Name || !hierarchy) return [];
  const tier1Node = hierarchy.find(tier => tier.name === tier1Name);
  if (!tier1Node?.children) return [];
  const tier2Node = tier1Node.children.find(child => child.name === tier2Name);
  return tier2Node?.children ? tier2Node.children.map(child => child.name) : [];
}

function getTier4Categories(hierarchy: Tier[], tier1Name: string | null, tier2Name: string | null, tier3Name: string | null): string[] {
  if (!tier1Name || !tier2Name || !tier3Name || !hierarchy) return [];
  const tier1Node = hierarchy.find(tier => tier.name === tier1Name);
  if (!tier1Node?.children) return [];
  const tier2Node = tier1Node.children.find(child => child.name === tier2Name);
  if (!tier2Node?.children) return [];
  const tier3Node = tier2Node.children.find(child => child.name === tier3Name);
  return tier3Node?.children ? tier3Node.children.map(child => child.name) : [];
}

export function CategorySelector({
  tier1Category,
  tier2Category,
  tier3Category,
  tier4Category,
  onTier1Change,
  onTier2Change,
  onTier3Change,
  onTier4Change,
}: CategorySelectorProps) {
  const { data: hierarchyData, isLoading, error } = useTierHierarchy();

  const tier1Categories = hierarchyData ? getTier1Categories(hierarchyData) : [];
  const tier2Categories = getTier2Categories(hierarchyData || [], tier1Category);
  const tier3Categories = getTier3Categories(hierarchyData || [], tier1Category, tier2Category);
  const tier4Categories = getTier4Categories(hierarchyData || [], tier1Category, tier2Category, tier3Category || '');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-full text-center py-4">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          <span className="ml-2 text-sm text-gray-600">Loading categories...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-full text-center py-4">
          <span className="text-sm text-red-600">Failed to load categories</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Tier 1 */}
      <div>
        <Label htmlFor="tier1Category" className="text-sm font-medium text-slate-700 mb-2 block">
          Tier 1 Category *
        </Label>
        <Select value={tier1Category || undefined} onValueChange={onTier1Change}>
          <SelectTrigger id="tier1Category" className="rounded-xl">
            <SelectValue placeholder="Select tier 1 category..." />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {tier1Categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tier 2 */}
      <div>
        <Label htmlFor="tier2Category" className="text-sm font-medium text-slate-700 mb-2 block">
          Tier 2 Category *
        </Label>
        <Select value={tier2Category || undefined} onValueChange={onTier2Change} disabled={!tier1Category}>
          <SelectTrigger
            id="tier2Category"
            className={`rounded-xl ${!tier1Category ? 'bg-slate-50 cursor-not-allowed' : ''}`}
          >
            <SelectValue
              placeholder={
                tier1Category ? 'Select tier 2 category...' : 'Select tier 1 category first'
              }
            />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {tier2Categories.map((subCat) => (
              <SelectItem key={subCat} value={subCat}>
                {subCat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!tier1Category && (
          <p className="text-xs text-slate-500 mt-1.5">Select a tier 1 category first</p>
        )}
      </div>

      {/* Tier 3 */}
      <div>
        <Label htmlFor="tier3Category" className="text-sm font-medium text-slate-700 mb-2 block">
          Tier 3 Category *
        </Label>
        <Select value={tier3Category || undefined} onValueChange={onTier3Change} disabled={!tier2Category}>
          <SelectTrigger
            id="tier3Category"
            className={`rounded-xl ${!tier2Category ? 'bg-slate-50 cursor-not-allowed' : ''}`}
          >
            <SelectValue
              placeholder={
                tier2Category ? 'Select tier 3 category...' : 'Select tier 2 category first'
              }
            />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {tier3Categories.map((subCat) => (
              <SelectItem key={subCat} value={subCat}>
                {subCat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!tier2Category && (
          <p className="text-xs text-slate-500 mt-1.5">Select a tier 2 category first</p>
        )}
      </div>

      {/* Tier 4 */}
      <div>
        <Label htmlFor="tier4Category" className="text-sm font-medium text-slate-700 mb-2 block">
          Tier 4 Category *
        </Label>
        <Select value={tier4Category || undefined} onValueChange={onTier4Change} disabled={!tier3Category}>
          <SelectTrigger
            id="tier4Category"
            className={`rounded-xl ${!tier3Category ? 'bg-slate-50 cursor-not-allowed' : ''}`}
          >
            <SelectValue
              placeholder={
                tier3Category ? 'Select tier 4 category...' : 'Select tier 3 category first'
              }
            />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {tier4Categories.map((subCat) => (
              <SelectItem key={subCat} value={subCat}>
                {subCat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!tier3Category && (
          <p className="text-xs text-slate-500 mt-1.5">Select a tier 3 category first</p>
        )}
      </div>
    </div>
  );
}
