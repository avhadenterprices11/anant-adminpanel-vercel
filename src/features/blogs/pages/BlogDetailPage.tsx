import { ArrowLeft, Save, MoreVertical, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DetailPageSkeleton } from '@/components/ui/loading-skeletons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BlogDetailsSection,
  ContentEditorSection,
  // MediaSection, // Commented out - using BlogMediaSection instead (aligned with AddBlogPage)
  // CategorizationSection, // Commented out - using VisibilityCategorySection + NotesTags instead
  SeoSection,
  // PublishingSection, // Commented out - fields not in AddBlogPage (publishDate, publishTime, featured, sticky, allowComments)
  AuthorSection,
} from '../components/form-sections';
import { BlogMediaSection } from '../components/form-sections/BlogMediaSection';
import { VisibilityCategorySection } from '../components/form-sections/VisibilityCategorySection';
import { NotesTags } from '@/components/features/notes/NotesTags';
import { useBlogDetail } from '../hooks/useBlogDetail';
import { useState, useEffect } from 'react';
import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog';
import { useDeleteBlog } from '../hooks/useBlogs';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';
import { tagService } from '@/features/tags/services/tagService';

import { UnsavedChangesDialog } from '@/components/dialogs/UnsavedChangesDialog';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';

export default function BlogDetailPage() {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const deleteBlogMutation = useDeleteBlog();

  const {
    form,
    formRef,
    values,
    blog,
    id,
    isLoading,
    onSubmit,
    onError,
    handleTitleChange,
    handleDescriptionChange,
    setValue,
    hasChanges,
    isUpdating
  } = useBlogDetail();

  const { handleSubmit } = form;

  // Fetch available tags for suggestion
  const { data: availableTags = [] } = useQuery({
    queryKey: ['tags', 'all'],
    queryFn: async () => {
      const response = await tagService.getAllTags({ limit: 1000, status: 'active' });
      return response.tags.map((t: any) => t.name);
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Unsaved changes warning
  const { navigateWithConfirmation, proceedNavigation, cancelNavigation } =
    useUnsavedChangesWarning(hasChanges && !isUpdating, () => setShowDiscardDialog(true));

  const handleDiscardChanges = () => {
    setShowDiscardDialog(false);
    proceedNavigation();
  };

  const handleContinueEditing = () => {
    cancelNavigation();
    setShowDiscardDialog(false);
  };

  // Override navigation handlers
  const handleBack = () => {
    navigateWithConfirmation(ROUTES.BLOGS.LIST);
  };

  const handleCancel = () => {
    // If dirty, confirm discard. If clean, just nav (hook handles clean check but good to match)
    navigateWithConfirmation(ROUTES.BLOGS.LIST);
  };

  const handlePreview = () => {
    const storefrontUrl = import.meta.env.VITE_STOREFRONT_URL || 'https://example.com';
    window.open(`${storefrontUrl}/blogs/${values.metaURL || values.slug || id}`, '_blank');
  };

  // Debug logging for visibility and images
  useEffect(() => {
    if (blog) {
      console.log('[BlogDetailPage] Blog data loaded:');
      console.log('  - visibility:', values.visibility);
      console.log('  - mainImagePC:', values.mainImagePC);
      console.log('  - mainImageMobile:', values.mainImageMobile);
    }
  }, [blog, values.visibility, values.mainImagePC, values.mainImageMobile]);

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (!blog) {
    return null; // Will redirect via useEffect in hook
  }

  return (
    <div className="flex-1 w-full relative">
      <UnsavedChangesDialog
        open={showDiscardDialog}
        onOpenChange={setShowDiscardDialog}
        onDiscard={handleDiscardChanges}
        onContinueEditing={handleContinueEditing}
      />

      {/* Sticky Header Section - Pinned below the main header (80px) */}
      <div id="blog-detail-sticky-header" className="sticky top-0 z-20 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200 shadow-sm -mx-1 px-7 lg:px-9 py-4 mb-6 transition-all">
        <div className="space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={handleBack}
              className="text-slate-500 hover:text-slate-900 transition-colors"
            >
              Blogs
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-medium">{blog?.title || 'Blog Details'}</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleBack}
                className="rounded-full h-10 w-10"
              >
                <ArrowLeft className="size-4" />
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-slate-900">{blog?.title || 'Blog Details'}</h1>
                  <Badge
                    variant={blog.visibility === 'Public' ? 'default' : 'secondary'}
                    className="rounded-lg"
                  >
                    {blog.visibility}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">View and edit information for "{blog?.title || 'this blog'}"</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {hasChanges ? (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleCancel}
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="lg"
                    onClick={() => formRef.current?.requestSubmit()}
                    className="rounded-xl bg-[#0e042f] hover:bg-[#0e042f]/90"
                  >
                    <Save className="size-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  size="lg"
                  onClick={handlePreview}
                  className="rounded-xl bg-[#0e042f] hover:bg-[#0e042f]/90"
                >
                  <ExternalLink className="size-4 mr-2" />
                  Preview
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-xl h-10 w-10">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 text-sm"
                  >
                    <Trash2 className="size-4 mr-2" />
                    Delete Blog
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-8 pb-8">


        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit(onSubmit, onError)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Primary Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Blog Details - using quote instead of excerpt (aligned with AddBlogPage) */}
            <BlogDetailsSection
              title={values.title}
              quote={values.quote || ''}
              description={values.description}
              onTitleChange={(val) => handleTitleChange('title', val)}
              onQuoteChange={(val) => setValue('quote', val, { shouldDirty: true })}
              onDescriptionChange={handleDescriptionChange}
              errors={form.formState.errors}
            />
            {/* Note: Using quote instead of excerpt to align with AddBlogPage */}

            {/* 2. Content Editor */}
            <ContentEditorSection
              content={values.content}
              onContentChange={(val) => setValue('content', val, { shouldDirty: true })}
            />

            {/* 3. Media - using BlogMediaSection (aligned with AddBlogPage) */}
            <BlogMediaSection
              mainImagePC={values.mainImagePC || null}
              mainImageMobile={values.mainImageMobile || null}
              onMainImagePCChange={(file) => setValue('mainImagePC', file, { shouldDirty: true })}
              onMainImageMobileChange={(file) => setValue('mainImageMobile', file, { shouldDirty: true })}
            />
            {/* Note: Using BlogMediaSection (mainImagePC/mainImageMobile) instead of MediaSection (featuredImage/galleryImages) to align with AddBlogPage */}

            {/* 4. SEO - without metaKeywords (aligned with AddBlogPage) */}
            <SeoSection
              metaTitle={values.metaTitle}
              metaURL={values.metaURL || ''}
              metaDescription={values.metaDescription}
              onMetaTitleChange={(val) => setValue('metaTitle', val, { shouldDirty: true })}
              onMetaURLChange={(val) => setValue('metaURL', val, { shouldDirty: true })}
              onMetaDescriptionChange={(val) => setValue('metaDescription', val, { shouldDirty: true })}
            />
            {/* Note: metaKeywords field removed to align with AddBlogPage */}
          </div>

          {/* RIGHT COLUMN - Settings & Meta */}
          <div className="space-y-6">
            {/* 1. Visibility & Category - using VisibilityCategorySection (aligned with AddBlogPage) */}
            <VisibilityCategorySection control={form.control} />
            {/* Note: Replaced PublishingSection with VisibilityCategorySection. Removed fields: publishDate, publishTime, featured, sticky, allowComments */}

            {/* Note: Category is now in VisibilityCategorySection, Tags are in NotesTags component below */}

            {/* 2. Author Information - simplified (aligned with AddBlogPage) */}
            <AuthorSection
              author={values.author}
              onAuthorChange={(val) => setValue('author', val, { shouldDirty: true })}
            />
            {/* Note: AuthorSection simplified - removed authorBio and authorImage to align with AddBlogPage */}

            {/* 3. Notes & Tags - added to match AddBlogPage */}
            <NotesTags
              adminComment={values.adminComment}
              onAdminCommentChange={(val: string) => setValue('adminComment', val, { shouldDirty: true })}
              tags={values.tags}
              onTagsChange={(tags: string[]) => setValue('tags', tags, { shouldDirty: true })}
              showCustomerNote={false}
              availableTags={availableTags}
            />
          </div>
        </form>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => {
          if (!id) return;
          deleteBlogMutation.mutate(id, {
            onSuccess: () => {
              setShowDeleteDialog(false);
              navigate(ROUTES.BLOGS.LIST);
            }
          });
        }}
        title="Delete Blog"
        description="Are you sure you want to delete this blog? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        isLoading={deleteBlogMutation.isPending}
      />
    </div>
  );
}
