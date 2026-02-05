import { X, Activity, ShoppingBag, DollarSign, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ActivityTimelineItem } from '@/components/features/activity';

interface AllActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: ActivityTimelineItem[];
  customerName?: string;
}

const activityConfig: Record<string, { icon: React.ElementType; color: string }> = {
  order: { icon: ShoppingBag, color: 'bg-green-100 text-green-600' },
  payment: { icon: DollarSign, color: 'bg-blue-100 text-blue-600' },
  login: { icon: LogIn, color: 'bg-purple-100 text-purple-600' },
  default: { icon: Activity, color: 'bg-slate-100 text-slate-600' },
};

export function AllActivityModal({ isOpen, onClose, activities, customerName }: AllActivityModalProps) {
  if (!isOpen) return null;

  const getConfig = (type: string) => activityConfig[type] || activityConfig.default;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Activity className="size-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Activity Timeline</h2>
              <p className="text-sm text-slate-600">{customerName ? `Activity for ${customerName}` : `${activities.length} activities`}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="size-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activities.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Activity className="size-12 mx-auto text-slate-300 mb-3" />
              <p>No activity found</p>
            </div>
          ) : (
            <div className="relative pl-8">
              {/* Timeline line */}
              <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200" />

              <div className="space-y-6">
                {activities.map((activity, index) => {
                  const config = getConfig(activity.type);
                  const Icon = config.icon;
                  return (
                    <div key={activity.id || index} className="relative">
                      {/* Timeline dot */}
                      <div className={`absolute -left-5 size-6 rounded-full flex items-center justify-center ${config.color}`}>
                        <Icon className="size-3" />
                      </div>

                      <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <p className="font-medium text-slate-900">{activity.title}</p>
                            {activity.description && (
                              <p className="text-sm text-slate-600 mt-0.5">{activity.description}</p>
                            )}
                          </div>
                          <span className="text-xs text-slate-500 whitespace-nowrap">
                            {activity.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full rounded-xl"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
