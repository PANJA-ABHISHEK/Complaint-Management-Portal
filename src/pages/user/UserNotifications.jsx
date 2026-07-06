import React from 'react';
import Card from '../../components/ui/Card';
import { Bell, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const fakeNotifications = [
  { id: 1, type: 'status', title: 'Complaint Updated', message: 'Your complaint "Pothole on Main Street" status changed to In Progress.', time: '2 hours ago', read: false },
  { id: 2, type: 'resolved', title: 'Complaint Resolved', message: 'Your complaint "Streetlight completely broken" has been resolved.', time: '1 day ago', read: false },
  { id: 3, type: 'info', title: 'Welcome!', message: 'Thank you for joining ComplaintPortal. Start by filing your first complaint.', time: '3 days ago', read: true },
];

const icons = {
  status: { icon: Clock, color: 'bg-blue-50 text-blue-500 dark:bg-blue-500/10' },
  resolved: { icon: CheckCircle, color: 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10' },
  info: { icon: Bell, color: 'bg-amber-50 text-amber-500 dark:bg-amber-500/10' },
};

const UserNotifications = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-8">Notifications</h1>
      <div className="space-y-3">
        {fakeNotifications.map((n) => {
          const { icon: Icon, color } = icons[n.type] || icons.info;
          return (
            <Card key={n.id} className={`transition-colors ${!n.read ? 'border-l-4 border-l-primary-500' : ''}`}>
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl ${color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{n.title}</h3>
                    <span className="text-xs text-slate-400 whitespace-nowrap">{n.time}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default UserNotifications;
