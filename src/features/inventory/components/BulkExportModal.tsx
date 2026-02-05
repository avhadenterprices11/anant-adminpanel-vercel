import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { cn } from "@/lib/utils";
import type { InventoryItem } from '../types';

interface BulkExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedItems: InventoryItem[];
    onConfirm: (format: 'csv' | 'xlsx') => void;
}

type ExportFormat = 'csv' | 'xlsx';

export const BulkExportModal: React.FC<BulkExportModalProps> = ({
    isOpen,
    onClose,
    selectedItems,
    onConfirm
}) => {
    const [format, setFormat] = useState<ExportFormat>('xlsx');

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[500px] overflow-hidden flex flex-col p-0 gap-0 rounded-xl bg-white shadow-xl border-0">
                <DialogHeader className="px-6 py-5 border-b border-slate-100 flex-shrink-0 flex-row items-start justify-between space-y-0">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-slate-800 flex items-center justify-center">
                            <Download className="size-5 text-white" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
                                Export Selected Items
                            </DialogTitle>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    {/* Info Block */}
                    <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">Items selected:</span>
                            <span className="text-slate-900 font-bold">{selectedItems.length}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">Location:</span>
                            <span className="text-slate-900 font-bold">Nashik Warehouse</span>
                        </div>
                    </div>

                    {/* Export Format */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                            Export Format
                        </label>

                        <label className={cn(
                            "flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all",
                            format === 'csv' ? "border-slate-800 bg-slate-50 shadow-sm" : "border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                        )}>
                            <div className="mt-0.5 relative flex items-center justify-center">
                                <input
                                    type="radio"
                                    name="export-format"
                                    className="peer h-4 w-4 appearance-none rounded-full border border-slate-300 checked:border-slate-800"
                                    checked={format === 'csv'}
                                    onChange={() => setFormat('csv')}
                                />
                                <div className={cn(
                                    "absolute bg-slate-800 rounded-full size-2 pointer-events-none transform scale-0 transition-transform",
                                    format === 'csv' ? "scale-100" : ""
                                )} />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className={cn("text-sm font-bold", format === 'csv' ? "text-slate-900" : "text-slate-700")}>
                                    CSV (Comma-Separated)
                                </span>
                                <span className="text-xs text-slate-500 font-medium">
                                    Compatible with Excel, Google Sheets
                                </span>
                            </div>
                        </label>

                        <label className={cn(
                            "flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all",
                            format === 'xlsx' ? "border-slate-800 bg-slate-50 shadow-sm" : "border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                        )}>
                            <div className="mt-0.5 relative flex items-center justify-center">
                                <input
                                    type="radio"
                                    name="export-format"
                                    className="peer h-4 w-4 appearance-none rounded-full border border-slate-300 checked:border-slate-800"
                                    checked={format === 'xlsx'}
                                    onChange={() => setFormat('xlsx')}
                                />
                                <div className={cn(
                                    "absolute bg-slate-800 rounded-full size-2 pointer-events-none transform scale-0 transition-transform",
                                    format === 'xlsx' ? "scale-100" : ""
                                )} />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className={cn("text-sm font-bold", format === 'xlsx' ? "text-slate-900" : "text-slate-700")}>
                                    XLSX (Excel Workbook)
                                </span>
                                <span className="text-xs text-slate-500 font-medium">
                                    Native Excel format with formatting
                                </span>
                            </div>
                        </label>
                    </div>

                    {/* Info Message */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700 leading-relaxed">
                        Export will include: Product, Variant, SKU, Location, Incoming, Committed, Available, and Blocked quantities.
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 flex items-center gap-3 mt-auto bg-white rounded-b-xl">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 h-11 text-sm font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => onConfirm(format)}
                        className="flex-1 h-11 text-sm font-semibold bg-slate-800 hover:bg-slate-900 text-white shadow-sm hover:shadow rounded-lg border border-transparent"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export {format.toUpperCase()}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
