import { useNavigate, useParams } from 'react-router-dom';
import { Save, Layers, ChevronRight, Plus, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTierForm } from '../hooks/useTierForm';
import { useTier, useUpdateTier, useCreateTier, useDeleteTier } from '../hooks/useTiers';
import { ROUTES } from '@/lib/constants';
import { Package } from 'lucide-react';
import { TierTree } from '../components/TierTree';
import { TierStatusSection } from '../components/form-sections';
import { useTierHierarchy } from '../hooks/useTiers';
import type { Tier } from '../types/tier.types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog';
import { UnsavedChangesDialog } from '@/components/dialogs/UnsavedChangesDialog';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';

// Helper to find a tier node in the hierarchy tree
const findTierNode = (nodes: Tier[], targetId: string): Tier | undefined => {
    for (const node of nodes) {
        if (node.id === targetId) return node;
        if (node.children) {
            const found = findTierNode(node.children, targetId);
            if (found) return found;
        }
    }
    return undefined;
};

/**
 * Get the entire root (Tier 1) branch that contains the target tier
 * Shows all tiers within that Tier 1 parent, not just the path to selected tier
 */
const getRootTierBranch = (allTiers: Tier[], targetId: string): Tier[] => {
    // Helper to check if a tier or its descendants contain the target
    const containsTier = (tier: Tier, target: string): boolean => {
        if (tier.id === target) return true;
        if (tier.children) {
            return tier.children.some(child => containsTier(child, target));
        }
        return false;
    };

    // Find the root tier (level 1) that contains the target
    const rootTier = allTiers.find(tier => containsTier(tier, targetId));

    // Return only that root tier (with all its descendants)
    return rootTier ? [rootTier] : allTiers;
};

