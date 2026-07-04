import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch, HiClipboardList } from 'react-icons/hi';
import { complaintService } from '../../services/dataService';
import { getStatusVariant, formatDate, PRIORITY_COLORS } from '../../utils/constants';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const OfficerComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await complaintService.getAssignedComplaints(params);
      setComplaints(res.data?.complaints || []);
      setTotalPages(res.data?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch assigned complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, [page, statusFilter]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchComplaints(); };

  const statuses = ['Assigned', 'In Progress', 'Under Review', 'Resolved', 'Closed', 'Rejected'];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Assigned Complaints</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage complaints assigned to you</p>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search complaints..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-slate-900 dark:text-white"
            />
          </form>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer"
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />)}
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-16">
            <HiClipboardList className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No complaints found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">No complaints match your filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3">ID</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3">Title</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3">User</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3">Priority</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3">Status</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {complaints.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 pr-4">
                        <Link to={`/officer/complaints/${c._id}`} className="text-xs font-mono text-primary-500 hover:underline">{c.complaintId}</Link>
                      </td>
                      <td className="py-3 pr-4">
                        <Link to={`/officer/complaints/${c._id}`} className="text-sm font-medium text-slate-900 dark:text-white hover:text-primary-500 truncate max-w-[200px] block">{c.title}</Link>
                      </td>
                      <td className="py-3 pr-4 text-sm text-slate-500 dark:text-slate-400">{c.user?.name || 'User'}</td>
                      <td className="py-3 pr-4">
                        <span className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[c.priority]}`} />
                          <span className="text-sm capitalize">{c.priority}</span>
                        </span>
                      </td>
                      <td className="py-3 pr-4"><Badge variant={getStatusVariant(c.status)} dot>{c.status}</Badge></td>
                      <td className="py-3 text-sm text-slate-500 dark:text-slate-400">{formatDate(c.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
                <Button variant="ghost" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            )}
          </>
        )}
      </Card>
    </motion.div>
  );
};

export default OfficerComplaints;
