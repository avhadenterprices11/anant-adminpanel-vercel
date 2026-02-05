import type { FAQItem, ProductFormData, ProductImage } from './product.types';

// ==================== Component Props Interfaces ====================

export interface FaqManagerProps {
  faqs: FAQItem[];
  onChange: (faqs: FAQItem[]) => void;
}

export interface ImageUploaderProps {
  primaryImage: string;
  additionalImages: string[];
  onPrimaryImageChange: (url: string) => void;
  onAdditionalImagesChange: (urls: string[]) => void;
}

export interface ProductMediaUploaderProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxImages?: number;
  maxFileSize?: number;
}

// ==================== Form Section Props Interfaces ====================

export interface SeoSectionProps {
  formData: ProductFormData;
  handleInputChange: (field: keyof ProductFormData, value: any) => void;
}

export interface ProductMetricsSectionProps {
  productMetadata: {
    createdAt: string;
    createdBy: string;
    lastModified: string;
    totalViews: number;
    totalSales: number;
  };
}

export interface PricingSectionProps {
  formData: ProductFormData;
  handleInputChange: (field: keyof ProductFormData, value: any) => void;
  errors: Partial<Record<keyof ProductFormData, string>>;
}

export interface InventorySectionProps {
  formData: ProductFormData;
  handleInputChange: (field: keyof ProductFormData, value: any) => void;
  errors: Partial<Record<keyof ProductFormData, string>>;
}

export interface PricingInventorySectionProps {
  formData: ProductFormData;
  handleInputChange: (field: keyof ProductFormData, value: any) => void;
  errors: Partial<Record<keyof ProductFormData, string>>;
  productId?: string; // Optional: only provided on Edit page
}


export interface MediaSectionProps {
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
}

export interface IdentificationSectionProps {
  formData: ProductFormData;
  handleInputChange: (field: keyof ProductFormData, value: any) => void;
}

export interface FAQSectionProps {
  formData: ProductFormData;
  handleAddFAQ: () => void;
  handleRemoveFAQ: (id: string) => void;
  handleFAQChange: (id: string, field: 'question' | 'answer', value: string) => void;
  expandedFaqId?: string | null;
  setExpandedFaqId?: (id: string | null) => void;
}

export interface CategorizationSectionProps {
  formData: ProductFormData;
  handleInputChange: (field: keyof ProductFormData, value: any) => void;
  errors: Partial<Record<keyof ProductFormData, string>>;
}

export interface BasicDetailsSectionProps {
  formData: ProductFormData;
  handleInputChange: (field: keyof ProductFormData, value: any) => void;
  errors: Partial<Record<keyof ProductFormData, string>>;
}

export interface AvailabilitySectionProps {
  formData: ProductFormData;
  handleInputChange: (field: keyof ProductFormData, value: any) => void;
}

export interface AssociationsSectionProps {
  formData: ProductFormData;
  handleInputChange: (field: keyof ProductFormData, value: any) => void;
}

export interface SalesChannelsSectionProps {
  formData: ProductFormData;
  handleInputChange: (field: keyof ProductFormData, value: any) => void;
}

export interface CategorySelectorProps {
  tier1Category: string | null;
  tier2Category: string | null;
  tier3Category: string | null;
  tier4Category: string | null;
  onTier1Change: (value: string) => void;
  onTier2Change: (value: string) => void;
  onTier3Change: (value: string) => void;
  onTier4Change: (value: string) => void;
}
