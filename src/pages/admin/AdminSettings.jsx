import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { Moon, Sun, Globe, Bell, Shield } from 'lucide-react';

const AdminSettings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-8">Admin Settings</h1>

      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Appearance</h2>
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-dark-bg rounded-xl">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-slate-400" /> : <Sun className="w-5 h-5 text-slate-400" />}
              <div>
                <p className="font-semibold text-sm text-slate-900 dark:text-white">Dark Mode</p>
                <p className="text-xs text-slate-500">Toggle between light and dark theme</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-primary-500' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${theme === 'dark' ? 'left-6.5' : 'left-0.5'}`} />
            </button>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Security</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-dark-bg rounded-xl">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-slate-400" />
                <span className="font-semibold text-sm text-slate-900 dark:text-white">Two-Factor Authentication</span>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
