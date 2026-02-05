import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  FileText,
  Users, ShoppingCart,
  Settings,
  Package,
  ArrowRight,
  Gift,
  Percent,
  CornerDownLeft,
  Layers
} from 'lucide-react';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { logger } from "@/utils/logger";
import type { ModuleName, SearchRecord } from "@/data/mockSearchIndex";

// Re-export types for external use
export type { ModuleName, SearchRecord } from "@/data/mockSearchIndex";


// --- Helper Functions ---

const getModuleIcon = (module: ModuleName) => {
  switch (module) {
    case 'Products': return <Package size={14} className="text-blue-500" />;
    case 'Collections': return <Layers size={14} className="text-purple-500" />;
    case 'Orders': return <ShoppingCart size={14} className="text-emerald-500" />;
    case 'Customers': return <Users size={14} className="text-amber-500" />;
    case 'Blogs': return <FileText size={14} className="text-indigo-500" />;
    case 'Bundles': return <Package size={14} className="text-pink-500" />;
    case 'Discounts': return <Percent size={14} className="text-orange-500" />;
    case 'Gift Cards': return <Gift size={14} className="text-rose-500" />;
    case 'Settings': return <Settings size={14} className="text-slate-500" />;
    default: return <FileText size={14} className="text-slate-400" />;
  }
};

const getStatusColor = (status?: string) => {
  if (!status) return "bg-slate-100 text-slate-500";
  switch (status.toLowerCase()) {
    case 'published':
    case 'active':
    case 'completed':
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case 'draft':
    case 'processing':
      return "bg-slate-100 text-slate-600 border-slate-200";
    case 'inactive':
      return "bg-rose-50 text-rose-600 border-rose-100";
    default:
      return "bg-slate-100 text-slate-500 border-slate-200";
  }
};

// --- Component ---

interface GlobalSearchProps {
  searchIndex?: SearchRecord[];
  onNavigate?: (page: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export const GlobalSearch = ({
  searchIndex = [],
  onNavigate,
  placeholder = "Search...",

}: GlobalSearchProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All");
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard Shortcut (Cmd+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 10);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // --- Search Logic ---
  const results = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase().trim();

    return searchIndex.filter((record: SearchRecord) => {
      // 1. Module Scope Check
      if (activeTab !== "All" && record.module !== activeTab) return false;

      // 2. Content Match Check (Match ANY field)
      const searchableText = [
        record.title,
        record.subtitle,
        record.id,
        record.status,
        record.module,
        ...(record.tags || [])
      ].join(" ").toLowerCase();

      return searchableText.includes(query);
    });
  }, [searchQuery, activeTab, searchIndex]);

  // Group Results by Module
  const groupedResults = useMemo(() => {
    return results.reduce((acc, item) => {
      if (!acc[item.module]) acc[item.module] = [];
      acc[item.module].push(item);
      return acc;
    }, {} as Record<ModuleName, SearchRecord[]>);
  }, [results]);

  // Calculate Tab Counts
  const tabCounts = useMemo(() => {
    if (!searchQuery.trim()) return {};

    const allMatches = searchIndex.filter((record: SearchRecord) => {
      const query = searchQuery.toLowerCase().trim();
      const searchableText = [
        record.title, record.subtitle, record.id, record.status, record.module, ...(record.tags || [])
      ].join(" ").toLowerCase();
      return searchableText.includes(query);
    });

    const counts: Record<string, number> = { All: allMatches.length };
    allMatches.forEach((r: SearchRecord) => {
      counts[r.module] = (counts[r.module] || 0) + 1;
    });
    return counts;
  }, [searchQuery, searchIndex]);

