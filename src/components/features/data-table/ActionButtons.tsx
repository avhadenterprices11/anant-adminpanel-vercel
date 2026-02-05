import React, { useState } from "react";
import { Download, Upload, Plus } from "lucide-react";
import type { To } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { ImportDialog, type ImportField, type ImportMode } from "../import-export/ImportDialog";
import { ExportDialog, type ExportOptions, type ExportColumn } from "../import-export/ExportDialog";

interface ActionButtonsProps {
    onImport?: (data: any[], mode: ImportMode) => void | Promise<void>;
    onExport?: (options: ExportOptions) => void | Promise<void>;
    onAddPrimary?: () => void;
    importTo?: To;
    exportTo?: To;
    primaryTo?: To;
    primaryLabel?: string;
    totalItems?: number;
    templateUrl?: string;
    moduleName?: string; // e.g., "Tags", "Products", "Orders"
    importFields?: ImportField[]; // Fields for import mapping
    exportColumns?: ExportColumn[]; // Columns for export selection
    allowUpdate?: boolean; // Allow update/merge modes in import
    supportsDateRange?: boolean; // Show date range filter in export
    selectedItems?: any[]; // Items selected in the table for export
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
    onImport,
    onExport,
    onAddPrimary,
    importTo,
    exportTo,
    primaryTo,
    primaryLabel = "Add New",
    totalItems = 0,
    templateUrl,
    moduleName = "Items",
    importFields,
    exportColumns,
    allowUpdate = false,
    supportsDateRange = false,
    selectedItems = [],
}) => {
    const navigate = useNavigate();
    const [showImportModal, setShowImportModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);

    // const baseBtn = "h-[38px] px-4 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all shadow-sm";

    const handleImportClick = () => {
        if (importTo) {
            navigate(importTo);
        } else {
            setShowImportModal(true);
        }
    };

    const handleExportClick = () => {
        if (exportTo) {
            navigate(exportTo);
        } else {
            setShowExportModal(true);
        }
    };

    const handlePrimaryClick = () => {
        if (primaryTo) {
            navigate(primaryTo);
        } else if (onAddPrimary) {
            onAddPrimary();
        }
    };

    // Default fields for import (should be passed via props in a real app, but mocking for generic use)
    const defaultImportFields: ImportField[] = [
        { id: 'name', label: 'Name', required: true, type: 'text' },
        { id: 'email', label: 'Email', required: true, type: 'email' },
        { id: 'role', label: 'Role', required: false, type: 'text' },
        { id: 'status', label: 'Status', required: false, type: 'select', options: ['Active', 'Inactive'] }
    ];

    // Default columns for export (Updated to match user screenshot)
    const defaultExportColumns: ExportColumn[] = [
        { id: 'event_id', label: 'Event ID' },
        { id: 'event_name', label: 'Event Name' },
        { id: 'type', label: 'Type' },
        { id: 'start_date', label: 'Start Date' },
        { id: 'end_date', label: 'End Date' },
        { id: 'owner', label: 'Owner' },
        { id: 'location', label: 'Location' },
        { id: 'total_registrations', label: 'Total Registrations' },
        { id: 'checked_in', label: 'Checked In' },
        { id: 'status', label: 'Status' }
    ];

    return (
        <>
            <div 
                className="flex w-full md:w-auto items-center gap-1.5 sm:gap-3 flex-nowrap overflow-x-auto pb-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {(importTo || onImport) && (
                    <button
                        type="button"
                        onClick={handleImportClick}
                        className="flex-1 min-w-0 md:flex-none h-[38px] px-2 sm:px-4 bg-[#0e042f] text-white hover:bg-[#0e042f]/90 flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg text-[12px] sm:text-sm font-medium transition-all shadow-sm whitespace-nowrap"
                    >
                        <Upload size={14} className="text-white shrink-0 sm:w-4 sm:h-4" />
                        <span className="truncate">Import</span>
                    </button>
                )}

                {(exportTo || onExport) && (
                    <button
                        type="button"
                        onClick={handleExportClick}
                        className="flex-1 min-w-0 md:flex-none h-[38px] px-2 sm:px-4 bg-[#0e042f] text-white hover:bg-[#0e042f]/90 flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg text-[12px] sm:text-sm font-medium transition-all shadow-sm whitespace-nowrap"
                    >
                        <Download size={14} className="text-white shrink-0 sm:w-4 sm:h-4" />
                        <span className="truncate">Export</span>
                    </button>
                )}

                {(primaryTo || onAddPrimary) && (
                    <button
                        type="button"
                        onClick={handlePrimaryClick}
                        className="flex-1 min-w-0 md:flex-none h-[38px] px-2 sm:px-4 bg-[#0e042f] text-white hover:bg-[#0e042f]/90 flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg text-[12px] sm:text-sm font-medium transition-all shadow-sm whitespace-nowrap"
                    >
                        <Plus size={14} className="text-white shrink-0 sm:w-4 sm:h-4" />
                        <span className="truncate whitespace-nowrap">
                            <span className="hidden xs:inline">{primaryLabel.split(' ')[0]} </span>
                            {primaryLabel.split(' ').slice(1).join(' ') || primaryLabel}
                        </span>
                    </button>
                )}
            </div>

            {/* Import Dialog */}
            {onImport && (
                <ImportDialog
                    open={showImportModal}
                    onOpenChange={setShowImportModal}
                    moduleName={moduleName}
                    fields={importFields || defaultImportFields}
                    templateUrl={templateUrl}
                    allowUpdate={allowUpdate}
                    onImport={async (data, mode) => {
                        await onImport(data, mode);
                    }}
                />
            )}

            {/* Export Dialog */}
            {onExport && (
                <ExportDialog
                    open={showExportModal}
                    onOpenChange={setShowExportModal}
                    moduleName={moduleName}
                    totalCount={totalItems}
                    columns={exportColumns || defaultExportColumns}
                    supportsDateRange={supportsDateRange}
                    selectedItems={selectedItems}
                    onExport={async (options) => {
                        await onExport(options);
                    }}
                />
            )}
        </>
    );
};

export { ActionButtons };

