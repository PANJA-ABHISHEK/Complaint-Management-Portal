import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-dark-bg selection:bg-primary-500/30">
      {/* Left side: Premium Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary-500/20 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary-500/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0,transparent_60%)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center max-w-lg"
        >
          {/* Logo Badge */}
          <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary-400 to-secondary-500 p-[1px] mx-auto mb-10 shadow-2xl shadow-primary-500/30">
            <div className="w-full h-full rounded-[calc(2rem-1px)] bg-white/10 backdrop-blur-xl flex items-center justify-center">
              <span className="text-white font-extrabold text-4xl tracking-tighter">CP</span>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
            Welcome to <br />
            <span className="bg-gradient-to-r from-primary-300 to-accent-300 bg-clip-text text-transparent">
              ComplaintPortal
            </span>
          </h1>
          <p className="text-lg text-slate-300/90 leading-relaxed font-medium">
            Your trusted platform for registering, tracking, and resolving civic complaints with total transparency.
          </p>
          
          {/* Decorative stats/features */}
          <div className="grid grid-cols-2 gap-4 mt-12 text-left">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center mb-3 text-xl">⚡</div>
              <h3 className="text-white font-semibold mb-1">Fast Resolution</h3>
              <p className="text-sm text-slate-400">Average time to resolve under 24 hours.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3 text-xl">🛡️</div>
              <h3 className="text-white font-semibold mb-1">Secure & Private</h3>
              <p className="text-sm text-slate-400">Your data is protected and encrypted.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right side: Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative">
        {/* Mobile decorative background */}
        <div className="lg:hidden absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary-500/10 to-transparent pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[420px] relative z-10"
        >
          <div className="glass-card p-8 sm:p-10 shadow-2xl">
            <Outlet />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
