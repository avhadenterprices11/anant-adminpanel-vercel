import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ROUTES } from '@/lib/constants';
import { notifyInfo, notifySuccess, notifyError } from '@/utils';
import { blogSchema } from '../validation/blogSchema';
import type { BlogFormData } from '../types/blog.types';
import { useBlog, useUpdateBlog } from './useBlogs';

export const useBlogDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const formRef = useRef<HTMLFormElement>(null);

  // Fetch blog data
  const { data: blog, isLoading, error } = useBlog(id || '');

  // Update Mutation
  const updateBlogMutation = useUpdateBlog();

  const defaultValues: BlogFormData = {
    title: '',
    description: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    visibility: 'Draft',
    publishDate: '',
    publishTime: '',
    featuredImage: '',
    galleryImages: [],
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    metaURL: '',
    slug: '',
    author: '',
    authorBio: '',
    authorImage: '',
    allowComments: true,
    featured: false,
    sticky: false,
    subsections: [],
    mainImagePC: null,
    mainImageMobile: null,
    adminComment: '',
  };

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema) as any, // Type cast needed due to schema defaults
    defaultValues,
    mode: 'onSubmit', // Changed to onSubmit for better UX on edit
  });

  const { setValue, watch, reset, formState: { errors } } = form;
  const values = watch();

  // Manual snapshot for robust change detection (like CustomerForm)
  const [initialSnapshot, setInitialSnapshot] = useState<BlogFormData | null>(null);

  // Log form errors for debugging
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('[useBlogDetail] Form validation errors:', errors);
    }
  }, [errors]);

  // Populate form when data is loaded
  useEffect(() => {
    if (blog) {
      // Sanitize data to match defaultValues structure and avoid false dirty state
      const sanitizedData: BlogFormData = {
        ...defaultValues,
        ...blog,
        quote: blog.quote || '',
        excerpt: blog.excerpt || '',
        description: blog.description || '',
        category: blog.category || '',
        tags: blog.tags || [],
        metaTitle: blog.metaTitle || '',
        metaDescription: blog.metaDescription || '',
        metaURL: blog.metaURL || '',
        author: blog.author || '',
        adminComment: blog.adminComment || '',
        mainImagePC: blog.mainImagePC || null,
        mainImageMobile: blog.mainImageMobile || null,
        visibility: blog.visibility || 'Draft',
        subsections: blog.subsections || [],
      };

      reset(sanitizedData);
      setInitialSnapshot(sanitizedData);
    }
  }, [blog, reset]);

  // Handle Error/Redirect
  useEffect(() => {
    if (error) {
      navigate(ROUTES.BLOGS.LIST);
    }
  }, [error, navigate]);

  const onSubmit = async (data: BlogFormData) => {
    if (!id) return;

    updateBlogMutation.mutate({ id, data }, {
      onSuccess: () => {
        notifySuccess('Blog updated successfully!');
        setTimeout(() => {
          navigate(ROUTES.BLOGS.LIST);
        }, 500);
      }
    });
  };

  const onError = (errors: any) => {
    // Priority 1: Title
    if (errors.title) {
      notifyError('Title is required');
      const element = document.getElementById('blog-title');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    // Priority 2: Description
    if (errors.description) {
      notifyError('Description is required');
      const element = document.getElementById('blog-description');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    // Priority 3: Content
    if (errors.content) {
      notifyError('Content is required');
      const element = document.getElementById('blog-content-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Fallback
    notifyError('Please fix validation errors');
  };

  const handleCancel = () => {
    notifyInfo('Changes discarded');
    navigate(ROUTES.BLOGS.LIST);
  };

  const handleBack = () => {
    navigate(ROUTES.BLOGS.LIST);
  };

  const handleTitleChange = (field: keyof BlogFormData, value: string) => {
    setValue(field, value, { shouldDirty: true });
    if (field === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      // Auto-update Meta URL and Meta Title (User Request: "They should not be different")
      setValue('metaURL', slug, { shouldDirty: true });
      setValue('metaTitle', value.slice(0, 60), { shouldDirty: true });
    }
  };

  const handleDescriptionChange = (value: string) => {
    setValue('description', value, { shouldDirty: true });
    // Auto-update Meta Description
    setValue('metaDescription', value, { shouldDirty: true });
  };

  // Manual hasChanges check to avoid RHF dirty state issues and key ordering mismatches
  const hasChanges = (() => {
    if (!initialSnapshot) return false;

    // Normalize all primitives to ensure strict equality (null == undefined == '')
    const norm = (val: any): any => {
      if (val === null || val === undefined) return '';
      if (typeof val === 'string') return val.trim();
      return val;
    };

    const normalizeContent = (val?: string | null) => {
      if (!val) return '';
      const trimmed = val.trim();
      return (trimmed === '<p><br></p>' || trimmed === '<p></p>') ? '' : trimmed;
    };

    const getComparable = (data: Partial<BlogFormData>) => ({
      title: norm(data.title),
      description: norm(data.description),
      content: normalizeContent(data.content),
      quote: norm(data.quote),
      excerpt: norm(data.excerpt),
      category: norm(data.category),
      tags: (data.tags || []).sort().map(norm), // Sort tags to ignore order
      visibility: norm(data.visibility),
      publishDate: norm(data.publishDate),
      publishTime: norm(data.publishTime),
      metaTitle: norm(data.metaTitle),
      metaDescription: norm(data.metaDescription),
      metaURL: norm(data.metaURL),
      slug: norm(data.slug),
      author: norm(data.author),
      adminComment: norm(data.adminComment),
      featured: !!data.featured,
      sticky: !!data.sticky,
      allowComments: !!data.allowComments,

      // Images - normalize URLs/Strings
      mainImagePC: norm(data.mainImagePC),
      mainImageMobile: norm(data.mainImageMobile),

      // Subsections - deep normalize
      subsections: (data.subsections || []).map(sub => ({
        title: norm(sub.title),
        description: norm(sub.description),
        image: norm(sub.image)
      })),
    });

    const current = getComparable(values);
    const initial = getComparable(initialSnapshot);

    // Debug log to find the culprit if issues persist
    const currentStr = JSON.stringify(current);
    const initialStr = JSON.stringify(initial);
    if (currentStr !== initialStr) {
      console.log('[useBlogDetail] Diff detected:', currentStr, initialStr);
    }

    return currentStr !== initialStr;
  })();

  return {
    form,
    formRef,
    values,
    blog,
    id,
    isLoading,
    onSubmit,
    onError,
    handleCancel,
    handleBack,
    handleTitleChange,
    handleDescriptionChange,
    setValue,
    slug: values.slug,
    isUpdating: updateBlogMutation.isPending,
    hasChanges // Return manual check
  };
};
