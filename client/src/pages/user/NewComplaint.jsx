import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiPaperAirplane } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { complaintService } from '../../services/dataService';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import FileUpload from '../../components/ui/FileUpload';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const NewComplaint = () => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      files.forEach((file) => formData.append('attachments', file));

      await complaintService.createComplaint(formData);
      toast.success('Complaint registered successfully!');
      navigate('/user/complaints');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = CATEGORIES.map((c) => ({ value: c.value, label: `${c.icon} ${c.label}` }));
  const priorityOptions = PRIORITIES.map((p) => ({ value: p.value, label: p.label }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mb-6 cursor-pointer"
      >
        <HiArrowLeft className="w-4 h-4" /> Back
      </button>

      <Card>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Register New Complaint</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Fill in the details below to submit your complaint. Our team will review it shortly.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Complaint Title"
            placeholder="Brief title describing the issue"
            error={errors.title?.message}
            {...register('title', { required: 'Title is required', maxLength: { value: 100, message: 'Max 100 characters' } })}
          />

          <Textarea
            label="Description"
            rows={5}
            placeholder="Describe the issue in detail — what, where, when, and how it affects you"
            error={errors.description?.message}
            {...register('description', { required: 'Description is required', minLength: { value: 20, message: 'At least 20 characters' } })}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              options={categoryOptions}
              error={errors.category?.message}
              {...register('category', { required: 'Category is required' })}
            />
            <Select
              label="Priority"
              options={priorityOptions}
              error={errors.priority?.message}
              {...register('priority', { required: 'Priority is required' })}
            />
          </div>

          <Input
            label="Location / Address"
            placeholder="Where is the issue located?"
            error={errors.location?.message}
            {...register('location')}
          />

          <FileUpload
            label="Attachments (optional)"
            accept="image/*,.pdf"
            maxFiles={5}
            onChange={setFiles}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" loading={loading} icon={HiPaperAirplane}>
              Submit Complaint
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default NewComplaint;
