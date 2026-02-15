import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import VideoPage from './pages/VideoPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import { AuthProvider } from './contexts/AuthProvider';
import './styles/animations.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
                <Route path="/video/:id" element={<ProtectedRoute><VideoPage /></ProtectedRoute>} />
                <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
              </Routes>
            </AnimatePresence>
          </main>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '10px',
                padding: '16px',
              },
              success: {
                icon: '🎉',
                style: {
                  background: '#10b981',
                },
              },
              error: {
                icon: '❌',
                style: {
                  background: '#ef4444',
                },
              },
              loading: {
                icon: '⏳',
                style: {
                  background: '#3b82f6',
                },
              },
            }}
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;