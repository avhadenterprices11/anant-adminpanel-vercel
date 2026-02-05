/**
 * Order Status Helpers - Validation and Transition Rules
 * 
 * Provides validation functions for order, payment, and fulfillment status transitions.
 * These rules enforce business logic and prevent invalid state changes.
 */

// ============================================
// ORDER STATUS CONFIGURATION
// ============================================

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'returned';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed' | 'partially_refunded';
export type FulfillmentStatus = 'unfulfilled' | 'partial' | 'fulfilled' | 'returned' | 'cancelled';

/**
 * Valid order status transitions mirroring backend logic
 */
export const VALID_ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['processing', 'cancelled'],
    'processing': ['shipped', 'cancelled'],
    'shipped': ['delivered', 'returned'],
    'delivered': ['refunded'],
    'cancelled': ['refunded'],
    'refunded': [],
    'returned': ['refunded']
};

/**
 * Valid payment status transitions
 */
export const VALID_PAYMENT_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
    'pending': ['paid', 'failed'],
    'paid': ['refunded', 'partially_refunded'],
    'failed': ['pending', 'paid'],
    'refunded': [],
    'partially_refunded': ['refunded']
};

/**
 * Valid fulfillment status transitions
 */
export const VALID_FULFILLMENT_TRANSITIONS: Record<FulfillmentStatus, FulfillmentStatus[]> = {
    'unfulfilled': ['partial', 'fulfilled', 'cancelled'],
    'partial': ['fulfilled', 'cancelled'],
    'fulfilled': ['returned'],
    'returned': [],
    'cancelled': []
};

/**
 * Order lifecycle steps for timeline visualization
 */
export const ORDER_LIFECYCLE_STEPS = [
    { value: 'pending', label: 'Pending', icon: 'clock' },
    { value: 'confirmed', label: 'Confirmed', icon: 'check' },
    { value: 'processing', label: 'Processing', icon: 'package' },
    { value: 'shipped', label: 'Shipped', icon: 'truck' },
    { value: 'delivered', label: 'Delivered', icon: 'check-circle' }
] as const;

// ============================================
// VALIDATION FUNCTIONS
// ============================================

export interface TransitionValidation {
    isValid: boolean;
    errorMessage?: string;
    allowedTransitions: string[];
}

/**
 * Check if an order status transition is allowed
 */
export function canTransitionOrder(currentStatus: string, targetStatus: string): boolean {
    if (!currentStatus) return true;
    const allowed = VALID_ORDER_TRANSITIONS[currentStatus.toLowerCase() as OrderStatus] || [];
    return allowed.includes(targetStatus.toLowerCase() as OrderStatus);
}

/**
 * Validate order status transition with detailed feedback
 */
export function validateOrderTransition(currentStatus: string, targetStatus: string): TransitionValidation {
    const current = currentStatus.toLowerCase() as OrderStatus;
    const target = targetStatus.toLowerCase() as OrderStatus;
    const allowed = VALID_ORDER_TRANSITIONS[current] || [];

    if (current === target) {
        return { isValid: false, errorMessage: 'Status is already ' + getStatusLabel(current), allowedTransitions: allowed };
    }

    if (allowed.includes(target)) {
        return { isValid: true, allowedTransitions: allowed };
    }

    return {
        isValid: false,
        errorMessage: `Cannot change status from "${getStatusLabel(current)}" to "${getStatusLabel(target)}". Allowed: ${allowed.map(s => getStatusLabel(s)).join(', ') || 'None (Terminal State)'}`,
        allowedTransitions: allowed
    };
}

/**
 * Check if a payment status transition is allowed
 */
export function canTransitionPayment(currentStatus: string, targetStatus: string): boolean {
    if (!currentStatus) return true;
    const allowed = VALID_PAYMENT_TRANSITIONS[currentStatus.toLowerCase() as PaymentStatus] || [];
    return allowed.includes(targetStatus.toLowerCase() as PaymentStatus);
}

/**
 * Validate payment status transition with detailed feedback
 */
