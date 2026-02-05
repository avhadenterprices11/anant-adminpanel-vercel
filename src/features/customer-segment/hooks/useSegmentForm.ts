import { useState, useEffect } from 'react';
import { type SegmentRule, type SegmentPurpose, type SegmentPriority } from '../types/segment.types';

interface InitialSegmentSnapshot {
    segmentName: string;
    segmentCode: string;
    segmentDescription: string;
    segmentPurpose: SegmentPurpose;
    segmentPriority: SegmentPriority;
    segmentStatus: boolean;
    tags: string[];
    adminComment: string;
    rules: SegmentRule[];
    matchType: 'all' | 'any';
    segmentType: 'manual' | 'automated';
}

export const useSegmentForm = (initialData?: any) => {
    // Form State
    const [segmentName, setSegmentName] = useState(initialData?.segmentName || '');
    const [segmentCode, setSegmentCode] = useState(initialData?.segmentCode || '');
    const [segmentDescription, setSegmentDescription] = useState(initialData?.segmentDescription || '');
    const [segmentPurpose, setSegmentPurpose] = useState<SegmentPurpose>(initialData?.segmentPurpose || 'marketing-campaign');
    const [segmentPriority, setSegmentPriority] = useState<SegmentPriority>(initialData?.segmentPriority || 'normal');
    const [segmentStatus, setSegmentStatus] = useState(initialData?.segmentStatus !== undefined ? initialData.segmentStatus : true);
    const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [adminComment, setAdminComment] = useState(initialData?.adminComment || '');
    const [segmentType, setSegmentType] = useState<'manual' | 'automated'>(initialData?.segmentType || 'automated');
    const [matchType, setMatchType] = useState<'all' | 'any'>(initialData?.matchType || 'all');

    // UI State
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulatedCount, setSimulatedCount] = useState<number | null>(null);

    const [rules, setRules] = useState<SegmentRule[]>(initialData?.rules || [
        { id: '1', field: '', condition: '', value: '' }
    ]);

    // Snapshot for change detection
    const [initialSnapshot, setInitialSnapshot] = useState<InitialSegmentSnapshot | null>(null);

    // Capture initial state
    useEffect(() => {
        if (initialData) {
            setInitialSnapshot({
                segmentName: initialData.segmentName || '',
                segmentCode: initialData.segmentCode || '',
                segmentDescription: initialData.segmentDescription || '',
                segmentPurpose: initialData.segmentPurpose || 'marketing-campaign',
                segmentPriority: initialData.segmentPriority || 'normal',
                segmentStatus: initialData.segmentStatus !== undefined ? initialData.segmentStatus : true,
                tags: initialData.tags || [],
                adminComment: initialData.adminComment || '',
                rules: initialData.rules || [{ id: '1', field: '', condition: '', value: '' }],
                matchType: initialData.matchType || 'all',
                segmentType: initialData.segmentType || 'automated',
            });
        } else {
            // For new segments, capture current state as initial
            setInitialSnapshot({
                segmentName: '',
                segmentCode: '',
                segmentDescription: '',
                segmentPurpose: 'marketing-campaign',
                segmentPriority: 'normal',
                segmentStatus: true,
                tags: [],
                adminComment: '',
                rules: [{ id: '1', field: '', condition: '', value: '' }],
                matchType: 'all',
                segmentType: 'automated',
            });
        }
    }, [initialData]);

    // Check for changes
    const hasChanges = (() => {
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
    })();

    // Handlers
    const addRule = () => {
        setRules([...rules, { id: Date.now().toString(), field: '', condition: '', value: '' }]);
    };

    const removeRule = (id: string) => {
        if (rules.length > 1) {
            setRules(rules.filter(rule => rule.id !== id));
        }
    };

    const duplicateRule = (id: string) => {
        const ruleToDuplicate = rules.find(rule => rule.id === id);
        if (ruleToDuplicate) {
            setRules([...rules, { ...ruleToDuplicate, id: Date.now().toString() }]);
        }
    };

    const updateRule = (id: string, key: keyof SegmentRule, value: string) => {
        setRules(rules.map(rule => {
            if (rule.id === id) {
                const updatedRule = { ...rule, [key]: value };
                if (key === 'field') {
                    updatedRule.condition = '';
                    updatedRule.value = '';
                }
                return updatedRule;
            }
            return rule;
        }));
    };

    const handleRulePresetChange = (value: string) => {
        if (value === 'high-value') {
            setRules([{ id: '1', field: 'total_spent', condition: 'greater_than', value: '50000' }]);
        } else if (value === 'inactive') {
            setRules([{ id: '1', field: 'last_order_date', condition: 'before', value: '90' }]);
        } else if (value === 'vip') {
            setRules([{ id: '1', field: 'loyalty_points', condition: 'greater_than', value: '1000' }]);
        } else if (value === 'new') {
            setRules([{ id: '1', field: 'total_orders', condition: 'less_than', value: '5' }]);
        } else {
            setRules([{ id: '1', field: '', condition: '', value: '' }]);
        }
    };

    const hasValidRule = rules.some(rule => rule.field && rule.condition && rule.value);

    const handleSimulateSegment = () => {
        setIsSimulating(true);
        setTimeout(() => {
            setSimulatedCount(Math.floor(Math.random() * 500) + 100);
            setIsSimulating(false);
        }, 1000);
    };

    return {
        formState: {
            segmentName, setSegmentName,
            segmentCode, setSegmentCode,
            segmentDescription, setSegmentDescription,
            segmentPurpose, setSegmentPurpose,
            segmentPriority, setSegmentPriority,
            segmentStatus, setSegmentStatus,
            tags, setTags,
            adminComment, setAdminComment,
            segmentType, setSegmentType,
            matchType, setMatchType,
            rules, setRules
        },
        uiState: {
            isSimulating,
            simulatedCount,
            hasValidRule,
            hasChanges
        },
        handlers: {
            addRule,
            removeRule,
            duplicateRule,
            updateRule,
            handleRulePresetChange,
            handleSimulateSegment
        }
    };
};
