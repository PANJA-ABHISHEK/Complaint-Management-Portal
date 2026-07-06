import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, CheckCircle, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { api } from '../../services/api';

const monthlyData = [
  { month: 'Jan', complaints: 45 }, { month: 'Feb', complaints: 38 },
  { month: 'Mar', complaints: 62 }, { month: 'Apr', complaints: 55 },
  { month: 'May', complaints: 71 }, { month: 'Jun', complaints: 48 },
];

const categoryData = [
  { name: 'Infrastructure', value: 35, color: '#6366f1' },
  { name: 'Utilities', value: 25, color: '#8b5cf6' },
  { name: 'Sanitation', value: 20, color: '#10b981' },
  { name: 'Safety', value: 12, color: '#f59e0b' },
  { name: 'Other', value: 8, color: '#64748b' },
];

const deptPerformance = [
  { name: 'Public Works', resolved: 85, pending: 15 },
  { name: 'Electrical', resolved: 72, pending: 28 },
  { name: 'Water Supply', resolved: 90, pending: 10 },
  { name: 'Health', resolved: 65, pending: 35 },
  { name: 'Police', resolved: 78, pending: 22 },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, complaintsData] = await Promise.all([
        api.stats.get(true),
        api.complaints.getAll()
      ]);
      setStats(statsData);
      setComplaints(complaintsData.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Overview of all complaint activities and system metrics.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Complaints" value={stats.total} icon={FileText} color="primary" trend={{ value: 15, isPositive: true }} />
        <StatCard title="Pending Review" value={stats.pending} icon={Clock} color="amber" />
        <StatCard title="In Progress" value={stats.inProgress} icon={AlertTriangle} color="red" />
        <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle} color="emerald" trend={{ value: 23, isPositive: true }} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Trend */}
        <Card>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Monthly Complaints</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="complaints" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">By Category</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={4} dataKey="value">
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Department Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Department Performance</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={deptPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="#94a3b8" width={100} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                <Bar dataKey="resolved" fill="#10b981" radius={[0, 4, 4, 0]} name="Resolved %" />
                <Bar dataKey="pending" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Pending %" />
                <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Complaints */}
        <Card>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Complaints</h2>
          {complaints.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No complaints yet.</p>
          ) : (
            <div className="space-y-3">
              {complaints.map((c) => (
                <div key={c.id} className="p-3 bg-slate-50 dark:bg-dark-bg rounded-xl">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{c.title}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
