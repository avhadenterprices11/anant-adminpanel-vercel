export interface DraftOrderItem {
    id: string;
    name: string;
    quantity: number;
}

export interface DraftOrder {
    orderNumber: string;
    orderDate: string;
    paymentStatus: 'Pending' | 'Awaiting' | 'Unpaid';
    items: DraftOrderItem[];
    channel: string;
}
