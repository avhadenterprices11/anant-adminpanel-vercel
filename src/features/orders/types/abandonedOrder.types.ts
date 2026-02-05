export interface AbandonedOrderProduct {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export type RecoveryStatus = 'not-contacted' | 'email-sent' | 'recovered';

export interface AbandonedOrder {
    id: string;
    cartId: string;
    customerName: string;
    email: string;
    phone: string;
    products: AbandonedOrderProduct[];
    cartValue: number;
    abandonedAt: string;
    lastActivity: string;
    recoveryStatus: RecoveryStatus;
    channel: 'web' | 'app';
    emailSentAt?: string;
}

export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    preview?: string;
}
