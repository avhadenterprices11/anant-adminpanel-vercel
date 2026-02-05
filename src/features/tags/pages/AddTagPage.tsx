import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { tagService } from '../services/tagService';
import { logger } from '@/lib/utils/logger';
import { notifySuccess, notifyError } from '@/utils';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { TagBasicInfoSection, TagStatusSection, TagGuidelinesSection } from '../components/form-sections';
import { UnsavedChangesDialog } from '@/components/dialogs/UnsavedChangesDialog';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';


const AddTagPage: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showDiscardDialog, setShowDiscardDialog] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        type: 'product',
        status: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Check if form has changes (any field is filled or modified from initial)
    // For Add page, we check against empty/default values
    const hasChanges = formData.name !== '' || formData.type !== 'product' || formData.status !== true;

    // Use the unsaved changes warning hook
    const { navigateWithConfirmation, proceedNavigation, cancelNavigation } =
        useUnsavedChangesWarning(hasChanges && !isSubmitting && !isSuccess, () => setShowDiscardDialog(true));

    const handleDiscardChanges = () => {
        setShowDiscardDialog(false);
        // notifyInfo('Changes discarded'); // Matching Tiers behavior (no toast)
        proceedNavigation();
    };

    const handleContinueEditing = () => {
        setShowDiscardDialog(false);
        cancelNavigation();
    };

    // Validate form
    const validateForm = (): boolean => {
        // 1. Tag Name
        if (!formData.name.trim()) {
            notifyError('Tag name is required');
            const element = document.getElementById('name');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus();
            }
            return false;
        }

        if (formData.name.length > 255) {
            notifyError('Tag name must be less than 255 characters');
            const element = document.getElementById('name');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus();
            }
            return false;
        }

        // 2. Tag Type
        if (!formData.type) {
            notifyError('Tag type is required');
            const element = document.getElementById('tag-type-section');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Divs aren't focusable by default unless tabindex is set, but scrolling to it is helpful
                // If the SelectTrigger is inside, maybe we can resort to finding the button
                // But scrolling is the key requirement.
            }
            return false;
        }

        return true;
    };

    // Handle back navigation
    const onBack = () => {
        navigateWithConfirmation('/tags');
    };

    // Handle form submission
    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await tagService.createTag(formData);
            notifySuccess(`Tag "${formData.name}" created successfully`);
            setIsSuccess(true); // Mark as success to disable warning
            // Navigate back after short delay (no confirmation needed after save)
            setTimeout(() => {
                navigate('/tags');
            }, 1000);
        } catch (error: any) {
            logger.error('Failed to create tag', error);
            notifyError(error?.response?.data?.message || 'Failed to create tag');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        onBack();
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div className="flex-1 w-full">
            <UnsavedChangesDialog
                open={showDiscardDialog}
                onOpenChange={setShowDiscardDialog}
                onDiscard={handleDiscardChanges}
                onContinueEditing={handleContinueEditing}
            />
            <PageHeader
                title="Add Tag"
                subtitle="Create and manage product tags"
                breadcrumbs={[
                    { label: 'Tags', onClick: onBack },
                    { label: 'Add New', active: true }
                ]}
                backIcon="arrow"
                onBack={onBack}
                actions={
                    <>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className="rounded-xl h-[44px] px-6"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSave}
                            disabled={isSubmitting}
                            className="rounded-xl bg-[var(--sidebar-bg)] hover:bg-[var(--sidebar-hover)] text-[var(--text-white)]/90 h-[44px] px-6 gap-2 shadow-sm"
                        >
                            <Plus className="size-[18px]" />
                            {isSubmitting ? 'Adding...' : 'Add Tag'}
                        </Button>
                    </>
                }
            />

            {/* Main Content */}
            <div className="px-6 lg:px-8 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT COLUMN - Primary Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                            <TagBasicInfoSection
                                formData={formData}
                                handleChange={handleChange}
                                errors={errors}
                                disabled={isSubmitting}
                            />
                        </form>
                    </div>

                    {/* RIGHT COLUMN - Secondary Content */}
                    <div className="space-y-6">
                        <TagStatusSection
                            formData={formData}
                            handleChange={handleChange}
                            disabled={isSubmitting}
                        />
                        <TagGuidelinesSection />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTagPage;
