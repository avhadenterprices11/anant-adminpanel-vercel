import { Activity, ShoppingBag, DollarSign, LogIn, Filter, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { ActivityTimeline } from '@/components/features/activity/ActivityTimeline';
import { mockActivities } from '../../data/mock-data';

export function ActivityTimelineSection() {
  const [filter, setFilter] = useState<string>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag className="size-4" />;
      case 'payment': return <DollarSign className="size-4" />;
      case 'login': return <LogIn className="size-4" />;
      default: return <Activity className="size-4" />;
    }
  };

  const getIconColors = (type: string) => {
    switch (type) {
      case 'order': return 'bg-green-100 text-green-600';
      case 'payment': return 'bg-blue-100 text-blue-600';
      case 'login': return 'bg-purple-100 text-purple-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const filteredActivities = filter === 'all'
    ? mockActivities
    : mockActivities.filter(a => a.type === filter);

  const filterAction = (
    <div className="relative">
      <button
        onClick={() => setShowFilterMenu(!showFilterMenu)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
      >
        <Filter className="size-3.5" />
        {filter === 'all' ? 'All Activities' : filter.charAt(0).toUpperCase() + filter.slice(1)}
        <ChevronDown className="size-3.5" />
      </button>

      {showFilterMenu && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-10 py-1">
          {['all', 'order', 'payment', 'login'].map((t) => (
            <button
              key={t}
              onClick={() => { setFilter(t); setShowFilterMenu(false); }}
              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors capitalize"
            >
              {t === 'all' ? 'All Activities' : t}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/80 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900 mb-1">Activity Timeline</h3>
          <p className="text-xs text-slate-600">Recent member activities</p>
        </div>
        {filterAction}
      </div>
      <ActivityTimeline
        activities={filteredActivities}
        getIcon={getIcon}
        getIconColors={getIconColors}
      />
    </div>
  );
}
