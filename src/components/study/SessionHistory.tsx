import { format } from 'date-fns';
import { Clock, BookOpen, Coffee } from 'lucide-react';
import type { StudySession } from '../../types';
import { cn } from '../../lib/utils';

interface SessionHistoryProps {
    sessions: StudySession[];
}

export function SessionHistory({ sessions }: SessionHistoryProps) {
    return (
        <div className="rounded-xl border bg-card shadow-sm">
            <div className="border-b p-4">
                <h3 className="font-semibold">Recent Sessions</h3>
            </div>
            <div className="divide-y">
                {sessions.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        No sessions recorded yet. Start focusing!
                    </div>
                ) : (
                    sessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50">
                            <div className="flex items-center space-x-4">
                                <div className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-full",
                                    session.type === 'focus' ? "bg-primary/10 text-primary" : "bg-green-100 text-green-600 dark:bg-green-900/30"
                                )}>
                                    {session.type === 'focus' ? <BookOpen className="h-5 w-5" /> : <Coffee className="h-5 w-5" />}
                                </div>
                                <div>
                                    <p className="font-medium">
                                        {session.notes || (session.type === 'focus' ? 'Focus Session' : 'Break')}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(session.startTime, 'MMM d, h:mm a')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center text-sm font-medium">
                                <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                                {session.duration} min
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
