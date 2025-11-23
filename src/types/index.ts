export interface Subject {
    id: string;
    name: string;
    code: string;
    grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
    credit: number;
}

export interface Semester {
    id: string;
    year: number;
    term: 'Fall' | 'Winter';
    subjects: Subject[];
    gpa: number;
    totalCredits: number;
}

export interface TimetableEntry {
    id: string;
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
    type: 'theory' | 'lab';
    slot: string;
    subjectName: string;
    subjectCode: string;
    startTime: string; // HH:MM
    endTime: string; // HH:MM
    credit: number;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    subjectId?: string;
    subjectCode?: string;
    dueDate: string; // ISO string
    isCompleted: boolean;
    createdAt: Date;
}

export interface FileItem {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    createdAt: Date;
    path: string; // Storage path
}

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    college?: string;
    program?: string;
    preferences: {
        darkMode: boolean;
        defaultSemester?: string;
    };
}

export interface StudySession {
    id: string;
    userId: string;
    startTime: Date;
    endTime: Date;
    duration: number; // in minutes
    subjectId?: string;
    subjectName?: string;
    notes?: string;
    type: 'focus' | 'break';
}
