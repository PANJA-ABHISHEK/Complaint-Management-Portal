import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
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

  return (
    <div>
      {/* Mobile Logo */}
      <div className="lg:hidden" style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, margin: '0 auto 12px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
        }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 24 }}>CP</span>
        </div>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8 }} className="dark:text-white">
          Welcome Back
        </h1>
        <p style={{ fontSize: 15, color: '#64748b' }} className="dark:text-slate-400">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Input
          label="Email Address"
          type="email"
          icon={HiMail}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email' },
          })}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          icon={HiLockClosed}
          placeholder="Enter your password"
          endIcon={showPassword ? HiEyeOff : HiEye}
          endIconClick={() => setShowPassword(!showPassword)}
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Must be at least 6 characters' },
          })}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: -4 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" style={{ width: 16, height: 16, accentColor: '#6366f1', cursor: 'pointer' }} />
            <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }} className="dark:text-slate-400">Remember me</span>
          </label>
          <Link to="/forgot-password" style={{ fontSize: 13, color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={loading} size="lg" style={{ marginTop: 8 }}>
          Sign In
        </Button>
      </form>

      <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #e2e8f0', textAlign: 'center' }} className="dark:border-slate-700">
        <p style={{ fontSize: 14, color: '#64748b' }} className="dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#6366f1', fontWeight: 700, textDecoration: 'none' }}>
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
