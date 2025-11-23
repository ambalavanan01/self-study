import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import CGPAManager from './pages/CGPAManager';
import Timetable from './pages/Timetable';
import FileManager from './pages/FileManager';
import TaskManager from './pages/TaskManager';
import StudySessions from './pages/StudySessions';
import Profile from './pages/Profile';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/cgpa" element={<CGPAManager />} />
                <Route path="/timetable" element={<Timetable />} />
                <Route path="/files" element={<FileManager />} />
                <Route path="/tasks" element={<TaskManager />} />
                <Route path="/study-sessions" element={<StudySessions />} />
                <Route path="/profile" element={<Profile />} />
                {/* Add other protected routes here */}
              </Route>
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
