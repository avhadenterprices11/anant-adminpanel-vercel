import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, MoreVertical, Trash2 } from 'lucide-react';
import { tagService } from '../services/tagService';
import { logger } from '@/lib/utils/logger';
import { notifySuccess, notifyError } from '@/utils';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog';
import { UnsavedChangesDialog } from '@/components/dialogs/UnsavedChangesDialog';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';
import { TagBasicInfoSection, TagStatusSection } from '../components/form-sections';

const TagDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showDiscardDialog, setShowDiscardDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    // New state to track successful deletion to bypass unsaved changes warning
    const [isDeletedSuccess, setIsDeletedSuccess] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        type: 'product',
        status: true,
    });

    // Track original data for change detection
    const [originalData, setOriginalData] = useState({
        name: '',
        type: 'product',
        status: true,
    });

    // Mock usage data for display
    const [usageData, setUsageData] = useState({
        usage_count: 0,
        created_at: '',
        updated_at: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Load tag data
    useEffect(() => {
        const fetchTag = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                // If ID is valid UUID, try fetching from API
                const data = await tagService.getTagById(id);
                const loadedData = {
                    name: data.name,
                    type: data.type,
                    status: data.status,
                };
                setFormData(loadedData);
                setOriginalData(loadedData);
                setUsageData({
                    usage_count: data.usage_count,
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                });
            } catch (error) {
                logger.error('Failed to fetch tag', error);
                notifyError('Failed to load tag details');
                navigate('/tags'); // Redirect back to list on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchTag();
    }, [id, navigate]);

    // Handle navigation after successful deletion
    // This ensures the blocker is disabled before we attempt to navigate
    useEffect(() => {
        if (isDeletedSuccess) {
            navigate('/tags');
        }
    }, [isDeletedSuccess, navigate]);

    // Check if form has unsaved changes
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

    // Use the unsaved changes warning hook
    // We disable the warning if a delete operation was successful
    const { navigateWithConfirmation, proceedNavigation, cancelNavigation } =
        useUnsavedChangesWarning(hasChanges && !isDeletedSuccess && !isSuccess, () => setShowDiscardDialog(true));

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
            }
            return false;
        }

        return true;
    };

    // Handle back navigation
    const onBack = () => {
        navigateWithConfirmation('/tags');
    };

    // Handle save
    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            if (id && id !== 'mock') {
                await tagService.updateTag(id, formData);
                notifySuccess('Tag updated successfully');
                setIsSuccess(true); // Suppress warning

                // Navigate back to list
                setTimeout(() => {
                    navigate('/tags');
                }, 500);
            } else {
                notifySuccess('Mock tag updated successfully');
            }
        } catch (error: any) {
            logger.error('Failed to update tag', error);
            notifyError(error?.response?.data?.message || 'Failed to update tag');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        navigateWithConfirmation('/tags');
    };

    const handleDiscardChanges = () => {
        setShowDiscardDialog(false);
        // notifyInfo('Changes discarded');
        proceedNavigation();
    };

    const handleContinueEditing = () => {
        setShowDiscardDialog(false);
        cancelNavigation();
    };

    // Handle delete click
    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    };

    // Handle confirm delete
    const handleConfirmDelete = async () => {
        if (!id) return;

        setIsDeleting(true);
        try {
            await tagService.deleteTag(id);
            notifySuccess('Tag deleted successfully');
            setShowDeleteDialog(false);

            // Set success flag to triggering navigation via useEffect
            // This bypasses the unsaved changes blocker
            setIsDeletedSuccess(true);
        } catch (error: any) {
            logger.error('Failed to delete tag', error);
            notifyError(error?.response?.data?.message || 'Failed to delete tag');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 w-full p-8 space-y-4">
                <Skeleton className="h-12 w-full max-w-md" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-[400px] lg:col-span-2" />
                    <Skeleton className="h-[200px]" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full">
            <PageHeader
                title={formData.name || 'Tag Details'}
                subtitle={formData.type}
                breadcrumbs={[
                    { label: 'Tags', onClick: onBack },
                    { label: formData.name || 'Details', active: true }
                ]}
                backIcon="arrow"
                onBack={onBack}
                actions={
                    <>
                        {hasChanges && (
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
                                    <Save className="size-[18px]" />
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="rounded-xl h-[44px] w-[44px]">
                                    <MoreVertical className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={handleDeleteClick}
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50 text-sm"
                                >
                                    <Trash2 className="size-4 mr-2" />
                                    Delete Tag
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                }
            />

            {/* Main Content */}
            <div className="px-6 lg:px-8 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Use TagBasicInfoSection but wrap in a card look if needed or just use it directly since it has FormSection wrapper */}
                        {/* Note: TagBasicInfoSection uses FormSection which has card styling */}
                        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                            <TagBasicInfoSection
                                formData={formData}
                                handleChange={handleChange}
                                errors={errors}
                            />
                        </form>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-6">
                        <TagStatusSection
                            formData={formData}
                            handleChange={handleChange}
                        />

                        {/* Usage Stats (Mock) - Keeping as Card since it's specific view-only data */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Usage Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-50 rounded-lg flex justify-between items-center">
                                        <p className="text-sm text-gray-500">Total Uses</p>
                                        <p className="text-2xl font-bold">{usageData.usage_count}</p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="p-4 bg-slate-50 rounded-lg">
                                            <p className="text-sm text-gray-500">Created</p>
                                            <p className="text-sm font-medium">{new Date(usageData.created_at || Date.now()).toLocaleDateString()}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-lg">
                                            <p className="text-sm text-gray-500">Last Updated</p>
                                            <p className="text-sm font-medium">{new Date(usageData.updated_at || Date.now()).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Tag"
                description="Are you sure you want to delete this tag? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                isLoading={isDeleting}
            />

            {/* Unsaved Changes Confirmation Dialog */}
            <UnsavedChangesDialog
                open={showDiscardDialog}
                onOpenChange={setShowDiscardDialog}
                onDiscard={handleDiscardChanges}
                onContinueEditing={handleContinueEditing}
            />
        </div>
    );
};

export default TagDetailPage;
