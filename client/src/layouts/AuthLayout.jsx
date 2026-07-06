import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>
      {/* Left Branding Panel */}
      <div
        className="gradient-hero"
        style={{
          display: 'none',
          width: '50%',
          position: 'relative',
          overflow: 'hidden',
          padding: '48px',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
        id="auth-left-panel"
      >
        {/* Background Orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '15%', left: '10%', width: 350, height: 350, background: 'rgba(99,102,241,0.15)', borderRadius: '50%', filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 400, height: 400, background: 'rgba(168,85,247,0.12)', borderRadius: '50%', filter: 'blur(80px)' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 420, margin: '0 auto' }}
        >
          {/* Logo */}
          <div style={{
            width: 80, height: 80, borderRadius: 24,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 40px',
            boxShadow: '0 20px 60px rgba(99,102,241,0.35)',
          }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 32, letterSpacing: -1 }}>CP</span>
          </div>

          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 38, lineHeight: 1.2, marginBottom: 16 }}>
            Welcome to
          </h1>
          <h1 style={{
            fontWeight: 800, fontSize: 38, lineHeight: 1.2, marginBottom: 24,
            background: 'linear-gradient(to right, #a5b4fc, #c4b5fd)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Complaint Portal
          </h1>
          <p style={{ color: 'rgba(203,213,225,0.9)', fontSize: 16, lineHeight: 1.7, maxWidth: 380, margin: '0 auto' }}>
            Your trusted platform for registering, tracking, and resolving civic complaints with complete transparency.
          </p>

          {/* Feature Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 48 }}>
            <div style={{
              background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 20, textAlign: 'left',
            }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>⚡</div>
              <h3 style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Fast Resolution</h3>
              <p style={{ color: 'rgba(148,163,184,1)', fontSize: 12, lineHeight: 1.5 }}>Resolved under 24 hours on average.</p>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 20, textAlign: 'left',
            }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>🛡️</div>
              <h3 style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Secure & Private</h3>
              <p style={{ color: 'rgba(148,163,184,1)', fontSize: 12, lineHeight: 1.5 }}>Your data is encrypted and protected.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Form Panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 24px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            width: '100%', maxWidth: 460,
            background: '#fff',
            borderRadius: 20,
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04), 0 20px 50px -12px rgba(0,0,0,0.08)',
            padding: '48px 40px',
          }}
        >
          <Outlet />
        </motion.div>
      </div>

      {/* CSS to show left panel on large screens */}
      <style>{`
        @media (min-width: 1024px) {
          #auth-left-panel { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