  // Available Tabs
  const availableTabs = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const tabs = Object.keys(tabCounts).filter(k => k !== 'All' && tabCounts[k] > 0);
    return ['All', ...tabs];
  }, [tabCounts, searchQuery]);


  const handleSelect = (record: SearchRecord) => {
    setOpen(false);
    setSearchQuery("");
    logger.info("Navigating to:", { id: record.id, module: record.module });

    if (onNavigate) {
      if (record.module === 'Products') onNavigate('/products');
      else if (record.module === 'Collections') onNavigate('/collections');
      else if (record.module === 'Orders') onNavigate('/orders');
      else if (record.module === 'Customers') onNavigate('/customers');
      else if (record.module === 'Blogs') onNavigate('/blogs');
      else if (record.module === 'Bundles') onNavigate('/bundles');
      else if (record.module === 'Discounts') onNavigate('/discounts');
      else if (record.module === 'Gift Cards') onNavigate('/giftcards');
      else if (record.module === 'Settings') onNavigate('/settings');
      else onNavigate('/dashboard');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative group w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors pointer-events-none">
            <Search size={16} />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!open) setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            className="w-full h-[40px] bg-[#251550] rounded-lg pl-10 pr-12 text-sm text-white focus:outline-none focus:bg-[#2e1a5f] placeholder:text-gray-400 border border-transparent focus:border-[#7c6aa6] transition-all shadow-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-sans text-[10px] font-medium text-gray-400">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </PopoverAnchor>

      <PopoverContent
        className="p-0 w-[var(--radix-popover-trigger-width)] bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden mt-2"
        align="center"
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          if (inputRef.current && inputRef.current.contains(e.target as Node)) {
            e.preventDefault();
          }
        }}
      >
        <Command shouldFilter={false} className="bg-transparent flex flex-col w-full">

          {/* 1. Category Tabs */}
          {searchQuery && availableTabs.length > 0 && (
            <div className="flex items-center gap-1.5 p-2 border-b border-slate-100 overflow-x-auto bg-slate-50/50 shrink-0">
              {availableTabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all whitespace-nowrap border",
                    activeTab === tab
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                  )}
                >
                  {tab}
                  <span className={cn(
                    "text-[9px] px-1 py-0 rounded-sm min-w-[12px] text-center",
                    activeTab === tab ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  )}>
                    {tabCounts[tab]}
                  </span>
                </button>
              ))}
            </div>
          )}

          <CommandList className="flex-1 overflow-y-auto p-1 min-h-[100px] max-h-[500px]">

            {/* 2. Default State */}
            {!searchQuery && (
              <div className="py-4 px-2">
                <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Quick Actions</h4>
                <div className="grid grid-cols-1 gap-1">
                  <QuickLink
                    title="Add New Product"
                    icon={<Package size={14} />}
                    onClick={() => { setOpen(false); onNavigate?.('/products/add'); }}
                  />
                  <QuickLink
                    title="View All Orders"
                    icon={<ShoppingCart size={14} />}
                    onClick={() => { setOpen(false); onNavigate?.('/orders'); }}
                  />
                  <QuickLink
                    title="Manage Customers"
                    icon={<Users size={14} />}
                    onClick={() => { setOpen(false); onNavigate?.('/customers'); }}
                  />
                  <QuickLink
                    title="Create Discount"
                    icon={<Percent size={14} />}
                    onClick={() => { setOpen(false); onNavigate?.('/discounts/new'); }}
                  />
                  <QuickLink
                    title="System Settings"
                    icon={<Settings size={14} />}
                    onClick={() => { setOpen(false); onNavigate?.('/settings'); }}
                  />
                </div>
              </div>
            )}

            {/* 3. Empty State */}
            {searchQuery && results.length === 0 && (
              <div className="py-10 text-center px-4">
                <p className="text-slate-900 font-medium text-sm">No matches found</p>
                <p className="text-slate-500 text-xs mt-1">
                  Try searching for products, orders, or customers.
                </p>
              </div>
            )}

            {/* 4. Grouped Results */}
            {searchQuery && Object.entries(groupedResults).map(([module, records]) => (
              <CommandGroup key={module} heading={
                activeTab === 'All' ? (
                  <div className="flex items-center justify-between px-2 py-1.5 mt-2 mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{module}</span>
                  </div>
                ) : null
              } className={cn(activeTab !== 'All' && "[&_[cmdk-group-heading]]:hidden")}>
                {records.map(record => (
                  <CommandItem
                    key={record.id}
                    onSelect={() => handleSelect(record)}
                    className="relative flex items-center justify-between py-2.5 px-3 rounded-lg aria-selected:bg-slate-50 cursor-pointer group mb-0.5 border border-transparent aria-selected:border-slate-100 transition-all"
                  >
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                      {/* Icon */}
                      <div className="w-5 h-5 flex items-center justify-center shrink-0 text-slate-400">
                        {getModuleIcon(record.module)}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900 text-sm truncate">{record.title}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                          <span className="font-medium text-slate-600">{record.module}</span>

                          {record.status && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span>{record.status}</span>
                            </>
                          )}

                          {record.subtitle && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="truncate">{record.subtitle}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3 shrink-0 pl-2">
                      {record.status && (
                        <Badge variant="outline" className={cn(
                          "text-[10px] h-5 px-1.5 py-0 border font-medium rounded-full bg-opacity-50",
                          getStatusColor(record.status)
                        )}>
                          {record.status}
                        </Badge>
                      )}

                      <div className="opacity-0 group-aria-selected:opacity-100 transition-opacity flex items-center justify-center w-5 h-5 rounded bg-white border border-slate-200 shadow-sm">
                        <CornerDownLeft size={10} className="text-slate-400" />
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}

          </CommandList>

          {/* 5. Footer */}
          {searchQuery && results.length > 0 && (
            <div className="p-1 border-t border-slate-100 bg-slate-50/50 shrink-0">
              <button className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors">
                View all {results.length} results for "{searchQuery}"
                <ArrowRight size={12} />
              </button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// Quick Link Component
const QuickLink = ({ title, icon, onClick }: { title: string; icon: React.ReactNode; onClick?: () => void }) => (
  <div
    onClick={onClick}
    className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 hover:shadow-sm cursor-pointer transition-all group"
  >
    <div className="flex items-center gap-3">
      <div className="text-slate-400 group-hover:text-slate-600">{icon}</div>
      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{title}</span>
    </div>
  </div>
);
