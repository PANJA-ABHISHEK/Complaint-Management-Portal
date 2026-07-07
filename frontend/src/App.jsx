import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout wrappers
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Route protection guards
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoutes';

// Public pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutContactPage from './pages/AboutContactPage';

// Citizen pages
import UserDashboard from './pages/UserDashboard';
import NewComplaint from './pages/NewComplaint';
import MyComplaints from './pages/MyComplaints';
import ComplaintDetails from './pages/ComplaintDetails';
import ProfilePage from './pages/ProfilePage';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import AdminComplaints from './pages/AdminComplaints';
import AdminComplaintDetail from './pages/AdminComplaintDetail';
import AdminUsers from './pages/AdminUsers';
import AdminDepartments from './pages/AdminDepartments';
import AdminNotifications from './pages/AdminNotifications';
import AdminReports from './pages/AdminReports';

// Layout wrapping structure
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 relative">
        <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
        <main className="flex-1 bg-slate-50 flex flex-col min-w-0">
          <Outlet />
        </main>
      </div>
      {!user && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public / Generic Frame layouts */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about-contact" element={<AboutContactPage />} />

            {/* Citizen protected portal */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/new-complaint" element={<NewComplaint />} />
              <Route path="/my-complaints" element={<MyComplaints />} />
              <Route path="/complaint/:id" element={<ComplaintDetails />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Administrator/Officer protected portal */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/complaints" element={<AdminComplaints />} />
              <Route path="/admin/complaint/:id" element={<AdminComplaintDetail />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/departments" element={<AdminDepartments />} />
              <Route path="/admin/notifications" element={<AdminNotifications />} />
              <Route path="/admin/reports" element={<AdminReports />} />
            </Route>
          </Route>

          {/* Catch-all fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
