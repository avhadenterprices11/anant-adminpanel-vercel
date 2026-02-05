import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import { useState, useMemo } from 'react';
import { UnsavedChangesDialog } from '@/components/dialogs/UnsavedChangesDialog';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';

import { useTierForm } from '../hooks/useTierForm';
import { useCreateTier, useTier, useTierHierarchy } from '../hooks/useTiers';
import { TierTree } from '../components/TierTree';
import { TierStatusSection } from '../components/form-sections';
import type { Tier } from '../types/tier.types';
import { ROUTES } from '@/lib/constants';

export default function AddTierPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const parentId = searchParams.get('parentId');

    // Load parent tier if creating a sub-tier
    const { data: parentTier } = useTier(parentId || '');

    const {
        formData,
        errors,
        handleInputChange,
        validate,
        hasChanges
    } = useTierForm({
        mode: 'create',
        selectedParent: parentTier,
    });

    const createTierMutation = useCreateTier();
    const { data: tierHierarchy = [] } = useTierHierarchy();
    const [expandedTiers, setExpandedTiers] = useState<Set<string>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDiscardDialog, setShowDiscardDialog] = useState(false);

    // Filter hierarchy to show only relevant tiers
    const relevantTiers = useMemo(() => {
        if (!parentId || !parentTier) {
            // Creating root tier - don't show any tiers (empty preview)
            return [];
        }

        // Creating sub-tier - show only the parent branch
        return tierHierarchy.filter(tier => tier.id === parentId);
    }, [tierHierarchy, parentId, parentTier]);

    // Tree handlers
    const handleToggleExpand = (tierId: string) => {
        const newExpanded = new Set(expandedTiers);
        if (newExpanded.has(tierId)) {
            newExpanded.delete(tierId);
        } else {
            newExpanded.add(tierId);
        }
        setExpandedTiers(newExpanded);
    };

    const handleSelectTier = (tier: Tier) => {
        navigate(ROUTES.TIERS?.DETAIL(tier.id) || `/tiers/${tier.id}`);
    };

    const handleAddSubTier = (tier: Tier) => {
        if (tier.level < 4) {
            navigate(`${ROUTES.TIERS?.CREATE || '/tiers/new'}?parentId=${tier.id}`);
        }
    };



    const handleSave = async () => {
        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const newTier = await createTierMutation.mutateAsync(formData);
            toast.success('Tier created successfully!');
            // Redirect to the new tier's detail page to allow adding sub-tiers immediately
            navigate(ROUTES.TIERS?.DETAIL(newTier.id) || `/tiers/${newTier.id}`);
        } catch (error: any) {
            toast.error(error?.message || 'Failed to create tier');
            setIsSubmitting(false); // Only reset submitting on error, success navigates away
        }
    };

    // Unsaved changes warning
    const { navigateWithConfirmation, proceedNavigation, cancelNavigation } =
        useUnsavedChangesWarning(hasChanges && !isSubmitting, () => setShowDiscardDialog(true));

    const handleDiscardChanges = () => {
        setShowDiscardDialog(false);
        proceedNavigation();
    };

    const handleContinueEditing = () => {
        cancelNavigation();
        setShowDiscardDialog(false);
    };

    const handleCancel = () => {
        // toast.info('Tier creation cancelled');
        navigateWithConfirmation(ROUTES.TIERS?.LIST || '/tiers');
    };

    const handleBack = () => {
        navigateWithConfirmation(ROUTES.TIERS?.LIST || '/tiers');
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
                title={parentTier ? `Add Sub-Tier to ${parentTier.name}` : 'Add Tier'}
                subtitle="Create a new tier in the hierarchy"
                breadcrumbs={[
                    { label: 'Tiers', onClick: handleBack },
                    { label: parentTier ? `Sub-tier of ${parentTier.name}` : 'Add New', active: true }
                ]}
                backIcon="arrow"
                onBack={handleBack}
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
                            {isSubmitting ? 'Adding...' : 'Add Tier'}
                        </Button>
                    </>
                }
            />

            {/* Main Content */}
            <div className="px-6 lg:px-8 pb-8">
                <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column - Tree View (4 cols) */}
                    <div className="lg:col-span-4 self-stretch">
                        <Card className="h-full rounded-[20px] border-slate-200 shadow-sm flex flex-col gap-0 py-0">
                            <CardHeader className="px-4 pt-4 pb-2">
                                <h3 className="text-lg font-semibold text-slate-900 px-2">Tier Hierarchy</h3>
                                <p className="text-xs text-slate-500 px-2">
                                    {parentTier ? `Your new tier will be added under "${parentTier.name}"` : 'Your new tier will be added at the root level'}
                                </p>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                                <TierTree
                                    tiers={relevantTiers}
                                    selectedTier={null}
                                    expandedTiers={expandedTiers}
                                    onSelectTier={handleSelectTier}
                                    onToggleExpand={handleToggleExpand}
                                    onAddSubTier={handleAddSubTier}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Details (8 cols) */}
                    <div className="lg:col-span-8">
                        <Card className="rounded-[20px] border-slate-200 shadow-sm bg-white gap-0 py-0">
                            {/* Card Header with Title - Matches TierDetailPage */}
                            <CardHeader className="px-4 pt-4 pb-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            Tier Details
                                        </h2>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Configure tier information and settings
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            {/* Details Grid */}
                            <div className="p-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                                    {/* Tier Name */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            TIER NAME <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className="bg-slate-50 border-slate-200"
                                            placeholder="e.g. Electronics"
                                        />
                                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                    </div>

                                    {/* Tier Code */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            TIER CODE
                                        </Label>
                                        <Input
                                            value={formData.code}
                                            onChange={(e) => handleInputChange('code', e.target.value)}
                                            className="font-mono bg-slate-50 border-slate-200"
                                            placeholder="Auto-generated if empty"
                                        />
                                        {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
                                    </div>

                                    {/* Tier Level */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            TIER LEVEL
                                        </Label>
                                        <Input
                                            value={`Level ${formData.level}`}
                                            disabled
                                            className="bg-slate-50 border-slate-200 text-slate-500"
                                        />
                                    </div>

                                    {/* Parent Tier */}
                                    {parentTier && (
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                PARENT TIER
                                            </Label>
                                            <Input
                                                value={parentTier.name}
                                                disabled
                                                className="bg-slate-50 border-slate-200 text-slate-500"
                                            />
                                        </div>
                                    )}

                                    {/* Description */}
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            DESCRIPTION
                                        </Label>
                                        <Input
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            className="bg-slate-50 border-slate-200"
                                            placeholder="Enter description..."
                                        />
                                    </div>

                                    {/* Status Toggle */}
                                    <div className="col-span-1 md:col-span-2">
                                        <TierStatusSection
                                            status={formData.status}
                                            onStatusChange={(status) => handleInputChange('status', status)}
                                        />
                                    </div>

                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div >
        </div >
    );
}
