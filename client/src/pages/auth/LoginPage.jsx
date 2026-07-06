import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
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
    <div className="w-full">
      {/* Mobile Logo (only shows on small screens since left side is hidden) */}
      <div className="lg:hidden text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
          <span className="text-white font-extrabold text-3xl tracking-tighter">CP</span>
        </div>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Please enter your details to sign in</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          icon={HiMail}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email' } })}
        />

        <div className="relative group">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            icon={HiLockClosed}
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
          />
          {/* Eye Icon Button adjusted for perfect alignment */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[38px] text-slate-400 hover:text-primary-500 focus:outline-none transition-colors"
          >
            {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center justify-between text-sm mt-2">
          <label className="flex items-center gap-2.5 cursor-pointer group/checkbox">
            <div className="relative flex items-center justify-center">
              <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded focus:ring-2 focus:ring-primary-500/30 checked:bg-primary-500 checked:border-primary-500 transition-all dark:border-slate-600 dark:bg-slate-800" />
              <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none">
                <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-slate-600 font-medium select-none group-hover/checkbox:text-slate-900 transition-colors dark:text-slate-400 dark:group-hover/checkbox:text-slate-200">
              Remember me
            </span>
          </label>
          <Link to="/forgot-password" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold transition-colors">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={loading} size="lg" className="mt-8 font-bold tracking-wide shadow-xl shadow-primary-500/20">
          Sign In to Portal
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700/50">
        <p className="text-center text-sm font-medium text-slate-600 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-bold ml-1 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
