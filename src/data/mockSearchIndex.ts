// Mock data for GlobalSearch component
// This file contains sample search records for development/testing purposes

export type ModuleName =
    | 'Products'
    | 'Collections'
    | 'Orders'
    | 'Customers'
    | 'Blogs'
    | 'Bundles'
    | 'Discounts'
    | 'Gift Cards'
    | 'Settings';

export interface SearchRecord {
    id: string;
    module: ModuleName;
    title: string;
    subtitle?: string;
    status?: string;
    path: string[];
    tags?: string[];
}

export const mockSearchIndex: SearchRecord[] = [
    // Products
    {
        id: "PRD-001",
        module: "Products",
        title: "Premium Cotton T-Shirt",
        subtitle: "Apparel • $29.99",
        status: "Active",
        path: ["Products", "Active"],
        tags: ["tshirt", "cotton", "apparel", "clothing"]
    },
    {
        id: "PRD-002",
        module: "Products",
        title: "Wireless Headphones",
        subtitle: "Electronics • $149.99",
        status: "Draft",
        path: ["Products", "Draft"],
        tags: ["headphones", "audio", "electronics"]
    },
    {
        id: "PRD-003",
        module: "Products",
        title: "Leather Wallet",
        subtitle: "Accessories • $49.99",
        status: "Active",
        path: ["Products", "Active"],
        tags: ["wallet", "leather", "accessories"]
    },
    {
        id: "PRD-004",
        module: "Products",
        title: "Running Shoes",
        subtitle: "Footwear • $89.99",
        status: "Active",
        path: ["Products", "Active"],
        tags: ["shoes", "running", "sports", "footwear"]
    },
    {
        id: "PRD-005",
        module: "Products",
        title: "Smart Watch",
        subtitle: "Electronics • $299.99",
        status: "Active",
        path: ["Products", "Active"],
        tags: ["watch", "smart", "wearable", "electronics"]
    },

    // Collections
    {
        id: "COL-001",
        module: "Collections",
        title: "Summer Collection 2024",
        subtitle: "25 products",
        status: "Published",
        path: ["Collections", "Active"],
        tags: ["summer", "seasonal", "2024"]
    },
    {
        id: "COL-002",
        module: "Collections",
        title: "Winter Sale",
        subtitle: "18 products",
        status: "Published",
        path: ["Collections", "Active"],
        tags: ["winter", "sale", "discount"]
    },
    {
        id: "COL-003",
        module: "Collections",
        title: "New Arrivals",
        subtitle: "32 products",
        status: "Published",
        path: ["Collections", "Active"],
        tags: ["new", "arrivals", "latest"]
    },

    // Orders
    {
        id: "ORD-1001",
        module: "Orders",
        title: "Order #1001",
        subtitle: "John Doe • $299.99",
        status: "Completed",
        path: ["Orders", "Completed"],
        tags: ["john", "doe", "completed"]
    },
    {
        id: "ORD-1002",
        module: "Orders",
        title: "Order #1002",
        subtitle: "Jane Smith • $149.50",
        status: "Processing",
        path: ["Orders", "Processing"],
        tags: ["jane", "smith", "processing"]
    },
    {
        id: "ORD-1003",
        module: "Orders",
        title: "Order #1003",
        subtitle: "Mike Johnson • $89.99",
        status: "Shipped",
        path: ["Orders", "Shipped"],
        tags: ["mike", "johnson", "shipped"]
    },
    {
        id: "ORD-1004",
        module: "Orders",
        title: "Order #1004",
        subtitle: "Sarah Williams • $199.99",
        status: "Pending",
        path: ["Orders", "Pending"],
        tags: ["sarah", "williams", "pending"]
    },

    // Customers
    {
        id: "CUS-892",
        module: "Customers",
        title: "Sarah Jenkins",
        subtitle: "sarah.jenkins@email.com",
        status: "Active",
        path: ["Customers", "All"],
        tags: ["jenkins", "sarah", "customer"]
    },
    {
        id: "CUS-901",
        module: "Customers",
        title: "Michael Ross",
        subtitle: "michael.ross@email.com",
        status: "Active",
        path: ["Customers", "All"],
        tags: ["ross", "michael", "customer"]
    },
    {
        id: "CUS-902",
        module: "Customers",
        title: "Emily Davis",
        subtitle: "emily.davis@email.com",
        status: "Active",
        path: ["Customers", "All"],
        tags: ["davis", "emily", "customer"]
    },
    {
        id: "CUS-903",
        module: "Customers",
        title: "David Brown",
        subtitle: "david.brown@email.com",
        status: "Inactive",
        path: ["Customers", "All"],
        tags: ["brown", "david", "customer"]
    },

    // Blogs
    {
        id: "BLG-001",
        module: "Blogs",
        title: "10 Tips for Better Product Photography",
        subtitle: "Published on Dec 15",
        status: "Published",
        path: ["Blogs", "Published"],
        tags: ["photography", "tips", "products"]
    },
    {
        id: "BLG-002",
        module: "Blogs",
        title: "How to Choose the Perfect Gift",
        subtitle: "Draft",
        status: "Draft",
        path: ["Blogs", "Draft"],
        tags: ["gift", "guide", "shopping"]
    },
    {
        id: "BLG-003",
        module: "Blogs",
        title: "Summer Fashion Trends 2024",
        subtitle: "Published on Dec 20",
        status: "Published",
        path: ["Blogs", "Published"],
        tags: ["fashion", "trends", "summer"]
    },

    // Bundles
    {
        id: "BND-001",
        module: "Bundles",
        title: "Starter Pack Bundle",
        subtitle: "3 products • $79.99",
        status: "Active",
        path: ["Bundles", "Active"],
        tags: ["starter", "pack", "bundle"]
    },
    {
        id: "BND-002",
        module: "Bundles",
        title: "Premium Bundle",
        subtitle: "5 products • $199.99",
        status: "Active",
        path: ["Bundles", "Active"],
        tags: ["premium", "bundle", "value"]
    },

    // Discounts
    {
        id: "DSC-001",
        module: "Discounts",
        title: "SUMMER20 - 20% Off",
        subtitle: "Valid until Aug 31",
        status: "Active",
        path: ["Discounts", "Active"],
        tags: ["summer", "discount", "percentage"]
    },
    {
        id: "DSC-002",
        module: "Discounts",
        title: "WELCOME10 - $10 Off First Order",
        subtitle: "Valid until Dec 31",
        status: "Active",
        path: ["Discounts", "Active"],
        tags: ["welcome", "new", "customer", "discount"]
    },
    {
        id: "DSC-003",
        module: "Discounts",
        title: "FREESHIP - Free Shipping",
        subtitle: "Orders over $50",
        status: "Active",
        path: ["Discounts", "Active"],
        tags: ["shipping", "free", "delivery"]
    },

    // Gift Cards
    {
        id: "GFT-001",
        module: "Gift Cards",
        title: "$50 Gift Card",
        subtitle: "100 available",
        status: "Active",
        path: ["Gift Cards", "Active"],
        tags: ["gift", "card", "50"]
    },
    {
        id: "GFT-002",
        module: "Gift Cards",
        title: "$100 Gift Card",
        subtitle: "50 available",
        status: "Active",
        path: ["Gift Cards", "Active"],
        tags: ["gift", "card", "100"]
    },
    {
        id: "GFT-003",
        module: "Gift Cards",
        title: "$25 Gift Card",
        subtitle: "200 available",
        status: "Active",
        path: ["Gift Cards", "Active"],
        tags: ["gift", "card", "25"]
    },

    // Settings
    {
        id: "SET-STR",
        module: "Settings",
        title: "Store Details",
        subtitle: "Business Information",
        path: ["Settings", "Store"],
        tags: ["store", "business", "details"]
    },
    {
        id: "SET-PAY",
        module: "Settings",
        title: "Payment Settings",
        subtitle: "Payment Providers",
        path: ["Settings", "Payments"],
        tags: ["payment", "gateway", "providers"]
    },
    {
        id: "SET-SHP",
        module: "Settings",
        title: "Shipping Settings",
        subtitle: "Delivery Options",
        path: ["Settings", "Shipping"],
        tags: ["shipping", "delivery", "logistics"]
    },
    {
        id: "SET-TAX",
        module: "Settings",
        title: "Tax Configuration",
        subtitle: "Tax Rates & Rules",
        path: ["Settings", "Taxes"],
        tags: ["tax", "vat", "rates"]
    },
    {
        id: "SET-USR",
        module: "Settings",
        title: "Users & Permissions",
        subtitle: "Team Management",
        path: ["Settings", "Users"],
        tags: ["users", "team", "permissions", "roles"]
    }
];
