// Component Props Interfaces
import type { CustomerSegment } from './segment.types';

// ==================== Component Props Interfaces ====================

export interface SegmentRulesBuilderProps {
  rules: any[];
  onRulesChange: (rules: any[]) => void;
}

export interface SegmentFormProps {
  formData: Partial<CustomerSegment>;
  handleInputChange: (field: string, value: string | string[] | number) => void;
  onSubmit: () => void;
}

export interface SegmentBasicDetailsProps {
  formData: Partial<CustomerSegment>;
  handleInputChange: (field: string, value: string | string[] | number) => void;
}
