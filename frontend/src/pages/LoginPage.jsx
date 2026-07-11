import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('user'); // 'user' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSentMessage, setForgotSentMessage] = useState('');

  const { login, showToast } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success && res.user) {
      if (res.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (res.user.role === 'officer') {
        navigate('/officer/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgotpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await response.json();
      if (data.success) {
        setForgotSentMessage('Simulated email reset link has been dispatched! Check your backend server console.');
        showToast('Reset email simulated!', 'success');
      } else {
        showToast(data.message || 'Email not found', 'error');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-5xl bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side Branding */}
        <div className="hidden md:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-brand-700 via-brand-600 to-tealbrand-600 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full border-4 border-white/40"></div>
            <div className="absolute bottom-12 -right-12 w-56 h-56 rounded-full border-4 border-white/40"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/10 rounded-full rotate-45"></div>
          </div>
          
          <div className="relative z-10 text-white mt-8">
            <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider uppercase mb-6 border border-white/20">
              Welcome to the platform
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-4 leading-tight">
              ResolveHub
            </h1>
            <p className="text-brand-100 text-lg leading-relaxed max-w-sm">
              Digitizing grievances for a faster, transparent, and accountable tomorrow.
            </p>
          </div>
          
          <div className="relative z-10 text-white mt-auto mb-8">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg">
              <p className="italic font-medium text-brand-50 text-sm leading-relaxed">
                "A significant step towards better governance and immediate resolution. Connect directly with your local departments."
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 flex flex-col bg-white">
          {/* Toggle tabs */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => {
                setActiveTab('user');
                setEmail('');
                setPassword('');
              }}
              className={`flex-1 py-5 text-sm font-bold transition-all duration-200 ${
                activeTab === 'user'
                  ? 'bg-white border-b-2 border-brand-600 text-brand-600'
                  : 'bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100/50'
              }`}
            >
              Citizen Login
            </button>
            <button
              onClick={() => {
                setActiveTab('admin');
                setEmail('');
                setPassword('');
              }}
              className={`flex-1 py-5 text-sm font-bold transition-all duration-200 ${
                activeTab === 'admin'
                  ? 'bg-white border-b-2 border-brand-600 text-brand-600'
                  : 'bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100/50'
              }`}
            >
              Admin / Officer Login
            </button>
          </div>

          <div className="p-10 lg:p-12 flex-1 flex flex-col justify-center">
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                Welcome back
              </h2>
              <p className="text-slate-500 text-sm mt-2 font-medium">
                {activeTab === 'admin'
                  ? 'Sign in to access the authority control panel'
                  : 'Sign in to your citizen complaint dashboard'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activeTab === 'admin' ? 'admin@city.gov.in' : 'citizen@gmail.com'}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors text-sm font-medium text-slate-800 placeholder-slate-400"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(true);
                      setForgotSentMessage('');
                      setForgotEmail('');
                    }}
                    className="text-xs font-bold text-brand-600 hover:text-brand-800 transition-colors focus:outline-none"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 pr-11 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors text-sm font-medium text-slate-800 placeholder-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[14px] text-slate-400 hover:text-slate-700 focus:outline-none text-lg transition-colors"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
              >
                {loading ? 'Authenticating...' : 'Sign In to Account'}
              </button>
            </form>

            {activeTab === 'user' && (
              <p className="text-center text-sm text-slate-500 mt-8 font-medium">
                New to the platform?{' '}
                <Link to="/register" className="font-bold text-brand-600 hover:text-brand-800 transition-colors">
                  Create an account
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Reset Password</h3>
            <p className="text-sm text-slate-500 mb-4">
              Enter your registered email address and we will output a password recovery link to the server logs.
            </p>
            {forgotSentMessage ? (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm font-medium leading-relaxed">
                {forgotSentMessage}
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="citizen@gmail.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="py-3 mt-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-md shadow-brand-500/30 transition-all active:scale-[0.98]"
                >
                  Send Recovery Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
