import { Ban, AlertTriangle } from 'lucide-react';
import { FormSection } from '@/components/forms';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface BanSectionProps {
  isBanned: boolean;
  setIsBanned: (value: boolean) => void;
  banReason: string;
  setBanReason: (value: string) => void;
}

export function BanSection({
  isBanned,
  setIsBanned,
  banReason,
  setBanReason
}: BanSectionProps) {
  return (
    <FormSection icon={Ban} title="Ban Customer">
      <div className="space-y-5">
        <div className="flex items-center justify-between transition-colors">
          <div>
            <Label className="text-sm font-medium text-slate-900">
              {isBanned ? 'Customer Banned' : 'Ban Customer'}
            </Label>
            <p className="text-xs mt-0.5 text-slate-600">
              {isBanned ? 'Customer access is currently revoked' : 'Revoke customer access and block login'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-600">
              {isBanned ? 'Banned' : 'Active'}
            </span>
            <Switch
              checked={isBanned}
              onCheckedChange={setIsBanned}
              className="data-[state=checked]:bg-slate-900"
            />
          </div>
        </div>

        {isBanned && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 space-y-3">
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                Reason for Ban <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Please provide a detailed reason for banning this customer..."
                className="min-h-[100px] rounded-xl border border-slate-200 bg-white focus-visible:ring-2 focus-visible:ring-slate-200 focus-visible:border-slate-300"
              />
            </div>

            <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <p>
                This action will immediately prevent the customer from logging in, placing orders, or accessing their account history.
              </p>
            </div>
          </div>
        )}
      </div>
    </FormSection>
  );
}
