import { memo } from 'react';
import { Eye, Package, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface ProductPreviewItem {
  id: string;
  title: string;
  price: number;
  status: string;
  tags: string[];
}

export interface SortOptionItem {
  value: string;
  label: string;
}

interface ProductPreviewProps {
  products: ProductPreviewItem[];
  sortOrder: string;
  onSortOrderChange: (value: string) => void;
  sortOptions: SortOptionItem[];
  title?: string;
  emptyMessage?: string;
}

export const ProductPreview = memo(function ProductPreview({
  products,
  sortOrder,
  onSortOrderChange,
  sortOptions,
  title = "Products Preview",
  emptyMessage = "No matching products found. Adjust your conditions to see results."
}: ProductPreviewProps) {
  return (
    <div className="border-t border-slate-200 pt-6 mt-6">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Eye className="size-4 text-gray-400" />
          <Label className="text-sm font-medium text-slate-700">
            {title}
          </Label>
          <Badge variant="secondary" className="rounded-lg">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </Badge>
        </div>
        {sortOptions.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600">Sort:</span>
            <Select value={sortOrder} onValueChange={onSortOrderChange}>
              <SelectTrigger className="rounded-lg h-8 w-[140px] text-xs px-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="text-xs">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start sm:items-center gap-3">
              <GripVertical className="size-4 text-slate-400 flex-shrink-0 cursor-move mt-1 sm:mt-0" />
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 truncate">{product.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-slate-600">₹{product.price.toLocaleString('en-IN')}</p>
                    <span className="text-slate-300">•</span>
                    <Badge
                      variant={product.status === 'Active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {product.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {product.tags.slice(0, 2).map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <Package className="size-10 mx-auto text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">
              {emptyMessage}
            </p>
          </div>
        )}
      </div>
      <p className="text-xs text-slate-500 mt-2">
        This preview updates automatically based on your conditions
      </p>
    </div>
  );
});
