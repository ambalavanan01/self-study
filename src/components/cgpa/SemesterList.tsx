import type { Semester } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Edit2, Trash2 } from 'lucide-react';

interface SemesterListProps {
    semesters: Semester[];
}

export function SemesterList({ semesters }: SemesterListProps) {
    if (semesters.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                <h3 className="text-lg font-semibold">No semesters added yet</h3>
                <p className="text-sm text-muted-foreground">
                    Add your first semester to start tracking your CGPA.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {semesters.map((semester) => (
                <Card key={semester.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">
                            Year {semester.year} - {semester.term}
                        </CardTitle>
                        <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">GPA:</span>
                                <span className="font-bold">{semester.gpa.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Credits:</span>
                                <span>{semester.totalCredits}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subjects:</span>
                                <span>{semester.subjects.length}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
