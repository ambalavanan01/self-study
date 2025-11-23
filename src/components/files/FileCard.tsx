import type { FileItem } from '../../types';
import { FileIcon, Download, Trash2, FileText, Image, Film, Music } from 'lucide-react';
import { Button } from '../ui/button';
import { format } from 'date-fns';

interface FileItemProps {
    file: FileItem;
    onDelete: (file: FileItem) => void;
}

export function FileCard({ file, onDelete }: FileItemProps) {
    const getIcon = () => {
        if (file.type.startsWith('image/')) return <Image className="h-8 w-8 text-blue-500" />;
        if (file.type.startsWith('video/')) return <Film className="h-8 w-8 text-purple-500" />;
        if (file.type.startsWith('audio/')) return <Music className="h-8 w-8 text-pink-500" />;
        if (file.type.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
        return <FileIcon className="h-8 w-8 text-gray-500" />;
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-accent/50">
            <div className="flex items-center space-x-4">
                <div className="rounded-md bg-background p-2 shadow-sm">
                    {getIcon()}
                </div>
                <div>
                    <p className="font-medium leading-none">{file.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {formatSize(file.size)} • {format(file.createdAt, 'MMM d, yyyy')}
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <Download className="h-4 w-4" />
                </a>
                <Button variant="ghost" size="icon" onClick={() => onDelete(file)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
