import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { FiSearch, FiSliders } from 'react-icons/fi';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      let query = '';
      const params = [];
      if (statusFilter) params.push(`status=${statusFilter}`);
      if (priorityFilter) params.push(`priority=${priorityFilter}`);
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      
      if (params.length > 0) {
        query = `?${params.join('&')}`;
      }

      const data = await api.get(`/complaints${query}`);
      if (data.success) {
        setComplaints(data.complaints);
      }
    } catch (err) {
      console.error('Failed to fetch complaints', err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, search]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-6 sm:p-10 flex flex-col gap-8">
      {/* Header Block */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">My Filed Grievances</h1>
        <p className="text-slate-500 text-sm mt-2 max-w-2xl leading-relaxed">
          Review the current resolution states and detailed history logs of your filed tickets.
        </p>
      </div>

      {/* Search & Filters (Glassmorphism control strip) */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-200/40 flex flex-col gap-5">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <FiSearch className="absolute left-5 top-4 text-slate-400 text-lg group-focus-within:text-brand-500 transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by tracking ID, title, or description..."
              className="w-full pl-12 pr-6 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3.5 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-brand-500/20 transition-all active:scale-95"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-6 items-center border-t border-slate-100 pt-5 text-sm font-semibold text-slate-600">
          <span className="flex items-center gap-2 text-slate-400 uppercase tracking-wider text-xs font-bold">
            <FiSliders /> Filters
          </span>
          
          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-xs font-bold">STATUS</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-sm font-medium text-slate-700 cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-xs font-bold">PRIORITY</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-sm font-medium text-slate-700 cursor-pointer"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table list */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/40 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm font-medium">Loading your records...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <FiSearch className="text-2xl" />
            </div>
            <h3 className="text-slate-700 font-bold text-lg">No records found</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-sm">
              We couldn't find any complaints matching your current search or filter criteria.
            </p>
            {(search || statusFilter || priorityFilter) && (
              <button 
                onClick={() => { setSearch(''); setStatusFilter(''); setPriorityFilter(''); fetchComplaints(); }}
                className="mt-6 px-4 py-2 text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg text-sm font-bold transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider text-xs">
                  <th className="py-5 px-8">Tracking ID</th>
                  <th className="py-5 px-8">Issue Title</th>
                  <th className="py-5 px-8">Department</th>
                  <th className="py-5 px-8">Priority</th>
                  <th className="py-5 px-8">Status</th>
                  <th className="py-5 px-8">Last Updated</th>
                  <th className="py-5 px-8">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-600">
                {complaints.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-5 px-8 font-extrabold text-brand-600">
                      <Link to={`/complaint/${c._id}`} className="hover:underline">{c.complaintId}</Link>
                    </td>
                    <td className="py-5 px-8 font-semibold text-slate-800 truncate max-w-[200px]">{c.title}</td>
                    <td className="py-5 px-8 text-slate-500">{c.category ? c.category.name : 'Unassigned'}</td>
                    <td className="py-5 px-8">
                      <span
                        className={`px-3 py-1.5 rounded-md font-bold text-[10px] uppercase border tracking-wider ${
                          c.priority === 'critical'
                            ? 'bg-rose-50 text-rose-600 border-rose-100'
                            : c.priority === 'high'
                            ? 'bg-orange-50 text-orange-600 border-orange-100'
                            : c.priority === 'medium'
                            ? 'bg-amber-50 text-amber-600 border-amber-100'
                            : 'bg-sky-50 text-sky-600 border-sky-100'
                        }`}
                      >
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-5 px-8">
                      <span
                        className={`px-3 py-1.5 rounded-md font-bold text-[10px] uppercase tracking-wider flex items-center w-fit gap-1.5 ${
                          c.status === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : c.status === 'Closed'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          c.status === 'Resolved' ? 'bg-emerald-500' : c.status === 'Closed' ? 'bg-slate-400' : 'bg-amber-500'
                        }`}></span>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-5 px-8 text-slate-400 font-medium text-xs">
                      {new Date(c.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-5 px-8">
                      <Link
                        to={`/complaint/${c._id}`}
                        className="px-4 py-2 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 rounded-xl font-bold text-xs transition-all opacity-80 group-hover:opacity-100"
                      >
                        Track Progress
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComplaints;
