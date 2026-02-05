# Phase 2A Frontend Migration Guide

## Overview
Phase 2A unified the inventory system in the backend. Product variants no longer have an `inventory_quantity` field. All inventory is now managed through the unified `inventory` table.

## Breaking Changes

### 1. Product Variant Type Changes
**Before:**
```typescript
interface ProductVariant {
  inventory_quantity: number;
  // ... other fields
}
```

**After:**
```typescript
interface ProductVariant {
  // inventory_quantity removed
  // Query inventory table with variant_id instead
  // ... other fields
}
```

### 2. API Endpoint Changes

**Deprecated Endpoint (Removed):**
```
POST /api/inventory/variants/:variantId/adjust
```

**New Unified Endpoint:**
```
POST /api/inventory/:inventoryId/adjust
```

To adjust variant inventory:
1. Query inventory table to get the inventory record ID for the variant
2. Use the unified adjustment endpoint with the inventory ID

### 3. Product API Response Changes

**Product GET Response:**
- Products without variants: Still include `inventory_quantity` (unchanged)
- Product variants: `inventory_quantity` field removed
- Variant stock must be queried from inventory table using `variant_id`

## Migration Strategy

### Option A: Temporary Fallback (Current Implementation)
Display placeholder values and notes where inventory_quantity was used:
- Product forms: Show "0" as placeholder, add note to manage via inventory
- Product lists: Hide stock column or show "See Inventory"
- Order components: Show warning about stock validation

**Pros:**
- Quick migration, no breaking changes
- Allows time to implement proper inventory queries
- Backend fully functional

**Cons:**
- Limited functionality for variants
- Users can't see stock during order creation
- May cause confusion

### Option B: Full Integration (Recommended)
Implement proper inventory queries throughout the admin panel:

1. **Create Helper Functions:**
```typescript
// Get total stock across all locations
export const getVariantTotalStock = async (variantId: string): Promise<number> => {
  const response = await makeGetRequest(`inventory/variant/${variantId}/total`);
  return response.data.total_quantity;
};

// Get stock by location
export const getVariantStockByLocation = async (variantId: string, locationId: string): Promise<number> => {
  const response = await makeGetRequest(`inventory?variant_id=${variantId}&location_id=${locationId}`);
  return response.data.available_quantity || 0;
};

// Adjust variant inventory (unified)
export const adjustVariantStock = async (
  variantId: string, 
  locationId: string, 
  adjustment: AdjustInventoryRequest
) => {
  // First, get inventory record
  const inventory = await makeGetRequest(`inventory?variant_id=${variantId}&location_id=${locationId}`);
  const inventoryId = inventory.data[0]?.id;
  
  if (!inventoryId) {
    throw new Error('Inventory record not found for variant');
  }
  
  // Use unified endpoint
  return adjustInventory(inventoryId, adjustment);
};
```

2. **Update Order Components:**
```typescript
// In ProductItemSelector.tsx
const [variantStock, setVariantStock] = useState<Record<string, number>>({});

useEffect(() => {
  // Load stock for all variants when product is selected
  if (selectedProduct?.variants) {
    Promise.all(
      selectedProduct.variants.map(v => 
        getVariantTotalStock(v.id).then(stock => ({ id: v.id, stock }))
      )
    ).then(results => {
      setVariantStock(Object.fromEntries(results.map(r => [r.id, r.stock])));
    });
  }
}, [selectedProduct]);

// Use variantStock[variant.id] instead of variant.inventory_quantity
```

3. **Update Product Service:**
```typescript
// Remove inventory_quantity from create/update payloads (already done)
// Add inventory creation as separate step after product creation:

export const createProductWithInventory = async (data: ProductFormData) => {
  const product = await createProduct(data);
  
  // Create inventory records for variants if needed
  if (data.productVariants?.length > 0) {
    await Promise.all(
      data.productVariants.map(variant => 
        createInventory({
          variant_id: variant.id,
          location_id: DEFAULT_LOCATION_ID,
          available_quantity: parseInt(variant.inventoryQuantity || '0'),
        })
      )
    );
  }
  
  return product;
};
```

## Backend API Reference

### Get Variant Stock
```http
GET /api/inventory?variant_id={variantId}&location_id={locationId}
```

Response:
```json
{
  "data": [{
    "id": "uuid",
    "variant_id": "uuid",
    "location_id": "uuid",
    "available_quantity": 100,
    "reserved_quantity": 10
  }]
}
```

### Adjust Variant Inventory
```http
POST /api/inventory/{inventoryId}/adjust
```

Request:
```json
{
  "adjustment_type": "sale",
  "quantity_changed": 5,
  "reason": "Order #123",
  "reference_type": "order",
  "reference_id": "order-uuid"
}
```

### Get Inventory History
```http
GET /api/inventory/history/product/{productId}
```

Returns unified history for product and all its variants.

## Files Updated

### Types:
- ✅ `src/features/products/types/product.types.ts` - Removed inventory_quantity

### Services:
- ✅ `src/features/products/services/productService.ts` - Removed inventory_quantity from payloads
- ✅ `src/features/inventory/services/inventoryApi.service.ts` - Deprecated adjustVariantInventory
- ✅ `src/features/inventory/hooks/useInventory.ts` - Updated to use unified endpoint

### Components (Partial - Need Full Integration):
- ⚠️ `src/features/orders/components/ProductItemSelector.tsx` - Shows placeholder stock
- ⚠️ `src/features/orders/components/modals/ProductSelectionModal.tsx` - Shows placeholder stock
- ✅ `src/features/products/hooks/useProductList.ts` - Hid stock column
- ✅ `src/features/products/pages/ProductListPage.tsx` - Updated styling

### Config:
- `src/features/products/config/import-export.config.ts` - Needs documentation update

## Testing Checklist

- [ ] Product creation with variants (inventory separate)
- [ ] Product update with variants
- [ ] Order creation with products (base products work)
- [ ] Order creation with variants (needs stock queries)
- [ ] Variant stock display in product list
- [ ] Variant stock display in order flow
- [ ] Inventory adjustments for variants (use unified endpoint)
- [ ] Inventory history for products with variants
- [ ] Import/export with variants (document inventory separate)

## Next Steps

1. **Immediate (Done):**
   - ✅ Remove inventory_quantity from types
   - ✅ Update product service
   - ✅ Deprecate adjustVariantInventory
   - ✅ Add migration notes

2. **Short Term (Recommended):**
   - Create helper functions for variant stock queries
   - Update order components to query stock
   - Add inventory creation step to product creation flow
   - Update import/export documentation

3. **Long Term:**
   - Add real-time stock updates
   - Multi-location inventory support in UI
   - Inventory alerts and notifications
   - Stock forecasting

## Migration Status

**Backend:** ✅ Complete (100%)
- All schema changes applied
- Data migrated successfully
- APIs updated
- Deprecated code removed

**Frontend:** ⚠️ Partial (40%)
- Types updated
- Services updated
- Deprecated code removed
- Components need inventory query integration

**Recommended:** Implement Option B (Full Integration) for production-ready functionality.

## Support

For questions or issues:
1. Check backend documentation: `/anant-enterprises-backend/docs/PHASE2A_COMPLETE.md`
2. Review API changes: `/anant-enterprises-backend/docs/PHASE2A_API_CHANGES.md`
3. Test with Postman/curl using backend examples

---

**Last Updated:** Phase 2A Backend Complete, Frontend Partial Migration
**Status:** Backend Production Ready, Frontend Needs Integration
