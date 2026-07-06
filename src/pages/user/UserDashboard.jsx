import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, AlertTriangle, PlusCircle, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, complaintsData] = await Promise.all([
        api.stats.get(false),
        api.complaints.getAll(user.id)
      ]);
      setStats(statsData);
      setComplaints(complaintsData.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pieData = [
    { name: 'Pending', value: stats.pending || 1, color: '#f59e0b' },
    { name: 'In Progress', value: stats.inProgress || 1, color: '#8b5cf6' },
    { name: 'Resolved', value: stats.resolved || 1, color: '#10b981' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Here's what's happening with your complaints.</p>
        </div>
        <Link to="/user/complaints/new">
          <Button icon={PlusCircle}>New Complaint</Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Complaints" value={stats.total} icon={FileText} color="primary" trend={{ value: 12, isPositive: true }} />
        <StatCard title="Pending" value={stats.pending} icon={Clock} color="amber" />
        <StatCard title="In Progress" value={stats.inProgress} icon={AlertTriangle} color="red" />
        <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle} color="emerald" trend={{ value: 8, isPositive: true }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Complaints */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Complaints</h2>
              <Link to="/user/complaints" className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {complaints.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">No complaints yet</p>
                <Link to="/user/complaints/new" className="text-sm text-primary-600 font-semibold mt-2 inline-block">File your first complaint</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {complaints.map((c) => (
                  <Link 
                    key={c.id} 
                    to={`/user/complaints/${c.id}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-dark-bg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">{c.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{c.category} • {new Date(c.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      <PriorityBadge priority={c.priority} />
                      <StatusBadge status={c.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Status Overview Chart */}
        <Card>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Status Overview</h2>
          <div className="flex items-center justify-center h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
