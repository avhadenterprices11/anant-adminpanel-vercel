import { useState } from 'react';
import {
  Save,
  Eye,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { logger } from "@/utils/logger";
import { useBlogForm } from '../hooks/useBlogForm';
import { useCreateBlog } from '../hooks/useBlogs';
import { useQuery } from '@tanstack/react-query';
import { tagService } from '@/features/tags/services/tagService';
import { useBlogDeferredUpload } from '../hooks/useBlogDeferredUpload';
import { BlogDetailsSection } from './form-sections/BlogDetailsSection';
import { ContentEditorSection } from './form-sections/ContentEditorSection';
import { DeferredBlogMediaSection } from './form-sections/DeferredBlogMediaSection';
import { SeoSection } from './form-sections/SeoSection';
import { AuthorSection } from './form-sections/AuthorSection';
import { NotesTags } from '@/components/features/notes/NotesTags';
import { PageHeader } from '@/components/layout/PageHeader';
import { ROUTES } from '@/lib/constants';
import { UnsavedChangesDialog } from '@/components/dialogs/UnsavedChangesDialog';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';

export default function AddBlogForm() {
  const navigate = useNavigate();
  const createBlogMutation = useCreateBlog();
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [activeAction, setActiveAction] = useState<'Public' | 'Draft' | null>(null);

  // Using new standardized hook interface
  const {
    formData,
    updateField,
    handleTitleChange,
    handleDescriptionChange,
    hasChanges,
    validate
  } = useBlogForm({ mode: 'create' });

  // Fetch available tags for suggestion
  const { data: availableTags = [] } = useQuery({
    queryKey: ['tags', 'all'],
    queryFn: async () => {
      const response = await tagService.getAllTags({ limit: 1000, status: 'active' });
      return response.tags.map((t: any) => t.name);
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Deferred Upload Hook
  const {
    pendingMainImagePC,
    setPendingMainImagePC,
    pendingMainImageMobile,
    setPendingMainImageMobile,
    isUploading,
    uploadPendingImages,
    hasUnsavedImages
  } = useBlogDeferredUpload();

  const isSaving = createBlogMutation.isPending || isUploading;

  // Unsaved changes warning
  // Check both form changes and pending images
  const hasAnyChanges = hasChanges || hasUnsavedImages;

  const { navigateWithConfirmation, proceedNavigation, cancelNavigation } =
    useUnsavedChangesWarning(hasAnyChanges && !isSaving, () => setShowDiscardDialog(true));

  const handleDiscardChanges = () => {
    setShowDiscardDialog(false);
    proceedNavigation();
  };

  const handleContinueEditing = () => {
    cancelNavigation();
    setShowDiscardDialog(false);
  };

  const onBack = () => {
    navigateWithConfirmation(ROUTES.BLOGS.LIST);
  };

  const handleSubmit = async (visibility: 'Public' | 'Draft') => {
    // Run validation before submitting
    if (!validate()) {
      return;
    }

    setActiveAction(visibility);

    try {
      // 1. Upload Pending Images
      let mainImagePCUrl = formData.mainImagePC as string | null;
      let mainImageMobileUrl = formData.mainImageMobile as string | null;

      if (hasUnsavedImages) {
        // Generate folder path: blogs/{slug}
        // Fallback slug generation if not present in formData
        const blogSlug = formData.metaURL || formData.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();

        const folderPath = `blogs/${blogSlug || 'temp'}`;

        const uploadResults = await uploadPendingImages(folderPath);

        // If uploaded new images, use their URLs. Otherwise keep existing.
        if (uploadResults.mainImagePCUrl) mainImagePCUrl = uploadResults.mainImagePCUrl;
        if (uploadResults.mainImageMobileUrl) mainImageMobileUrl = uploadResults.mainImageMobileUrl;
      }

      // 2. Prepare Data
      const dataToSubmit = {
        ...formData,
        visibility,
        mainImagePC: mainImagePCUrl,
        mainImageMobile: mainImageMobileUrl
      };

      logger.info(`[AddBlogForm] Submitting as ${visibility}`, dataToSubmit);

      // 3. Submit
      createBlogMutation.mutate(dataToSubmit, {
        onSuccess: () => {
          // Navigate to list on success
          navigate(ROUTES.BLOGS.LIST);
        },
        onError: () => {
          setActiveAction(null);
        }
      });
    } catch (error) {
      console.error('Submission failed', error);
      setActiveAction(null);
      // Toast already handled by upload hook or mutation
    }
  };

  const handlePublish = () => handleSubmit('Public');
  const handleSaveDraft = () => handleSubmit('Draft');

  return (
    <div className="flex-1 w-full">
      <UnsavedChangesDialog
        open={showDiscardDialog}
        onOpenChange={setShowDiscardDialog}
        onDiscard={handleDiscardChanges}
        onContinueEditing={handleContinueEditing}
      />
      <PageHeader
        title="Add New Blog"
        subtitle="Create a new blog post with rich content and media"
        breadcrumbs={[
          { label: 'Blogs', onClick: onBack },
          { label: 'Add New', active: true }
        ]}
        onBack={onBack}
        actions={
          <>
            <Button
              variant="outline"
              size="lg"
              onClick={handleSaveDraft}
              className="border-[#0e042f] text-[#0e042f] hover:bg-[#0e042f]/10"
              disabled={isSaving}
            >
              {isSaving && activeAction === 'Draft' ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Save className="size-4 mr-2 text-[#0e042f]" />}
              Save Draft
            </Button>
            <Button
              className="bg-[#0e042f] hover:bg-[#0e042f]/90 text-white"
              size="lg"
              onClick={handlePublish}
              disabled={isSaving}
            >
              {isSaving && activeAction === 'Public' ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Eye className="size-4 mr-2" />}
              Publish
            </Button>
          </>
        }
      />

      <div className="px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            <BlogDetailsSection
              title={formData.title}
              quote={formData.quote || ''}
              description={formData.description}
              onTitleChange={handleTitleChange}
              onQuoteChange={(val) => updateField('quote', val)}
              onDescriptionChange={handleDescriptionChange}
            />

            <ContentEditorSection
              content={formData.content}
              onContentChange={(val) => updateField('content', val)}
            />

            <DeferredBlogMediaSection
              pendingMainImagePC={pendingMainImagePC}
              pendingMainImageMobile={pendingMainImageMobile}
              onPendingMainImagePCChange={setPendingMainImagePC}
              onPendingMainImageMobileChange={setPendingMainImageMobile}
              existingMainImagePC={formData.mainImagePC as string}
              existingMainImageMobile={formData.mainImageMobile as string}
            />

            {/* Commented out BlogSubsections component
            <BlogSubsections
              subsections={formData.subsections}
              onAddSubsection={handlers.subsections.add}
              onRemoveSubsection={handlers.subsections.remove}
              onSubsectionChange={handlers.subsections.update}
            />
            */}

            <SeoSection
              metaTitle={formData.metaTitle}
              metaURL={formData.metaURL || ''}
              metaDescription={formData.metaDescription}
              onMetaTitleChange={(val) => updateField('metaTitle', val)}
              onMetaURLChange={(val) => updateField('metaURL', val)}
              onMetaDescriptionChange={(val) => updateField('metaDescription', val)}
            />

          </div>

          {/* RIGHT SIDE - Controls & Settings */}
          <div className="space-y-6">
            {/* <VisibilityCategorySection
              visibility={formData.visibility}
              category={formData.category}
              onVisibilityChange={(val) => updateField('visibility', val as any)}
              onCategoryChange={(val) => updateField('category', val)}
            /> */}

            <AuthorSection
              author={formData.author}
              onAuthorChange={(val) => updateField('author', val)}
            />

            {/* Notes & Tags */}
            <NotesTags
              adminComment={formData.adminComment}
              onAdminCommentChange={(val: string) => updateField('adminComment', val)}
              tags={formData.tags}
              onTagsChange={(tags: string[]) => updateField('tags', tags)}
              showCustomerNote={false}
              availableTags={availableTags}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
