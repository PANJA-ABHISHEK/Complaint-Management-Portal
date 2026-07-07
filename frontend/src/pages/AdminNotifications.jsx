import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiSend, FiBell, FiInfo } from 'react-icons/fi';

const AdminNotifications = () => {
  const { showToast } = useAuth();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    try {
      const data = await api.post('/notifications/broadcast', { message });
      if (data.success) {
        showToast(data.message || 'Announcement broadcasted successfully', 'success');
        setMessage('');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-6 sm:p-10">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Global Announcements</h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed font-medium">
            Broadcast warning alerts or maintenance updates directly to all active citizens.
          </p>
        </div>

        <form
          onSubmit={handleBroadcast}
          className="bg-white border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl p-8 sm:p-10 flex flex-col gap-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-50 rounded-bl-full -mr-10 -mt-10 opacity-50 pointer-events-none"></div>

          <div className="relative z-10">
            <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-3">
              Announcement Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your notice message here... (e.g. Scheduled maintenance: Sector 4 water supply will be down on 9th July for valve repairs)"
              rows={6}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium transition-all resize-none"
              required
            />
          </div>

          {/* Info banner */}
          <div className="p-5 bg-amber-50 border border-amber-200/60 rounded-2xl text-amber-800 text-sm flex gap-3 items-start relative z-10 shadow-sm">
            <FiInfo className="text-xl flex-shrink-0 mt-0.5 text-amber-600" />
            <p className="leading-relaxed font-medium">
              <span className="font-extrabold block mb-1">Important Notice:</span>
              Broadcasting notifications generates database alert items for every registered standard citizen in the registry database. Use this feature only for critical announcements.
            </p>
          </div>

          <button
            type="submit"
            disabled={sending || !message.trim()}
            className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-brand-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 relative z-10"
          >
            <FiSend className="text-lg" /> {sending ? 'Broadcasting Announcement...' : 'Broadcast Announcement'}
          </button>
        </form>

        {/* Visual Live Preview mockup */}
        <div className="bg-slate-200/50 border border-slate-200 rounded-3xl p-8 relative overflow-hidden">
          <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-300/50 flex items-center justify-center">
              <FiBell className="text-slate-600 animate-bounce-short" />
            </div>
            Citizens Notification Feed Preview
          </h4>
          
          <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-lg flex flex-col gap-2 relative z-10 transform hover:-translate-y-1 transition-transform">
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 mb-1">
              <FiInfo className="text-lg" />
            </div>
            <p className="text-slate-800 text-sm font-bold leading-relaxed">
              {message.trim() || 'System announcement content will appear here in real-time...'}
            </p>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
              Just now
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
