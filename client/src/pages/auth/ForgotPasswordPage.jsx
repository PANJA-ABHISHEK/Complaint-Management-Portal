import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { HiMail, HiArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { authService } from '../../services/dataService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await authService.forgotPassword(data);
      setSent(true);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <HiMail className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Check Your Email</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          We've sent a password reset link to your email address.
        </p>
        <Link to="/login">
          <Button variant="outline" icon={HiArrowLeft}>Back to Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Forgot Password?</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email"
          type="email"
          icon={HiMail}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <Button type="submit" fullWidth loading={loading} size="lg">
          Send Reset Link
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
        <Link to="/login" className="text-primary-500 hover:text-primary-600 font-semibold flex items-center justify-center gap-1">
          <HiArrowLeft className="w-4 h-4" /> Back to Login
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
