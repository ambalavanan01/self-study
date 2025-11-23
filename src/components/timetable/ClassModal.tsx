import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import type { TimetableEntry } from '../../types';
import { X, Save } from 'lucide-react';
import { addMinutes, format, parse } from 'date-fns';

const classSchema = z.object({
    day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
    type: z.enum(['theory', 'lab']),
    slot: z.string().min(1, 'Required'),
    subjectName: z.string().min(1, 'Required'),
    subjectCode: z.string().min(1, 'Required'),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    credit: z.number().min(1),
});

type ClassFormValues = z.infer<typeof classSchema>;

interface ClassModalProps {
    onClose: () => void;
    onSave: (entry: TimetableEntry) => void;
}

export function ClassModal({ onClose, onSave }: ClassModalProps) {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<ClassFormValues>({
        resolver: zodResolver(classSchema),
        defaultValues: {
            day: 'Monday',
            type: 'theory',
            credit: 3,
            startTime: '08:00'
        },
    });

    const type = watch('type');

    const onSubmit = (data: ClassFormValues) => {
        const start = parse(data.startTime, 'HH:mm', new Date());
        const duration = data.type === 'theory' ? 90 : 100;
        const end = addMinutes(start, duration);
        const endTime = format(end, 'HH:mm');

        const newEntry: TimetableEntry = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            endTime,
        };

        onSave(newEntry);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-900">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Add Class</h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium">Day</label>
                        <select
                            {...register('day')}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Type</label>
                            <select
                                {...register('type')}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="theory">Theory</option>
                                <option value="lab">Lab</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Slot</label>
                            <Input {...register('slot')} placeholder={type === 'theory' ? 'e.g. A1' : 'e.g. Morning'} />
                            {errors.slot && <p className="text-xs text-destructive">{errors.slot.message}</p>}
                        </div>
                    </div>

                    <div>
                        <Input label="Subject Name" {...register('subjectName')} error={errors.subjectName?.message} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Input label="Subject Code" {...register('subjectCode')} error={errors.subjectCode?.message} />
                        </div>
                        <div>
                            <Input label="Credit" type="number" {...register('credit', { valueAsNumber: true })} error={errors.credit?.message} />
                        </div>
                    </div>

                    <div>
                        <Input label="Start Time" type="time" {...register('startTime')} error={errors.startTime?.message} />
                        <p className="mt-1 text-xs text-muted-foreground">
                            Duration: {type === 'theory' ? '90 mins' : '100 mins'}
                        </p>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">
                            <Save className="mr-2 h-4 w-4" /> Save Class
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
