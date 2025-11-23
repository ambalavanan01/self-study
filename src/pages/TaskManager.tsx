import { useState, useEffect } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskForm } from '../components/tasks/TaskForm';
import type { Task } from '../types';
import { db } from '../services/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function TaskManager() {
    const { currentUser } = useAuth();
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, 'tasks'),
            where('userId', '==', currentUser.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tasksData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
            })) as Task[];
            setTasks(tasksData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleAddTask = async (data: Omit<Task, 'id' | 'createdAt' | 'isCompleted'>) => {
        if (!currentUser) return;
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'tasks'), {
                ...data,
                isCompleted: false,
                createdAt: new Date(),
                userId: currentUser.uid,
            });
            setIsAddingTask(false);
        } catch (error) {
            console.error('Error adding task:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleStatus = async (task: Task) => {
        try {
            await updateDoc(doc(db, 'tasks', task.id), {
                isCompleted: !task.isCompleted
            });
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDelete = async (task: Task) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await deleteDoc(doc(db, 'tasks', task.id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const filteredTasks = tasks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subjectCode?.toLowerCase().includes(searchQuery.toLowerCase())
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
                <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                <Button onClick={() => setIsAddingTask(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                </Button>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tasks..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        {searchQuery ? 'No tasks match your search.' : 'No tasks found. Add a task to get started.'}
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onToggleStatus={handleToggleStatus}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>

            {isAddingTask && (
                <TaskForm
                    onClose={() => setIsAddingTask(false)}
                    onSave={handleAddTask}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
}
