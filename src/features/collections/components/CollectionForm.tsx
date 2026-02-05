import { Save, Plus, Package, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCollectionForm } from '../hooks/useCollectionForm';
import { BasicDetailsSection, SeoSection, PublishingSection } from './formSections';
import { CollectionTypeSelector } from './formSections/CollectionTypeSelector';
import { ProductSelector } from './ProductSelector';
import { SORT_OPTIONS, CONDITION_CONFIGS } from '../types/collection.types';
import { CommonConditionsSection } from '@/components/features/rules/CommonConditionsSection';
import { NotesTags } from '@/components/features/notes/NotesTags';
import { Badge } from '@/components/ui/badge';
import { CollectionMediaUpload } from '../components/CollectionMediaUpload';
import { PageHeader } from '@/components/layout/PageHeader';


export function CollectionForm() {
  const {
    formData,
    isEditMode,
    handleInputChange,
    handleSave,
    handleCancel,
    matchingProducts,
    handleApplyConditions,
    handleClearConditions,
    handleSortOrderChange
  } = useCollectionForm();

  return (
    <div className="flex-1 w-full">
      <PageHeader
        title={isEditMode ? 'Edit Collection' : 'Save New Collection'}
        subtitle={isEditMode ? 'Update collection details and rules' : 'Set up automated or manual product collections'}
        breadcrumbs={[
          { label: 'Collections', onClick: handleCancel },
          { label: isEditMode ? 'Edit' : 'Add New', active: true }
        ]}
        backIcon="arrow"
        onBack={handleCancel}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={handleCancel}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="lg"
              onClick={handleSave}
              className="rounded-xl bg-[var(--sidebar-bg)] hover:bg-[var(--sidebar-hover)] text-[var(--text-white)]/90 h-[44px] px-6 gap-2 shadow-sm"
            >
              {isEditMode ? <Save className="size-[18px]" /> : <Plus className="size-[18px]" />}
              {isEditMode ? 'Save Changes' : 'Create Collection'}
            </Button>
          </div>
        }
      />

      <div className="px-6 lg:px-8 pb-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Primary Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Basic Details */}
            <BasicDetailsSection
              title={formData.title}
              description={formData.description}
              onTitleChange={(value) => handleInputChange('title', value)}
              onDescriptionChange={(value) => handleInputChange('description', value)}
              useRichText={true}
            />

            {/* 2. Media */}
            <CollectionMediaUpload
              bannerImage={formData.bannerImage}
              bannerImageMobile={formData.bannerImageMobile}
            />

            {/* 3. Rules & Products */}
            <CommonConditionsSection
              title="Apply Rule/Add Products"
              icon={Settings}
              collectionType={formData.collectionType} // Reverted to formData.collectionType to maintain existing data flow
              onCollectionTypeChange={(value: string) => handleInputChange('collectionType', value)} // Reverted to existing handler
              conditions={formData.conditions} // Reverted to formData.conditions
              onConditionsChange={(conditions: any[]) => handleInputChange('conditions', conditions)} // Reverted to existing handler
              matchType={formData.conditionMatchType} // Reverted to formData.conditionMatchType
              onMatchTypeChange={(value: 'all' | 'any') => handleInputChange('conditionMatchType', value)} // Reverted to existing handler
              onApplyConditions={handleApplyConditions}
              onClearConditions={handleClearConditions}
              matchingProducts={matchingProducts}
              sortOrder={formData.sortOrder} // Reverted to formData.sortOrder
              onSortOrderChange={handleSortOrderChange}
              sortOptions={SORT_OPTIONS}
              CollectionTypeSelector={CollectionTypeSelector}
              ProductSelector={ProductSelector}
              conditionConfigs={CONDITION_CONFIGS}
            />
          </div>

          {/* RIGHT COLUMN - Secondary Content */}
          <div className="space-y-6">
            {/* Collection Status Summary */}
            {isEditMode && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[20px] border border-indigo-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="size-8 rounded-lg bg-[#0e042f] flex items-center justify-center">
                    <Package className="size-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">Collection Overview</h3>
                    <p className="text-xs text-slate-600">Quick summary</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-indigo-100">
                    <span className="text-xs text-slate-600">Products</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {matchingProducts.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-indigo-100">
                    <span className="text-xs text-slate-600">Type</span>
                    <Badge
                      variant="secondary"
                      className="text-xs capitalize"
                    >
                      {formData.collectionType || 'Not set'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs text-slate-600">Status</span>
                    <Badge
                      variant={formData.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs capitalize"
                    >
                      {formData.status}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Publishing */}
            <PublishingSection
              status={formData.status}
              publishDate={formData.publishDate}
              publishTime={formData.publishTime}
              onStatusChange={(value) => handleInputChange('status', value)}
              onPublishDateChange={(value) => handleInputChange('publishDate', value)}
              onPublishTimeChange={(value) => handleInputChange('publishTime', value)}
              showScheduling={true}
            />

            {/* Notes & Tags */}
            <NotesTags
              adminComment={formData.adminComment}
              onAdminCommentChange={(value: string) => handleInputChange('adminComment', value)}
              tags={formData.tags}
              onTagsChange={(value: string[]) => handleInputChange('tags', value)}
              showCustomerNote={false}
              availableTags={['Cricket', 'Featured', 'New Arrival', 'Best Seller', 'Sale', 'Premium', 'Professional', 'Beginner']}
            />

            {/* SEO Metadata */}
            <SeoSection
              urlHandle={formData.urlHandle}
              metaTitle={formData.metaTitle}
              metaDescription={formData.metaDescription}
              onUrlHandleChange={(value) => handleInputChange('urlHandle', value)}
              onMetaTitleChange={(value) => handleInputChange('metaTitle', value)}
              onMetaDescriptionChange={(value) => handleInputChange('metaDescription', value)}
              showUrlPreview={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
