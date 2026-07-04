import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiClipboardList, HiClock, HiCheckCircle, HiExclamationCircle,
  HiArrowRight,
} from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext';
import { complaintService } from '../../services/dataService';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { getStatusVariant, formatDate, PRIORITY_COLORS } from '../../utils/constants';

const OfficerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [assignedComplaints, setAssignedComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await complaintService.getAssignedComplaints({ limit: 8 });
        const complaints = res.data?.complaints || [];
        setAssignedComplaints(complaints);

        setStats({
          total: res.data?.total || complaints.length,
          pending: complaints.filter((c) => c.status === 'Assigned').length,
          inProgress: complaints.filter((c) => c.status === 'In Progress').length,
          resolved: complaints.filter((c) => ['Resolved', 'Closed'].includes(c.status)).length,
        });
      } catch (error) {
        console.error('Failed to fetch officer data:', error);
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
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Officer Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Welcome, {user?.name}. Here are your assigned complaints.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Assigned" value={stats.total} icon={HiClipboardList} color="primary" />
        <StatCard title="New / Pending" value={stats.pending} icon={HiClock} color="warning" />
        <StatCard title="In Progress" value={stats.inProgress} icon={HiExclamationCircle} color="info" />
        <StatCard title="Resolved" value={stats.resolved} icon={HiCheckCircle} color="success" />
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Assigned Complaints</h2>
            <Link to="/officer/complaints" className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
              View All <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : assignedComplaints.length === 0 ? (
            <div className="text-center py-12">
              <HiClipboardList className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">No complaints assigned yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-3">ID</th>
                    <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-3">Title</th>
                    <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-3">Category</th>
                    <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-3">Priority</th>
                    <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-3">Status</th>
                    <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {assignedComplaints.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 pr-4">
                        <Link to={`/officer/complaints/${c._id}`} className="text-xs font-mono text-primary-500 hover:underline">
                          {c.complaintId}
                        </Link>
                      </td>
                      <td className="py-3 pr-4">
                        <Link to={`/officer/complaints/${c._id}`} className="text-sm font-medium text-slate-900 dark:text-white hover:text-primary-500 truncate max-w-[200px] block">
                          {c.title}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-sm text-slate-500 dark:text-slate-400">{c.category}</td>
                      <td className="py-3 pr-4">
                        <span className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[c.priority]}`} />
                          <span className="text-sm capitalize text-slate-600 dark:text-slate-300">{c.priority}</span>
                        </span>
                      </td>
                      <td className="py-3 pr-4"><Badge variant={getStatusVariant(c.status)} dot>{c.status}</Badge></td>
                      <td className="py-3 text-sm text-slate-500 dark:text-slate-400">{formatDate(c.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default OfficerDashboard;