export function validatePaymentTransition(currentStatus: string, targetStatus: string): TransitionValidation {
    const current = currentStatus.toLowerCase() as PaymentStatus;
    const target = targetStatus.toLowerCase() as PaymentStatus;
    const allowed = VALID_PAYMENT_TRANSITIONS[current] || [];

    if (current === target) {
        return { isValid: false, errorMessage: 'Payment status is already ' + getPaymentLabel(current), allowedTransitions: allowed };
    }

    // Special rule: Cannot refund if not paid
    if (target === 'refunded' && current !== 'paid' && current !== 'partially_refunded') {
        return {
            isValid: false,
            errorMessage: 'Cannot refund an order that was never paid',
            allowedTransitions: allowed
        };
    }

    if (allowed.includes(target)) {
        return { isValid: true, allowedTransitions: allowed };
    }

    return {
        isValid: false,
        errorMessage: `Cannot change payment from "${getPaymentLabel(current)}" to "${getPaymentLabel(target)}". Allowed: ${allowed.map(s => getPaymentLabel(s)).join(', ') || 'None'}`,
        allowedTransitions: allowed
    };
}

/**
 * Check if a fulfillment status transition is allowed
 */
export function canTransitionFulfillment(currentStatus: string, targetStatus: string): boolean {
    if (!currentStatus) return true;
    const allowed = VALID_FULFILLMENT_TRANSITIONS[currentStatus.toLowerCase() as FulfillmentStatus] || [];
    return allowed.includes(targetStatus.toLowerCase() as FulfillmentStatus);
}

/**
 * Validate fulfillment status transition with detailed feedback
 */
export function validateFulfillmentTransition(currentStatus: string, targetStatus: string): TransitionValidation {
    const current = currentStatus.toLowerCase() as FulfillmentStatus;
    const target = targetStatus.toLowerCase() as FulfillmentStatus;
    const allowed = VALID_FULFILLMENT_TRANSITIONS[current] || [];

    if (current === target) {
        return { isValid: false, errorMessage: 'Fulfillment status is already ' + getFulfillmentLabel(current), allowedTransitions: allowed };
    }

    // Special rule: Cannot return if never fulfilled
    if (target === 'returned' && current === 'unfulfilled') {
        return {
            isValid: false,
            errorMessage: 'Cannot return an order that was never fulfilled',
            allowedTransitions: allowed
        };
    }

    if (allowed.includes(target)) {
        return { isValid: true, allowedTransitions: allowed };
    }

    return {
        isValid: false,
        errorMessage: `Cannot change fulfillment from "${getFulfillmentLabel(current)}" to "${getFulfillmentLabel(target)}". Allowed: ${allowed.map(s => getFulfillmentLabel(s)).join(', ') || 'None'}`,
        allowedTransitions: allowed
    };
}

// ============================================
// INTERDEPENDENCY WARNINGS
// ============================================

export interface StatusWarning {
    type: 'warning' | 'info' | 'error';
    message: string;
    affectedStatus: 'order' | 'payment' | 'fulfillment';
}

/**
 * Get warnings for conflicting or noteworthy status combinations
 */
export function getStatusWarnings(
    orderStatus: string,
    paymentStatus: string,
    fulfillmentStatus: string
): StatusWarning[] {
    const warnings: StatusWarning[] = [];
    const os = orderStatus?.toLowerCase();
    const ps = paymentStatus?.toLowerCase();
    const fs = fulfillmentStatus?.toLowerCase();

    // Shipped but payment pending - concerning
    if (os === 'shipped' && ps === 'pending') {
        warnings.push({
            type: 'warning',
            message: 'Order shipped but payment is still pending',
            affectedStatus: 'payment'
        });
    }

    // Delivered but not fulfilled (data inconsistency)
    if (os === 'delivered' && fs !== 'fulfilled') {
        warnings.push({
            type: 'error',
            message: 'Order delivered but fulfillment status is not marked as fulfilled',
            affectedStatus: 'fulfillment'
        });
    }

    // Cancelled but payment was made
    if (os === 'cancelled' && ps === 'paid') {
        warnings.push({
            type: 'warning',
            message: 'Order cancelled but payment was received - consider processing a refund',
            affectedStatus: 'payment'
        });
    }

    // Processing but not paid (COD is okay, but flagging)
    if (os === 'processing' && ps === 'pending') {
        warnings.push({
            type: 'info',
            message: 'Order is being processed with pending payment (COD or awaiting confirmation)',
            affectedStatus: 'payment'
        });
    }

    // Refunded but order not cancelled
    if (ps === 'refunded' && !['cancelled', 'returned', 'refunded'].includes(os)) {
        warnings.push({
            type: 'warning',
            message: 'Payment refunded but order status should be updated accordingly',
            affectedStatus: 'order'
        });
    }

    // Fulfilled but order still pending
    if (fs === 'fulfilled' && os === 'pending') {
        warnings.push({
            type: 'error',
            message: 'Fulfillment complete but order is still pending - update order status',
            affectedStatus: 'order'
        });
    }

    return warnings;
}

