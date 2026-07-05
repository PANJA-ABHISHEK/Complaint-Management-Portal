import { formatDate } from '../../utils/dateUtils';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch, HiFilter, HiDocumentText, HiPlusCircle } from 'react-icons/hi';
import { complaintService } from '../../services/dataService';
import { getStatusVariant, CATEGORIES, PRIORITY_COLORS } from '../../utils/constants';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;

      const res = await complaintService.getMyComplaints(params);
      setComplaints(res.data?.complaints || []);
      setTotalPages(res.data?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [page, statusFilter, categoryFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchComplaints();
  };

  const statuses = ['Pending', 'Assigned', 'In Progress', 'Under Review', 'Resolved', 'Closed', 'Rejected'];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Complaints</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View and track all your complaints</p>
        </div>
        <Link to="/user/new-complaint">
          <Button icon={HiPlusCircle}>New Complaint</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or complaint ID..."
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
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
      </Card>

      {/* Complaint List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-white dark:bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : complaints.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <HiDocumentText className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No complaints found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              {search || statusFilter || categoryFilter
                ? 'Try adjusting your filters'
                : "You haven't registered any complaints yet"}
            </p>
            {!search && !statusFilter && !categoryFilter && (
              <Link to="/user/new-complaint">
                <Button icon={HiPlusCircle}>Register Your First Complaint</Button>
              </Link>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {complaints.map((complaint) => (
            <Link key={complaint._id} to={`/user/complaints/${complaint._id}`}>
              <motion.div
                whileHover={{ x: 4 }}
                className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-slate-400">{complaint.complaintId}</span>
                    <span className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[complaint.priority]}`} />
                    <span className="text-xs text-slate-400 capitalize">{complaint.priority}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{complaint.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{complaint.category}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(complaint.createdAt)}</span>
                  </div>
                </div>
                <Badge variant={getStatusVariant(complaint.status)} dot>{complaint.status}</Badge>
              </motion.div>
            </Link>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="ghost"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MyComplaints;
