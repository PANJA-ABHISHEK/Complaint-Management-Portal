import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { HiMail, HiArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { authService } from '../../services/dataService';

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

  const inputStyle = {
    width: '100%',
    padding: '12px 16px 12px 44px',
    borderRadius: 12,
    border: '1.5px solid #e2e8f0',
    fontSize: 14,
    color: '#1e293b',
    background: '#f8fafc',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const inputFocusHandler = (e) => {
    e.target.style.borderColor = '#6366f1';
    e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)';
    e.target.style.background = '#fff';
  };
  const inputBlurHandler = (e) => {
    e.target.style.borderColor = '#e2e8f0';
    e.target.style.boxShadow = 'none';
    e.target.style.background = '#f8fafc';
  };

  const iconStyle = {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    width: 20,
    height: 20,
    pointerEvents: 'none',
  };

  if (sent) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <HiMail style={{ width: 32, height: 32, color: '#10b981' }} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Check Your Email</h1>
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>
          We've sent a password reset link to your email address.
        </p>
        <Link to="/login" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '10px 20px', borderRadius: 12, border: '1.5px solid #6366f1',
          color: '#6366f1', fontWeight: 600, fontSize: 14, textDecoration: 'none',
        }}>
          <HiArrowLeft style={{ width: 16, height: 16 }} /> Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <HiMail style={{ width: 28, height: 28, color: '#6366f1' }} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Forgot Password?</h1>
        <p style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>Enter your email and we'll send you a reset link</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <HiMail style={iconStyle} />
            <input
              type="email"
              placeholder="you@example.com"
              style={inputStyle}
              onFocus={inputFocusHandler}
              onBlur={inputBlurHandler}
              {...register('email', { required: 'Email is required' })}
            />
          </div>
          {errors.email && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 6, fontWeight: 500 }}>{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '14px 24px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
            color: '#fff', fontSize: 15, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
          }}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Link to="/login" style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 13, fontWeight: 600, color: '#6366f1', textDecoration: 'none',
        }}>
          <HiArrowLeft style={{ width: 16, height: 16 }} /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
