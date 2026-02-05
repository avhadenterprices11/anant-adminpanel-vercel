import React from "react";
import {
    ChevronRight,
    Settings,
    Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/*
// Settings sections data - COMMENTED OUT FOR COMING SOON
const settingsSections = [
    {
        id: "store-details",
        title: "Store / Company Details",
        description: "Manage your business profile and address",
        icon: Store,
        link: "/settings/store",
    },
    {
        id: "plan",
        title: "Plan",
        description: "View your current subscription and plan",
        icon: LayoutGrid,
        link: "/settings/plan",
    },
    {
        id: "billing",
        title: "Billing",
        description: "Manage billing information and invoices",
        icon: FileText,
        link: "/settings/billing",
    },
    {
        id: "users",
        title: "Users & Permissions",
        description: "Manage team members and access roles",
        icon: User,
        link: "/settings/roles",
    },
    {
        id: "payments",
        title: "Payments",
        description: "Configure payment providers and methods",
        icon: CreditCard,
        link: "/settings/payments",
    },
    {
        id: "checkout",
        title: "Checkout",
        description: "Customize your checkout experience",
        icon: Box,
        link: "/settings/checkout",
    },
    {
        id: "shipping",
        title: "Shipping & Delivery",
        description: "Manage shipping rates and delivery zones",
        icon: Truck,
        link: "/settings/shipping",
    },
    {
        id: "taxes",
        title: "Taxes & Duties",
        description: "Configure tax rates and duty calculations",
        icon: FileText,
        link: "/settings/taxes",
    },
    {
        id: "markets",
        title: "Markets",
        description: "Manage international markets and currency",
        icon: Globe,
        link: "/settings/markets",
    },
    {
        id: "languages",
        title: "Languages",
        description: "Configure supported languages for your store",
        icon: Languages,
        link: "/settings/languages",
    },
    {
        id: "locations",
        title: "Locations / Warehouses",
        description: "Manage inventory locations and warehouses",
        icon: MapPin,
        link: "/settings/locations",
    },
    {
        id: "notifications",
        title: "Notifications",
        description: "Configure email and SMS notifications",
        icon: Bell,
        link: "/settings/notifications",
    },
    {
        id: "files",
        title: "Files",
        description: "Manage uploaded files and media assets",
        icon: File,
        link: "/settings/files",
    },
    {
        id: "policies",
        title: "Policies",
        description: "Manage store policies and legal documents",
        icon: Shield,
        link: "/settings/policies",
    },
    {
        id: "metafields",
        title: "Metafields / Custom Data",
        description: "Manage custom fields and data structures",
        icon: Database,
        link: "/settings/metafields",
    },
    {
        id: "apps",
        title: "App-specific Settings",
        description: "Configure settings for installed apps",
        icon: Puzzle,
        link: "/settings/apps",
    },
];
*/

const SettingsOverviewPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200 shadow-sm px-4 sm:px-6 lg:px-8 py-4">
                <div className="space-y-4">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            Dashboard
                        </button>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 font-medium">Settings</span>
                    </div>

                    {/* Page Header */}
                    <div className="flex items-start gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-full hover:bg-slate-100 transition-colors border border-slate-200"
                        >
                            <ChevronRight size={20} className="text-slate-600 rotate-180" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                            <p className="text-sm text-slate-600">Manage your organization preferences and configurations</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coming Soon Section */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                    <Settings size={40} className="animate-spin" style={{ animationDuration: '8s' }} />
                </div>
                <div className="flex items-center justify-center gap-2 text-amber-600 mb-2">
                    <Clock size={20} />
                    <span className="text-lg font-semibold">Coming Soon</span>
                </div>
                <p className="text-sm text-slate-500 text-center max-w-sm">
                    We're working hard to bring you powerful settings and customization options. Stay tuned!
                </p>
            </div>
        </div>
    );
};

export default SettingsOverviewPage;

