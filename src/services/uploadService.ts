import axios from 'axios';
import { API_ROUTES } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace(/\/$/, '');

export interface UploadResponse {
    id: string;
    filename: string;
    original_filename: string;
    mime_type: string;
    file_size: number;
    file_path: string;
    file_url: string;
    /** Thumbnail URL (compressed, for images only) */
    thumbnail_url?: string;
    created_at: string;
}

export interface UploadOptions {
    /** 
     * Target folder path (e.g., 'products/my-product-slug').
     * If not provided, backend will use default user-based folder.
     */
    folder?: string;
    /** Progress callback (percentage: 0-100) */
    onProgress?: (percentage: number) => void;
}

export interface BatchUploadResult {
    successful: UploadResponse[];
    failed: { file: File; error: string }[];
}

/**
 * Upload a single file to the server
 * @param file - File to upload
 * @param options - Upload options including folder and progress callback
 * @returns Upload response with file URL
 */
export async function uploadFile(
    file: File,
    options?: UploadOptions | ((percentage: number) => void)
): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    // Handle legacy signature (onProgress as second arg)
    let folder: string | undefined;
    let onProgress: ((percentage: number) => void) | undefined;

    if (typeof options === 'function') {
        onProgress = options;
    } else if (options) {
        folder = options.folder;
        onProgress = options.onProgress;
    }

    // Add folder to FormData if provided
    if (folder) {
        formData.append('folder', folder);
    }

    // Get auth token from Supabase session (same as httpClient)
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    try {
        const response = await axios.post<{ data: UploadResponse }>(
            `${API_BASE_URL}/${API_ROUTES.UPLOADS.BASE}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const percentage = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        onProgress(percentage);
                    }
                },
            }
        );

        return response.data.data;
    } catch (error: any) {
        console.error('❌ [UploadService] Upload failed:', error.response?.data || error.message);
        const errorMessage =
            error?.response?.data?.message || error?.message || 'Failed to upload file';
        throw new Error(errorMessage);
    }
}

/**
 * Upload multiple files in batch (for deferred upload pattern)
 * @param files - Array of files to upload
 * @param folder - Target folder path
 * @param onFileProgress - Callback for individual file progress (fileIndex, percentage)
 * @returns Object with successful uploads and failed uploads
 */
export async function uploadFiles(
    files: File[],
    folder?: string,
    onFileProgress?: (fileIndex: number, percentage: number) => void
): Promise<BatchUploadResult> {
    const successful: UploadResponse[] = [];
    const failed: { file: File; error: string }[] = [];

    // Process files sequentially to avoid overwhelming the server
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
            const response = await uploadFile(file, {
                folder,
                onProgress: (percentage) => {
                    onFileProgress?.(i, percentage);
                },
            });
            successful.push(response);
        } catch (error: any) {
            failed.push({
                file,
                error: error.message || 'Upload failed',
            });
        }
    }

    return { successful, failed };
}

/**
 * Create a blob URL for instant file preview (no network call)
 * IMPORTANT: Call revokeBlobPreview when done to avoid memory leaks!
 * @param file - File to create preview for
 * @returns Blob URL string
 */
export function createBlobPreview(file: File): string {
    return URL.createObjectURL(file);
}

/**
 * Revoke a blob URL to free up memory
 * @param blobUrl - The blob URL to revoke
 */
export function revokeBlobPreview(blobUrl: string): void {
    if (blobUrl && blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrl);
    }
}

/**
 * Check if a file is a valid image
 * @param file - File to check
 * @returns true if file is an image
 */
export function isValidImage(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    return validTypes.includes(file.type);
}

/**
 * Check if file size is within limit
 * @param file - File to check
 * @param maxSizeMB - Maximum size in MB (default: 10MB)
 * @returns true if file is within size limit
 */
export function isWithinSizeLimit(file: File, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
}

export const uploadService = {
    uploadFile,
    uploadFiles,
    createBlobPreview,
    revokeBlobPreview,
    isValidImage,
    isWithinSizeLimit,
};
