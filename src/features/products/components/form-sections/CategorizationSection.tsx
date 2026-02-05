import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tag, Loader2 } from 'lucide-react';
import { FormSection } from '@/components/forms';
import type { CategorizationSectionProps } from '@/features/products/types/component.types';
import { useTiers } from '@/features/tiers/hooks/useTiers';
import { useMemo } from 'react';

export function CategorizationSection({ formData, handleInputChange, errors }: CategorizationSectionProps) {
  // Fetch all active tiers from API
  const { data: allTiers = [], isLoading } = useTiers({ status: 'active' });

  // Filter tiers by level and parent
  const tier1Categories = useMemo(() => 
    allTiers.filter(tier => tier.level === 1),
    [allTiers]
  );

  const tier2Categories = useMemo(() => 
    formData.tier1Category 
      ? allTiers.filter(tier => tier.level === 2 && tier.parentId === formData.tier1Category)
      : [],
    [allTiers, formData.tier1Category]
  );

  const tier3Categories = useMemo(() => 
    formData.tier2Category
      ? allTiers.filter(tier => tier.level === 3 && tier.parentId === formData.tier2Category)
      : [],
    [allTiers, formData.tier2Category]
  );

  const tier4Categories = useMemo(() => 
    formData.tier3Category
      ? allTiers.filter(tier => tier.level === 4 && tier.parentId === formData.tier3Category)
      : [],
    [allTiers, formData.tier3Category]
  );

  if (isLoading) {
    return (
      <FormSection icon={Tag} title="Product Categorization">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="size-6 animate-spin text-slate-400" />
          <span className="ml-2 text-sm text-slate-500">Loading categories...</span>
        </div>
      </FormSection>
    );
  }

  return (
    <FormSection icon={Tag} title="Product Categorization" id="section-categorization">
      <div>
        <Label htmlFor="tier1Category" className="text-sm font-medium text-slate-700 mb-2 block">
          Tier 1 Category <span className="text-amber-600">*</span>
        </Label>
        <Select
          value={formData.tier1Category}
          onValueChange={(value) => handleInputChange('tier1Category', value)}
        >
          <SelectTrigger 
            id="tier1Category" 
            className={`rounded-xl ${errors?.tier1Category ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
          >
            <SelectValue placeholder="Select tier 1 category..." />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {tier1Categories.length > 0 ? (
              tier1Categories.map((tier) => (
                <SelectItem key={tier.id} value={tier.id}>
                  {tier.name}
                </SelectItem>
              ))
            ) : (
              <div className="py-2 px-3 text-sm text-slate-500">No categories available</div>
            )}
          </SelectContent>
        </Select>
        {errors?.tier1Category && (
          <p className="text-red-400 text-xs mt-1.5">{errors.tier1Category}</p>
        )}
      </div>

      <div>
        <Label htmlFor="tier2Category" className="text-sm font-medium text-slate-700 mb-2 block">
          Tier 2 Category
        </Label>
        <Select
          value={formData.tier2Category}
          onValueChange={(value) => handleInputChange('tier2Category', value)}
          disabled={!formData.tier1Category}
        >
          <SelectTrigger id="tier2Category" className={`rounded-xl ${!formData.tier1Category ? 'bg-slate-50 cursor-not-allowed' : ''}`}>
            <SelectValue placeholder={formData.tier1Category ? "Select tier 2 category..." : "Select tier 1 category first"} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {tier2Categories.length > 0 ? (
              tier2Categories.map((tier) => (
                <SelectItem key={tier.id} value={tier.id}>
                  {tier.name}
                </SelectItem>
              ))
            ) : (
              <div className="py-2 px-3 text-sm text-slate-500">
                {formData.tier1Category ? 'No subcategories available' : 'Select tier 1 first'}
              </div>
            )}
          </SelectContent>
        </Select>
        {!formData.tier1Category && (
          <p className="text-xs text-slate-500 mt-1.5">
            Select a tier 1 category first
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="tier3Category" className="text-sm font-medium text-slate-700 mb-2 block">
          Tier 3 Category
        </Label>
        <Select
          value={formData.tier3Category}
          onValueChange={(value) => handleInputChange('tier3Category', value)}
          disabled={!formData.tier2Category}
        >
          <SelectTrigger id="tier3Category" className={`rounded-xl ${!formData.tier2Category ? 'bg-slate-50 cursor-not-allowed' : ''}`}>
            <SelectValue placeholder={formData.tier2Category ? "Select tier 3 category..." : "Select tier 2 category first"} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {tier3Categories.length > 0 ? (
              tier3Categories.map((tier) => (
                <SelectItem key={tier.id} value={tier.id}>
                  {tier.name}
                </SelectItem>
              ))
            ) : (
              <div className="py-2 px-3 text-sm text-slate-500">
                {formData.tier2Category ? 'No subcategories available' : 'Select tier 2 first'}
              </div>
            )}
          </SelectContent>
        </Select>
        {!formData.tier2Category && (
          <p className="text-xs text-slate-500 mt-1.5">
            Select a tier 2 category first
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="tier4Category" className="text-sm font-medium text-slate-700 mb-2 block">
          Tier 4 Category
        </Label>
        <Select
          value={formData.tier4Category}
          onValueChange={(value) => handleInputChange('tier4Category', value)}
          disabled={!formData.tier3Category}
        >
          <SelectTrigger id="tier4Category" className={`rounded-xl ${!formData.tier3Category ? 'bg-slate-50 cursor-not-allowed' : ''}`}>
            <SelectValue placeholder={formData.tier3Category ? "Select tier 4 category..." : "Select tier 3 category first"} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {tier4Categories.length > 0 ? (
              tier4Categories.map((tier) => (
                <SelectItem key={tier.id} value={tier.id}>
                  {tier.name}
                </SelectItem>
              ))
            ) : (
              <div className="py-2 px-3 text-sm text-slate-500">
                {formData.tier3Category ? 'No subcategories available' : 'Select tier 3 first'}
              </div>
            )}
          </SelectContent>
        </Select>
        {!formData.tier3Category && (
          <p className="text-xs text-slate-500 mt-1.5">
            Select a tier 3 category first
          </p>
        )}
      </div>
    </FormSection>
  );
}