export default function TierDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    // State for selected tier and mode
    const [selectedTierId, setSelectedTierId] = useState<string>(id || '');
    const [mode, setMode] = useState<'edit' | 'add-sub-tier'>('edit');
    const [showDiscardDialog, setShowDiscardDialog] = useState(false);

    // Mutations
    const createTierMutation = useCreateTier();
    const updateTierMutation = useUpdateTier();
    const deleteTierMutation = useDeleteTier();

    // Delete dialog state
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Load selected tier data
    const { data: selectedTierData, isLoading: isSelectedLoading, error: selectedError } = useTier(selectedTierId || '');
    const { data: tierHierarchy = [] } = useTierHierarchy();

    // Single form hook that handles both edit and create modes
    const formOptions = useMemo(() => ({
        mode: mode === 'edit' ? 'edit' as const : 'create' as const,
        initialData: mode === 'edit' ? selectedTierData : undefined,
        selectedParent: mode === 'add-sub-tier' ? selectedTierData : undefined,
    }), [mode, selectedTierData]);

    const {
        formData,
        errors,
        handleInputChange,
        validate,
        hasChanges,
        resetForSubTier,
    } = useTierForm(formOptions);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [expandedTiers, setExpandedTiers] = useState<Set<string>>(new Set());

    // Unsaved changes warning
    const { navigateWithConfirmation, proceedNavigation, cancelNavigation } =
        useUnsavedChangesWarning(hasChanges && !isSubmitting && !isSuccess, () => setShowDiscardDialog(true));

    const handleDiscardChanges = () => {
        setShowDiscardDialog(false);
        proceedNavigation();
    };

    const handleContinueEditing = () => {
        cancelNavigation();
        setShowDiscardDialog(false);
    };

    // ... (Tree handlers omitted for brevity, they are unchanged)

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
        if (hasChanges) {
            if (!confirm('You have unsaved changes. Discard them?')) return;
        }

        setSelectedTierId(tier.id);
        setMode('edit');
    };

    const handleAddSubTier = () => {
        if (selectedTierData) {
            resetForSubTier(selectedTierData);
            setMode('add-sub-tier');
        }
    };

    const handleCancelSubTier = () => {
        setMode('edit');
    };

    const handleSaveSubTier = async () => {
        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await createTierMutation.mutateAsync(formData);
            toast.success('Sub-tier created successfully!');
            setMode('edit');
        } catch (error: any) {
            toast.error(error?.message || 'Failed to create sub-tier');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSave = async () => {
        if (!selectedTierId) return;

        // Validate form data
        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await updateTierMutation.mutateAsync({ id: selectedTierId, data: formData });
            toast.success('Tier updated successfully!');
            setIsSuccess(true);

            // Navigate back to list just like Tags
            setTimeout(() => {
                navigate(ROUTES.TIERS?.LIST || '/tiers');
            }, 500);

        } catch (error: any) {
            toast.error(error?.message || 'Failed to update tier');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSelectedLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-slate-600">Loading tier...</p>
            </div>
        );
    }

    if (selectedError || !selectedTierData) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-red-600">Failed to load tier</p>
            </div>
        );
    }

    const handleCancel = () => {
        // toast.info('Changes discarded'); // Dialog handles message?
        navigateWithConfirmation(ROUTES.TIERS?.LIST || '/tiers');
    };

    const handleBack = () => {
        navigateWithConfirmation(ROUTES.TIERS?.LIST || '/tiers');
    };

    // Derived state for form fields based on mode
    // Note: We now use a single form hook that handles both modes

    // Get children from hierarchy if not available in single tier data
    const hierarchyNode = selectedTierId ? findTierNode(tierHierarchy, selectedTierId) : undefined;
    const displayChildren = hierarchyNode?.children || selectedTierData?.children || [];

    // Get the entire root (Tier 1) branch that contains the selected tier
    const tierBranch = selectedTierId ? getRootTierBranch(tierHierarchy, selectedTierId) : tierHierarchy;

    return (
        <>
            <UnsavedChangesDialog
                open={showDiscardDialog}
                onOpenChange={setShowDiscardDialog}
                onDiscard={handleDiscardChanges}
                onContinueEditing={handleContinueEditing}
            />

            <div className="flex-1 w-full">
                <PageHeader
                    title={mode === 'add-sub-tier' ? 'New Sub-Tier' : (formData.name || 'Tier Details')}
                    subtitle={mode === 'add-sub-tier' ? `Create a new sub-tier under "${selectedTierData?.name}"` : (formData.code ? `Manage details for "${formData.code}"` : 'Manage tier information')}
                    breadcrumbs={[
                        { label: 'Tiers', onClick: handleBack },
                        { label: mode === 'add-sub-tier' ? 'New Sub-Tier' : (formData.name || 'Details'), active: true }
                    ]}
                    backIcon="arrow"
                    onBack={handleBack}
                    actions={
                        <>
                            {(mode !== 'edit' || hasChanges) && (
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
                                        <Save className="size-4 mr-2" />
                                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </>
                            )}

                            {/* More Options Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon" className="rounded-xl h-[44px] w-[44px]">
                                        <MoreVertical className="size-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() => setShowDeleteDialog(true)}
                                        className="text-red-600 focus:text-red-600 focus:bg-red-50 text-sm"
                                    >
                                        <Trash2 className="size-4 mr-2" />
                                        Delete Tier
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
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
                                    <p className="text-xs text-slate-500 px-2">Click to expand and view sub-tiers</p>
                                </CardHeader>
                                <CardContent className="flex-1 overflow-y-auto min-h-[500px] pr-2 custom-scrollbar">
                                    <TierTree
                                        tiers={tierBranch}
                                        selectedTier={selectedTierData}
                                        expandedTiers={expandedTiers}
                                        onSelectTier={handleSelectTier}
                                        onToggleExpand={handleToggleExpand}
                                        onAddSubTier={(tier) => {
                                            if (tier.id === selectedTierId && tier.level < 4) {
                                                handleAddSubTier();
                                            }
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Details (8 cols) */}
                        <div className="lg:col-span-8">
                            <Card className="rounded-[20px] border-slate-200 shadow-sm bg-white gap-0 py-0">
                                {/* Card Header with Title */}
                                <CardHeader className="px-4 pt-4 pb-0">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-slate-900">
                                                {mode === 'edit' ? 'Tier Details' : 'New Sub-Tier'}
                                            </h2>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {mode === 'edit' ? 'Configure tier information, settings, and manage sub-tiers' : 'Create a new sub-tier under the selected parent tier'}
                                            </p>
                                        </div>
                                        {mode === 'edit' && selectedTierData && selectedTierData.level < 4 && (
                                            <Button
                                                onClick={handleAddSubTier}
                                                variant="outline"
                                                size="sm"
                                                className="gap-2"
                                            >
                                                <Plus className="size-4" />
                                                Add Sub Tier
                                            </Button>
                                        )}
                                        {mode === 'add-sub-tier' && (
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={handleCancelSubTier}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handleSaveSubTier}
                                                    disabled={isSubmitting}
                                                    size="sm"
                                                    className="bg-[var(--sidebar-bg)] hover:bg-[var(--sidebar-hover)] text-white gap-1"
                                                >
                                                    <Plus className="size-3" />
                                                    {isSubmitting ? 'Creating...' : 'Create Sub Tier'}
                                                </Button>
                                            </div>
                                        )}
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

                                        {/* Description */}
                                        <div className="col-span-1 md:col-span-2 space-y-2">
                                            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                DESCRIPTION
                                            </Label>
                                            <Input
                                                value={formData.description || ''}
                                                onChange={(e) => handleInputChange('description', e.target.value)}
                                                className="bg-slate-50 border-slate-200"
                                                placeholder="Enter description..."
                                            />
                                        </div>

                                        {/* Status and Usage in same row */}
                                        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Status Toggle */}
                                            <TierStatusSection
                                                status={formData.status}
                                                onStatusChange={(status) => handleInputChange('status', status)}
                                            />

                                            {/* Usage */}
                                            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                                                <div>
                                                    <Label className="text-sm font-medium text-slate-900">
                                                        Usage
                                                    </Label>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        Products using this tier
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-700">
                                                    <Package className="size-4 text-slate-400" />
                                                    <span className="font-semibold text-lg">
                                                        {mode === 'add-sub-tier' ? 0 : (selectedTierData?.usageCount || 0)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px bg-slate-100" />

                                    {/* Sub-Tiers List */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                SUB-TIERS ({displayChildren.length})
                                            </Label>
                                        </div>

                                        {displayChildren.length > 0 ? (
                                            <div className="bg-slate-50 rounded-xl border border-slate-200 divide-y divide-slate-100">
                                                {displayChildren.map(child => (
                                                    <div key={child.id} className="p-4 flex items-center justify-between hover:bg-white transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-white rounded-lg border border-slate-200">
                                                                <Layers className="size-4 text-slate-500" />
                                                            </div>
                                                            <span className="font-medium text-slate-900">{child.name}</span>
                                                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">T{child.level}</Badge>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-xs text-slate-500">{child.usageCount || 0} items</span>
                                                            <ChevronRight className="size-4 text-slate-400" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                                <p className="text-sm text-slate-500">No sub-tiers found.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div >
            </div>

            <ConfirmationDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={async () => {
                    if (!selectedTierId || !selectedTierData) return;

                    try {
                        // Delete tier
                        await deleteTierMutation.mutateAsync(selectedTierId);

                        setShowDeleteDialog(false);

                        // Determine redirect destination based on deleted tier level
                        let redirectPath: string;

                        if (selectedTierData.level === 1) {
                            // Tier 1 deleted - redirect to listing page
                            redirectPath = ROUTES.TIERS?.LIST || '/tiers';
                        } else {
                            // Tier 2, 3, or 4 deleted - find root parent (Tier 1)
                            // Use the hierarchy to find the root parent
                            const findRootParent = (tierId: string, nodes: Tier[]): string | null => {
                                for (const node of nodes) {
                                    // If this is the parent and it's level 1, return it
                                    if (node.id === tierId && node.level === 1) {
                                        return node.id;
                                    }
                                    // If this is the parent and it's not level 1, find its parent
                                    if (node.id === tierId && node.parentId) {
                                        return findRootParent(node.parentId, tierHierarchy);
                                    }
                                    // Check children recursively
                                    if (node.children) {
                                        const found = findRootParent(tierId, node.children);
                                        if (found) return found;
                                    }
                                }
                                return null;
                            };

                            const parentId = selectedTierData.parentId;
                            if (parentId) {
                                const rootParentId = findRootParent(parentId, tierHierarchy);
                                redirectPath = rootParentId ? `/tiers/${rootParentId}` : (ROUTES.TIERS?.LIST || '/tiers');
                            } else {
                                // Fallback to listing if no parent found
                                redirectPath = ROUTES.TIERS?.LIST || '/tiers';
                            }
                        }

                        // Navigate first
                        navigate(redirectPath);

                        // Show success message
                        toast.success('Tier deleted successfully!');

                        // Invalidate queries AFTER navigation to prevent refetch race condition
                        setTimeout(() => {
                            queryClient.invalidateQueries({ queryKey: ['tiers'] });
                        }, 100);

                    } catch (error) {
                        // Error toast already handled by mutation onError
                        setShowDeleteDialog(false);
                    }
                }}
                title="Delete Tier"
                description={`Are you sure you want to delete "${formData.name}"? This will also delete all sub-tiers under it. This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                isLoading={deleteTierMutation.isPending}
            />
        </>
    );
}
