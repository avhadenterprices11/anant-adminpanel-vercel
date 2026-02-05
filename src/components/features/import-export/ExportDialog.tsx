import { useState, useEffect } from 'react';
import type { DateRange } from 'react-day-picker';
import {
  Download,
  ChevronDown,
  ChevronRight,
  FileSpreadsheet,
  Loader2
} from 'lucide-react';
import { DateRangePicker } from '@/components/forms/inputs/DateRangePicker';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { extractErrorMessage } from '@/utils';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MessageDialog } from "@/components/dialogs";
import { cn } from "@/lib/utils";

export interface ExportColumn {
  id: string;
  label: string;
  defaultSelected?: boolean;
}

export interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleName: string; // e.g., "Tickets", "Add-ons"
  totalCount?: number;
  selectedCount?: number;
  selectedItems?: any[]; // Items selected in the table
  columns?: ExportColumn[];
  supportsDateRange?: boolean;
  onExport: (options: ExportOptions) => Promise<void>;
}

export interface ExportOptions {
  scope: 'all' | 'current' | 'selected';
  format: 'csv' | 'xlsx' | 'pdf' | 'json';
  detailLevel: 'summary' | 'detailed' | 'full';
  dateRange?: {
    from: string;
    to: string;
  };
  selectedIds?: string[]; // IDs of selected items
  selectedColumns: string[];
}

