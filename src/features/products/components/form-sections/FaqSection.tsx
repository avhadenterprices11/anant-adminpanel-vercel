import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MessageCircle, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { FormSection } from '@/components/forms';
import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog';
import type { FAQSectionProps } from '@/features/products/types/component.types';

export function FaqSection({
    formData,
    handleAddFAQ,
    handleRemoveFAQ,
    handleFAQChange,
    expandedFaqId: controlledExpandedId,
    setExpandedFaqId: controlledSetExpandedId
}: FAQSectionProps) {
    const [deleteFaqId, setDeleteFaqId] = useState<string | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Controlled vs Uncontrolled state logic
    const [localExpandedFaqId, setLocalExpandedFaqId] = useState<string | null>(null);
    const isControlled = controlledExpandedId !== undefined;
    const expandedFaqId = isControlled ? controlledExpandedId : localExpandedFaqId;
    const setExpandedFaqId = isControlled ? controlledSetExpandedId! : setLocalExpandedFaqId;

    const [prevFaqCount, setPrevFaqCount] = useState(formData.faqs.length);
    const itemsPerPage = 5;

    // Calculate pagination
    const totalPages = Math.ceil(formData.faqs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentFaqs = formData.faqs.slice(startIndex, startIndex + itemsPerPage);

    // Auto-expand new FAQ
    useEffect(() => {
        if (formData.faqs.length > prevFaqCount) {
            const lastFaq = formData.faqs[formData.faqs.length - 1];
            if (lastFaq) {
                setExpandedFaqId(lastFaq.id);
            }
        }
        setPrevFaqCount(formData.faqs.length);
    }, [formData.faqs.length, prevFaqCount, setExpandedFaqId]);

    const onRemoveClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteFaqId(id);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (deleteFaqId) {
            handleRemoveFAQ(deleteFaqId);
            setDeleteFaqId(null);
            setShowDeleteDialog(false);

            // Adjust current page if last item on page was deleted
            const newTotal = formData.faqs.length - 1;
            const newTotalPages = Math.ceil(newTotal / itemsPerPage);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            }
        }
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleToggleExpand = (id: string) => {
        setExpandedFaqId(expandedFaqId === id ? null : id);
    };

    const addButton = (
        <Button
            onClick={() => {
                handleAddFAQ();
                // Go to last page when adding new FAQ
                const newTotal = formData.faqs.length + 1;
                const newTotalPages = Math.ceil(newTotal / itemsPerPage);
                setCurrentPage(newTotalPages);
            }}
            size="sm"
            variant="outline"
            className="rounded-lg"
        >
            <Plus className="size-3.5 mr-1 text-icon-muted" />
            Add FAQ
        </Button>
    );

    return (
        <>
            <FormSection icon={MessageCircle} title="FAQ Group" actions={addButton}>
                {formData.faqs.length > 0 ? (
                    <div className="space-y-4">
                        {currentFaqs.map((faq, index) => {
                            const isExpanded = expandedFaqId === faq.id;
                            const globalIndex = startIndex + index;

                            return (
                                <div
                                    key={faq.id}
                                    className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden transition-all duration-200"
                                >
                                    {/* FAQ Header (Always Visible) */}
                                    <div
                                        onClick={() => handleToggleExpand(faq.id)}
                                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                                                {globalIndex + 1}
                                            </div>
                                            <h3 className="text-sm font-medium text-slate-700 truncate">
                                                {faq.question || <span className="text-slate-400 italic">No question entered...</span>}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0 ml-4">
                                            <button
                                                type="button"
                                                onClick={(e) => onRemoveClick(faq.id, e)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete FAQ"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                            <div className="p-2 text-slate-400">
                                                {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                                            </div>
                                        </div>
                                    </div>

                                    {/* FAQ Content (Conditional) */}
                                    {isExpanded && (
                                        <div className="p-4 pt-0 space-y-3 border-t border-slate-100 mt-0">
                                            <div className="pt-4">
                                                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                                                    Question
                                                </Label>
                                                <Input
                                                    id={`faq-${faq.id}-question`}
                                                    value={faq.question}
                                                    onChange={(e) => handleFAQChange(faq.id, 'question', e.target.value)}
                                                    className="rounded-lg bg-white"
                                                    placeholder="Enter question..."
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>

                                            <div>
                                                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                                                    Answer
                                                </Label>
                                                <Textarea
                                                    id={`faq-${faq.id}-answer`}
                                                    value={faq.answer}
                                                    onChange={(e) => handleFAQChange(faq.id, 'answer', e.target.value)}
                                                    rows={3}
                                                    className="rounded-lg resize-none bg-white"
                                                    placeholder="Enter answer..."
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
                                <div className="text-sm text-slate-500">
                                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, formData.faqs.length)} of {formData.faqs.length} FAQs
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="h-8 px-3 rounded-lg"
                                    >
                                        Previous
                                    </Button>
                                    <div className="text-sm font-medium text-slate-700 mx-2">
                                        Page {currentPage} of {totalPages}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="h-8 px-3 rounded-lg"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-8 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <MessageCircle className="size-10 mx-auto mb-3 text-icon-muted" />
                        <p className="text-sm text-slate-500">No FAQs added yet. Click "Add FAQ" to get started.</p>
                    </div>
                )}
            </FormSection>

            <ConfirmationDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={confirmDelete}
                title="Delete FAQ"
                description="Are you sure you want to delete this FAQ? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </>
    );
}
