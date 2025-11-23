import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/button';
import { Moon, Sun, User, LogOut } from 'lucide-react';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const { currentUser } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">{currentUser?.displayName || 'User'}</h2>
                        <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                    </div>
                </div>

                <div className="pt-6 border-t">
                    <h3 className="text-lg font-medium mb-4">Appearance</h3>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="font-medium">Theme</p>
                            <p className="text-sm text-muted-foreground">
                                Select your preferred theme for the application.
                            </p>
                        </div>
                        <div className="flex items-center space-x-2 bg-muted p-1 rounded-lg">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setTheme('light')}
                                className={theme === 'light' ? 'bg-background shadow-sm' : ''}
                            >
                                <Sun className="h-4 w-4 mr-2" />
                                Light
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setTheme('dark')}
                                className={theme === 'dark' ? 'bg-background shadow-sm' : ''}
                            >
                                <Moon className="h-4 w-4 mr-2" />
                                Dark
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setTheme('system')}
                                className={theme === 'system' ? 'bg-background shadow-sm' : ''}
                            >
                                <span className="text-xs">System</span>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t">
                    <h3 className="text-lg font-medium mb-4">Data Management</h3>
                    <div className="flex space-x-4">
                        <Button variant="outline" onClick={() => alert('Export functionality coming soon!')}>
                            Export Data
                        </Button>
                        <Button variant="outline" onClick={() => alert('Import functionality coming soon!')}>
                            Import Data
                        </Button>
                    </div>
                </div>

                <div className="pt-6 border-t">
                    <h3 className="text-lg font-medium mb-4">Account</h3>
                    <Button variant="danger" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </div>
    );
}
