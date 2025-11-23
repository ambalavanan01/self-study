import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CGPASummaryProps {
    cgpa: number;
    semesterGpa: number;
    totalCredits: number;
}

export function CGPASummary({ cgpa, semesterGpa, totalCredits }: CGPASummaryProps) {
    // Mock trend for now
    const trend = 'up';

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current CGPA</CardTitle>
                    {trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : trend === 'down' ? (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                        <Minus className="h-4 w-4 text-gray-500" />
                    )}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{cgpa.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                        Overall performance
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Semester GPA</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{semesterGpa.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                        Current semester
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalCredits}</div>
                    <p className="text-xs text-muted-foreground">
                        Credits earned
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
