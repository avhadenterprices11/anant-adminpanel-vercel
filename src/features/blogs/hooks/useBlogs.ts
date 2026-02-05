import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blogService } from "../services/blogService";
import type {
  BlogsQueryParams,
  BlogFormData
} from "../types/blog.types";
import { notifySuccess, notifyError } from "@/utils";

// Query keys
export const blogKeys = {
  all: ["blogs"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  list: (params: BlogsQueryParams) => [...blogKeys.lists(), params] as const,
  details: () => [...blogKeys.all, "detail"] as const,
  detail: (id: string) => [...blogKeys.details(), id] as const,
};

// Get blogs list with filters
export const useBlogs = (params: BlogsQueryParams) => {
  return useQuery({
    queryKey: blogKeys.list(params),
    queryFn: () => blogService.getBlogs(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (prev: any) => prev,
  });
};

// Get single blog by ID
export const useBlog = (id: string) => {
  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: () => blogService.getBlogById(id),
    enabled: !!id,
    // Removed staleTime to ensure fresh data after updates
  });
};

// Create blog mutation
export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BlogFormData) => blogService.createBlog(data),
    onSuccess: () => {
      // Invalidate blogs list to refetch
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      notifySuccess("Blog created successfully!");
    },
    onError: (error: any) => {
      notifyError(error?.response?.data?.error?.message || error?.message || "Failed to create blog");
    },
  });
};

// Update blog mutation
export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlogFormData> }) =>
      blogService.updateBlog(id, data),
    onSuccess: (_, variables) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(variables.id) });
      // Note: Toast notification handled by component
    },
    onError: (error: any) => {
      notifyError(error?.response?.data?.error?.message || error?.message || "Failed to update blog");
    },
  });
};

// Delete blog mutation with Optimistic Updates
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogService.deleteBlog(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: blogKeys.lists() });

      // Snapshot previous value
      const previousBlogs = queryClient.getQueriesData({
        queryKey: blogKeys.lists(),
      });

      // Optimistically remove from all list queries
      queryClient.setQueriesData({ queryKey: blogKeys.lists() }, (old: any) => {
        if (!old?.length) return old;
        // Assuming old is Blog[] directly as per service
        return old.filter((b: any) => b.blog_id !== id);
      });

      return { previousBlogs };
    },
    onError: (_error, _id, context) => {
      if (context?.previousBlogs) {
        context.previousBlogs.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      notifyError("Failed to delete blog");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      notifySuccess("Blog deleted successfully!");
    },
  });
};

// Bulk delete blogs mutation
export const useBulkDeleteBlogs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => blogService.bulkDeleteBlogs(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      notifySuccess("Blogs deleted successfully!");
    },
    onError: (error: any) => {
      notifyError(error?.response?.data?.error?.message || error?.message || "Failed to delete blogs");
    },
  });
};
