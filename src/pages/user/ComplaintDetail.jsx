import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Tag, Building, AlertTriangle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import Timeline from '../../components/ui/Timeline';
import { api } from '../../services/api';

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplaint();
  }, [id]);

  const loadComplaint = async () => {
    try {
      const data = await api.complaints.getById(id);
      setComplaint(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <Card className="text-center py-16">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Complaint Not Found</h2>
        <Button variant="outline" onClick={() => navigate(-1)} icon={ArrowLeft}>Go Back</Button>
      </Card>
    );
  }

  const timelineItems = (complaint.timeline || []).map((t) => ({
    title: t.status,
    date: new Date(t.date).toLocaleString(),
  }));

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Complaints
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">{complaint.title}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                ID: {complaint.id} • Filed on {new Date(complaint.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <PriorityBadge priority={complaint.priority} />
              <StatusBadge status={complaint.status} />
            </div>
          </div>

          {/* Meta Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-dark-bg rounded-xl">
            <div className="flex items-center gap-2.5">
              <Tag className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Category</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{complaint.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Building className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Department</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{complaint.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Location</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{complaint.location || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Priority</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{complaint.priority}</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Description */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Description</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </p>
            </Card>
          </div>

          {/* Timeline */}
          <Card>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Status Timeline</h2>
            <Timeline items={timelineItems} />
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default ComplaintDetail;
