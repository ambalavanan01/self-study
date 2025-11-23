import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function Landing() {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="flex h-16 items-center justify-between border-b px-6 lg:px-8">
                <div className="text-xl font-bold text-primary">StudyTrack</div>
                <div className="space-x-4">
                    <Link to="/login">
                        <Button variant="ghost">Log in</Button>
                    </Link>
                    <Link to="/signup">
                        <Button>Get Started</Button>
                    </Link>
                </div>
            </header>
            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                            Master your college life
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                            Track your CGPA, manage your timetable, organize files, and stay on top of assignments.
                            All in one place.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link to="/signup">
                                <Button size="lg">Start Tracking Now</Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="outline" size="lg">
                                    I already have an account
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
