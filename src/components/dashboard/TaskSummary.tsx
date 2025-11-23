import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { Task } from '../../types';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '../../lib/utils';

interface TaskSummaryProps {
    tasks: Task[];
}

export function TaskSummary({ tasks }: TaskSummaryProps) {
    // Sort by due date
    const sortedTasks = [...tasks].sort((a, b) =>
        a.dueDate.localeCompare(b.dueDate)
    );

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
            <CardHeader>
                <CardTitle className="text-lg font-medium">Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {sortedTasks.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No pending tasks.</p>
                    ) : (
                        sortedTasks.slice(0, 5).map((task) => (
                            <div
                                key={task.id}
                                className="flex items-start space-x-3 rounded-lg border p-3 shadow-sm"
                            >
                                {task.isCompleted ? (
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
                                ) : (
                                    <Circle className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                )}
                                <div className="flex-1 space-y-1">
                                    <p className={cn("font-medium leading-none", task.isCompleted && "line-through text-muted-foreground")}>
                                        {task.title}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{task.subjectCode}</span>
                                        <span className="flex items-center">
                                            <Clock className="mr-1 h-3 w-3" />
                                            {format(parseISO(task.dueDate), 'MMM d')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
