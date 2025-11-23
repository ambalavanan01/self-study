import { useState, useEffect } from 'react';
import { Timer } from '../components/study/Timer';
import { SessionHistory } from '../components/study/SessionHistory';
import type { StudySession } from '../types';
import { db } from '../services/firebase';
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function StudySessions() {
    const { currentUser } = useAuth();
    const [sessions, setSessions] = useState<StudySession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, 'study_sessions'),
            where('userId', '==', currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const sessionsData = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    startTime: doc.data().startTime?.toDate(),
                    endTime: doc.data().endTime?.toDate(),
                })) as StudySession[];

            // Client-side sorting
            sessionsData.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

            setSessions(sessionsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleSessionComplete = async (duration: number, type: 'focus' | 'break', notes?: string) => {
        if (!currentUser) return;

        try {
            const endTime = new Date();
            const startTime = new Date(endTime.getTime() - duration * 60000);

            await addDoc(collection(db, 'study_sessions'), {
                userId: currentUser.uid,
                startTime,
                endTime,
                duration,
                type,
                notes,
                createdAt: new Date(),
            });
        } catch (error) {
            console.error('Error saving session:', error);
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
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Study Sessions</h1>
                <p className="text-muted-foreground">
                    Track your focus time and take regular breaks using the Pomodoro technique.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <div>
                    <Timer onSessionComplete={handleSessionComplete} />
                </div>
                <div>
                    <SessionHistory sessions={sessions} />
                </div>
            </div>
        </div>
    );
}
