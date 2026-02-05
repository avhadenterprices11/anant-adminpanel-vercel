import { makeGetRequest, makeGetRequestWithParams, makePostRequest, makePutRequest, makeDeleteRequest } from '@/lib/api';
import { API_ROUTES } from '@/lib/constants';
import type { Collection, CollectionFormData } from '../types/collection.types';
import { mockCollections, getCollectionById as getMockCollection } from '../data/mockCollections';

// For now, using mock data. Replace with actual API calls when backend is ready
const USE_MOCK_DATA = true;

export const collectionService = {
  /**
   * Get all collections with optional filters
   */
  async getCollections(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ collections: Collection[]; total: number }> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      let filtered = [...mockCollections];

      // Apply status filter
      if (params?.status) {
        filtered = filtered.filter(c => c.status === params.status);
      }

      // Apply search filter
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filtered = filtered.filter(c =>
          c.title.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower) ||
          c.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      return {
        collections: filtered,
        total: filtered.length,
      };
    }

    const response = await makeGetRequestWithParams<{ collections: Collection[]; total: number }>(API_ROUTES.COLLECTIONS.BASE, params || {});
    return response.data;
  },

  /**
   * Get a single collection by ID
   */
  async getCollectionById(id: string): Promise<Collection> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const collection = getMockCollection(id);
      if (!collection) {
        throw new Error(`Collection with ID ${id} not found`);
      }
      return collection;
    }

    const response = await makeGetRequest<Collection>(API_ROUTES.COLLECTIONS.BY_ID(id));
    return response.data;
  },

  /**
   * Create a new collection
   */
  async createCollection(data: CollectionFormData): Promise<Collection> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newCollection: Collection = {
        id: `COL-${Date.now()}`,
        ...data,
        productCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin@example.com',
        lastModifiedBy: 'admin@example.com',
      };

      mockCollections.push(newCollection);
      return newCollection;
    }

    const response = await makePostRequest<Collection, CollectionFormData>(API_ROUTES.COLLECTIONS.BASE, data);
    return response.data;
  },

  /**
   * Update an existing collection
   */
  async updateCollection(id: string, data: Partial<CollectionFormData>): Promise<Collection> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));

      const index = mockCollections.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error(`Collection with ID ${id} not found`);
      }

      const updatedCollection: Collection = {
        ...mockCollections[index],
        ...data,
        updatedAt: new Date().toISOString(),
        lastModifiedBy: 'admin@example.com',
      };

      mockCollections[index] = updatedCollection;
      return updatedCollection;
    }

    const response = await makePutRequest<Collection, Partial<CollectionFormData>>(API_ROUTES.COLLECTIONS.BY_ID(id), data);
    return response.data;
  },

  /**
   * Delete a collection
   */
  async deleteCollection(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));

      const index = mockCollections.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error(`Collection with ID ${id} not found`);
      }

      mockCollections.splice(index, 1);
      return;
    }

    await makeDeleteRequest(API_ROUTES.COLLECTIONS.BY_ID(id));
  },

  /**
   * Bulk delete collections
   */
  async bulkDeleteCollections(ids: string[]): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));

      ids.forEach(id => {
        const index = mockCollections.findIndex(c => c.id === id);
        if (index !== -1) {
          mockCollections.splice(index, 1);
        }
      });
      return;
    }

    await makePostRequest(API_ROUTES.COLLECTIONS.BULK_DELETE, { ids });
  },
};
