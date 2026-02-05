import { Activity, ShoppingBag, DollarSign, LogIn, Filter, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { ActivityTimeline, type ActivityTimelineItem } from '@/components/features/activity';
import { FormSection } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { AllActivityModal } from '../../modals/AllActivityModal';

interface ActivityTimelineSectionProps {
  activities: ActivityTimelineItem[];
}

export function ActivityTimelineSection({ activities }: ActivityTimelineSectionProps) {
  const [filter, setFilter] = useState<string>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isAllActivityModalOpen, setIsAllActivityModalOpen] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="size-4" />;
      case 'payment':
        return <DollarSign className="size-4" />;
      case 'login':
        return <LogIn className="size-4" />;
      default:
        return <Activity className="size-4" />;
    }
  };

  const getIconColors = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-green-100 text-green-600';
      case 'payment':
        return 'bg-blue-100 text-blue-600';
      case 'login':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'order', label: 'Orders' },
    { value: 'payment', label: 'Payments' },
    { value: 'login', label: 'Logins' }
  ];

  const filteredActivities = filter === 'all'
    ? activities
    : activities.filter(a => a.type === filter);

  const filterAction = (
    <div className="relative">
      <button
        onClick={() => setShowFilterMenu(!showFilterMenu)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
      >
        <Filter className="size-3.5" />
        {filterOptions.find(f => f.value === filter)?.label || 'Filter'}
        <ChevronDown className="size-3.5" />
      </button>

      {showFilterMenu && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-10">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setFilter(option.value);
                setShowFilterMenu(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${filter === option.value ? 'bg-slate-50 font-medium text-slate-900' : 'text-slate-700'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <FormSection icon={Activity} title="Activity Timeline" actions={filterAction}>
        <ActivityTimeline
          activities={filteredActivities.slice(0, 5)}
          getIcon={getIcon}
          getIconColors={getIconColors}
        />

        <Button
          variant="outline"
          size="sm"
          className="w-full mt-4 rounded-xl h-8"
          onClick={() => setIsAllActivityModalOpen(true)}
        >
          View All Activity
        </Button>
      </FormSection>

      <AllActivityModal
        isOpen={isAllActivityModalOpen}
        onClose={() => setIsAllActivityModalOpen(false)}
        activities={activities}
      />
    </>
  );
}
