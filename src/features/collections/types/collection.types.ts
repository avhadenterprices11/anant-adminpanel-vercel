// Collection Type Definitions

export type CollectionType = 'manual' | 'automated' | '';
export type ConditionMatchType = 'all' | 'any';
export type ConditionField = 'title' | 'price' | 'tags' | '';
export type CollectionStatus = 'active' | 'inactive';

export interface Condition {
  id: string;
  field: ConditionField;
  condition: string;
  value: string;
}

export interface ConditionConfig {
  label: string;
  conditions: Array<{
    value: string;
    label: string;
  }>;
  inputType: 'text' | 'number';
}

export interface Product {
  id: string;
  title: string;
  price: number;
  status: 'Active' | 'Inactive';
  tags: string[];
  sku?: string;
  image?: string;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  bannerImage: string;
  bannerImageMobile: string;
  collectionType: CollectionType;
  conditionMatchType: ConditionMatchType;
  conditions: Condition[];
  sortOrder: string;
  status: CollectionStatus;
  publishDate: string;
  publishTime: string;
  tags: string[];
  urlHandle: string;
  metaTitle: string;
  metaDescription: string;
  adminComment: string;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface CollectionFormData {
  title: string;
  description: string;
  bannerImage: string;
  bannerImageMobile: string;
  collectionType: CollectionType;
  conditionMatchType: ConditionMatchType;
  conditions: Condition[];
  sortOrder: string;
  status: CollectionStatus;
  publishDate: string;
  publishTime: string;
  tags: string[];
  urlHandle: string;
  metaTitle: string;
  metaDescription: string;
  adminComment: string;
}

export const CONDITION_CONFIGS: Record<'title' | 'price' | 'tags', ConditionConfig> = {
  title: {
    label: 'Title',
    conditions: [
      { value: 'starts_with', label: 'starts with' },
      { value: 'ends_with', label: 'ends with' },
      { value: 'contains', label: 'contains' },
      { value: 'is_equal_to', label: 'is equal to' },
      { value: 'does_not_contain', label: 'does not contain' },
      { value: 'is_not_equal_to', label: 'is not equal to' },
    ],
    inputType: 'text',
  },
  price: {
    label: 'Price',
    conditions: [
      { value: 'is_equal_to', label: 'is equal to' },
      { value: 'is_greater_than', label: 'is greater than' },
      { value: 'is_less_than', label: 'is less than' },
      { value: 'is_not_equal_to', label: 'is not equal to' },
    ],
    inputType: 'number',
  },
  tags: {
    label: 'Tags',
    conditions: [
      { value: 'is_equal_to', label: 'is equal to' },
      { value: 'contains', label: 'contains' },
      { value: 'does_not_contain', label: 'does not contain' },
      { value: 'is_not_equal_to', label: 'is not equal to' },
    ],
    inputType: 'text',
  },
};

export const SORT_OPTIONS = [
  { value: 'manually', label: 'Manually' },
  { value: 'title_asc', label: 'Title (A → Z)' },
  { value: 'title_desc', label: 'Title (Z → A)' },
  { value: 'price_high', label: 'Highest Price' },
  { value: 'price_low', label: 'Lowest Price' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
];
