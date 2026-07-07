import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, showToast } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      showToast('Please fill in all mandatory fields', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setLoading(true);
    const res = await register(name, email, password, phone);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
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
              Join the Community
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-4 leading-tight">
              ResolveHub
            </h1>
            <p className="text-brand-100 text-lg leading-relaxed max-w-sm">
              Empowering citizens to build better cities, together.
            </p>
          </div>
          
          <div className="relative z-10 text-white mt-auto mb-8">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg">
              <p className="italic font-medium text-brand-50 text-sm leading-relaxed">
                "By creating an account, you get direct access to lodge grievances, track real-time resolution, and communicate with municipal departments."
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 flex flex-col bg-white">
          <div className="p-10 lg:p-12 flex-1 flex flex-col justify-center">
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                Create Citizen Account
              </h2>
              <p className="text-slate-500 text-sm mt-2 font-medium">
                Register to submit, track, and review civic grievances in your area
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors text-sm font-medium text-slate-800 placeholder-slate-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors text-sm font-medium text-slate-800 placeholder-slate-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors text-sm font-medium text-slate-800 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Password *
                </label>
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
                <span className="text-[11px] text-slate-500 mt-1.5 block font-medium">Minimum 6 characters</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
              >
                {loading ? 'Registering account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-8 font-medium">
              Already registered?{' '}
              <Link to="/login" className="font-bold text-brand-600 hover:text-brand-800 transition-colors">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
