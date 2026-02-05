import { useState, useRef, useId, useEffect } from 'react';
import { ImageIcon, X, Upload, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VariantImageUploadProps {
    imageUrl?: string;
    onImageChange: (file: File | null) => void;
}

export function VariantImageUpload({ imageUrl, onImageChange }: VariantImageUploadProps) {
    // Generate unique ID for this instance
    const uniqueId = useId();
    const inputId = `variant-image-upload-${uniqueId}`;

    const [preview, setPreview] = useState<string | undefined>(imageUrl);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);



    // Sync preview with imageUrl prop (for when parent updates it)
    useEffect(() => {

        setPreview(imageUrl);
    }, [imageUrl]);

    // Close modal on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && showPreviewModal) {
                setShowPreviewModal(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showPreviewModal]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            onImageChange(file);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();

        setPreview(undefined);
        onImageChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleChangeClick = () => {
        fileInputRef.current?.click();
    };

    const handlePreviewClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (preview) {
            setShowPreviewModal(true);
        }
    };

    return (
        <>
            <div className="relative w-full">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id={inputId}
                />

                {preview ? (
                    // Image selected - show preview with Change Image button
                    <div className="space-y-2">
                        <div
                            className="relative w-32 h-32 bg-slate-100 rounded-xl overflow-hidden border-2 border-slate-200 cursor-pointer group"
                            onClick={handlePreviewClick}
                        >
                            <img src={preview} alt="Variant" className="w-full h-full object-cover transition-transform group-hover:scale-105" />

                            {/* Hover overlay with zoom icon */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Remove button */}
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-lg w-32 text-xs"
                            onClick={handleChangeClick}
                        >
                            <Upload className="h-3 w-3 mr-1" />
                            Change Image
                        </Button>
                    </div>
                ) : (
                    // No image - show upload placeholder
                    <label
                        htmlFor={inputId}
                        className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        <ImageIcon className="w-8 h-8 text-slate-400 mb-1" />
                        <p className="text-xs text-slate-500 text-center px-2">Upload Image</p>
                    </label>
                )}
            </div>

            {/* Preview Modal / Lightbox */}
            {showPreviewModal && preview && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
                    onClick={() => setShowPreviewModal(false)}
                >
                    {/* Close button */}
                    <button
                        type="button"
                        onClick={() => setShowPreviewModal(false)}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Image */}
                    <div
                        className="max-w-[90vw] max-h-[90vh] relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={preview}
                            alt="Variant preview"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                        />
                    </div>
                </div>
            )}
        </>
    );
}

