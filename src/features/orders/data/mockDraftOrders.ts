import type { DraftOrder } from "../types/draftOrder.types";

export const MOCK_DRAFT_ORDERS: DraftOrder[] = [
    {
        orderNumber: 'SS-DRF-2024-001',
        orderDate: '2024-02-10',
        paymentStatus: 'Pending',
        items: [
            { id: '1', name: 'Cricket Bat Professional', quantity: 5 },
            { id: '2', name: 'Cricket Ball Leather', quantity: 20 }
        ],
        channel: 'Online Store'
    },
    {
        orderNumber: 'SS-DRF-2024-002',
        orderDate: '2024-02-11',
        paymentStatus: 'Awaiting',
        items: [
            { id: '1', name: 'Treadmill Pro X1', quantity: 1 },
            { id: '2', name: 'Dumbbell Set', quantity: 2 },
            { id: '3', name: 'Yoga Mat Premium', quantity: 10 }
        ],
        channel: 'Mobile App'
    },
    {
        orderNumber: 'SS-DRF-2024-003',
        orderDate: '2024-02-11',
        paymentStatus: 'Unpaid',
        items: [
            { id: '1', name: 'Football Size 5', quantity: 15 },
            { id: '2', name: 'Football Boots', quantity: 12 }
        ],
        channel: 'Online Store'
    },
    {
        orderNumber: 'SS-DRF-2024-004',
        orderDate: '2024-02-12',
        paymentStatus: 'Pending',
        items: [
            { id: '1', name: 'Swimming Goggles', quantity: 25 },
            { id: '2', name: 'Swimming Cap', quantity: 25 },
            { id: '3', name: 'Swimming Fins', quantity: 20 }
        ],
        channel: 'Phone'
    },
    {
        orderNumber: 'SS-DRF-2024-005',
        orderDate: '2024-02-12',
        paymentStatus: 'Awaiting',
        items: [
            { id: '1', name: 'Tennis Racket Pro', quantity: 8 }
        ],
        channel: 'Online Store'
    },
    {
        orderNumber: 'SS-DRF-2024-006',
        orderDate: '2024-02-13',
        paymentStatus: 'Pending',
        items: [
            { id: '1', name: 'Basketball Official', quantity: 20 },
            { id: '2', name: 'Basketball Shoes', quantity: 15 },
            { id: '3', name: 'Basketball Hoop', quantity: 2 }
        ],
        channel: 'Mobile App'
    },
    {
        orderNumber: 'SS-DRF-2024-007',
        orderDate: '2024-02-13',
        paymentStatus: 'Unpaid',
        items: [
            { id: '1', name: 'Badminton Racket Elite', quantity: 10 },
            { id: '2', name: 'Shuttlecock Professional', quantity: 50 }
        ],
        channel: 'Online Store'
    },
    {
        orderNumber: 'SS-DRF-2024-008',
        orderDate: '2024-02-14',
        paymentStatus: 'Pending',
        items: [
            { id: '1', name: 'Running Shoes', quantity: 25 },
            { id: '2', name: 'Running Shorts', quantity: 25 },
            { id: '3', name: 'Hydration Belt', quantity: 15 },
            { id: '4', name: 'Sports Watch', quantity: 10 }
        ],
        channel: 'Phone'
    },
    {
        orderNumber: 'SS-DRF-2024-009',
        orderDate: '2024-02-14',
        paymentStatus: 'Awaiting',
        items: [
            { id: '1', name: 'Mountain Bike Pro', quantity: 3 },
            { id: '2', name: 'Cycling Helmet', quantity: 8 }
        ],
        channel: 'Online Store'
    },
    {
        orderNumber: 'SS-DRF-2024-010',
        orderDate: '2024-02-15',
        paymentStatus: 'Pending',
        items: [
            { id: '1', name: 'Gym Equipment Set', quantity: 5 }
        ],
        channel: 'Mobile App'
    },
    {
        orderNumber: 'SS-DRF-2024-011',
        orderDate: '2024-02-15',
        paymentStatus: 'Unpaid',
        items: [
            { id: '1', name: 'Boxing Gloves', quantity: 20 },
            { id: '2', name: 'Punching Bag', quantity: 5 }
        ],
        channel: 'Online Store'
    },
    {
        orderNumber: 'SS-DRF-2024-012',
        orderDate: '2024-02-16',
        paymentStatus: 'Awaiting',
        items: [
            { id: '1', name: 'Table Tennis Set', quantity: 8 },
            { id: '2', name: 'Table Tennis Balls', quantity: 100 }
        ],
        channel: 'Phone'
    }
];
