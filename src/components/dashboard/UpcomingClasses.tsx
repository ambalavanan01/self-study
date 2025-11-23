import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { TimetableEntry } from '../../types';
import { Clock, MapPin } from 'lucide-react';

interface UpcomingClassesProps {
    classes: TimetableEntry[];
}

export function UpcomingClasses({ classes }: UpcomingClassesProps) {
    // Sort classes by start time (assuming they are for today)
    // In a real app, we'd filter for today and sort
    const sortedClasses = [...classes].sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
    );

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
            <CardHeader>
                <CardTitle className="text-lg font-medium">Upcoming Classes</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {sortedClasses.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No classes scheduled for today.</p>
                    ) : (
                        sortedClasses.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-lg border p-3 shadow-sm"
                            >
                                <div className="space-y-1">
                                    <p className="font-medium leading-none">{item.subjectName}</p>
                                    <p className="text-xs text-muted-foreground">{item.subjectCode}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center justify-end text-sm font-medium">
                                        <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                                        {item.startTime} - {item.endTime}
                                    </div>
                                    <div className="flex items-center justify-end text-xs text-muted-foreground">
                                        <MapPin className="mr-1 h-3 w-3" />
                                        {item.slot}
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
