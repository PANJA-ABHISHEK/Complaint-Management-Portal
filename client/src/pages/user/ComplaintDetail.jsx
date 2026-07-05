import { formatDateTime } from '../../utils/dateUtils';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiLocationMarker, HiCalendar, HiTag, HiUser, HiPaperClip } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { complaintService } from '../../services/dataService';
import { getStatusVariant, PRIORITY_COLORS } from '../../utils/constants';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Timeline from '../../components/ui/Timeline';
import RatingStars from '../../components/ui/RatingStars';
import Textarea from '../../components/ui/Textarea';

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await complaintService.getComplaintById(id);
        setComplaint(res.data?.complaint || res.data);
      } catch (error) {
        toast.error('Failed to load complaint');
        navigate('/user/complaints');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id, navigate]);

  const handleFeedback = async () => {
    if (!rating) return toast.error('Please provide a rating');
    try {
      setSubmittingFeedback(true);
      await complaintService.submitFeedback(id, { rating, comment: feedbackText });
      toast.success('Feedback submitted!');
      setComplaint((prev) => ({ ...prev, hasFeedback: true }));
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

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
        <HiArrowLeft className="w-4 h-4" /> Back to Complaints
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
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
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 capitalize">{complaint.priority} Priority</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {complaint.description}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-sm">
                <HiTag className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500 dark:text-slate-400">Category:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{complaint.category}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <HiCalendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500 dark:text-slate-400">Filed:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{formatDateTime(complaint.createdAt)}</span>
              </div>
              {complaint.location && (
                <div className="flex items-center gap-2 text-sm">
                  <HiLocationMarker className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-500 dark:text-slate-400">Location:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{complaint.location}</span>
                </div>
              )}
              {complaint.assignedTo && (
                <div className="flex items-center gap-2 text-sm">
                  <HiUser className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-500 dark:text-slate-400">Assigned To:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{complaint.assignedTo?.name || 'Officer'}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Attachments */}
          {complaint.attachments && complaint.attachments.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <HiPaperClip className="w-5 h-5" /> Attachments
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {complaint.attachments.map((file, index) => (
                  <a
                    key={index}
                    href={file.url || file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    {typeof file === 'string' && file.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img src={file} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />
                    ) : (
                      <div className="w-full h-24 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-lg mb-2">
                        <HiPaperClip className="w-8 h-8 text-slate-400" />
                      </div>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {typeof file === 'string' ? file.split('/').pop() : file.filename || `File ${index + 1}`}
                    </p>
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Feedback (only for resolved complaints) */}
          {(complaint.status === 'Resolved' || complaint.status === 'Closed') && !complaint.hasFeedback && (
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Rate Your Experience</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                How satisfied are you with the resolution?
              </p>
              <RatingStars value={rating} onChange={setRating} size="lg" />
              <div className="mt-4">
                <Textarea
                  placeholder="Share your feedback (optional)"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="mt-4">
                <Button onClick={handleFeedback} loading={submittingFeedback}>Submit Feedback</Button>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar — Timeline */}
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

export default ComplaintDetail;
