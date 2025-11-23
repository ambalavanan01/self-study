import type { Task } from '../../types';
import { Calendar, Trash2, CheckCircle, Circle } from 'lucide-react';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

interface TaskCardProps {
    task: Task;
    onToggleStatus: (task: Task) => void;
    onDelete: (task: Task) => void;
}

export function TaskCard({ task, onToggleStatus, onDelete }: TaskCardProps) {
    return (
        <div className={cn(
            "flex items-center justify-between rounded-lg border p-4 shadow-sm transition-all",
            task.isCompleted ? "bg-muted/50 opacity-75" : "bg-card hover:shadow-md"
        )}>
            <div className="flex items-start space-x-4">
                <button
                    onClick={() => onToggleStatus(task)}
                    className={cn(
                        "mt-1 flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                        task.isCompleted
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground hover:border-primary"
                    )}
                >
                    {task.isCompleted ? <CheckCircle className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                </button>

                <div className="space-y-1">
                    <p className={cn(
                        "font-medium leading-none",
                        task.isCompleted && "line-through text-muted-foreground"
                    )}>
                        {task.title}
                    </p>
                    {task.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {task.description}
                        </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                        {task.subjectCode && (
                            <span className="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">
                                {task.subjectCode}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(task)}
                className="text-muted-foreground hover:text-destructive"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
