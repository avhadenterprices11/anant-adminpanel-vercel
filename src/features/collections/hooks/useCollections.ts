import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionService } from '../services/collectionService';
import type { CollectionFormData } from '../types/collection.types';
import { toast } from 'sonner';

// Query keys
export const collectionKeys = {
  all: ['collections'] as const,
  lists: () => [...collectionKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...collectionKeys.lists(), filters] as const,
  details: () => [...collectionKeys.all, 'detail'] as const,
  detail: (id: string) => [...collectionKeys.details(), id] as const,
};

/**
 * Hook to fetch all collections with filters
 */
export function useCollections(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: collectionKeys.list(params || {}),
    queryFn: () => collectionService.getCollections(params),
  });
}

/**
 * Hook to fetch a single collection by ID
 */
export function useCollection(id: string) {
  return useQuery({
    queryKey: collectionKeys.detail(id),
    queryFn: () => collectionService.getCollectionById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new collection
 */
export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CollectionFormData) => collectionService.createCollection(data),
    onSuccess: (newCollection) => {
      // Invalidate collections list
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
      
      toast.success('Collection created!', {
        description: `"${newCollection.title}" has been created successfully.`,
      });
    },
    onError: (error: any) => {
      toast.error('Failed to create collection', {
        description: error.message || 'An error occurred while creating the collection.',
      });
    },
  });
}

/**
 * Hook to update an existing collection
 */
export function useUpdateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CollectionFormData> }) =>
      collectionService.updateCollection(id, data),
    onSuccess: (updatedCollection) => {
      // Invalidate collections list and detail
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(updatedCollection.id) });
      
      toast.success('Collection updated!', {
        description: `"${updatedCollection.title}" has been updated successfully.`,
      });
    },
    onError: (error: any) => {
      toast.error('Failed to update collection', {
        description: error.message || 'An error occurred while updating the collection.',
      });
    },
  });
}

/**
 * Hook to delete a collection
 */
export function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => collectionService.deleteCollection(id),
    onSuccess: () => {
      // Invalidate collections list
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
      
      toast.success('Collection deleted!', {
        description: 'The collection has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      toast.error('Failed to delete collection', {
        description: error.message || 'An error occurred while deleting the collection.',
      });
    },
  });
}

/**
 * Hook to bulk delete collections
 */
export function useBulkDeleteCollections() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => collectionService.bulkDeleteCollections(ids),
    onSuccess: (_, ids) => {
      // Invalidate collections list
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
      
      toast.success('Collections deleted!', {
        description: `${ids.length} collection${ids.length === 1 ? '' : 's'} deleted successfully.`,
      });
    },
    onError: (error: any) => {
      toast.error('Failed to delete collections', {
        description: error.message || 'An error occurred while deleting the collections.',
      });
    },
  });
}
