import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import {
    LayoutDashboard,
    GraduationCap,
    Calendar,
    CheckSquare,
    Clock,
    Settings,
    X,
    FolderOpen
} from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'CGPA Manager', href: '/cgpa', icon: GraduationCap },
    { name: 'Timetable', href: '/timetable', icon: Calendar },
    { name: 'Files', href: '/files', icon: FolderOpen },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Study Sessions', href: '/study-sessions', icon: Clock },
    { name: 'Profile & Settings', href: '/profile', icon: Settings },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation();

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-64 transform bg-white px-6 pb-4 transition-transform duration-300 ease-in-out dark:bg-gray-900 lg:static lg:translate-x-0 lg:border-r lg:border-gray-200 dark:lg:border-gray-800',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex h-16 items-center justify-between">
                    <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <GraduationCap className="h-8 w-8" />
                        <span>StudyTrack</span>
                    </Link>
                    <button
                        onClick={onClose}
                        className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="mt-8 space-y-1">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => onClose()} // Close sidebar on mobile when link clicked
                                className={cn(
                                    'group flex items-center gap-x-3 rounded-md px-2 py-2 text-sm font-semibold leading-6',
                                    isActive
                                        ? 'bg-gray-50 text-primary dark:bg-gray-800 dark:text-white'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        'h-6 w-6 shrink-0',
                                        isActive ? 'text-primary dark:text-white' : 'text-gray-400 group-hover:text-primary dark:text-gray-400 dark:group-hover:text-white'
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}
