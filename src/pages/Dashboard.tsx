import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CGPASummary } from '../components/dashboard/CGPASummary';
import { UpcomingClasses } from '../components/dashboard/UpcomingClasses';
import { TaskSummary } from '../components/dashboard/TaskSummary';
import type { TimetableEntry, Task, Semester } from '../types';
import { db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function Dashboard() {
    const { currentUser } = useAuth();
    const [cgpa, setCgpa] = useState(0);
    const [totalCredits, setTotalCredits] = useState(0);
    const [semesterGpa, setSemesterGpa] = useState(0);
    const [upcomingClasses, setUpcomingClasses] = useState<TimetableEntry[]>([]);
    const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!currentUser) return;

            try {
                // Fetch CGPA Data
                const semestersQuery = query(
                    collection(db, 'semesters'),
                    where('userId', '==', currentUser.uid)
                );
                const semestersSnapshot = await getDocs(semestersQuery);
                const semesters = semestersSnapshot.docs
                    .map(doc => doc.data() as Semester)
                    .sort((a, b) => {
                        if (a.year !== b.year) return b.year - a.year;
                        return b.term.localeCompare(a.term);
                    });

                if (semesters.length > 0) {
                    const totalPoints = semesters.reduce((acc, sem) => acc + (sem.gpa * sem.totalCredits), 0);
                    const totalCreds = semesters.reduce((acc, sem) => acc + sem.totalCredits, 0);
                    setCgpa(totalCreds > 0 ? totalPoints / totalCreds : 0);
                    setTotalCredits(totalCreds);
                    setSemesterGpa(semesters[0].gpa); // Most recent semester
                }

                // Fetch Upcoming Classes
                const timetableQuery = query(
                    collection(db, 'timetable'),
                    where('userId', '==', currentUser.uid)
                );
                const timetableSnapshot = await getDocs(timetableQuery);
                const allClasses = timetableSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimetableEntry));

                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const currentDay = days[new Date().getDay()];
                const todayClasses = allClasses.filter(c => c.day === currentDay);
                setUpcomingClasses(todayClasses);

                // Fetch Pending Tasks
                const tasksQuery = query(
                    collection(db, 'tasks'),
                    where('userId', '==', currentUser.uid)
                );
                const tasksSnapshot = await getDocs(tasksQuery);
                const tasks = tasksSnapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: doc.data().createdAt?.toDate(),
                    } as Task))
                    .filter(t => !t.isCompleted)
                    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
                    .slice(0, 5);

                setPendingTasks(tasks);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [currentUser]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <div className="text-sm text-muted-foreground">
                    Welcome back, {currentUser?.displayName || currentUser?.email}
                </div>
            </div>

            <CGPASummary
                cgpa={cgpa}
                semesterGpa={semesterGpa}
                totalCredits={totalCredits}
                isLoading={loading}
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <UpcomingClasses classes={upcomingClasses} isLoading={loading} />
                <TaskSummary tasks={pendingTasks} isLoading={loading} />
                {/* Placeholder for another widget or just empty space */}
                <div className="hidden lg:block"></div>
            </div>
        </div>
    );
}
