import { Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProductSelectorProps {
  onProductSearch?: (query: string) => void;
}

export function ProductSelector({ onProductSearch }: ProductSelectorProps) {
  return (
    <div className="border-t border-slate-200 pt-6 mt-6">
      <Label className="text-sm font-medium text-slate-700 mb-3 block">
        Add Products
      </Label>
      
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Package className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            placeholder="Search products to add..."
            className="pl-9 rounded-xl"
            onChange={(e) => onProductSearch?.(e.target.value)}
          />
        </div>
        
        <p className="text-xs text-slate-500">
          Search and select products to manually add to this collection
        </p>
      </div>
    </div>
  );
}
