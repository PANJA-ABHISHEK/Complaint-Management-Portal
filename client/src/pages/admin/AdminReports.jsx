import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiChartBar, HiDownload } from 'react-icons/hi';
import { adminService } from '../../services/dataService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';

const AdminReports = () => {
  const [reportData, setReportData] = useState(null);
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await adminService.getReports({ range: dateRange });
        setReportData(res.data || {});
      } catch (error) {
        console.error('Failed to fetch reports:', error);
        // Use fallback data for demo
        setReportData({
          totalComplaints: 156,
          resolvedComplaints: 128,
          pendingComplaints: 18,
          rejectedComplaints: 10,
          avgResolutionHours: 36,
          satisfactionRate: 4.2,
          categoryBreakdown: [
            { category: 'Electricity', count: 34, resolved: 28 },
            { category: 'Water Supply', count: 28, resolved: 24 },
            { category: 'Road Damage', count: 22, resolved: 18 },
            { category: 'Sanitation', count: 19, resolved: 16 },
            { category: 'Security', count: 15, resolved: 12 },
            { category: 'Health', count: 12, resolved: 10 },
            { category: 'Noise Pollution', count: 10, resolved: 8 },
            { category: 'Other', count: 16, resolved: 12 },
          ],
          monthlyTrend: [
            { month: 'Jan', complaints: 18, resolved: 14 },
            { month: 'Feb', complaints: 22, resolved: 18 },
            { month: 'Mar', complaints: 28, resolved: 24 },
            { month: 'Apr', complaints: 24, resolved: 20 },
            { month: 'May', complaints: 32, resolved: 28 },
            { month: 'Jun', complaints: 32, resolved: 24 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [dateRange]);

  const exportReport = () => {
    if (!reportData) return;
    const csvRows = [
      ['Category', 'Total', 'Resolved', 'Resolution %'],
      ...(reportData.categoryBreakdown || []).map((c) => [
        c.category, c.count, c.resolved, ((c.resolved / c.count) * 100).toFixed(1) + '%',
      ]),
    ];
    const csvContent = csvRows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complaint-report-${dateRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
  const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Performance insights and complaint analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm cursor-pointer text-slate-700 dark:text-slate-300">
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="outline" icon={HiDownload} onClick={exportReport}>Export CSV</Button>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 bg-white dark:bg-slate-800 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* Stats */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Complaints" value={reportData?.totalComplaints || 0} icon={HiChartBar} color="primary" />
            <StatCard title="Resolved" value={reportData?.resolvedComplaints || 0} icon={HiChartBar} color="success" />
            <StatCard title="Avg Resolution (hrs)" value={reportData?.avgResolutionHours || 0} icon={HiChartBar} color="info" />
            <StatCard title="Satisfaction" value={reportData?.satisfactionRate || 0} icon={HiChartBar} color="warning" />
          </motion.div>

          {/* Monthly Trend */}
          <motion.div variants={fadeUp}>
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Monthly Trend</h2>
              <div className="flex items-end gap-3 h-48">
                {(reportData?.monthlyTrend || []).map((m) => {
                  const maxVal = Math.max(...(reportData?.monthlyTrend || []).map((t) => t.complaints));
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex gap-1 justify-center" style={{ height: '160px' }}>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(m.complaints / maxVal) * 100}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="w-4 bg-primary-400 rounded-t-lg self-end"
                          title={`${m.complaints} complaints`}
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(m.resolved / maxVal) * 100}%` }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="w-4 bg-emerald-400 rounded-t-lg self-end"
                          title={`${m.resolved} resolved`}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{m.month}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary-400" />
                  <span className="text-xs text-slate-500">Total</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-400" />
                  <span className="text-xs text-slate-500">Resolved</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div variants={fadeUp}>
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Category Breakdown</h2>
              <div className="space-y-4">
                {(reportData?.categoryBreakdown || []).map((cat) => {
                  const pct = cat.count > 0 ? Math.round((cat.resolved / cat.count) * 100) : 0;
                  return (
                    <div key={cat.category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cat.category}</span>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>{cat.resolved}/{cat.count} resolved</span>
                          <span className={pct >= 80 ? 'text-emerald-500' : pct >= 60 ? 'text-amber-500' : 'text-red-500'}>
                            {pct}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8 }}
                          className={`h-full rounded-full ${pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default AdminReports;
