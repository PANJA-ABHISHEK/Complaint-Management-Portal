import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { HiMail, HiArrowLeft, HiLockClosed } from 'react-icons/hi';
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
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
          background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} className="dark:bg-emerald-500/20">
          <HiMail style={{ width: 32, height: 32, color: '#10b981' }} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 10 }} className="dark:text-white">
          Check Your Email
        </h1>
        <p style={{ fontSize: 15, color: '#64748b', marginBottom: 28, lineHeight: 1.6 }} className="dark:text-slate-400">
          We've sent a password reset link to your email address. Please check your inbox.
        </p>
        <Link to="/login">
          <Button variant="outline" icon={HiArrowLeft}>Back to Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', margin: '0 auto 20px',
          background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} className="dark:bg-primary-500/20">
          <HiLockClosed style={{ width: 28, height: 28, color: '#6366f1' }} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8 }} className="dark:text-white">
          Forgot Password?
        </h1>
        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6 }} className="dark:text-slate-400">
          No worries! Enter your email and we'll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Input
          label="Email Address"
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

      <div style={{ marginTop: 28, textAlign: 'center' }}>
        <Link to="/login" style={{ fontSize: 14, color: '#6366f1', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <HiArrowLeft style={{ width: 16, height: 16 }} /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
