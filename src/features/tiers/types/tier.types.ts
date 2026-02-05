// Tier Management Types

export interface Tier {
  id: string;
  name: string;
  code: string;
  level: 1 | 2 | 3 | 4;
  parentId: string | null;
  status: 'active' | 'inactive';
  isDeleted: boolean;
  description: string;
  usageCount: number;
  children?: Tier[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TierFormData {
  name: string;
  code: string;
  level: 1 | 2 | 3 | 4;
  parentId: string | null;
  status: 'active' | 'inactive';
  description: string;
}

export type TierViewMode = 'list' | 'create' | 'edit' | 'details';

export interface TierTreeProps {
  tiers: Tier[];
  selectedTier: Tier | null;
  expandedTiers: Set<string>;
  onSelectTier: (tier: Tier) => void;
  onToggleExpand: (tierId: string) => void;
  onAddSubTier: (parent: Tier) => void;
}

export interface TierDetailsProps {
  tier: Tier;
  onEdit: (tier: Tier) => void;
  onAddSubTier: (tier: Tier) => void;
  onDelete: (tier: Tier) => void;
  onSelectTier?: (tier: Tier) => void;
}

export interface TierFormProps {
  mode: 'create' | 'edit';
  initialData?: TierFormData;
  selectedParent?: Tier;
  availableParents: Tier[];
  onSave: (data: TierFormData) => void;
  onCancel: () => void;
}