import { useState } from 'react';
import { Settings, ChevronDown, ChevronUp, RefreshCw, Lock, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { AdvancedSettingsSectionProps } from '../../types/segment.types';

export const AdvancedSettingsSection = ({
  autoRefreshInterval,
  setAutoRefreshInterval,
  lockRules,
  setLockRules
}: AdvancedSettingsSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Settings className="size-5 text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-900">Advanced Settings</h2>
        </div>
        {isOpen ? (
          <ChevronUp className="size-5 text-slate-600" />
        ) : (
          <ChevronDown className="size-5 text-slate-600" />
        )}
      </button>

      {isOpen && (
        <div className="px-6 pb-6 space-y-6 border-t border-slate-200">
          {/* Auto Refresh Interval */}
          <div className="space-y-2 pt-6">
            <Label className="text-slate-700">Auto Refresh Interval</Label>
            <Select value={autoRefreshInterval} onValueChange={setAutoRefreshInterval}>
              <SelectTrigger>
                <SelectValue placeholder="Select refresh interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="hourly">Every 1 Hour</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <RefreshCw className="size-3" />
              Controls how often users are re-evaluated and reassigned to this segment
            </p>
          </div>

          {/* Lock Segment Rules */}
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="size-4 text-slate-600" />
                <p className="text-sm font-medium text-slate-900">Lock Segment Rules</p>
              </div>
              <p className="text-xs text-slate-600">
                Prevent future modifications to segment rules for consistency
              </p>
            </div>
            <Switch checked={lockRules} onCheckedChange={setLockRules} />
          </div>

          {lockRules && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-800 flex items-start gap-2">
                <Info className="size-4 flex-shrink-0 mt-0.5" />
                <span>Once saved, locked rules cannot be edited. Use this for compliance or audit requirements.</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
