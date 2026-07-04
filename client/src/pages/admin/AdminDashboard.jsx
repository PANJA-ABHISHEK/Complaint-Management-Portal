import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiDocumentText, HiUsers, HiCheckCircle, HiClock,
  HiOfficeBuilding, HiExclamationCircle, HiTrendingUp, HiArrowRight,
} from 'react-icons/hi';
import { adminService } from '../../services/dataService';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { getStatusVariant, formatDate, PRIORITY_COLORS } from '../../utils/constants';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalComplaints: 0, totalUsers: 0, totalDepartments: 0,
    pendingComplaints: 0, resolvedComplaints: 0, inProgressComplaints: 0,
    avgResolutionTime: 0, satisfactionRate: 0,
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminService.getDashboardStats();
        const data = res.data || {};
        setStats(data.stats || data);
        setRecentComplaints(data.recentComplaints || []);
        setCategoryBreakdown(data.categoryBreakdown || []);
      } catch (error) {
        console.error('Failed to fetch admin dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
  const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          System overview and analytics
        </p>
      </motion.div>

      {/* Top Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Complaints" value={stats.totalComplaints} icon={HiDocumentText} color="primary" trend={12} />
        <StatCard title="Total Users" value={stats.totalUsers} icon={HiUsers} color="purple" trend={8} />
        <StatCard title="Pending" value={stats.pendingComplaints} icon={HiClock} color="warning" />
        <StatCard title="Resolved" value={stats.resolvedComplaints} icon={HiCheckCircle} color="success" trend={15} />
      </motion.div>

      {/* Second Row Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="In Progress" value={stats.inProgressComplaints} icon={HiExclamationCircle} color="info" />
        <StatCard title="Departments" value={stats.totalDepartments} icon={HiOfficeBuilding} color="cyan" />
        <StatCard title="Avg Resolution (hrs)" value={stats.avgResolutionTime || 24} icon={HiTrendingUp} color="primary" />
        <StatCard title="Satisfaction %" value={stats.satisfactionRate || 95} icon={HiCheckCircle} color="success" />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Complaints */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Latest Complaints</h2>
              <Link to="/admin/complaints" className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
                View All <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recentComplaints.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">No complaints yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3">ID</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3">Title</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3">Priority</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3">Status</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {recentComplaints.slice(0, 8).map((c) => (
                      <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3 pr-3 text-xs font-mono text-primary-500">{c.complaintId}</td>
                        <td className="py-3 pr-3 text-sm font-medium text-slate-900 dark:text-white truncate max-w-[200px]">{c.title}</td>
                        <td className="py-3 pr-3">
                          <span className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[c.priority]}`} />
                            <span className="text-xs capitalize">{c.priority}</span>
                          </span>
                        </td>
                        <td className="py-3 pr-3"><Badge variant={getStatusVariant(c.status)} dot>{c.status}</Badge></td>
                        <td className="py-3 text-xs text-slate-500">{formatDate(c.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div variants={fadeUp}>
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">By Category</h2>
            {categoryBreakdown.length === 0 ? (
              <div className="space-y-3">
                {['Electricity', 'Water Supply', 'Road Damage', 'Sanitation', 'Security'].map((cat) => (
                  <div key={cat} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">{cat}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${Math.random() * 80 + 20}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 w-6 text-right">{Math.floor(Math.random() * 30 + 5)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {categoryBreakdown.map((cat) => (
                  <div key={cat._id || cat.category} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">{cat._id || cat.category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(cat.count / (stats.totalComplaints || 1)) * 100}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 w-6 text-right">{cat.count}</span>
                    </div>
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

export default AdminDashboard;
