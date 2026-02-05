import {
    Home,
    ShoppingCart,
    Package,
    Users,
    BookOpen,
    Tag,
    Layers,
    Warehouse,
    UserPlus
} from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import type { NavItemList } from "./navigation.types";

/**
 * Navigation Configuration
 * 
 * Defines navigation menu items by adding metadata (icons, labels, permissions)
 * to route constants. This eliminates duplication between routes and menu.
 * 
 * Benefits:
 * - Single source of truth (ROUTES)
 * - Menu just adds display metadata
 * - Type-safe with route constants
 * - Easy to keep in sync
 * 
 * @example
 * import { NAV_ITEMS } from '@/lib/config';
 * 
 * To add a new menu item:
 * 1. Ensure route exists in lib/constants/routes.ts
 * 2. Import the icon from lucide-react
 * 3. Add navigation metadata below
 */

export const NAV_ITEMS: NavItemList = [
    {
        id: "dashboard",
        label: "Home",
        icon: Home,
        path: ROUTES.DASHBOARD,
    },
    {
        id: "customers",
        label: "Customers",
        icon: Users,
        path: ROUTES.CUSTOMERS.LIST,
        // rolesAllowed: ["SUPER_ADMIN"],
    },
    // {
    //     id: "customer-segments",
    //     label: "Customer Segments",
    //     icon: Target,
    //     path: ROUTES.CUSTOMER_SEGMENTS.LIST,
    // },
    // {
    //     id: "access-management",
    //     label: "Access Management",
    //     icon: Users,
    //     path: ROUTES.ACCESS_MANAGEMENT.LIST,
    //     submenu: [
    //         {
    //             id: "access-roles",
    //             label: "Roles Management",
    //             path: ROUTES.ACCESS_MANAGEMENT.ROLES,
    //         },
    //         {
    //             id: "access-permissions",
    //             label: "Permission Catalogue",
    //             path: ROUTES.ACCESS_MANAGEMENT.PERMISSIONS,
    //         },
    //     ],
    // },
    {
        id: "products",
        label: "Products",
        icon: Package,
        path: ROUTES.PRODUCTS.LIST,
        // permissionsAllowed: ["products.view"],
    },
    {
        id: "inventory",
        label: "Inventory",
        icon: Warehouse,
        path: ROUTES.INVENTORY.LIST,
    },
    // {
    //     id: "bundles",
    //     label: "Bundles",
    //     icon: Boxes,
    //     path: ROUTES.BUNDLES.LIST,
    // },
    // {
    //     id: "collections",
    //     label: "Collections",
    //     icon: FolderOpen,
    //     path: ROUTES.COLLECTIONS.LIST,
    // },
    // {
    //     id: "catalogs",
    //     label: "Catalogs",
    //     icon: Library,
    //     path: ROUTES.CATALOGS.LIST,
    // },
    {
        id: "tiers",
        label: "Tiers",
        icon: Layers,
        path: ROUTES.TIERS.LIST,
    },
    {
        id: "tags",
        label: "Tags",
        icon: Tag,
        path: "/tags",
    },
    // {
    //     id: "conversations",
    //     label: "All Conversations",
    //     icon: MessageSquare,
    //     path: ROUTES.CHATS.LIST,
    // },
    {
        id: "orders",
        label: "Orders",
        icon: ShoppingCart,
        path: ROUTES.ORDERS.LIST,
        //rolesAllowed: ["ADMIN", "SUPER_ADMIN"],
        // permissionsAllowed: ["orders.view"],
        submenu: [
            {
                id: "orders-draft",
                label: "Draft Orders",
                path: ROUTES.ORDERS.DRAFT
            },
            /* {
                 id: "orders-abandoned-cart",
                 label: "Abandoned Cart",
                 path: ROUTES.ORDERS.ABANDONED_CART
             },*/
        ],
    },
    {
        id: "blogs",
        label: "Blogs",
        icon: BookOpen,
        path: ROUTES.BLOGS.LIST,
    },
    {
        id: "invitations",
        label: "Invitations",
        icon: UserPlus,
        path: "/invitations",
        // rolesAllowed: ["SUPER_ADMIN", "ADMIN"],
    },
    // {
    //     id: "discounts",
    //     label: "Discounts",
    //     icon: Tag,
    //     path: ROUTES.DISCOUNTS.LIST,
    // },
    // {
    //     id: "giftcards",
    //     label: "Gift Cards",
    //     icon: Gift,
    //     path: ROUTES.GIFTCARDS.LIST,
    // },
];
