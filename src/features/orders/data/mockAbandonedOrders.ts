import type { AbandonedOrder, EmailTemplate } from "../types/abandonedOrder.types";

export const MOCK_ABANDONED_ORDERS: AbandonedOrder[] = [
    {
        id: '1',
        cartId: 'CART-2024-001',
        customerName: 'Rajesh Kumar',
        email: 'rajesh.kumar@example.com',
        phone: '+91 98765 43210',
        products: [
            { id: '1', name: 'Cricket Bat Professional', quantity: 2, price: 5000 },
            { id: '2', name: 'Cricket Ball Leather', quantity: 6, price: 500 }
        ],
        cartValue: 13000,
        abandonedAt: '2024-02-15 14:30',
        lastActivity: '2 hours ago',
        recoveryStatus: 'not-contacted',
        channel: 'web'
    },
    {
        id: '2',
        cartId: 'CART-2024-002',
        customerName: 'Priya Sharma',
        email: 'priya.s@example.com',
        phone: '+91 87654 32109',
        products: [
            { id: '1', name: 'Treadmill Pro X1', quantity: 1, price: 75000 }
        ],
        cartValue: 75000,
        abandonedAt: '2024-02-15 10:15',
        lastActivity: '6 hours ago',
        recoveryStatus: 'email-sent',
        channel: 'app',
        emailSentAt: '2024-02-15 11:00'
    },
    {
        id: '3',
        cartId: 'CART-2024-003',
        customerName: 'Amit Patel',
        email: 'amit.patel@example.com',
        phone: '+91 76543 21098',
        products: [
            { id: '1', name: 'Football Size 5', quantity: 10, price: 800 },
            { id: '2', name: 'Football Boots', quantity: 5, price: 3500 }
        ],
        cartValue: 25500,
        abandonedAt: '2024-02-14 16:45',
        lastActivity: '1 day ago',
        recoveryStatus: 'recovered',
        channel: 'web'
    },
    {
        id: '4',
        cartId: 'CART-2024-004',
        customerName: 'Sneha Desai',
        email: 'sneha.d@example.com',
        phone: '+91 65432 10987',
        products: [
            { id: '1', name: 'Yoga Mat Premium', quantity: 20, price: 1200 },
            { id: '2', name: 'Dumbbells Set', quantity: 3, price: 4500 }
        ],
        cartValue: 37500,
        abandonedAt: '2024-02-15 09:00',
        lastActivity: '7 hours ago',
        recoveryStatus: 'not-contacted',
        channel: 'web'
    },
    {
        id: '5',
        cartId: 'CART-2024-005',
        customerName: 'Vikram Singh',
        email: 'vikram.singh@example.com',
        phone: '+91 54321 09876',
        products: [
            { id: '1', name: 'Tennis Racket Pro', quantity: 4, price: 6500 }
        ],
        cartValue: 26000,
        abandonedAt: '2024-02-15 12:20',
        lastActivity: '4 hours ago',
        recoveryStatus: 'email-sent',
        channel: 'app',
        emailSentAt: '2024-02-15 13:00'
    },
    {
        id: '6',
        cartId: 'CART-2024-006',
        customerName: 'Anita Reddy',
        email: 'anita.r@example.com',
        phone: '+91 43210 98765',
        products: [
            { id: '1', name: 'Swimming Goggles', quantity: 15, price: 600 },
            { id: '2', name: 'Swimming Cap', quantity: 15, price: 400 }
        ],
        cartValue: 15000,
        abandonedAt: '2024-02-14 14:30',
        lastActivity: '1 day ago',
        recoveryStatus: 'not-contacted',
        channel: 'web'
    },
    {
        id: '7',
        cartId: 'CART-2024-007',
        customerName: 'Rahul Mehta',
        email: 'rahul.m@example.com',
        phone: '+91 32109 87654',
        products: [
            { id: '1', name: 'Basketball Official', quantity: 8, price: 1500 },
            { id: '2', name: 'Basketball Jersey', quantity: 12, price: 800 }
        ],
        cartValue: 21600,
        abandonedAt: '2024-02-15 11:45',
        lastActivity: '5 hours ago',
        recoveryStatus: 'email-sent',
        channel: 'web',
        emailSentAt: '2024-02-15 12:15'
    },
    {
        id: '8',
        cartId: 'CART-2024-008',
        customerName: 'Meera Joshi',
        email: 'meera.j@example.com',
        phone: '+91 21098 76543',
        products: [
            { id: '1', name: 'Badminton Racket', quantity: 6, price: 3200 }
        ],
        cartValue: 19200,
        abandonedAt: '2024-02-15 08:15',
        lastActivity: '8 hours ago',
        recoveryStatus: 'not-contacted',
        channel: 'app'
    }
];

export const EMAIL_TEMPLATES: EmailTemplate[] = [
    {
        id: 'welcome-back',
        name: 'Welcome Back',
        subject: "You left something behind! Complete your purchase now",
        preview: "Hey {name}, we noticed you left some items in your cart. Don't miss out on these great products..."
    },
    {
        id: 'limited-stock',
        name: 'Limited Stock Alert',
        subject: "⚠️ Hurry! Items in your cart are running low",
        preview: "Hi {name}, the items you wanted are almost sold out. Complete your purchase before they're gone..."
    },
    {
        id: 'special-discount',
        name: 'Special Discount Offer',
        subject: "🎉 Exclusive 10% OFF on your cart",
        preview: "Hello {name}, we're offering you a special discount to complete your purchase today..."
    },
    {
        id: 'last-chance',
        name: 'Last Chance Reminder',
        subject: "Last chance to grab your items!",
        preview: "Hi {name}, your cart will expire soon. Complete your order now to secure these items..."
    }
];
