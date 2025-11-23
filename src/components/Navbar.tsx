import { Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';


interface NavbarProps {
    onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
    const { currentUser } = useAuth();

    return (
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:gap-x-6 sm:px-6 lg:px-8">
            <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-200 lg:hidden"
                onClick={onMenuClick}
            >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className="flex flex-1" />
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    {/* Profile dropdown or user info could go here */}
                    <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                        <span className="sr-only">Your profile</span>
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            {currentUser?.email?.charAt(0).toUpperCase()}
                        </div>
                        <span className="hidden lg:flex lg:items-center">
                            <span className="ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-white" aria-hidden="true">
                                {currentUser?.displayName || currentUser?.email}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