/**
 * Check if shipping requires tracking number
 */
export function requiresTracking(targetOrderStatus: string, currentTrackingNumber?: string): boolean {
    return targetOrderStatus.toLowerCase() === 'shipped' && !currentTrackingNumber;
}

/**
 * Get the current step in the order lifecycle (0-indexed)
 */
export function getOrderLifecycleStep(orderStatus: string): number {
    const os = orderStatus?.toLowerCase();

    // Map terminal/alternate states to their equivalent position
    if (os === 'cancelled' || os === 'refunded') return -1; // Not in normal flow
    if (os === 'returned') return 4; // After delivered conceptually

    const stepIndex = ORDER_LIFECYCLE_STEPS.findIndex(s => s.value === os);
    return stepIndex >= 0 ? stepIndex : 0;
}

/**
 * Check if order is in a terminal state (cannot proceed forward)
 */
export function isTerminalState(orderStatus: string): boolean {
    const os = orderStatus?.toLowerCase() as OrderStatus;
    const transitions = VALID_ORDER_TRANSITIONS[os] || [];
    return transitions.length === 0 || os === 'cancelled';
}

// ============================================
// LABEL FUNCTIONS
// ============================================

/**
 * Get human readable description for order status
 */
export function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'processing': 'Processing',
        'shipped': 'Shipped',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled',
        'refunded': 'Refunded',
        'returned': 'Returned'
    };
    return labels[status?.toLowerCase()] || status;
}

/**
 * Get human readable description for payment status
 */
export function getPaymentLabel(status: string): string {
    const labels: Record<string, string> = {
        'pending': 'Pending',
        'paid': 'Paid',
        'refunded': 'Refunded',
        'failed': 'Failed',
        'partially_refunded': 'Partially Refunded'
    };
    return labels[status?.toLowerCase()] || status;
}

/**
 * Get human readable description for fulfillment status
 */
export function getFulfillmentLabel(status: string): string {
    const labels: Record<string, string> = {
        'unfulfilled': 'Unfulfilled',
        'partial': 'Partial',
        'fulfilled': 'Fulfilled',
        'returned': 'Returned',
        'cancelled': 'Cancelled'
    };
    return labels[status?.toLowerCase()] || status;
}

// ============================================
// STYLING FUNCTIONS
// ============================================

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";

/**
 * Get color/variant for order status badge
 */
export function getStatusColor(status: string): BadgeVariant {
    switch (status?.toLowerCase()) {
        case 'pending': return 'warning';
        case 'confirmed': return 'info';
        case 'processing': return 'info';
        case 'shipped': return 'secondary';
        case 'delivered': return 'success';
        case 'cancelled': return 'destructive';
        case 'refunded': return 'outline';
        case 'returned': return 'warning';
        default: return 'default';
    }
}

/**
 * Get color/variant for payment status badge
 */
export function getPaymentColor(status: string): BadgeVariant {
    switch (status?.toLowerCase()) {
        case 'pending': return 'warning';
        case 'paid': return 'success';
        case 'refunded': return 'destructive';
        case 'failed': return 'destructive';
        case 'partially_refunded': return 'warning';
        default: return 'default';
    }
}

/**
 * Get color/variant for fulfillment status badge
 */
export function getFulfillmentColor(status: string): BadgeVariant {
    switch (status?.toLowerCase()) {
        case 'unfulfilled': return 'warning';
        case 'partial': return 'info';
        case 'fulfilled': return 'success';
        case 'returned': return 'destructive';
        case 'cancelled': return 'destructive';
        default: return 'default';
    }
}

/**
 * Get icon name for order status
 */
export function getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
        'pending': 'clock',
        'confirmed': 'check-circle',
        'processing': 'package',
        'shipped': 'truck',
        'delivered': 'check-circle-2',
        'cancelled': 'x-circle',
        'refunded': 'rotate-ccw',
        'returned': 'undo-2'
    };
    return icons[status?.toLowerCase()] || 'circle';
}
