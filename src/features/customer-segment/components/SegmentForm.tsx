import React, { useMemo, useEffect, useState } from 'react';
import { Save, Filter } from 'lucide-react';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';
import { Button } from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { UnsavedChangesDialog } from '@/components/dialogs/UnsavedChangesDialog';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';

import { SegmentBasicDetails } from './SegmentBasicDetails';
import { SegmentInsightsSidebar } from './SegmentInsightsSidebar';
import { UserSelector } from './UserSelector';
import {
  UsersPreviewSection
} from './form-sections';
import { NotesTags } from '@/components/features/notes/NotesTags';
import { CommonConditionsSection } from '@/components/features/rules/CommonConditionsSection';
import { TypeSelector } from '@/components/forms/inputs/TypeSelector';
import { mockMatchingUsers, mockSegments } from '../data/mock-data';
import type { SegmentRule, SegmentPurpose, SegmentPriority } from '../types/segment.types';
import { fieldOptions, getConditionOptions, getInputType } from '../data/segment.constants';

interface SegmentFormProps {
  segmentId?: string;
  onBack: () => void;
}

export const SegmentForm = ({ segmentId, onBack }: SegmentFormProps) => {
  const [segmentName, setSegmentName] = React.useState('');
  const [segmentCode, setSegmentCode] = React.useState('');
  const [segmentDescription, setSegmentDescription] = React.useState('');
  const [segmentPurpose, setSegmentPurpose] = React.useState<SegmentPurpose>('marketing-campaign');
  const [segmentPriority, setSegmentPriority] = React.useState<SegmentPriority>('normal');
  const [segmentStatus, setSegmentStatus] = React.useState(true);
  const [tags, setTags] = React.useState<string[]>([]);
  const [adminComment, setAdminComment] = React.useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  // State for RulesSection component
  const [rules, setRules] = React.useState<SegmentRule[]>([
    { id: '1', field: '', condition: '', value: '' }
  ]);
  const [matchType, setMatchType] = React.useState<'all' | 'any'>('all');
  const [segmentType, setSegmentType] = React.useState<'manual' | 'automated'>('automated');
  const [applied, setApplied] = React.useState(false);
  const [matchingUsersState, setMatchingUsersState] = React.useState<any[]>(mockMatchingUsers);

  // Track changes
  const [initialSnapshot, setInitialSnapshot] = React.useState<any>(null);

  // Detect changes
  const hasChanges = React.useMemo(() => {
    if (!initialSnapshot) return false;

    const current = {
      segmentName,
      segmentCode,
      segmentDescription,
      segmentPurpose,
      segmentPriority,
      segmentStatus,
      tags,
      adminComment,
      rules,
      matchType,
      segmentType,
    };

    return JSON.stringify(current) !== JSON.stringify(initialSnapshot);
  }, [segmentName, segmentCode, segmentDescription, segmentPurpose, segmentPriority, segmentStatus, tags, adminComment, rules, matchType, segmentType, initialSnapshot]);

  const { navigateWithConfirmation, proceedNavigation, cancelNavigation } =
    useUnsavedChangesWarning(hasChanges && !isSaving, () => setShowDiscardDialog(true));

  const handleDiscardChanges = () => {
    setShowDiscardDialog(false);
    proceedNavigation();
  };

  const handleContinueEditing = () => {
    cancelNavigation();
    setShowDiscardDialog(false);
  };

  // Load existing segment data when editing
  useEffect(() => {
    if (segmentId) {
      const segment = mockSegments.find(s => s.id === segmentId);
      if (segment) {
        setSegmentName(segment.segmentName);
        setSegmentCode(segmentId);
        setSegmentType(segment.type === 'manual' ? 'manual' : 'automated');
        // Set filters as tags for display
        setTags(segment.filters || []);
        setSegmentDescription(`Segment created by ${segment.createdBy}`);
      }
    }

    // Set initial snapshot after loading data
    const snapshot = {
      segmentName,
      segmentCode,
      segmentDescription,
      segmentPurpose,
      segmentPriority,
      segmentStatus,
      tags,
      adminComment,
      rules,
      matchType,
      segmentType,
    };
    setInitialSnapshot(snapshot);
  }, [segmentId]);

  // ... (handlers)

  const SegmentTypeSelector = (props: any) => (
    <TypeSelector
      {...props}
      required
      label="Segment Type"
      manualDescription="Add customers to this segment manually"
      automatedDescription="Customers are automatically added based on conditions"
    />
  );

  const handleBack = () => {
    navigateWithConfirmation('/customer-segments');
  };

  const hasValidRule = (rules && rules.length > 0 && rules[0].field !== '') || false;

  const BoundUserSelector = (props: any) => (
    <UserSelector
      {...props}
      onUsersSelected={(selected: any[]) => {
        // Map selected customers to MatchingUser format
        const mapped = selected.map(u => ({
          id: u.id,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          tags: u.tags || []
        }));
        setMatchingUsersState(mapped);
        setApplied(true);
      }}
    />
  );

  const handleSave = () => {
    setIsSaving(true);
    logger.info('Saving segment:', {
      segmentName,
      segmentCode,
      segmentDescription,
      segmentPurpose,
      segmentPriority,
      segmentStatus,
      adminComment,
      tags,
      rules,
      matchType
    });
    toast.success('Customer segment saved successfully');
    
    // Update snapshot after save
    setInitialSnapshot({
      segmentName,
      segmentCode,
      segmentDescription,
      segmentPurpose,
      segmentPriority,
      segmentStatus,
      tags,
      adminComment,
      rules,
      matchType,
      segmentType,
    });
    
    setIsSaving(false);
    onBack();
  };

  return (
    <div className="flex-1 w-full">
      <PageHeader
        title={segmentId ? "Edit Customer Segment" : "Create Customer Segment"}
        subtitle={segmentId ? "Update segment rules and settings" : "Define rules to automatically group customers"}
        breadcrumbs={[
          { label: 'Customer Segments', onClick: handleBack },
          { label: segmentId ? (segmentName || 'Loading...') : 'Add New', active: true }
        ]}
        backIcon="arrow"
        onBack={handleBack}
        actions={
          <>
            <Button variant="outline" className="h-10" onClick={handleBack}>
              Cancel
            </Button>
            <Button className="bg-[#0e042f] hover:bg-[#0e042f]/90 text-white h-10" onClick={handleSave}>
              <Save className="size-4 mr-2" />
              Save Segment
            </Button>
          </>
        }
      />

      <UnsavedChangesDialog
        open={showDiscardDialog}
        onOpenChange={setShowDiscardDialog}
        onDiscard={handleDiscardChanges}
        onContinueEditing={handleContinueEditing}
      />

      <div className="px-6 lg:px-8 pb-8">

        {/* Main Layout: 2-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDE - Main Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Basic Segment Details */}
            <SegmentBasicDetails
              segmentName={segmentName}
              setSegmentName={setSegmentName}
              segmentCode={segmentCode}
              setSegmentCode={(value) => setSegmentCode(value.toLowerCase().replace(/\s+/g, '-'))}
              segmentDescription={segmentDescription}
              setSegmentDescription={setSegmentDescription}
              segmentPurpose={segmentPurpose}
              setSegmentPurpose={setSegmentPurpose}
              segmentPriority={segmentPriority}
              setSegmentPriority={setSegmentPriority}
            />

            {/* 2. Segment Rules */}
            <CommonConditionsSection
              title={segmentType === 'manual' ? "Add Users Manually" : "Segment Rules"}
              icon={Filter}
              required
              conditions={rules}
              collectionType={segmentType}
              onCollectionTypeChange={(val: string) => setSegmentType(val as 'manual' | 'automated')}
              CollectionTypeSelector={SegmentTypeSelector}
              onConditionsChange={(newRules: any[]) => setRules(newRules as SegmentRule[])}
              matchType={matchType === 'all' ? 'all' : 'any'} // cast string to literal
              onMatchTypeChange={(val: 'all' | 'any') => setMatchType(val)}
              conditionConfigs={useMemo(() => {
                const config: any = {};
                fieldOptions.forEach(f => {
                  config[f.value] = {
                    label: f.label,
                    inputType: getInputType(f.value),
                    conditions: getConditionOptions(f.value)
                  };
                });
                return config;
              }, [])}
              onApplyConditions={() => {
                // Simulate apply: set applied state and (re)load matching users
                setApplied(true);
                // In real app, we'd fetch matching users based on rules
                setMatchingUsersState(mockMatchingUsers);
              }}
              onClearConditions={() => {
                setRules([{ id: '1', field: '', condition: '', value: '' }]);
                setApplied(false);
                setMatchingUsersState([]);
              }}
              ProductSelector={BoundUserSelector}
              showPreview={false}
            />

            {/* 3. Users Preview */}
            <UsersPreviewSection
              matchingUsers={matchingUsersState}
              hasValidRule={segmentType === 'manual' ? true : hasValidRule}
              applied={segmentType === 'manual' ? (matchingUsersState.length > 0) : applied}
            />
          </div>

          {/* RIGHT SIDE - Insights & Control */}
          <div className="space-y-6">
            <SegmentInsightsSidebar
              estimatedUsers={234}
              lastRefreshed="2 hours ago"
              createdBy="Admin User"
              segmentStatus={segmentStatus}
              setSegmentStatus={setSegmentStatus}
            />

            {/* Advanced Settings */}
            {/* Advanced Settings - Commented Out */}
            {/* <AdvancedSettingsSection
              autoRefreshInterval={autoRefreshInterval}
              setAutoRefreshInterval={setAutoRefreshInterval}
              lockRules={lockRules}
              setLockRules={setLockRules}
            /> */}

            {/* Notes & Tags */}
            <NotesTags
              adminComment={adminComment}
              onAdminCommentChange={setAdminComment}
              tags={tags}
              onTagsChange={setTags}
              showCustomerNote={false}
            />

            {/* User Timeline */}
            {/* User Timeline - Commented Out */}
            {/* <UserTimelineSection /> */}

            {/* Activity Timeline (Universal Common) - Commented Out */}
            {/* <ActivityTimelineSection /> */}
          </div>
        </div>
      </div>
    </div>
  );
};
