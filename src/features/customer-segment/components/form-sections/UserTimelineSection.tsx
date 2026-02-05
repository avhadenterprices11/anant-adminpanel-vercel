import { User, Settings, Info } from 'lucide-react';
import { SidebarSection } from '@/components/layouts';
import { mockUserTimeline as mockTimeline } from '../../data/mock-data';

export function UserTimelineSection() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'creation': return <User className="size-4" />;
      case 'update': return <Settings className="size-4" />;
      default: return <Info className="size-4" />;
    }
  };

  const getIconColors = (type: string) => {
    switch (type) {
      case 'creation': return 'bg-indigo-50 text-indigo-600';
      case 'update': return 'bg-amber-50 text-amber-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <SidebarSection
      title="User Timeline"
      description="Internal segment activity"
      className="rounded-[20px]"
    >
      <div className="space-y-4">
        {mockTimeline.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className={`size-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColors(item.type)}`}>
              {getIcon(item.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700">
                <span className="font-semibold text-slate-900">{item.user}</span> {item.action}
              </p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-medium tracking-wider">{item.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </SidebarSection>
  );
}
