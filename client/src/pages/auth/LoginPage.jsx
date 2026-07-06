import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const user = await login(data.email, data.password);
      toast.success(`Welcome back, ${user.name}!`);
      const path = user.role === 'admin' ? '/admin/dashboard' : user.role === 'officer' ? '/officer/dashboard' : '/user/dashboard';
      navigate(path);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
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

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#475569',
    marginBottom: 8,
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

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        {/* Mobile logo */}
        <div className="lg:hidden" style={{ marginBottom: 20 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto', boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
          }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 22 }}>CP</span>
          </div>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Welcome Back</h1>
        <p style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>Enter your credentials to access your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email Field */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Email Address</label>
          <div style={{ position: 'relative' }}>
            <HiMail style={iconStyle} />
            <input
              type="email"
              placeholder="you@example.com"
              style={inputStyle}
              onFocus={inputFocusHandler}
              onBlur={inputBlurHandler}
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
            />
          </div>
          {errors.email && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 6, fontWeight: 500 }}>{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Password</label>
          <div style={{ position: 'relative' }}>
            <HiLockClosed style={iconStyle} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              style={{ ...inputStyle, paddingRight: 44 }}
              onFocus={inputFocusHandler}
              onBlur={inputBlurHandler}
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                color: '#94a3b8', display: 'flex', alignItems: 'center',
              }}
            >
              {showPassword
                ? <HiEyeOff style={{ width: 20, height: 20 }} />
                : <HiEye style={{ width: 20, height: 20 }} />
              }
            </button>
          </div>
          {errors.password && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 6, fontWeight: 500 }}>{errors.password.message}</p>}
        </div>

        {/* Remember Me & Forgot Password */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#475569', fontWeight: 500 }}>
            <input
              type="checkbox"
              style={{ width: 16, height: 16, accentColor: '#6366f1', borderRadius: 4, cursor: 'pointer' }}
            />
            Remember me
          </label>
          <Link to="/forgot-password" style={{ fontSize: 13, fontWeight: 600, color: '#6366f1', textDecoration: 'none' }}>
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px 24px',
            borderRadius: 12,
            border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
            color: '#fff',
            fontSize: 15,
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.2s',
            boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
            letterSpacing: 0.3,
          }}
          onMouseEnter={(e) => { if (!loading) e.target.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Divider & Register link */}
      <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#6366f1', fontWeight: 700, textDecoration: 'none' }}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
