import type { TimetableEntry } from '../../types';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

interface TimetableViewProps {
    timetable: TimetableEntry[];
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export function TimetableView({ timetable }: TimetableViewProps) {
    const getClassesForDay = (day: string) => {
        return timetable
            .filter((entry) => entry.day === day)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    };

    return (
        <div className="grid gap-6 lg:grid-cols-5">
            {days.map((day) => {
                const classes = getClassesForDay(day);
                return (
                    <div key={day} className="space-y-4">
                        <h3 className="font-semibold text-lg text-center lg:text-left">{day}</h3>
                        <div className="space-y-3">
                            {classes.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                                    No classes
                                </div>
                            ) : (
                                classes.map((entry) => (
                                    <Card key={entry.id} className={cn("overflow-hidden", entry.type === 'lab' ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-green-500')}>
                                        <CardContent className="p-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold text-sm">{entry.subjectCode}</p>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">{entry.subjectName}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                                        {entry.slot}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                                                <span>{entry.startTime} - {entry.endTime}</span>
                                                <span className="capitalize">{entry.type}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
