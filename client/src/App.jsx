import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Common
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import HomePage from './pages/home/HomePage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import NewComplaint from './pages/user/NewComplaint';
import MyComplaints from './pages/user/MyComplaints';
import ComplaintDetail from './pages/user/ComplaintDetail';
import UserProfile from './pages/user/UserProfile';
import UserNotifications from './pages/user/UserNotifications';

// Officer Pages
import OfficerDashboard from './pages/officer/OfficerDashboard';
import OfficerComplaints from './pages/officer/OfficerComplaints';
import OfficerComplaintDetail from './pages/officer/OfficerComplaintDetail';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDepartments from './pages/admin/AdminDepartments';
import AdminReports from './pages/admin/AdminReports';
import AdminFeedback from './pages/admin/AdminFeedback';

// Error Pages
import NotFoundPage from './pages/errors/NotFoundPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '12px',
                background: '#1e293b',
                color: '#f8fafc',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
            </Route>

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* User Routes */}
            <Route
              element={
                <ProtectedRoute roles={['user', 'admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/new-complaint" element={<NewComplaint />} />
              <Route path="/user/complaints" element={<MyComplaints />} />
              <Route path="/user/complaints/:id" element={<ComplaintDetail />} />
              <Route path="/user/profile" element={<UserProfile />} />
              <Route path="/user/notifications" element={<UserNotifications />} />
            </Route>

            {/* Officer Routes */}
            <Route
              element={
                <ProtectedRoute roles={['officer', 'admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/officer/dashboard" element={<OfficerDashboard />} />
              <Route path="/officer/complaints" element={<OfficerComplaints />} />
              <Route path="/officer/complaints/:id" element={<OfficerComplaintDetail />} />
            </Route>

            {/* Admin Routes */}
            <Route
              element={
                <ProtectedRoute roles={['admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/complaints" element={<AdminComplaints />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/departments" element={<AdminDepartments />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/feedback" element={<AdminFeedback />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
