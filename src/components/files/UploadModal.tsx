import { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { X, Upload, Loader2 } from 'lucide-react';

interface UploadModalProps {
    onClose: () => void;
    onUpload: (file: File) => Promise<void>;
}

export function UploadModal({ onClose, onUpload }: UploadModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setIsUploading(true);
        try {
            await onUpload(file);
            onClose();
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-900">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Upload File</h2>
                    <Button variant="ghost" size="sm" onClick={onClose} disabled={isUploading}>
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="mb-4 h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {file ? file.name : "Click to select a file"}
                        </p>
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!file || isUploading}>
                            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Upload
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
