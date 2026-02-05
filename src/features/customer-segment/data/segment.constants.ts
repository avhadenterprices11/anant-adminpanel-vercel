export const fieldOptions = [
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'tags', label: 'Tags' },
    { value: 'total_orders', label: 'Total Orders' },
    { value: 'total_spent', label: 'Total Spent' },
    { value: 'last_order_date', label: 'Last Order Date' },
    { value: 'account_status', label: 'Account Status' },
];

export const rulePresets = [
    { value: 'none', label: 'None - Start from scratch' },
    { value: 'high-value', label: 'High-Value Customers (Total Spent > ₹50,000)' },
    { value: 'inactive', label: 'Inactive Customers (Last Order > 90 days)' },
    { value: 'vip', label: 'VIP Customers (Total Spent > ₹100,000)' },
    { value: 'new', label: 'New Customers (Total Orders < 5)' },
];

export const getConditionOptions = (field: string) => {
    if (!field) return [];

    if (['name', 'email', 'phone', 'tags'].includes(field)) {
        return [
            { value: 'equals', label: 'is equal to' },
            { value: 'not_equals', label: 'is not equal to' },
            { value: 'contains', label: 'contains' },
            { value: 'not_contains', label: 'does not contain' },
        ];
    } else if (['total_orders', 'total_spent'].includes(field)) {
        return [
            { value: 'equals', label: 'is equal to' },
            { value: 'not_equals', label: 'is not equal to' },
            { value: 'greater_than', label: 'greater than' },
            { value: 'less_than', label: 'less than' },
            { value: 'greater_equal', label: 'greater than or equal to' },
            { value: 'less_equal', label: 'less than or equal to' },
        ];
    } else if (field === 'last_order_date') {
        return [
            { value: 'before', label: 'before' },
            { value: 'after', label: 'after' },
            { value: 'between', label: 'between' },
        ];
    } else if (field === 'account_status') {
        return [
            { value: 'equals', label: 'is equal to' },
            { value: 'not_equals', label: 'is not equal to' },
        ];
    }
    return [];
};

export const getInputType = (field: string) => {
    if (['total_orders', 'total_spent'].includes(field)) return 'number';
    if (field === 'last_order_date') return 'date';
    return 'text';
};


