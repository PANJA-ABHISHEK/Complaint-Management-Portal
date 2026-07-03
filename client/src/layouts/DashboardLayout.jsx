import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import ThemeToggle from '../components/layout/ThemeToggle';
import { HiMenu, HiBell } from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-dark-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <HiMenu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                Welcome, {user?.name?.split(' ')[0]}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 relative cursor-pointer">
                <HiBell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
