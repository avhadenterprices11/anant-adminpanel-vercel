// Backend Response Types
export interface BackendBlog {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'public' | 'private';
  category: string;
  tags: string[]; // JSONB maps to string[]
  views_count: number;
  author: string;
  published_at: string | null;
  created_at: string;
  description: string;
}

export interface BackendBlogDetail extends BackendBlog {
  quote: string | null;
  content: string | null;
  main_image_pc_url: string | null;
  main_image_mobile_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  admin_comment: string | null;
  subsections: Array<{
    id: string;
    title: string;
    description: string;
    image_url: string | null;
    sort_order: number;
  }>;
}

export interface SubSection {
  id?: string; // Optional for new subsections
  title: string;
  description: string;
  image?: File | string | null;
}

export interface BlogFormData {
  id?: string; // Optional for edit mode
  title: string;
  quote?: string;
  description: string;
  content: string;
  excerpt?: string; // Kept for legacy compatibility if needed, but quote is preferred
  visibility: BlogVisibility;
  category: string;

  mainImagePC?: File | string | null;
  mainImageMobile?: File | string | null;
  featuredImage?: string; // Legacy
  galleryImages?: string[]; // Legacy

  tags: string[];
  author: string;
  authorBio?: string; // Legacy
  authorImage?: File | string | null; // Legacy

  metaTitle: string;
  metaDescription: string;
  metaURL?: string;
  metaKeywords?: string[]; // Legacy
  slug: string;

  subsections: SubSection[];
  adminComment: string;

  publishDate?: string;
  publishTime?: string;

  featured: boolean; // Legacy but kept in form
  sticky: boolean; // Legacy
  allowComments: boolean; // Legacy
}

export type BlogVisibility = 'Public' | 'Private' | 'Draft';

export interface Blog {
  blog_id: string; // Maintain frontend naming for now or migrate to id
  title: string;
  description: string;
  visibility: BlogVisibility; // Mapped from status
  category: string;
  tags: string[];
  views: number;
  author: string;
  publish_date?: string;
  created_at: string;
}

export interface BlogsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  author?: string;
  tags?: string;
  startDate?: string;
  endDate?: string;
  minViews?: number;
  maxViews?: number;
  visibility?: BlogVisibility;
  status?: string; // Mapped from visibility
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BlogsApiResponse {
  success: boolean;
  data: BackendBlog[];
  message: string;
  meta?: {
    timestamp?: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

