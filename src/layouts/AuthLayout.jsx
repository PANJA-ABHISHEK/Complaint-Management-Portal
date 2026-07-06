import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-dark-bg">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 items-center justify-center p-12 relative overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-500/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0,transparent_60%)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center mx-auto mb-10 shadow-2xl border border-white/20">
            <ShieldAlert className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Welcome to <br />
            <span className="bg-gradient-to-r from-primary-200 to-violet-300 bg-clip-text text-transparent">
              Complaint Portal
            </span>
          </h1>
          <p className="text-lg text-primary-200/80 leading-relaxed font-medium">
            Your trusted platform for registering, tracking, and resolving civic complaints with complete transparency.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-12">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-left">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="text-white font-semibold text-sm mb-1">Fast Resolution</h3>
              <p className="text-xs text-primary-300/70">Resolved under 24 hours on average.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-left">
              <div className="text-2xl mb-2">🛡️</div>
              <h3 className="text-white font-semibold text-sm mb-1">Secure & Private</h3>
              <p className="text-xs text-primary-300/70">Your data is encrypted and protected.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 sm:p-10">
            <Outlet />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
