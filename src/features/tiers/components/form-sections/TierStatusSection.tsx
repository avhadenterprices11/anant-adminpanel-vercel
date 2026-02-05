import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface TierStatusSectionProps {
    status: 'active' | 'inactive';
    onStatusChange: (status: 'active' | 'inactive') => void;
}

/**
 * Tier Status Section
 * Handles tier active/inactive status toggle
 */
export function TierStatusSection({
    status,
    onStatusChange,
}: TierStatusSectionProps) {
    const isActive = status === 'active';

    return (
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div>
                <Label htmlFor="tier-status" className="text-sm font-medium text-slate-900">
                    Status
                </Label>
                <p className="text-xs text-slate-500 mt-1">
                    {isActive ? 'Tier is visible and usable' : 'Tier is hidden from users'}
                </p>
            </div>
            <Switch
                id="tier-status"
                checked={isActive}
                onCheckedChange={(checked) => onStatusChange(checked ? 'active' : 'inactive')}
            />
        </div>
    );
}
