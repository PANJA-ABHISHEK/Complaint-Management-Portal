import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const ProfilePage = () => {
  const { user, updateProfile, showToast } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setSubmitting(true);
    const profileData = { name, phone };
    if (password) {
      profileData.password = password;
    }

    const res = await updateProfile(profileData);
    setSubmitting(false);

    if (res.success) {
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-6 sm:p-10">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Profile Settings</h1>
          <p className="text-slate-500 text-sm mt-2 max-w-2xl leading-relaxed">
            Manage your account contact information and password credentials.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl p-8 sm:p-12 flex flex-col gap-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-500 to-tealbrand-500"></div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar block */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-brand-50 border-4 border-white shadow-lg flex items-center justify-center text-brand-600 text-3xl font-black">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
                Citizen Account
              </span>
            </div>
            
            <div className="flex-1 flex flex-col gap-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 text-slate-400 text-sm cursor-not-allowed font-medium opacity-80"
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium transition-all"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8 mt-2 flex flex-col gap-6">
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg">Update Password</h3>
              <p className="text-slate-400 text-xs mt-1">Leave blank if you do not wish to change it.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  New Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-3.5 pr-12 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-brand-500 focus:outline-none text-lg transition-colors"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Confirm New Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-3.5 pr-12 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-brand-500 focus:outline-none text-lg transition-colors"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto self-start px-10 py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-brand-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {submitting ? 'Saving modifications...' : 'Save Profile Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