export const ExportDialog = ({
  open,
  onOpenChange,
  moduleName,
  totalCount = 0,
  selectedCount: propSelectedCount,
  selectedItems = [],
  columns = [],
  supportsDateRange = false,
  onExport
}: ExportDialogProps) => {
  // Use selectedItems length if provided, otherwise use propSelectedCount
  const selectedCount = selectedItems.length > 0 ? selectedItems.length : (propSelectedCount || 0);
  const [isExporting, setIsExporting] = useState(false);
  const [scope, setScope] = useState<'all' | 'current' | 'selected'>('all');
  const [format, setFormat] = useState<'csv' | 'xlsx' | 'pdf' | 'json'>('csv');
  const [detailLevel, setDetailLevel] = useState<'summary' | 'detailed' | 'full'>('detailed');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [selectedColumnIds, setSelectedColumnIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // Initialize columns
  useEffect(() => {
    if (open) {
      setSelectedColumnIds(
        columns
          .filter(c => c.defaultSelected !== false)
          .map(c => c.id)
      );
      setScope('all');
      setFormat('csv');
      setDetailLevel('detailed');
      setDateRange(undefined);
      setError(null);
      setIsExporting(false);
    }
  }, [open, columns]);

  const validateExport = () => {
    // Check if no columns selected
    if (selectedColumnIds.length === 0) {
      setError("Please select at least one column to export.");
      return false;
    }

    // Check if scope is selected but no items selected
    if (scope === 'selected' && selectedCount === 0) {
      setError(`No ${moduleName.toLowerCase()} selected. Please select items from the table or change export scope to "All Items".`);
      return false;
    }

    // Warning for potentially empty export
    const warnings = [];
    if (scope === 'selected' && selectedCount < 3) {
      warnings.push(`Only ${selectedCount} item${selectedCount === 1 ? '' : 's'} selected`);
    }
    if (selectedColumnIds.length < 3) {
      warnings.push(`Only ${selectedColumnIds.length} column${selectedColumnIds.length === 1 ? '' : 's'} selected`);
    }

    // Show confirmation if there are warnings
    if (warnings.length > 0) {
      setConfirmationMessage(
        `Your export will be limited:\n\n${warnings.map(w => `• ${w}`).join('\n')}\n\nDo you want to continue?`
      );
      setShowConfirmDialog(true);
      return false;
    }

    return true;
  };

  const handleExport = async () => {
    setError(null);
    
    // Validate before exporting
    if (!validateExport()) {
      return;
    }

    await proceedWithExport();
  };

  const proceedWithExport = async () => {
    setIsExporting(true);

    try {
      await onExport({
        scope,
        format,
        detailLevel,
        dateRange: supportsDateRange && dateRange?.from ? {
          from: dateRange.from.toISOString().split('T')[0],
          to: (dateRange.to || dateRange.from).toISOString().split('T')[0]
        } : undefined,
        selectedColumns: selectedColumnIds
      });

      // Close on success
      onOpenChange(false);
    } catch (err: any) {
      console.error('Export error:', err);
      console.error('Error response:', err?.response);
      console.error('Error data:', err?.response?.data);
      const errorMessage = extractErrorMessage(err, "Export failed. Please try again.");
      setError(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  const toggleColumn = (id: string) => {
    if (selectedColumnIds.includes(id)) {
      setSelectedColumnIds(selectedColumnIds.filter(c => c !== id));
    } else {
      setSelectedColumnIds([...selectedColumnIds, id]);
    }
  };

  const toggleAllColumns = () => {
    if (selectedColumnIds.length === columns.length) {
      setSelectedColumnIds([]);
    } else {
      setSelectedColumnIds(columns.map(c => c.id));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val: boolean) => !isExporting && onOpenChange(val)}>
      <DialogContent className="sm:max-w-[500px] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b border-slate-100 space-y-1">
          <DialogTitle className="text-xl font-bold text-[#1d293d]">Export Data</DialogTitle>
          <DialogDescription>
            Export data from <span className="font-medium text-slate-700">{moduleName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto max-h-[60vh] p-6 space-y-6 custom-scrollbar-light">

          {/* Export Scope Section */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-900">Export Scope</Label>
            <RadioGroup value={scope} onValueChange={(val) => setScope(val as 'all' | 'current' | 'selected')} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="scope-all" />
                <Label htmlFor="scope-all" className="font-normal cursor-pointer">Export all items ({totalCount})</Label>
              </div>
              {/* TODO: Implement Export Current View in future */}
              {/* <div className="flex items-center space-x-2">
                <RadioGroupItem value="current" id="scope-current" />
                <Label htmlFor="scope-current" className="font-normal cursor-pointer">Export current view</Label>
              </div> */}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="selected" id="scope-selected" disabled={selectedCount === 0} />
                <Label htmlFor="scope-selected" className={cn("font-normal cursor-pointer", selectedCount === 0 && "text-slate-400")}>
                  Export selected items {selectedCount > 0 ? `(${selectedCount})` : ''}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Export Format Section */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-900">Export Format</Label>
            <div className="grid grid-cols-2 gap-3">
              <div
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                  format === 'csv' ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900" : "border-slate-200 hover:bg-slate-50"
                )}
                onClick={() => setFormat('csv')}
              >
                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-md">
                  <FileSpreadsheet size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900">CSV</span>
                  <span className="text-[10px] text-slate-500">Universal format</span>
                </div>
                {format === 'csv' && <div className="ml-auto text-slate-900"><div className="w-2 h-2 rounded-full bg-slate-900" /></div>}
              </div>

              <div
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                  format === 'xlsx' ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900" : "border-slate-200 hover:bg-slate-50"
                )}
                onClick={() => setFormat('xlsx')}
              >
                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-md">
                  <FileSpreadsheet size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900">Excel</span>
                  <span className="text-[10px] text-slate-500">.xlsx format</span>
                </div>
                {format === 'xlsx' && <div className="ml-auto text-slate-900"><div className="w-2 h-2 rounded-full bg-slate-900" /></div>}
              </div>

              {/* TODO: Implement PDF export in future
              <div
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                  format === 'pdf' ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900" : "border-slate-200 hover:bg-slate-50"
                )}
                onClick={() => setFormat('pdf')}
              >
                <div className="bg-red-100 text-red-600 p-2 rounded-md">
                  <FileText size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900">PDF</span>
                  <span className="text-[10px] text-slate-500">Document format</span>
                </div>
                {format === 'pdf' && <div className="ml-auto text-slate-900"><div className="w-2 h-2 rounded-full bg-slate-900" /></div>}
              </div>
              */}

              {/* TODO: Implement JSON export in future
              <div
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                  format === 'json' ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900" : "border-slate-200 hover:bg-slate-50"
                )}
                onClick={() => setFormat('json')}
              >
                <div className="bg-amber-100 text-amber-600 p-2 rounded-md">
                  <FileJson size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900">JSON</span>
                  <span className="text-[10px] text-slate-500">Structured data</span>
                </div>
                {format === 'json' && <div className="ml-auto text-slate-900"><div className="w-2 h-2 rounded-full bg-slate-900" /></div>}
              </div>
              */}
            </div>
          </div>

          {/* TODO: Implement Data Detail Level in future
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-900">Data Detail Level</Label>
            <Select value={detailLevel} onValueChange={(val) => setDetailLevel(val as 'summary' | 'detailed' | 'full')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select detail level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">
                  <span className="font-medium block">Summary</span>
                  <span className="text-xs text-slate-500">Key metrics and high-level data only</span>
                </SelectItem>
                <SelectItem value="detailed">
                  <span className="font-medium block">Detailed</span>
                  <span className="text-xs text-slate-500">Standard set of fields for reporting</span>
                </SelectItem>
                <SelectItem value="full">
                  <span className="font-medium block">Full Export</span>
                  <span className="text-xs text-slate-500">All available data fields including metadata</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          */}

          {/* Date Range (Conditional) */}
          {supportsDateRange && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-900">Date Range</Label>
              <DateRangePicker
                value={dateRange ? { from: dateRange.from ?? null, to: dateRange.to ?? null } : { from: null, to: null }}
                onChange={(val) => setDateRange(val.from ? { from: val.from, to: val.to ?? undefined } : undefined)}
              />
            </div>
          )}

          {/* Column Selection (Advanced) */}
          {columns.length > 0 && (
            <Collapsible open={isColumnsOpen} onOpenChange={setIsColumnsOpen} className="space-y-1 border rounded-lg p-2 bg-slate-50/50">
              <CollapsibleTrigger className="flex items-center justify-between w-full text-xs font-medium text-slate-700 hover:text-slate-900">
                <span>Select columns to include</span>
                {isColumnsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1.5 pt-1.5 animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-blue-600 hover:text-blue-700" onClick={toggleAllColumns}>
                    {selectedColumnIds.length === columns.length ? 'Deselect all' : 'Select all'}
                  </Button>
                  <span className="text-xs text-slate-400">{selectedColumnIds.length} selected</span>
                </div>
                <div className="grid grid-cols-1 gap-1.5 max-h-[120px] overflow-y-auto custom-scrollbar-light">
                  {columns.map(col => (
                    <div key={col.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`col-${col.id}`}
                        checked={selectedColumnIds.includes(col.id)}
                        onCheckedChange={() => toggleColumn(col.id)}
                      />
                      <Label htmlFor={`col-${col.id}`} className="text-xs font-normal cursor-pointer truncate" title={col.label}>
                        {col.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="p-6 border-t border-slate-100 bg-slate-50/50">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isExporting}>
            Cancel
          </Button>
          <Button
            className="bg-[#0f172b] min-w-[120px]"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Warning Dialog for Limited Exports */}
      <MessageDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Limited Export Detected"
        description={confirmationMessage}
        variant="warning"
        primaryAction={{
          label: "Continue Export",
          onClick: () => {
            setShowConfirmDialog(false);
            proceedWithExport();
          },
        }}
        secondaryAction={{
          label: "Go Back & Adjust",
          onClick: () => setShowConfirmDialog(false),
        }}
      />
    </Dialog>
  );
};
