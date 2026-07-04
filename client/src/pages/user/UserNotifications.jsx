import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiBell, HiCheck, HiTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { notificationService } from '../../services/dataService';
import { formatDateTime } from '../../utils/constants';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationService.getNotifications();
        setNotifications(res.data?.notifications || []);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const typeColors = {
    complaint_submitted: 'bg-primary-500',
    status_update: 'bg-blue-500',
    complaint_assigned: 'bg-purple-500',
    complaint_resolved: 'bg-emerald-500',
    feedback_received: 'bg-amber-500',
    default: 'bg-slate-500',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" icon={HiCheck} onClick={markAllAsRead}>
            Mark All Read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-white dark:bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <HiBell className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No notifications</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              You'll be notified when there are updates to your complaints
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <motion.div
              key={notif._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`glass-card p-4 flex items-start gap-4 ${
                !notif.isRead ? 'ring-1 ring-primary-200 dark:ring-primary-500/30 bg-primary-50/50 dark:bg-primary-500/5' : ''
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${typeColors[notif.type] || typeColors.default}`} />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{notif.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{notif.message}</p>
                <p className="text-xs text-slate-400 mt-1">{formatDateTime(notif.createdAt)}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {!notif.isRead && (
                  <button
                    onClick={() => markAsRead(notif._id)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-primary-500 transition-colors cursor-pointer"
                    title="Mark as read"
                  >
                    <HiCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notif._id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default UserNotifications;
