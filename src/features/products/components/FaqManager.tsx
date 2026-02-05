import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { FAQItem } from '@/features/products/types/product.types';
import type { FaqManagerProps } from '@/features/products/types/component.types';

export function FaqManager({ faqs, onChange }: FaqManagerProps) {
  const handleAddFAQ = () => {
    const newFAQ: FAQItem = {
      id: `faq-${Date.now()}`,
      question: '',
      answer: '',
    };
    onChange([...faqs, newFAQ]);
  };

  const handleRemoveFAQ = (id: string) => {
    onChange(faqs.filter((faq) => faq.id !== id));
  };

  const handleFAQChange = (id: string, field: 'question' | 'answer', value: string) => {
    onChange(
      faqs.map((faq) => (faq.id === id ? { ...faq, [field]: value } : faq))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {faqs.length === 0 ? 'No FAQs added yet' : `${faqs.length} FAQ(s) added`}
        </p>
        <Button
          type="button"
          onClick={handleAddFAQ}
          size="sm"
          variant="outline"
          className="rounded-lg"
        >
          <Plus className="size-3.5 mr-1" />
          Add FAQ
        </Button>
      </div>

      {faqs.length > 0 ? (
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="rounded-lg">
                  FAQ #{index + 1}
                </Badge>
                <button
                  type="button"
                  onClick={() => handleRemoveFAQ(faq.id)}
                  className="text-slate-400 hover:text-red-600 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  Question *
                </Label>
                <Input
                  value={faq.question}
                  onChange={(e) => handleFAQChange(faq.id, 'question', e.target.value)}
                  className="rounded-lg bg-white"
                  placeholder="Enter question..."
                />
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  Answer *
                </Label>
                <Textarea
                  value={faq.answer}
                  onChange={(e) => handleFAQChange(faq.id, 'answer', e.target.value)}
                  rows={3}
                  className="rounded-lg resize-none bg-white"
                  placeholder="Enter answer..."
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <p className="text-sm text-slate-500">
            Click "Add FAQ" to get started with product FAQs
          </p>
        </div>
      )}
    </div>
  );
}
