import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import type { Semester, Subject } from '../../types';
import { X, Plus, Save, Trash2 } from 'lucide-react';

const subjectSchema = z.object({
    name: z.string().min(1, 'Required'),
    code: z.string().min(1, 'Required'),
    grade: z.enum(['S', 'A', 'B', 'C', 'D', 'E', 'F']),
    credit: z.number().min(1),
});

const semesterSchema = z.object({
    year: z.number().min(1).max(5),
    term: z.enum(['Fall', 'Winter']),
    subjects: z.array(subjectSchema),
});

type SemesterFormValues = z.infer<typeof semesterSchema>;

interface SemesterFormProps {
    onClose: () => void;
    onSave: (semester: Semester) => void;
}

export function SemesterForm({ onClose, onSave }: SemesterFormProps) {
    const { register, control, handleSubmit, watch } = useForm<SemesterFormValues>({
        resolver: zodResolver(semesterSchema),
        defaultValues: {
            year: 1,
            term: 'Fall',
            subjects: [{ name: '', code: '', grade: 'S', credit: 3 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'subjects',
    });

    const calculateGPA = (subjects: SemesterFormValues['subjects']) => {
        const gradePoints: Record<string, number> = {
            'S': 10, 'A': 9, 'B': 8, 'C': 7, 'D': 6, 'E': 5, 'F': 0
        };

        let totalPoints = 0;
        let totalCredits = 0;

        subjects.forEach(sub => {
            totalPoints += gradePoints[sub.grade] * sub.credit;
            totalCredits += sub.credit;
        });

        return totalCredits === 0 ? 0 : totalPoints / totalCredits;
    };

    const onSubmit = (data: SemesterFormValues) => {
        const gpa = calculateGPA(data.subjects);
        const totalCredits = data.subjects.reduce((sum, sub) => sum + sub.credit, 0);

        const subjectsWithIds: Subject[] = data.subjects.map(sub => ({
            ...sub,
            id: Math.random().toString(36).substr(2, 9)
        }));

        const newSemester: Semester = {
            id: Math.random().toString(36).substr(2, 9), // Mock ID
            year: data.year,
            term: data.term,
            subjects: subjectsWithIds,
            gpa,
            totalCredits,
        };

        onSave(newSemester);
    };

    const currentSubjects = watch('subjects');
    const currentGPA = calculateGPA(currentSubjects);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Add Semester</h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Year</label>
                            <select
                                {...register('year', { valueAsNumber: true })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Term</label>
                            <select
                                {...register('term')}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="Fall">Fall</option>
                                <option value="Winter">Winter</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Subjects</h3>
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', code: '', grade: 'S', credit: 3 })}>
                                <Plus className="mr-2 h-4 w-4" /> Add Subject
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-12 gap-2 items-end">
                                    <div className="col-span-4">
                                        <Input placeholder="Subject Name" {...register(`subjects.${index}.name`)} />
                                    </div>
                                    <div className="col-span-2">
                                        <Input placeholder="Code" {...register(`subjects.${index}.code`)} />
                                    </div>
                                    <div className="col-span-2">
                                        <select
                                            {...register(`subjects.${index}.grade`)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        >
                                            {['S', 'A', 'B', 'C', 'D', 'E', 'F'].map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <select
                                            {...register(`subjects.${index}.credit`, { valueAsNumber: true })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        >
                                            {[1, 1.5, 2, 3, 4].map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                        <div className="text-lg font-semibold">
                            Projected GPA: <span className="text-primary">{currentGPA.toFixed(2)}</span>
                        </div>
                        <div className="space-x-2">
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit">
                                <Save className="mr-2 h-4 w-4" /> Save Semester
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
