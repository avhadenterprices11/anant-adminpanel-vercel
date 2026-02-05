import { Label } from '@/components/ui/label';

interface CollectionTypeSelectorProps {
  value: string;
  onChange: (value: 'manual' | 'automated') => void;
  disabled?: boolean;
}

export function CollectionTypeSelector({
  value,
  onChange,
  disabled = false,
}: CollectionTypeSelectorProps) {
  return (
    <div>
      <Label className="text-sm font-medium text-slate-700 mb-3 block">Collection Type</Label>
      <div className="space-y-2.5">
        <button
          onClick={() => onChange('manual')}
          className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
            value === 'manual'
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-slate-200 bg-white hover:border-slate-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          type="button"
          disabled={disabled}
        >
          <div className="flex items-start gap-2.5">
            <div
              className={`mt-0.5 size-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                value === 'manual' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
              }`}
            >
              {value === 'manual' && <div className="size-1.5 rounded-full bg-white" />}
            </div>
            <div>
              <p className="font-medium text-slate-900">Manual</p>
              <p className="text-sm text-slate-600 mt-0.5">
                Add products to this collection one by one
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onChange('automated')}
          className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
            value === 'automated'
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-slate-200 bg-white hover:border-slate-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          type="button"
          disabled={disabled}
        >
          <div className="flex items-start gap-2.5">
            <div
              className={`mt-0.5 size-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                value === 'automated' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
              }`}
            >
              {value === 'automated' && <div className="size-1.5 rounded-full bg-white" />}
            </div>
            <div>
              <p className="font-medium text-slate-900">Automated</p>
              <p className="text-sm text-slate-600 mt-0.5">
                Products are automatically added based on conditions
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
