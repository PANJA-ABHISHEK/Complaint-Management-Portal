import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiChat, HiStar } from 'react-icons/hi';
import { adminService } from '../../services/dataService';
import { formatDate } from '../../utils/constants';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import RatingStars from '../../components/ui/RatingStars';

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await adminService.getFeedback();
        const data = res.data?.feedbacks || res.data || [];
        setFeedbacks(data);
        if (data.length > 0) {
          setAvgRating((data.reduce((sum, f) => sum + (f.rating || 0), 0) / data.length).toFixed(1));
        }
      } catch (error) {
        console.error('Failed to fetch feedback:', error);
        // Demo data
        const demo = [
          { _id: '1', user: { name: 'Rahul Sharma' }, complaint: { complaintId: 'CMP-001', title: 'Street light not working' }, rating: 5, comment: 'Resolved within 24 hours. Excellent service!', createdAt: new Date().toISOString() },
          { _id: '2', user: { name: 'Priya Patel' }, complaint: { complaintId: 'CMP-002', title: 'Water pipe leak' }, rating: 4, comment: 'Good response time. Issue fixed properly.', createdAt: new Date().toISOString() },
          { _id: '3', user: { name: 'Amit Kumar' }, complaint: { complaintId: 'CMP-003', title: 'Pothole on main road' }, rating: 3, comment: 'Took a bit longer but eventually resolved.', createdAt: new Date().toISOString() },
          { _id: '4', user: { name: 'Neha Singh' }, complaint: { complaintId: 'CMP-004', title: 'Garbage collection delayed' }, rating: 5, comment: 'Very responsive team. Thank you!', createdAt: new Date().toISOString() },
          { _id: '5', user: { name: 'Vikram Reddy' }, complaint: { complaintId: 'CMP-005', title: 'Drainage issue' }, rating: 4, comment: 'Well handled. Professional approach.', createdAt: new Date().toISOString() },
        ];
        setFeedbacks(demo);
        setAvgRating(4.2);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  const ratingDistribution = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: feedbacks.filter((f) => f.rating === r).length,
    percentage: feedbacks.length > 0 ? (feedbacks.filter((f) => f.rating === r).length / feedbacks.length) * 100 : 0,
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Feedback</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review user satisfaction and feedback</p>
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <div className="text-center">
            <h2 className="text-5xl font-bold gradient-text">{avgRating}</h2>
            <div className="flex justify-center mt-2">
              <RatingStars value={Math.round(avgRating)} readonly size="md" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Based on {feedbacks.length} reviews
            </p>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Rating Distribution</h3>
          <div className="space-y-2">
            {ratingDistribution.map((r) => (
              <div key={r.rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{r.rating}</span>
                  <HiStar className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${r.percentage}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-full bg-amber-400 rounded-full"
                  />
                </div>
                <span className="text-xs text-slate-400 w-8 text-right">{r.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Feedback List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-white dark:bg-slate-800 rounded-2xl animate-pulse" />)}
        </div>
      ) : feedbacks.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <HiChat className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No feedback yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Feedback will appear here once users rate resolved complaints</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {feedbacks.map((feedback) => (
            <Card key={feedback._id}>
              <div className="flex items-start gap-4">
                <Avatar name={feedback.user?.name || 'User'} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {feedback.user?.name || 'Anonymous'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Re: {feedback.complaint?.complaintId} — {feedback.complaint?.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <RatingStars value={feedback.rating} readonly size="sm" />
                      <span className="text-xs text-slate-400">{formatDate(feedback.createdAt)}</span>
                    </div>
                  </div>
                  {feedback.comment && (
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">"{feedback.comment}"</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AdminFeedback;
