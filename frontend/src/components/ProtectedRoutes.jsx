import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Standard Protected Route (Must be logged in)
export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
          <span className="text-sm font-medium text-slate-500">Loading your profile...</span>
        </div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// Admin Route (Must be Admin)
export const AdminRoute = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
          <span className="text-sm font-medium text-slate-500">Verifying access rights...</span>
        </div>
      </div>
    );
  }

  return user && isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

// Officer Route (Must be Department Officer)
export const OfficerRoute = () => {
  const { user, isOfficer, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
          <span className="text-sm font-medium text-slate-500">Verifying access rights...</span>
        </div>
      </div>
    );
  }

  return user && isOfficer ? <Outlet /> : <Navigate to="/dashboard" replace />;
};
