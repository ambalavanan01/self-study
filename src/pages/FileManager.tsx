import { useState, useEffect } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { FileCard } from '../components/files/FileCard';
import { UploadModal } from '../components/files/UploadModal';
import type { FileItem } from '../types';
import { db, storage } from '../services/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function FileManager() {
    const { currentUser } = useAuth();
    const [isUploading, setIsUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, 'files'),
            where('userId', '==', currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const filesData = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate() || new Date(),
                })) as FileItem[];

            // Client-side sorting
            filesData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

            setFiles(filesData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleUpload = async (file: File) => {
        if (!currentUser) return;

        const storageRef = ref(storage, `files/${currentUser.uid}/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);

        await addDoc(collection(db, 'files'), {
            name: file.name,
            url,
            type: file.type,
            size: file.size,
            createdAt: new Date(),
            path: storageRef.fullPath,
            userId: currentUser.uid,
        });
    };

    const handleDelete = async (fileToDelete: FileItem) => {
        try {
            const storageRef = ref(storage, fileToDelete.path);
            await deleteObject(storageRef);
            await deleteDoc(doc(db, 'files', fileToDelete.id));
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Failed to delete file');
        }
    };

    const filteredFiles = files.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">File Manager</h1>
                <Button onClick={() => setIsUploading(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Upload File
                </Button>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search files..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {filteredFiles.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        {searchQuery ? 'No files match your search.' : 'No files found. Upload some files to get started.'}
                    </div>
                ) : (
                    filteredFiles.map(file => (
                        <FileCard key={file.id} file={file} onDelete={handleDelete} />
                    ))
                )}
            </div>

            {isUploading && (
                <UploadModal
                    onClose={() => setIsUploading(false)}
                    onUpload={handleUpload}
                />
            )}
        </div>
    );
}
