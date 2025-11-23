import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { TimetableView } from '../components/timetable/TimetableView';
import { ClassModal } from '../components/timetable/ClassModal';
import type { TimetableEntry } from '../types';
import { db } from '../services/firebase';
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function Timetable() {
    const { currentUser } = useAuth();
    const [isAddingClass, setIsAddingClass] = useState(false);
    const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, 'timetable'),
            where('userId', '==', currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const classesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as TimetableEntry[];
            setTimetable(classesData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleAddClass = async (entry: TimetableEntry) => {
        if (!currentUser) return;

        try {
            // Remove id as firestore generates it, but we need to keep other fields
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...classData } = entry;

            await addDoc(collection(db, 'timetable'), {
                ...classData,
                userId: currentUser.uid,
                createdAt: new Date()
            });
            setIsAddingClass(false);
        } catch (error) {
            console.error("Error adding class:", error);
        }
    };

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
                <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
                <Button onClick={() => setIsAddingClass(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Class
                </Button>
            </div>

            <TimetableView timetable={timetable} />

            {isAddingClass && (
                <ClassModal
                    onClose={() => setIsAddingClass(false)}
                    onSave={handleAddClass}
                />
            )}
        </div>
    );
}
