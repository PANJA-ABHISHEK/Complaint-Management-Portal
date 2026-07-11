import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiCalendar, FiMapPin, FiUser, FiPaperclip, FiArrowLeft, FiClock, FiStar, FiFileText } from 'react-icons/fi';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, showToast } = useAuth();
  
  const [complaint, setComplaint] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  // Feedback states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Close ticket states
  const [closingTicket, setClosingTicket] = useState(false);

  const fetchComplaintDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get(`/complaints/${id}`);
      if (data.success) {
        setComplaint(data.complaint);
        setTimeline(data.timeline);
        setFeedback(data.feedback);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch details', 'error');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, showToast, navigate]);

  useEffect(() => {
    fetchComplaintDetails();
  }, [fetchComplaintDetails]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      const data = await api.post('/feedback', {
        complaintId: complaint._id,
        rating,
        comment,
      });
      if (data.success) {
        showToast('Feedback submitted successfully', 'success');
        setFeedback(data.feedback);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!window.confirm('Are you sure you want to close this complaint ticket? This action is permanent.')) return;
    setClosingTicket(true);
    try {
      // User advances status to 'Closed'
      const data = await api.put(`/complaints/${complaint._id}/status`, {
        status: 'Closed',
        remarks: 'Citizen closed the grievance ticket.',
      });
      if (data.success) {
        showToast('Complaint ticket closed', 'success');
        fetchComplaintDetails();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setClosingTicket(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  const getPriorityStyle = (pri) => {
    switch (pri) {
      case 'critical':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'high':
        return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'medium':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      default:
        return 'bg-sky-50 text-sky-600 border-sky-100';
    }
  };

  const getStatusStyle = (st) => {
    switch (st) {
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Closed':
        return 'bg-slate-50 text-slate-500 border-slate-200';
      default:
        return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-12">
      {/* Premium Header Banner (small) */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-6 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            to={user.role === 'admin' ? '/admin/complaints' : '/my-complaints'}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-bold transition-colors"
          >
            <FiArrowLeft className="text-lg" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full font-extrabold text-[10px] uppercase tracking-wider shadow-sm ${getPriorityStyle(complaint.priority)}`}>
              {complaint.priority} Priority
            </span>
            <span className={`px-3 py-1 rounded-full font-extrabold text-[10px] uppercase tracking-wider shadow-sm ${getStatusStyle(complaint.status)}`}>
              {complaint.status}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 mt-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* Left/Middle: Details & Attachments & Resolution */}
        <div className="flex-1 flex flex-col gap-8 w-full">
          {/* Main Info Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>
            
            <span className="text-xs font-extrabold text-brand-600 uppercase tracking-widest block mb-2 relative z-10">
              ID: {complaint.complaintId}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-snug relative z-10 mb-6">
              {complaint.title}
            </h1>
            
            <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-6 mb-8 relative z-10">
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-medium">
                {complaint.description}
              </p>
            </div>

            {/* Incident Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm relative z-10">
              <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 shadow-sm rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                  <FiCalendar className="text-lg" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Filed On</span>
                  <span className="font-bold text-slate-700">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 shadow-sm rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                  <FiMapPin className="text-lg" />
                </div>
                <div className="overflow-hidden">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Location</span>
                  <span className="font-bold text-slate-700 truncate block">{complaint.location || 'Not Specified'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 shadow-sm rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <FiClock className="text-lg" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">SLA Deadline</span>
                  <span className="font-bold text-slate-700">{new Date(complaint.slaDeadline).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 shadow-sm rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <FiUser className="text-lg" />
                </div>
                <div className="overflow-hidden">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Assigned Officer</span>
                  <span className="font-bold text-slate-700 truncate block">{complaint.assignedTo ? complaint.assignedTo.name : 'Pending Assignment'}</span>
                </div>
              </div>
            </div>
            
            {/* Evidence Attachments */}
            {complaint.attachments && complaint.attachments.length > 0 && (
              <div className="mt-8 pt-8 border-t border-slate-100 relative z-10">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FiPaperclip /> Attached Evidence ({complaint.attachments.length})
                </h4>
                <div className="flex flex-wrap gap-3">
                  {complaint.attachments.map((filePath, i) => (
                    <a
                      key={i}
                      href={`http://localhost:5000${filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-800 px-4 py-2 border border-brand-100 bg-brand-50/50 hover:bg-brand-100 rounded-xl transition-colors"
                    >
                      <FiPaperclip className="text-brand-500" /> Evidence File {i + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Resolution Card */}
          {complaint.status === 'Resolved' && (
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 shadow-xl shadow-emerald-600/20 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="font-extrabold text-lg flex items-center gap-2">
                  Resolution Summary Notes
                </h3>
                <span className="text-[10px] text-emerald-800 font-extrabold bg-white px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Resolved
                </span>
              </div>
              <p className="text-emerald-50 text-sm leading-relaxed whitespace-pre-line bg-black/10 p-5 rounded-2xl relative z-10 font-medium">
                {complaint.resolutionNotes}
              </p>
              {user.role === 'user' && (
                <div className="mt-6 flex justify-end relative z-10">
                  <button
                    onClick={handleCloseTicket}
                    disabled={closingTicket}
                    className="px-6 py-3 bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl text-sm font-extrabold shadow-lg transition-all active:scale-95 disabled:opacity-50"
                  >
                    Confirm Fix & Close Ticket
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Citizen Feedback Rating Card */}
          {user.role === 'user' && (complaint.status === 'Resolved' || complaint.status === 'Closed') && (
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-lg">
                  <FiStar />
                </div>
                <h3 className="font-extrabold text-slate-800 text-lg">Rating & Service Review</h3>
              </div>
              
              {feedback ? (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className={`text-xl drop-shadow-sm ${
                          star <= feedback.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm italic font-medium">"{feedback.comment || 'No review comment provided.'}"</p>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Submitted: {new Date(feedback.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Rating</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none hover:scale-110 transition-transform"
                        >
                          <FiStar
                            className={`text-3xl drop-shadow-sm transition-colors ${
                              star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Feedback Comment</span>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Provide additional comments on your satisfaction levels..."
                      rows={3}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-sm focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:outline-none bg-slate-50 font-medium resize-none transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="mt-2 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-bold shadow-lg shadow-slate-900/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Right side: Timeline Stepper Log */}
        <div className="w-full lg:w-96 flex-shrink-0 bg-white border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-200/40 sticky top-8">
          <h3 className="font-extrabold text-slate-800 text-lg mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center">
              <FiFileText className="text-lg" />
            </div>
            Timeline Progress
          </h3>

          <div className="flex flex-col gap-8 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
            {timeline.map((log, index) => {
              return (
                <div key={log._id} className="flex gap-5 relative z-10 group">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold shadow-md shadow-slate-200 ${
                      log.status === 'Resolved' || log.status === 'Closed'
                        ? 'bg-emerald-500'
                        : log.status === 'In Progress'
                        ? 'bg-brand-500'
                        : log.status === 'Assigned'
                        ? 'bg-sky-500'
                        : 'bg-amber-500'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex flex-col gap-1 pt-0.5">
                    <span className="font-extrabold text-slate-800 text-sm group-hover:text-brand-600 transition-colors">{log.status}</span>
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      {new Date(log.timestamp).toLocaleDateString()} •{' '}
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl mt-2">
                      <span className="text-[11px] text-slate-500 font-medium block">
                        {log.remarks || 'No remarks provided.'}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 mt-2 block">
                      Updated by: {log.updatedBy ? log.updatedBy.name : 'System'} ({log.updatedBy ? log.updatedBy.role : 'Core'})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
