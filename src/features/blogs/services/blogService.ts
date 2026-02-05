import {
  makeGetRequestWithParams,
  makeGetRequest,
  makePostRequest,
  makePutRequest,
  makeDeleteRequest,
  httpClient
} from "@/lib/api";
import { API_ROUTES } from '@/lib/constants';
import { logger } from "@/lib/utils/logger";
import type {
  BlogsApiResponse,
  BlogsQueryParams,
  BlogFormData,
  BackendBlogDetail,
  BlogVisibility,
  Blog
} from "../types/blog.types";

// Helper to convert relative URLs to absolute URLs
const getAbsoluteImageUrl = (url: string | null): string | null => {
  if (!url) return null;
  // If already absolute URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Get backend base URL without /api suffix
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  const backendBaseUrl = apiBaseUrl.replace('/api', '');
  // Remove leading slash from url if present to avoid double slashes
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${backendBaseUrl}${cleanUrl}`;
};

export const blogService = {
  getBlogs: async (params: BlogsQueryParams): Promise<{ blogs: Blog[]; meta?: { page: number; limit: number; total: number } }> => {
    // Map Frontend params to Backend params
    const backendParams: any = {
      page: params.page,
      limit: params.limit,
      search: params.search,
      category: params.category,
      author: params.author,
      tags: params.tags,
      startDate: params.startDate,
      endDate: params.endDate,
      minViews: params.minViews,
      maxViews: params.maxViews,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    };

    if (params.visibility) {
      backendParams.status = params.visibility.toLowerCase();
    }

    const response = await makeGetRequestWithParams<BlogsApiResponse>(
      API_ROUTES.BLOGS?.BASE || '/api/blogs',
      backendParams
    );

    // Map BackendBlog[] to Frontend Blog[]
    const blogs = response.data.data.map((blog) => ({
      blog_id: blog.id,
      title: blog.title,
      description: blog.description,
      // Map status 'public'/'draft' -> 'Public'/'Draft'
      visibility: (blog.status.charAt(0).toUpperCase() + blog.status.slice(1)) as BlogVisibility,
      category: blog.category,
      tags: blog.tags || [],
      views: blog.views_count,
      author: blog.author,
      publish_date: blog.published_at || undefined,
      created_at: blog.created_at
    }));

    return {
      blogs,
      meta: response.data.meta?.pagination
    };
  },

  getBlogById: async (id: string): Promise<BlogFormData> => {
    const response = await makeGetRequest<{ data: BackendBlogDetail }>(
      API_ROUTES.BLOGS?.BY_ID?.(id) || `/api/blogs/${id}`
    );
    const data = response.data.data;

    const result = {
      id: data.id,
      title: data.title,
      quote: data.quote || '',
      description: data.description,
      content: data.content || '',
      slug: data.slug,

      // Map status -> visibility
      visibility: (data.status.charAt(0).toUpperCase() + data.status.slice(1)) as BlogVisibility,
      category: data.category,

      tags: data.tags || [],
      author: data.author,

      // Admin
      adminComment: data.admin_comment || '',

      // SEO
      metaTitle: data.meta_title || '',
      metaDescription: data.meta_description || '',

      // We use explicit URL fields instead of Files for fetched data
      // Convert relative URLs to absolute URLs
      mainImagePC: getAbsoluteImageUrl(data.main_image_pc_url),
      mainImageMobile: getAbsoluteImageUrl(data.main_image_mobile_url),

      // Subsections
      subsections: (data.subsections || []).map(sub => ({
        id: sub.id,
        title: sub.title,
        description: sub.description,
        image: sub.image_url
      })),

      // Legacy/Unused fields (fill with defaults to satisfy type)
      excerpt: '',
      featuredImage: '',
      galleryImages: [],
      authorBio: '',
      authorImage: null,
      metaKeywords: [],
      metaURL: data.slug, // Sync metaURL with slug
      publishDate: data.published_at ? new Date(data.published_at).toISOString().split('T')[0] : '',
      publishTime: data.published_at ? new Date(data.published_at).toTimeString().slice(0, 5) : '',
      featured: false,
      sticky: false,
      allowComments: true
    };



    return result;
  },

  createBlog: async (data: BlogFormData) => {
    // Upload image files first and get URLs
    let mainImagePCUrl: string | undefined = undefined;
    let mainImageMobileUrl: string | undefined = undefined;

    // Upload main PC image if it's a File
    if (data.mainImagePC && data.mainImagePC instanceof File) {
      const uploadService = await import('@/services/uploadService');
      const uploadResponse = await uploadService.uploadFile(data.mainImagePC);
      mainImagePCUrl = uploadResponse.file_url;
      logger.debug('[BlogService] Uploaded main PC image:', mainImagePCUrl);
    } else if (typeof data.mainImagePC === 'string') {
      mainImagePCUrl = data.mainImagePC;
    }

    // Upload main mobile image if it's a File
    if (data.mainImageMobile && data.mainImageMobile instanceof File) {
      const uploadService = await import('@/services/uploadService');
      const uploadResponse = await uploadService.uploadFile(data.mainImageMobile);
      mainImageMobileUrl = uploadResponse.file_url;
      logger.debug('[BlogService] Uploaded main mobile image:', mainImageMobileUrl);
    } else if (typeof data.mainImageMobile === 'string') {
      mainImageMobileUrl = data.mainImageMobile;
    }

    // Map Frontend CamelCase -> Backend expects
    const payload: any = {
      title: data.title,
      quote: data.quote,
      description: data.description,
      content: data.content,

      // Backend expects 'visibility' in TitleCase (Public/Draft/Private)
      visibility: data.visibility,
      category: data.category,
      tags: data.tags,
      author: data.author,

      // SEO
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      metaURL: data.metaURL || data.slug, // backend expects slug/metaURL mapping

      // Admin
      adminComment: data.adminComment,

      // Images - now URLs after upload
      mainImagePC: mainImagePCUrl,
      mainImageMobile: mainImageMobileUrl,

      // Subsections
      subsections: data.subsections.map(sub => ({
        title: sub.title,
        description: sub.description,
        image: typeof sub.image === 'string' ? sub.image : undefined
      }))
    };

    logger.debug('[BlogService] Create payload:', payload);
    logger.debug('[BlogService] Content field value:', data.content);


    const response = await makePostRequest<{ data: any }>(
      API_ROUTES.BLOGS?.BASE || '/api/blogs',
      payload
    );
    return response.data.data;
  },

  updateBlog: async (id: string, data: Partial<BlogFormData>) => {
    // Upload image files first if they're Files
    let mainImagePCUrl: string | undefined = undefined;
    let mainImageMobileUrl: string | undefined = undefined;

    // Upload main PC image if it's a File
    if (data.mainImagePC && data.mainImagePC instanceof File) {
      const uploadService = await import('@/services/uploadService');
      const uploadResponse = await uploadService.uploadFile(data.mainImagePC);
      mainImagePCUrl = uploadResponse.file_url;
      logger.debug('[BlogService] Uploaded main PC image:', mainImagePCUrl);
    } else if (typeof data.mainImagePC === 'string') {
      mainImagePCUrl = data.mainImagePC;
    }

    // Upload main mobile image if it's a File
    if (data.mainImageMobile && data.mainImageMobile instanceof File) {
      const uploadService = await import('@/services/uploadService');
      const uploadResponse = await uploadService.uploadFile(data.mainImageMobile);
      mainImageMobileUrl = uploadResponse.file_url;
      logger.debug('[BlogService] Uploaded main mobile image:', mainImageMobileUrl);
    } else if (typeof data.mainImageMobile === 'string') {
      mainImageMobileUrl = data.mainImageMobile;
    }

    // Manual Mapping for Update
    const payload: any = {};

    if (data.title !== undefined) payload.title = data.title;
    if (data.quote !== undefined) payload.quote = data.quote;
    if (data.description !== undefined) payload.description = data.description;
    if (data.content !== undefined) payload.content = data.content;

    if (data.visibility !== undefined) payload.visibility = data.visibility; // Backend handles uppercase 'Public' via Zod transform, or we lowercase it here. 
    // Backend Zod: z.enum(['Public'...]).transform(val => val.toLowerCase())
    // So sending Title Case is fine!

    if (data.category !== undefined) payload.category = data.category;
    if (data.tags !== undefined) payload.tags = data.tags;
    if (data.author !== undefined) payload.author = data.author;

    if (data.metaTitle !== undefined) payload.metaTitle = data.metaTitle;
    if (data.metaDescription !== undefined) payload.metaDescription = data.metaDescription;
    if (data.metaURL !== undefined) payload.metaURL = data.metaURL;

    if (data.adminComment !== undefined) payload.adminComment = data.adminComment;

    // Use uploaded URLs if files were uploaded
    if (data.mainImagePC !== undefined) payload.mainImagePC = mainImagePCUrl;
    if (data.mainImageMobile !== undefined) payload.mainImageMobile = mainImageMobileUrl;

    if (data.subsections !== undefined) {
      payload.subsections = data.subsections.map(sub => ({
        id: sub.id, // Include ID for updates
        title: sub.title,
        description: sub.description,
        image: typeof sub.image === 'string' ? sub.image : undefined
      }));
    }

    logger.debug('[BlogService] Update payload:', payload);

    const response = await makePutRequest<{ data: any }>(
      API_ROUTES.BLOGS?.BY_ID?.(id) || `/api/blogs/${id}`,
      payload
    );
    return response.data.data;
  },

  deleteBlog: async (id: string) => {
    const response = await makeDeleteRequest<{ message: string }>(
      API_ROUTES.BLOGS?.BY_ID?.(id) || `/api/blogs/${id}`
    );
    return response.data;
  },

  bulkDeleteBlogs: async (ids: string[]) => {
    const response = await makePostRequest<{ message: string }>(
      `${API_ROUTES.BLOGS?.BASE}/bulk-delete` || 'blogs/bulk-delete',
      { ids }
    );
    return response.data;
  },

  /**
   * Import blogs from CSV/JSON data
   */
  /**
   * Import blogs from CSV/JSON data
   */
  importBlogs: async (data: any[], mode: 'create' | 'update' | 'upsert') => {
    const response = await makePostRequest<{
      success: number;
      failed: number;
      skipped: number;
      errors: Array<{ row: number; title: string; error: string }>;
    }>(
      API_ROUTES.BLOGS?.IMPORT || '/api/blogs/import',
      {
        data: data
          .filter(item => item.title && String(item.title).trim() !== '') // Filter out rows without title
          .map(item => {
            // Helper to sanitize strings (convert null/undefined/empty to undefined)
            const sanitizeString = (val: any) => val && String(val).trim() !== '' ? String(val).trim() : undefined;

            // Helper to sanitize and truncate
            const sanitizeAndTruncate = (val: any, maxLength: number) => {
              const sanitized = sanitizeString(val);
              return sanitized ? sanitized.substring(0, maxLength) : undefined;
            };

            return {
              title: String(item.title || '').trim().substring(0, 255), // Max 255
              slug: sanitizeAndTruncate(item.slug, 255),
              description: sanitizeAndTruncate(item.description, 150), // Max 150
              content: sanitizeString(item.content),
              quote: sanitizeAndTruncate(item.quote, 500), // Max 500
              category: sanitizeAndTruncate(item.category, 100), // Max 100
              tags: item.tags ? (Array.isArray(item.tags) ? item.tags : String(item.tags)) : undefined,
              author: sanitizeAndTruncate(item.author, 255), // Max 255
              // Ensure status is lowercase, trimmed, and valid
              status: item.status && String(item.status).trim() !== ''
                ? String(item.status).trim().toLowerCase()
                : undefined,
              meta_title: sanitizeAndTruncate(item.meta_title, 60), // Max 60
              meta_description: sanitizeAndTruncate(item.meta_description, 160), // Max 160
              admin_comment: sanitizeString(item.admin_comment)
            };
          }),
        mode
      }
    );
    // Unwrap the response safely
    return (response.data as any).data;
  },

  /**
   * Export blogs to CSV/XLSX
   */
  exportBlogs: async (options: {
    scope: 'all' | 'selected';
    format: 'csv' | 'xlsx';
    selectedIds?: string[];
    selectedColumns: string[];
    filters?: {
      status?: 'public' | 'private' | 'draft';
      category?: string;
      author?: string;
    };
    dateRange?: {
      from?: string;
      to?: string;
      field?: 'created_at' | 'published_at';
    };
  }) => {
    const response = await httpClient.post<Blob>(
      API_ROUTES.BLOGS?.EXPORT || '/api/blogs/export',
      options,
      { responseType: 'blob' }
    );
    return response.data;
  },
};
