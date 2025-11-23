import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { SemesterList } from '../components/cgpa/SemesterList';
import { SemesterForm } from '../components/cgpa/SemesterForm';
import type { Semester } from '../types';
import { db } from '../services/firebase';
import { collection, addDoc, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function CGPAManager() {
    const { currentUser } = useAuth();
    const [isAddingSemester, setIsAddingSemester] = useState(false);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, 'semesters'),
            where('userId', '==', currentUser.uid),
            orderBy('year', 'desc'),
            orderBy('term', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const semestersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Semester[];
            setSemesters(semestersData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleAddSemester = async (semester: Semester) => {
        if (!currentUser) return;

        try {
            // Remove id as firestore generates it, but we need to keep other fields
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...semesterData } = semester;

            await addDoc(collection(db, 'semesters'), {
                ...semesterData,
                userId: currentUser.uid,
                createdAt: new Date()
            });
            setIsAddingSemester(false);
        } catch (error) {
            console.error("Error adding semester:", error);
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
                <h1 className="text-3xl font-bold tracking-tight">CGPA Manager</h1>
                <Button onClick={() => setIsAddingSemester(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Semester
                </Button>
            </div>

            <SemesterList semesters={semesters} />

            {isAddingSemester && (
                <SemesterForm
                    onClose={() => setIsAddingSemester(false)}
                    onSave={handleAddSemester}
                />
            )}
        </div>
    );
}
