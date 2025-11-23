import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import type { Task } from '../../types';
import { X, Save, Loader2 } from 'lucide-react';

const taskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    subjectCode: z.string().optional(),
    dueDate: z.string().min(1, 'Due date is required'),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
    onClose: () => void;
    onSave: (data: Omit<Task, 'id' | 'createdAt' | 'isCompleted'>) => Promise<void>;
    isSubmitting?: boolean;
}

export function TaskForm({ onClose, onSave, isSubmitting }: TaskFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            dueDate: new Date().toISOString().split('T')[0]
        }
    });

    const onSubmit = async (data: TaskFormValues) => {
        await onSave(data);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-900">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Add Task</h2>
                    <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Input
                            label="Title"
                            {...register('title')}
                            error={errors.title?.message}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">Description</label>
                        <textarea
                            {...register('description')}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Optional description..."
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Input
                                label="Subject Code"
                                {...register('subjectCode')}
                                placeholder="e.g. CS101"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <Input
                                label="Due Date"
                                type="date"
                                {...register('dueDate')}
                                error={errors.dueDate?.message}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Task
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
