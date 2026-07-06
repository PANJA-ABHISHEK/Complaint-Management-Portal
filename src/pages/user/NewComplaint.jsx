import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import FileUpload from '../../components/ui/FileUpload';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { api } from '../../services/api';
import { MapPin, Calendar } from 'lucide-react';

const NewComplaint = () => {
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const categories = [
    { value: 'Infrastructure', label: 'Infrastructure' },
    { value: 'Utilities', label: 'Utilities' },
    { value: 'Sanitation', label: 'Sanitation' },
    { value: 'Safety', label: 'Public Safety' },
    { value: 'Transportation', label: 'Transportation' },
    { value: 'Environment', label: 'Environment' },
    { value: 'Other', label: 'Other' },
  ];

  const departments = [
    { value: 'Public Works', label: 'Public Works' },
    { value: 'Electrical', label: 'Electrical' },
    { value: 'Water Supply', label: 'Water Supply' },
    { value: 'Health', label: 'Health Department' },
    { value: 'Police', label: 'Police Department' },
    { value: 'Transport', label: 'Transport Authority' },
    { value: 'Municipal', label: 'Municipal Corporation' },
  ];

  const priorities = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
  ];

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const complaint = await api.complaints.create({
        ...data,
        attachments: attachments.map(f => f.name)
      });
      toast.success('Complaint filed successfully!');
      navigate(`/user/complaints/${complaint.id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">File a New Complaint</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Fill in the details below to register your complaint.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Complaint Title"
              placeholder="e.g., Pothole on Main Street"
              error={errors.title?.message}
              {...register('title', { required: 'Title is required' })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Select
                label="Category"
                options={categories}
                error={errors.category?.message}
                {...register('category', { required: 'Category is required' })}
              />
              <Select
                label="Department"
                options={departments}
                error={errors.department?.message}
                {...register('department', { required: 'Department is required' })}
              />
            </div>

            <Select
              label="Priority"
              options={priorities}
              error={errors.priority?.message}
              {...register('priority', { required: 'Priority is required' })}
            />

            <Textarea
              label="Description"
              placeholder="Describe the issue in detail..."
              rows={5}
              error={errors.description?.message}
              {...register('description', { required: 'Description is required', minLength: { value: 20, message: 'Please provide more detail (min 20 chars)' } })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Location"
                icon={MapPin}
                placeholder="e.g., 123 Main St"
                error={errors.location?.message}
                {...register('location', { required: 'Location is required' })}
              />
              <Input
                label="Date of Issue"
                type="date"
                icon={Calendar}
                error={errors.issueDate?.message}
                {...register('issueDate')}
              />
            </div>

            <FileUpload
              label="Attachments (optional)"
              value={attachments}
              onChange={setAttachments}
            />

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Submit Complaint
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default NewComplaint;
