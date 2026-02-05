import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ROUTES } from '@/lib/constants';
import { getMatchingProducts } from '../data/mockCollections';
import type { CollectionFormData } from '../types/collection.types';

export const useCollectionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<CollectionFormData>({
    title: isEditMode ? 'Cricket Equipment Collection' : '',
    description: isEditMode ? '<p>Premium cricket equipment for professional and amateur players</p>' : '',
    bannerImage: '',
    bannerImageMobile: '',
    collectionType: '',
    conditionMatchType: 'all',
    conditions: [
      { id: '1', field: 'tags', condition: 'contains', value: 'Cricket' }
    ],
    sortOrder: 'manually',
    status: 'active',
    publishDate: '',
    publishTime: '',
    tags: isEditMode ? ['Sports', 'Cricket', 'Featured'] : [],
    urlHandle: isEditMode ? 'cricket-equipment-collection' : '',
    metaTitle: isEditMode ? 'Cricket Equipment' : '',
    metaDescription: isEditMode ? 'Shop premium cricket bats, balls, and accessories' : '',
    adminComment: isEditMode ? 'Featured collection for the upcoming cricket season.' : '',
  });

  const handleInputChange = useCallback((field: keyof CollectionFormData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      // Auto-fill SEO fields from title
      if (field === 'title') {
        updated.urlHandle = value.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        updated.metaTitle = value;
      }

      // Auto-fill meta description from description
      if (field === 'description') {
        updated.metaDescription = value;
      }

      return updated;
    });
  }, []);

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error('Collection title is required');
      return;
    }

    toast.success(isEditMode ? 'Collection updated!' : 'Collection created!', {
      description: 'Your changes have been saved.',
    });
  };

  const handleCancel = () => {
    navigate(ROUTES.COLLECTIONS.LIST);
  };

  // Get matching products based on conditions
  const matchingProducts = useMemo(() => {
    return formData.collectionType === 'automated'
      // @ts-ignore - matchType mismatch workaround
      ? getMatchingProducts(formData.conditions, formData.conditionMatchType as 'all' | 'any')
      : [];
  }, [formData.collectionType, formData.conditions, formData.conditionMatchType]);

  const handleApplyConditions = () => {
    toast.success('Conditions applied', {
      description: `Matched ${matchingProducts.length} products.`
    });
  };

  const handleClearConditions = () => {
    handleInputChange('conditions', [{ id: Date.now().toString(), field: 'tags', condition: 'contains', value: '' }]);
    toast.info('Conditions cleared');
  };

  const handleSortOrderChange = useCallback((value: string) => {
    handleInputChange('sortOrder', value);
  }, [handleInputChange]);

  return {
    formData,
    isEditMode,
    handleInputChange,
    handleSave,
    handleCancel,
    matchingProducts,
    handleApplyConditions,
    handleClearConditions,
    handleSortOrderChange
  };
};
