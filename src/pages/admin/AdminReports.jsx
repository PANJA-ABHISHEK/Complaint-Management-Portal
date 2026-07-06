import React from 'react';
import Card from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';

const resolutionData = [
  { month: 'Jan', time: 22 }, { month: 'Feb', time: 18 },
  { month: 'Mar', time: 15 }, { month: 'Apr', time: 20 },
  { month: 'May', time: 12 }, { month: 'Jun', time: 10 },
];

const priorityData = [
  { name: 'High', value: 30, color: '#ef4444' },
  { name: 'Medium', value: 45, color: '#f59e0b' },
  { name: 'Low', value: 25, color: '#10b981' },
];

const statusTrend = [
  { month: 'Jan', submitted: 45, resolved: 38 },
  { month: 'Feb', submitted: 38, resolved: 35 },
  { month: 'Mar', submitted: 62, resolved: 50 },
  { month: 'Apr', submitted: 55, resolved: 52 },
  { month: 'May', submitted: 71, resolved: 65 },
  { month: 'Jun', submitted: 48, resolved: 46 },
];

const AdminReports = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Reports & Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed insights into complaint management performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Resolution Time Trend */}
        <Card>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Avg. Resolution Time (hours)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={resolutionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
              <Line type="monotone" dataKey="time" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Priority Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={priorityData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={5} dataKey="value">
                {priorityData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Submitted vs Resolved */}
      <Card>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Submitted vs Resolved Trend</h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={statusTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
            <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
            <Bar dataKey="submitted" fill="#6366f1" name="Submitted" radius={[4, 4, 0, 0]} />
            <Bar dataKey="resolved" fill="#10b981" name="Resolved" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default AdminReports;
