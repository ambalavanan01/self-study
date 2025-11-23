import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Save } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';

interface TimerProps {
    onSessionComplete: (duration: number, type: 'focus' | 'break', notes?: string) => void;
}

export function Timer({ onSessionComplete }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [type, setType] = useState<'focus' | 'break'>('focus');
    const [notes, setNotes] = useState('');
    const [initialTime, setInitialTime] = useState(25 * 60);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            // Play sound or notification here
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(initialTime);
    };

    const handleTypeChange = (newType: 'focus' | 'break') => {
        setType(newType);
        setIsActive(false);
        const newTime = newType === 'focus' ? 25 * 60 : 5 * 60;
        setInitialTime(newTime);
        setTimeLeft(newTime);
    };

    const handleSave = () => {
        const duration = Math.round((initialTime - timeLeft) / 60);
        if (duration > 0) {
            onSessionComplete(duration, type, notes);
            setNotes('');
            resetTimer();
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((initialTime - timeLeft) / initialTime) * 100;

    return (
        <div className="flex flex-col items-center space-y-8 rounded-xl border bg-card p-8 shadow-sm">
            <div className="flex space-x-4 rounded-lg bg-muted p-1">
                <button
                    onClick={() => handleTypeChange('focus')}
                    className={cn(
                        "rounded-md px-4 py-2 text-sm font-medium transition-all",
                        type === 'focus' ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Focus
                </button>
                <button
                    onClick={() => handleTypeChange('break')}
                    className={cn(
                        "rounded-md px-4 py-2 text-sm font-medium transition-all",
                        type === 'break' ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Break
                </button>
            </div>

            <div className="relative flex h-64 w-64 items-center justify-center">
                {/* Circular Progress Background */}
                <svg className="absolute h-full w-full -rotate-90 transform">
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-muted"
                    />
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 120}
                        strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                        className={cn(
                            "transition-all duration-1000 ease-linear",
                            type === 'focus' ? "text-primary" : "text-green-500"
                        )}
                        strokeLinecap="round"
                    />
                </svg>

                <div className="text-6xl font-bold tracking-tighter">
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full"
                    onClick={toggleTimer}
                >
                    {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full"
                    onClick={resetTimer}
                >
                    <RotateCcw className="h-5 w-5" />
                </Button>
            </div>

            <div className="w-full max-w-sm space-y-4">
                <Input
                    placeholder="What are you working on?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="text-center"
                />
                <Button
                    className="w-full"
                    onClick={handleSave}
                    disabled={isActive || (initialTime - timeLeft) < 60} // Disable if less than 1 min elapsed
                >
                    <Save className="mr-2 h-4 w-4" />
                    Log Session
                </Button>
            </div>
        </div>
    );
}
