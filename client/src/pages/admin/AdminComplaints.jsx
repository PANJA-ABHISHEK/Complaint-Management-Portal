import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiSearch, HiDocumentText, HiUserCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { adminService } from '../../services/dataService';
import { getStatusVariant, formatDate, PRIORITY_COLORS } from '../../utils/constants';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await adminService.getAllComplaints(params);
      setComplaints(res.data?.complaints || []);
      setTotalPages(res.data?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOfficers = async () => {
    try {
      const res = await adminService.getOfficers();
      setOfficers(res.data?.officers || res.data?.users || []);
    } catch (error) {
      console.error('Failed to fetch officers:', error);
    }
  };

  useEffect(() => { fetchComplaints(); fetchOfficers(); }, [page, statusFilter]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchComplaints(); };

  const handleAssign = async () => {
    if (!selectedOfficer) return toast.error('Please select an officer');
    try {
      await adminService.assignComplaint(selectedComplaint._id, selectedOfficer);
      toast.success('Complaint assigned!');
      setAssignModalOpen(false);
      setSelectedOfficer('');
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to assign complaint');
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) return;
    try {
      await adminService.updateComplaintStatus(selectedComplaint._id, { status: newStatus, message: statusMessage });
      toast.success('Status updated!');
      setStatusModalOpen(false);
      setNewStatus('');
      setStatusMessage('');
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const statuses = ['Pending', 'Assigned', 'In Progress', 'Under Review', 'Resolved', 'Closed', 'Rejected'];
  const officerOptions = officers.map((o) => ({ value: o._id, label: o.name }));
  const statusOptions = statuses.map((s) => ({ value: s, label: s }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">All Complaints</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and assign complaints across the system</p>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-slate-900 dark:text-white" />
          </form>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer">
            <option value="">All Statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />)}
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-16">
            <HiDocumentText className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No complaints found</h3>
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
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3">Category</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3">Priority</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3">Status</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3">Assigned</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {complaints.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 pr-3 text-xs font-mono text-primary-500">{c.complaintId}</td>
                      <td className="py-3 pr-3 text-sm font-medium text-slate-900 dark:text-white truncate max-w-[180px]">{c.title}</td>
                      <td className="py-3 pr-3 text-sm text-slate-500">{c.user?.name || 'User'}</td>
                      <td className="py-3 pr-3 text-xs text-slate-500">{c.category}</td>
                      <td className="py-3 pr-3">
                        <span className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[c.priority]}`} />
                          <span className="text-xs capitalize">{c.priority}</span>
                        </span>
                      </td>
                      <td className="py-3 pr-3"><Badge variant={getStatusVariant(c.status)} dot>{c.status}</Badge></td>
                      <td className="py-3 pr-3 text-xs text-slate-500">{c.assignedTo?.name || '—'}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setSelectedComplaint(c); setAssignModalOpen(true); }}
                            className="text-xs px-2 py-1 rounded-lg bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-500/20 cursor-pointer">
                            Assign
                          </button>
                          <button onClick={() => { setSelectedComplaint(c); setNewStatus(c.status); setStatusModalOpen(true); }}
                            className="text-xs px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer">
                            Status
                          </button>
                        </div>
                      </td>
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

      {/* Assign Modal */}
      <Modal isOpen={assignModalOpen} onClose={() => setAssignModalOpen(false)} title="Assign Complaint">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Assign <strong>{selectedComplaint?.complaintId}</strong> to an officer
        </p>
        <Select label="Select Officer" options={officerOptions} value={selectedOfficer} onChange={(e) => setSelectedOfficer(e.target.value)} />
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setAssignModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAssign} icon={HiUserCircle}>Assign</Button>
        </div>
      </Modal>

      {/* Status Modal */}
      <Modal isOpen={statusModalOpen} onClose={() => setStatusModalOpen(false)} title="Update Status">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Update status for <strong>{selectedComplaint?.complaintId}</strong>
        </p>
        <Select label="New Status" options={statusOptions} value={newStatus} onChange={(e) => setNewStatus(e.target.value)} />
        <div className="mt-4">
          <Textarea label="Message (optional)" placeholder="Reason for status change..." value={statusMessage} onChange={(e) => setStatusMessage(e.target.value)} rows={3} />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setStatusModalOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate}>Update</Button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default AdminComplaints;
