import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiDocumentText, HiClock, HiCheckCircle, HiExclamationCircle,
  HiPlusCircle, HiArrowRight, HiBell,
} from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext';
import { complaintService, notificationService } from '../../services/dataService';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { getStatusVariant, formatDate, PRIORITY_COLORS } from '../../utils/constants';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [complaintsRes, notifRes] = await Promise.all([
          complaintService.getMyComplaints({ limit: 5 }),
          notificationService.getNotifications({ limit: 5 }),
        ]);

        const complaints = complaintsRes.data?.complaints || [];
        setRecentComplaints(complaints);
        setNotifications(notifRes.data?.notifications || []);

        setStats({
          total: complaintsRes.data?.total || complaints.length,
          pending: complaints.filter((c) => c.status === 'Pending').length,
          inProgress: complaints.filter((c) => ['Assigned', 'In Progress'].includes(c.status)).length,
          resolved: complaints.filter((c) => c.status === 'Resolved').length,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
  const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, {user?.name}. Here's your complaint overview.
          </p>
        </div>
        <Link to="/user/new-complaint">
          <Button icon={HiPlusCircle}>New Complaint</Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Complaints" value={stats.total} icon={HiDocumentText} color="primary" />
        <StatCard title="Pending" value={stats.pending} icon={HiClock} color="warning" />
        <StatCard title="In Progress" value={stats.inProgress} icon={HiExclamationCircle} color="info" />
        <StatCard title="Resolved" value={stats.resolved} icon={HiCheckCircle} color="success" />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Complaints */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Complaints</h2>
              <Link to="/user/complaints" className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
                View All <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recentComplaints.length === 0 ? (
              <div className="text-center py-12">
                <HiDocumentText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500 dark:text-slate-400">No complaints yet</p>
                <Link to="/user/new-complaint" className="text-sm text-primary-500 hover:text-primary-600 mt-2 inline-block">
                  Register your first complaint →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentComplaints.map((complaint) => (
                  <Link
                    key={complaint._id}
                    to={`/user/complaints/${complaint._id}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-400">{complaint.complaintId}</span>
                        <span className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[complaint.priority]}`} />
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{complaint.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{formatDate(complaint.createdAt)}</p>
                    </div>
                    <Badge variant={getStatusVariant(complaint.status)} dot>{complaint.status}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={fadeUp}>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Notifications</h2>
              <Link to="/user/notifications" className="text-sm text-primary-500 hover:text-primary-600">
                View All
              </Link>
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <HiBell className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">No notifications</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif._id}
                    className={`p-3 rounded-xl text-sm ${
                      notif.isRead
                        ? 'bg-slate-50 dark:bg-slate-800/50'
                        : 'bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20'
                    }`}
                  >
                    <p className="font-medium text-slate-900 dark:text-white">{notif.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notif.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatDate(notif.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserDashboard;
