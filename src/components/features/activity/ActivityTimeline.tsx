import React from 'react';
import { cn } from '@/lib/utils';

export interface ActivityTimelineItem {
  id: string | number;
  type: string;
  title: string;
  description: string;
  amount?: string | null;
  timestamp: string;
}

interface ActivityTimelineProps {
  activities: ActivityTimelineItem[];
  getIcon: (type: string) => React.ReactNode;
  getIconColors: (type: string) => string;
  emptyMessage?: string;
  className?: string;
}

export function ActivityTimeline({
  activities,
  getIcon,
  getIconColors,
  emptyMessage = "No activities found",
  className
}: ActivityTimelineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {activities.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          {emptyMessage}
        </div>
      ) : (
        activities.map((activity) => (
          <div key={activity.id} className="flex gap-4">
            <div className={cn(
              "size-10 rounded-xl flex items-center justify-center flex-shrink-0",
              getIconColors(activity.type)
            )}>
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{activity.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{activity.description}</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-medium tracking-wider">{activity.timestamp}</p>
                </div>
                {activity.amount && (
                  <p className="font-semibold text-slate-900 text-sm whitespace-nowrap">{activity.amount}</p>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
