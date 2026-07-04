import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiLocationMarker, HiCalendar, HiTag, HiUser, HiPaperClip, HiChat } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { complaintService } from '../../services/dataService';
import { getStatusVariant, formatDateTime, PRIORITY_COLORS } from '../../utils/constants';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Timeline from '../../components/ui/Timeline';

const OfficerComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await complaintService.getComplaintById(id);
        const data = res.data?.complaint || res.data;
        setComplaint(data);
        setNewStatus(data.status);
      } catch (error) {
        toast.error('Failed to load complaint');
        navigate('/officer/complaints');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id, navigate]);

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === complaint.status) return;
    try {
      setUpdating(true);
      await complaintService.updateStatus(id, { status: newStatus, message: statusMessage });
      setComplaint((prev) => ({
        ...prev,
        status: newStatus,
        timeline: [...(prev.timeline || []), { status: newStatus, message: statusMessage, createdAt: new Date().toISOString() }],
      }));
      setStatusMessage('');
      toast.success('Status updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!internalNote.trim()) return;
    try {
      setAddingNote(true);
      await complaintService.addNote(id, { note: internalNote });
      setComplaint((prev) => ({
        ...prev,
        internalNotes: [...(prev.internalNotes || []), { note: internalNote, createdAt: new Date().toISOString() }],
      }));
      setInternalNote('');
      toast.success('Note added');
    } catch (error) {
      toast.error('Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  const statusOptions = [
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Under Review', label: 'Under Review' },
    { value: 'Resolved', label: 'Resolved' },
    { value: 'Rejected', label: 'Rejected' },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!complaint) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
      >
        <HiArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Complaint Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-slate-400">{complaint.complaintId}</span>
                  <Badge variant={getStatusVariant(complaint.status)} dot>{complaint.status}</Badge>
                </div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">{complaint.title}</h1>
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-2.5 h-2.5 rounded-full ${PRIORITY_COLORS[complaint.priority]}`} />
                <span className="text-sm capitalize">{complaint.priority} Priority</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{complaint.description}</p>

            <div className="grid sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-sm">
                <HiUser className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500">Filed by:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{complaint.user?.name || 'User'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <HiTag className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500">Category:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{complaint.category}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <HiCalendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500">Filed:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{formatDateTime(complaint.createdAt)}</span>
              </div>
              {complaint.location && (
                <div className="flex items-center gap-2 text-sm">
                  <HiLocationMarker className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-500">Location:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{complaint.location}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Attachments */}
          {complaint.attachments && complaint.attachments.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <HiPaperClip className="w-5 h-5" /> Attachments ({complaint.attachments.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {complaint.attachments.map((file, index) => (
                  <a key={index} href={file.url || file} target="_blank" rel="noopener noreferrer"
                    className="block p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <div className="w-full h-20 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-lg mb-2">
                      <HiPaperClip className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-500 truncate">{typeof file === 'string' ? file.split('/').pop() : `File ${index + 1}`}</p>
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Update Status */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Update Status</h2>
            <div className="space-y-4">
              <Select
                label="New Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                options={statusOptions}
              />
              <Textarea
                label="Status Message (optional)"
                placeholder="Add a message explaining the status change..."
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
                rows={3}
              />
              <Button onClick={handleStatusUpdate} loading={updating} disabled={!newStatus || newStatus === complaint.status}>
                Update Status
              </Button>
            </div>
          </Card>

          {/* Internal Notes */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <HiChat className="w-5 h-5" /> Internal Notes
            </h2>

            {complaint.internalNotes && complaint.internalNotes.length > 0 && (
              <div className="space-y-3 mb-4">
                {complaint.internalNotes.map((note, i) => (
                  <div key={i} className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                    <p className="text-sm text-slate-700 dark:text-slate-300">{note.note || note.text}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatDateTime(note.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <Textarea
                placeholder="Add an internal note..."
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                rows={3}
              />
              <Button variant="outline" onClick={handleAddNote} loading={addingNote} disabled={!internalNote.trim()}>
                Add Note
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Status Timeline</h2>
            <Timeline entries={complaint.timeline || []} currentStatus={complaint.status} />
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default OfficerComplaintDetail;
