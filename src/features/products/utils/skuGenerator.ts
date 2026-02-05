/**
 * Utility functions for generating SKUs
 */

/**
 * Generate a random alphanumeric SKU
 * Format: PXXXX where X is a digit
 */
export function generateProductSKU(): string {
    const prefix = 'P';
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number
    return `${prefix}${randomNum}`;
}

/**
 * Generate a variant SKU based on product SKU and variant info
 * Format: {PRODUCT_SKU}-V{VARIANT_NUMBER} or auto-generated if no product SKU
 */
export function generateVariantSKU(
    productSKU?: string,
    variantIndex?: number
): string {
    // If we have product SKU, append variant suffix
    if (productSKU && productSKU.trim()) {
        const variantSuffix = variantIndex !== undefined
            ? `V${variantIndex + 1}`
            : `V${Date.now().toString().slice(-4)}`;
        return `${productSKU}-${variantSuffix}`;
    }

    // Otherwise generate standalone variant SKU
    const prefix = 'VR';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomNum}`;
}

/**
 * Check if a SKU is valid (not empty and following basic pattern)
 */
export function isValidSKU(sku: string): boolean {
    return Boolean(sku && sku.trim().length >= 3);
}
