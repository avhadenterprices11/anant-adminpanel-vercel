import type { CollectionFormData, Product } from './collection.types';

// ==================== Component Props Interfaces ====================

export interface ProductSelectorProps {
  selectedProducts: Product[];
  onProductsChange: (products: Product[]) => void;
}

export interface ConditionBuilderProps {
  conditions: any[];
  onConditionsChange: (conditions: any[]) => void;
}

export interface CollectionMediaUploadProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
}

// ==================== Form Section Props ====================

export interface TagsSectionProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export interface SeoSectionProps {
  formData: CollectionFormData;
  handleInputChange: (field: keyof CollectionFormData, value: CollectionFormData[keyof CollectionFormData]) => void;
}

export interface RulesSectionProps {
  rules: any[];
  onRulesChange: (rules: any[]) => void;
}

export interface PublishingSectionProps {
  formData: CollectionFormData;
  handleInputChange: (field: keyof CollectionFormData, value: CollectionFormData[keyof CollectionFormData]) => void;
}

export interface CollectionTypeSelectorProps {
  type: string;
  onTypeChange: (type: string) => void;
}

export interface BasicDetailsSectionProps {
  formData: CollectionFormData;
  handleInputChange: (field: keyof CollectionFormData, value: CollectionFormData[keyof CollectionFormData]) => void;
}
