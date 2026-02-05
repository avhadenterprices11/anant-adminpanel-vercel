import type { BlogFormData } from './blog.types';

// ==================== Component Props Interfaces ====================

export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
}

// ==================== Form Section Props ====================

export interface VisibilityCategorySectionProps {
  formData: BlogFormData;
  handleInputChange: (field: keyof BlogFormData, value: any) => void;
}

export interface TagsSectionProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export interface SeoSectionProps {
  formData: BlogFormData;
  handleInputChange: (field: keyof BlogFormData, value: any) => void;
}

export interface PublishingSectionProps {
  formData: BlogFormData;
  handleInputChange: (field: keyof BlogFormData, value: any) => void;
  onPublish: () => void;
}

export interface MediaSectionProps {
  featuredImage: string;
  onImageChange: (url: string) => void;
}

export interface ContentEditorSectionProps {
  content: string;
  onContentChange: (content: string) => void;
}

export interface CategorizationSectionProps {
  category: string;
  onCategoryChange: (category: string) => void;
}

export interface BlogSubsectionsProps {
  subsections: any[];
  onSubsectionsChange: (subsections: any[]) => void;
}

export interface BlogMediaSectionProps {
  media: any[];
  onMediaChange: (media: any[]) => void;
}

export interface BlogDetailsSectionProps {
  formData: BlogFormData;
  handleInputChange: (field: keyof BlogFormData, value: any) => void;
}

export interface AuthorSectionProps {
  author: string;
  onAuthorChange: (author: string) => void;
}
