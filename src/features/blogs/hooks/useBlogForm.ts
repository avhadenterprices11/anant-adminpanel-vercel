import { notifyError } from '@/utils';
import { useState } from 'react';
import type { SubSection, BlogFormData } from '../types/blog.types';


/**
 * Standard form hook options interface
 * This pattern is recommended for all form hooks in the application
 */
interface UseBlogFormOptions {
  mode?: 'create' | 'edit';
  initialData?: Partial<BlogFormData>;
  blogId?: string;
}

/**
 * Default form data for new blogs
 */
const getDefaultFormData = (): BlogFormData => ({
  title: '',
  quote: '',
  description: '',
  content: '',
  visibility: 'Draft',
  category: '',
  mainImagePC: null,
  mainImageMobile: null,
  tags: [],
  author: '',
  authorBio: '',
  authorImage: null,
  metaTitle: '',
  metaDescription: '',
  metaURL: '',
  slug: '',
  subsections: [],
  adminComment: '',
  publishDate: '',
  publishTime: '',
  featured: false,
  sticky: false,
  allowComments: true
});

/**
 * Standard blog form hook following the established pattern
 * 
 * @example
 * // Creating new blog
 * const { formData, updateField, handlers } = useBlogForm({ mode: 'create' });
 * 
 * @example
 * // Editing existing blog
 * const { formData, updateField, handlers } = useBlogForm({ 
 *   mode: 'edit',
 *   initialData: blogData,
 *   blogId: '123'
 * });
 */
export const useBlogForm = (options?: UseBlogFormOptions) => {
  const mode = options?.mode || 'create';
  const initialData = options?.initialData;

  // 1. Primary form data state (single source of truth)
  const [formData, setFormData] = useState<BlogFormData>({
    ...getDefaultFormData(),
    ...initialData
  });

  // 2. UI state (separate from form data)
  const [ui, setUi] = useState({
    isLoading: false,
    isSaving: false,
    tagInput: '',
  });

  // 3. Error state for validation
  const [errors, setErrors] = useState<Partial<Record<keyof BlogFormData, string>>>({});

  // === CORE OPERATIONS ===

  /**
   * Generic field update handler
   * Type-safe update for any form field
   */
  const updateField = <K extends keyof BlogFormData>(
    field: K,
    value: BlogFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user updates it
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * Batch update multiple fields at once
   * Useful for complex operations that update multiple fields
   */
  const updateFields = (updates: Partial<BlogFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  /**
   * Reset form to default or initial state
   */
  const resetForm = () => {
    setFormData(initialData ? { ...getDefaultFormData(), ...initialData } : getDefaultFormData());
    setErrors({});
    setUi(prev => ({ ...prev, tagInput: '' }));
  };

  // === SMART HANDLERS ===

  /**
   * Handle title change with SEO auto-fill
   * Demonstrates business logic in handlers
   */
  const handleTitleChange = (newTitle: string) => {
    // Generate SEO-friendly URL slug
    const slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Batch update with derived values
    updateFields({
      title: newTitle,
      metaTitle: newTitle.slice(0, 60), // SEO best practice: max 60 chars
      metaURL: slug
    });
  };

  /**
   * Handle description change with SEO auto-fill
   */
  const handleDescriptionChange = (newDescription: string) => {
    updateFields({
      description: newDescription,
      metaDescription: newDescription
    });
  };

  // === GROUPED HANDLERS ===

  /**
   * Tag management handlers
   * Groups related operations for better organization
   */
  const tagHandlers = {
    add: () => {
      const trimmedTag = ui.tagInput.trim();
      if (trimmedTag && !formData.tags.includes(trimmedTag)) {
        updateField('tags', [...formData.tags, trimmedTag]);
        setUi(prev => ({ ...prev, tagInput: '' }));
      }
    },

    remove: (tagToRemove: string) => {
      updateField('tags', formData.tags.filter(tag => tag !== tagToRemove));
    },

    setInput: (value: string) => {
      setUi(prev => ({ ...prev, tagInput: value }));
    },

    clear: () => {
      updateField('tags', []);
    }
  };

  /**
   * Subsection management handlers
   * Demonstrates complex nested data operations
   */
  const subsectionHandlers = {
    add: () => {
      updateField('subsections', [
        ...formData.subsections,
        {
          id: `subsection-${Date.now()}`,
          title: '',
          description: '',
          image: null
        }
      ]);
    },

    remove: (id: string) => {
      updateField(
        'subsections',
        formData.subsections.filter(s => s.id !== id)
      );
    },

    update: (id: string, field: keyof SubSection, value: any) => {
      updateField(
        'subsections',
        formData.subsections.map(s =>
          s.id === id ? { ...s, [field]: value } : s
        )
      );
    },

    reorder: (startIndex: number, endIndex: number) => {
      const result = Array.from(formData.subsections);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      updateField('subsections', result);
    }
  };

  // === COMPUTED VALUES ===

  /**
   * Check if form has unsaved changes
   */
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData ? { ...getDefaultFormData(), ...initialData } : getDefaultFormData());

  /**
   * Validate form data
   * Returns true if valid, false otherwise
   */
  const validate = (): boolean => {
    // 1. Title Validation
    if (!formData.title.trim()) {
      notifyError('Title is required');
      const element = document.getElementById('blog-title');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return false;
    }

    // 2. Description Validation
    if (!formData.description.trim()) {
      notifyError('Description is required');
      const element = document.getElementById('blog-description');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return false;
    }

    // 3. Content Validation
    if (!formData.content.trim() || formData.content === '<p><br></p>') {
      notifyError('Content is required');
      const element = document.getElementById('blog-content-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    // 4. Author Validation
    if (formData.author && !formData.author.trim()) {
      notifyError('Author name is required');
      const element = document.getElementById('blog-author-name');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return false;
    }

    setErrors({});
    return true;
  };

  // === RETURN INTERFACE ===
  // Following standard pattern: formData, ui state, handlers grouped by domain

  return {
    // Form data (single source of truth)
    formData,

    // UI state
    ui,

    // Error state
    errors,

    // Computed values
    hasChanges,
    mode,

    // Core operations
    updateField,
    updateFields,
    resetForm,
    validate,

    // Smart handlers (with business logic)
    handleTitleChange,
    handleDescriptionChange,

    // Grouped handlers (organized by domain)
    handlers: {
      tags: tagHandlers,
      subsections: subsectionHandlers,
    },
  };
};
