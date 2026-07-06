import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { HiMail, HiLockClosed, HiUser, HiPhone, HiEye, HiEyeOff } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await authRegister(data);
      toast.success('Account created successfully!');
      navigate('/user/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
          Create Account
        </h1>
        <p style={{ fontSize: 15, color: '#64748b' }} className="dark:text-slate-400">
          Get started with your free account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Input
          label="Full Name"
          icon={HiUser}
          placeholder="John Doe"
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />

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
          label="Phone Number"
          icon={HiPhone}
          placeholder="+91 9876543210"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          icon={HiLockClosed}
          placeholder="Create a strong password"
          endIcon={showPassword ? HiEyeOff : HiEye}
          endIconClick={() => setShowPassword(!showPassword)}
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Must be at least 6 characters' },
          })}
        />

        <Button type="submit" fullWidth loading={loading} size="lg" style={{ marginTop: 8 }}>
          Create Account
        </Button>
      </form>

      <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #e2e8f0', textAlign: 'center' }} className="dark:border-slate-700">
        <p style={{ fontSize: 14, color: '#64748b' }} className="dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6366f1', fontWeight: 700, textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
