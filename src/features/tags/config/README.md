# Tags Import/Export Configuration

## Overview
This directory contains the configuration for importing and exporting tags data in the admin panel.

## Files

### `import-export.config.ts`
Centralized configuration for tags import/export functionality including:
- **Import Fields**: Schema definition for CSV import mapping
- **Export Columns**: Available columns for export selection
- **Template URL**: Path to the CSV template file
- **Module Name**: Display name used in dialogs

## Import Configuration

### Import Fields
Based on the Tag schema from `anant-enterprises-backend/src/features/tags/shared/tags.schema.ts`:

| Field | Type | Required | Options |
|-------|------|----------|---------|
| `name` | text | Yes | - |
| `type` | select | Yes | product, order, customer, collection, blog |
| `status` | select | No | true, false |

### Import Modes
- **Create**: Add new tags only
- **Update**: Update existing tags (matched by name)
- **Merge**: Create new + update existing tags

## Export Configuration

### Export Columns
All available fields from the Tag model:

| Column | Default Selected | Description |
|--------|------------------|-------------|
| `id` | Yes | Tag UUID |
| `name` | Yes | Tag name |
| `type` | Yes | Tag type (product/order/customer/collection/blog) |
| `status` | Yes | Active/Inactive status |
| `usage_count` | Yes | Number of times tag is used |
| `created_at` | Yes | Creation timestamp |
| `updated_at` | No | Last update timestamp |
| `created_by` | No | User ID who created the tag |

### Export Formats
- **CSV**: Universal format for spreadsheets
- **XLSX**: Excel format with formatting
- **PDF**: Printable report format
- **JSON**: Developer-friendly format

## CSV Template

### Location
`public/templates/tags-template.csv`

### Structure
```csv
name,type,status
Summer Sale,product,true
VIP Customer,customer,true
Urgent Order,order,true
Featured Collection,collection,true
Tech Blog,blog,true
```

### Field Specifications

#### name (required)
- **Type**: String (max 255 characters)
- **Description**: Unique tag name
- **Validation**: Must be unique across all tags
- **Example**: "Summer Sale", "VIP Customer"

#### type (required)
- **Type**: Enum
- **Options**: `product`, `order`, `customer`, `collection`, `blog`
- **Description**: Context where the tag will be used
- **Default**: `product`
- **Example**: "product", "customer"

#### status (optional)
- **Type**: Boolean
- **Options**: `true`, `false`
- **Default**: `true`
- **Description**: Whether the tag is active
- **Example**: "true", "false"

## Usage in TagListPage

```typescript
import { 
    tagImportFields, 
    tagExportColumns, 
    tagTemplateUrl, 
    tagModuleName 
} from '../config/import-export.config';

<ActionButtons
    moduleName={tagModuleName}
    importFields={tagImportFields}
    exportColumns={tagExportColumns}
    templateUrl={tagTemplateUrl}
    allowUpdate={true}
    supportsDateRange={true}
    onImport={handleImport}
    onExport={handleExport}
    totalItems={total}
/>
```

## Backend Schema Reference

### Database Table: `tags`
```typescript
{
  id: uuid (primary key)
  name: varchar(255) (unique, not null)
  type: varchar(50) (not null, default: 'product')
  usage_count: integer (not null, default: 0)
  status: boolean (not null, default: true)
  is_deleted: boolean (not null, default: false)
  created_by: uuid (optional)
  created_at: timestamp (not null)
  updated_at: timestamp (not null)
}
```

### Indexes
- `tags_name_idx`: Fast lookup by name
- `tags_type_idx`: Fast filtering by type

## Next Steps

### To implement actual import:
1. Create API endpoint: `POST /api/tags/import`
2. Parse CSV file (use `papaparse` library)
3. Validate data against schema
4. Handle duplicates based on import mode
5. Return success/error summary

### To implement actual export:
1. Create API endpoint: `GET /api/tags/export`
2. Accept query parameters (scope, format, columns, dateRange)
3. Generate file in requested format
4. Stream file to client

### Template Upload to Bucket:
1. Upload `tags-template.csv` to your storage bucket (S3, Supabase Storage, etc.)
2. Update `tagTemplateUrl` in config to point to bucket URL
3. Implement signed URL generation for secure downloads

## Validation Rules

### Import Validation
- **name**: Required, max 255 chars, must be unique
- **type**: Required, must be one of allowed values
- **status**: Optional, must be boolean string ("true"/"false")

### Error Handling
- Duplicate names: Based on import mode (skip/update/merge)
- Invalid type: Show error, skip row
- Missing required field: Show error, skip row
- Empty rows: Ignore silently

## Related Files
- Backend Schema: `anant-enterprises-backend/src/features/tags/shared/tags.schema.ts`
- Backend Interface: `anant-enterprises-backend/src/features/tags/shared/interface.ts`
- Admin Types: `src/features/tags/types/tag.types.ts`
- Import Dialog: `src/components/features/import-export/ImportDialog.tsx`
- Export Dialog: `src/components/features/import-export/ExportDialog.tsx`
