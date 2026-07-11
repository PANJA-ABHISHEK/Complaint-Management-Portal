import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiUsers, FiTrendingUp, FiShield, FiArrowRight, FiFileText, FiMapPin, FiStar } from 'react-icons/fi';

const LandingPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const data = await api.get('/platform-feedback');
        if (data.success) {
          setFeedbacks(data.feedbacks);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchFeedbacks();
  }, []);

  const stats = [
    { label: 'Grievances Resolved', count: '14,820+', icon: <FiCheckCircle className="text-emerald-500" />, bg: 'bg-emerald-50' },
    { label: 'Avg Resolution Time', count: '3.2 Days', icon: <FiClock className="text-brand-500" />, bg: 'bg-brand-50' },
    { label: 'Active Citizens', count: '45,000+', icon: <FiUsers className="text-indigo-500" />, bg: 'bg-indigo-50' },
    { label: 'SLA Adherence', count: '97.8%', icon: <FiTrendingUp className="text-tealbrand-500" />, bg: 'bg-tealbrand-50' },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Submit Grievance',
      desc: 'Fill in details of the issue, select a category, set the priority level, and upload photo or document proof.',
      icon: <FiFileText className="text-xl" />
    },
    {
      step: '02',
      title: 'Automated Routing',
      desc: 'Our intelligent system immediately routes the complaint to the head of the respective public department.',
      icon: <FiMapPin className="text-xl" />
    },
    {
      step: '03',
      title: 'Active Resolution',
      desc: 'Track the status and timeline logs of the officer on site as they address the complaint in real-time.',
      icon: <FiClock className="text-xl" />
    },
    {
      step: '04',
      title: 'Citizen Feedback',
      desc: 'Verify the resolution notes, close the case, and leave feedback or a rating on the service quality.',
      icon: <FiStar className="text-xl" />
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-28 pb-32 px-6 sm:px-12 lg:px-24">
        {/* Background Gradients & Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pointer-events-none z-0" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.15),transparent_60%)] -translate-y-1/2 translate-x-1/3 pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.15),transparent_60%)] translate-y-1/3 -translate-x-1/3 pointer-events-none z-0" />
        
        {/* subtle noise/pattern texture placeholder */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] z-0"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-500/10 border border-brand-500/20 text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider w-fit shadow-[0_0_15px_rgba(37,99,235,0.2)]">
              <FiShield className="text-sm" /> Certified E-Governance Portal
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Transparent & Fast <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-sky-400 to-tealbrand-400 drop-shadow-sm">
                Grievance Redressal
              </span>
            </h1>
            <p className="text-slate-300 text-lg sm:text-xl max-w-xl leading-relaxed mt-2">
              Empowering citizens to report municipal issues, track resolution workflows in real-time, and hold public services accountable.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link
                to="/register"
                className="px-8 py-4 text-sm font-bold bg-brand-600 hover:bg-brand-500 text-white rounded-2xl hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2 active:scale-95"
              >
                File a Complaint <FiArrowRight className="text-lg" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 text-sm font-bold bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:bg-slate-700 hover:border-slate-600 text-white rounded-2xl transition-all active:scale-95"
              >
                Track Status
              </Link>
            </div>
            
            <div className="mt-8 flex items-center gap-4 text-sm text-slate-400">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" src="https://i.pravatar.cc/100?img=1" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" src="https://i.pravatar.cc/100?img=2" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" src="https://i.pravatar.cc/100?img=3" alt="User" />
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs font-bold">+14k</div>
              </div>
              <p>Trusted by citizens statewide</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: 1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative lg:block"
          >
            {/* Visual Glass Card - Dashboard Mockup */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-brand-900/50 relative z-10 transform lg:-rotate-2 transition-transform hover:rotate-0 duration-500">
              <div className="flex items-center justify-between border-b border-slate-700/50 pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <span className="text-sm font-semibold text-slate-300 ml-2">Live Status Monitor</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Syncing</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/50 flex justify-between items-center group hover:bg-slate-800/80 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400">
                      <FiCheckCircle className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-brand-300 transition-colors">CMP-20260707-1004</h4>
                      <p className="text-xs text-slate-400 mt-1">Mosquito Breeding Treatment</p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Resolved
                  </span>
                </div>

                <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/50 flex justify-between items-center group hover:bg-slate-800/80 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                      <FiClock className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">CMP-20260707-1002</h4>
                      <p className="text-xs text-slate-400 mt-1">Street Light Broken</p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Assigned
                  </span>
                </div>

                <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/50 flex justify-between items-center group hover:bg-slate-800/80 transition-colors opacity-60">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-400">
                      <FiMapPin className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">CMP-20260707-1003</h4>
                      <p className="text-xs text-slate-400 mt-1">Garbage Accumulation</p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                    In Progress
                  </span>
                </div>
              </div>
            </div>
            
            {/* Decorative floaters */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-brand-500/30 blur-2xl rounded-full pointer-events-none z-0"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-tealbrand-500/20 blur-3xl rounded-full pointer-events-none z-0"></div>
          </motion.div>
        </div>
      </section>

      {/* Stats Counter Section (Lifted) */}
      <section className="max-w-7xl mx-auto -mt-16 px-6 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
              <div className={`p-4 ${stat.bg} rounded-2xl text-2xl group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">{stat.count}</h3>
                <p className="text-xs lg:text-sm font-semibold text-slate-500 mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto py-28 px-6 sm:px-12 lg:px-24">
        <div className="text-center flex flex-col items-center gap-3">
          <span className="px-4 py-1.5 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-widest border border-brand-100">Workflow</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">How It Works</h2>
          <p className="text-slate-500 text-base max-w-xl mt-2 leading-relaxed">
            A simplified, 4-step digital process replacing manual paper trails with transparency and accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-12 left-24 right-24 h-0.5 bg-gradient-to-r from-slate-200 via-brand-200 to-slate-200 z-0"></div>

          {workflowSteps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center justify-center mb-8 relative overflow-hidden group-hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute inset-0 bg-brand-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 text-3xl text-brand-600">
                  {step.icon}
                </div>
                <div className="absolute top-2 right-2 text-3xl font-extrabold text-slate-100/50 -mr-2 -mt-2 group-hover:text-brand-100 transition-colors">
                  {step.step}
                </div>
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl mb-3">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-900 py-28 px-6 sm:px-12 lg:px-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] z-0"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center flex flex-col items-center gap-3 mb-20">
            <span className="px-4 py-1.5 rounded-full bg-tealbrand-500/10 text-tealbrand-400 text-xs font-bold uppercase tracking-widest border border-tealbrand-500/20">Testimonials</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Citizen Feedback</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {feedbacks.slice(0, 3).map((fb) => (
              <div key={fb._id} className="bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-700 flex flex-col gap-6 relative group hover:bg-slate-800 transition-colors">
                <div className="absolute -top-4 -left-4 text-6xl text-slate-700/50 font-serif font-black">"</div>
                <p className="text-slate-300 text-sm leading-relaxed relative z-10 font-medium line-clamp-4">
                  {fb.comment}
                </p>
                <div className="mt-auto border-t border-slate-700/50 pt-6 flex items-center gap-4">
                  <img src={`https://i.pravatar.cc/100?img=${fb.user?.image || '11'}`} className="w-12 h-12 rounded-full border-2 border-slate-600 object-cover" alt="Avatar" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{fb.user?.name || 'Citizen'}</h4>
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${fb.user?.role === 'admin' ? 'text-tealbrand-400' : 'text-brand-400'}`}>
                      {fb.user?.role === 'admin' ? 'Dept Officer' : 'Verified Citizen'}
                    </span>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={`text-xs ${i < fb.rating ? 'text-amber-400' : 'text-slate-600'}`} fill={i < fb.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-brand-600 to-tealbrand-600 rounded-[3rem] p-12 md:p-16 shadow-2xl shadow-brand-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-900/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6 relative z-10">
            Ready to make a difference?
          </h2>
          <p className="text-brand-50 text-base md:text-lg max-w-2xl mx-auto mb-10 relative z-10 leading-relaxed">
            Join thousands of citizens actively contributing to a better, more accountable civic infrastructure.
          </p>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Link
              to="/register"
              className="px-10 py-4 text-sm font-bold bg-white text-brand-700 rounded-2xl hover:shadow-xl hover:scale-105 transition-all active:scale-95"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
