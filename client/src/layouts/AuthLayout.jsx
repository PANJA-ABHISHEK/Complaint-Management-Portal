import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f8fafc' }} className="dark:bg-dark-bg">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex" style={{
        width: '45%', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '48px 40px',
      }}>
        {/* Background blobs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div className="animate-pulse-soft" style={{ position: 'absolute', top: '15%', left: '10%', width: 350, height: 350, background: 'rgba(99,102,241,0.25)', borderRadius: '50%', filter: 'blur(80px)' }} />
          <div className="animate-pulse-soft" style={{ position: 'absolute', bottom: '10%', right: '5%', width: 300, height: 300, background: 'rgba(139,92,246,0.2)', borderRadius: '50%', filter: 'blur(80px)', animationDelay: '1.5s' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 400 }}
        >
          {/* Logo */}
          <div style={{
            width: 80, height: 80, borderRadius: 24,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 40px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 32, letterSpacing: '-0.02em' }}>CP</span>
          </div>

          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#ffffff', lineHeight: 1.3, marginBottom: 16 }}>
            Complaint{' '}
            <span style={{ display: 'block', color: '#a5b4fc' }}>Management Portal</span>
          </h1>

          <p style={{ fontSize: 16, color: 'rgba(203,213,225,0.85)', lineHeight: 1.7, marginBottom: 48 }}>
            Your trusted platform for registering, tracking, and resolving civic complaints with total transparency.
          </p>

          {/* Feature cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, textAlign: 'left' }}>
            <div style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 16, padding: 20, backdropFilter: 'blur(8px)',
            }}>
              <span style={{ fontSize: 24, display: 'block', marginBottom: 10 }}>⚡</span>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Fast Resolution</h3>
              <p style={{ color: 'rgba(203,213,225,0.7)', fontSize: 13, lineHeight: 1.5 }}>Avg time under 24 hours</p>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 16, padding: 20, backdropFilter: 'blur(8px)',
            }}>
              <span style={{ fontSize: 24, display: 'block', marginBottom: 10 }}>🛡️</span>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Secure & Private</h3>
              <p style={{ color: 'rgba(203,213,225,0.7)', fontSize: 13, lineHeight: 1.5 }}>Data encrypted & safe</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Auth Form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: 440 }}
        >
          <div style={{
            background: '#ffffff', borderRadius: 24, padding: '40px 36px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02), 0 12px 40px rgba(0,0,0,0.06)',
          }} className="dark:bg-slate-800 dark:border-slate-700">
            <Outlet />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
