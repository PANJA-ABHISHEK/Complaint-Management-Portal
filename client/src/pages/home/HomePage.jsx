import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HiShieldCheck, HiLightningBolt, HiChartBar, HiClock, HiUserGroup,
  HiDocumentSearch, HiArrowRight, HiChevronDown, HiMail, HiPhone,
} from 'react-icons/hi';
import { CATEGORIES } from '../../utils/constants';
import Button from '../../components/ui/Button';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const HomePage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const features = [
    { icon: HiShieldCheck, title: 'Secure & Transparent', desc: 'End-to-end encrypted complaint management with full transparency and audit trails.', gradient: 'from-blue-500 to-indigo-600' },
    { icon: HiLightningBolt, title: 'Fast Resolution', desc: 'Streamlined workflow ensures complaints are resolved quickly and efficiently.', gradient: 'from-amber-500 to-orange-600' },
    { icon: HiChartBar, title: 'Real-time Analytics', desc: 'Track performance with interactive charts, dashboards, and smart insights.', gradient: 'from-emerald-500 to-teal-600' },
    { icon: HiClock, title: 'Track Progress', desc: 'Monitor complaint status in real-time with detailed timeline view.', gradient: 'from-purple-500 to-violet-600' },
    { icon: HiUserGroup, title: 'Role-based Access', desc: 'Dedicated dashboards for users, officers, and administrators.', gradient: 'from-pink-500 to-rose-600' },
    { icon: HiDocumentSearch, title: 'Smart Search', desc: 'Find complaints instantly with advanced search and smart filters.', gradient: 'from-cyan-500 to-blue-600' },
  ];

  const steps = [
    { num: '01', title: 'Register', desc: 'Create your account in seconds', emoji: '📝' },
    { num: '02', title: 'Submit Complaint', desc: 'File a detailed complaint with attachments', emoji: '📨' },
    { num: '03', title: 'Track Progress', desc: 'Monitor real-time status updates', emoji: '📊' },
    { num: '04', title: 'Get Resolved', desc: 'Receive notification when resolved', emoji: '✅' },
  ];

  const stats = [
    { value: '10K+', label: 'Complaints Resolved' },
    { value: '5K+', label: 'Active Users' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '24h', label: 'Avg Response Time' },
  ];

  const faqs = [
    { q: 'How do I register a complaint?', a: 'Simply create an account, navigate to your dashboard, and click "New Complaint". Fill in the details and submit.' },
    { q: 'How can I track my complaint?', a: 'Go to your dashboard and view "My Complaints". Each complaint has a detailed timeline showing its progress.' },
    { q: 'What complaint categories are supported?', a: 'We support 12+ categories including Electricity, Water Supply, Road Damage, Health, Security, and more.' },
    { q: 'How long does resolution take?', a: 'Most complaints are resolved within 24-72 hours depending on the complexity and category.' },
    { q: 'Can I upload evidence?', a: 'Yes! You can attach images and PDF documents to support your complaint.' },
  ];

  const testimonials = [
    { name: 'Rahul Sharma', role: 'Resident', text: 'The portal resolved my street light issue within 48 hours. Amazing transparency and user experience!', avatar: '👨‍💼' },
    { name: 'Priya Patel', role: 'Business Owner', text: 'Finally, a system where I can track my complaints easily. No more running around offices.', avatar: '👩‍💻' },
    { name: 'Amit Kumar', role: 'Student', text: 'The hostel complaint I filed was addressed so quickly. Great user experience and modern interface!', avatar: '👨‍🎓' },
  ];

  return (
    <div style={{ overflow: 'hidden' }}>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="gradient-hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Animated background blobs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div className="animate-pulse-soft" style={{ position: 'absolute', top: '20%', left: '15%', width: 500, height: 500, background: 'rgba(99,102,241,0.12)', borderRadius: '50%', filter: 'blur(80px)' }} />
          <div className="animate-pulse-soft" style={{ position: 'absolute', bottom: '20%', right: '15%', width: 400, height: 400, background: 'rgba(139,92,246,0.12)', borderRadius: '50%', filter: 'blur(80px)', animationDelay: '1s' }} />
        </div>

        <div className="section-container" style={{ paddingTop: 120, paddingBottom: 80, position: 'relative', zIndex: 10, width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 48, alignItems: 'center' }} className="lg:grid-cols-2">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 9999, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', marginBottom: 32 }}>
                <span style={{ width: 8, height: 8, background: '#34d399', borderRadius: '50%' }} className="animate-pulse" />
                <span style={{ fontSize: 14, color: '#cbd5e1' }}>Platform is live</span>
              </motion.div>

              <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, marginBottom: 24 }}>
                Resolve Complaints{' '}
                <span className="gradient-text" style={{ WebkitTextFillColor: 'transparent', background: 'linear-gradient(135deg, #818cf8, #22d3ee)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
                  Faster & Smarter
                </span>
              </motion.h1>

              <motion.p variants={fadeUp} style={{ fontSize: 18, color: 'rgba(203,213,225,0.9)', marginBottom: 40, maxWidth: 520, lineHeight: 1.7 }}>
                A modern, transparent complaint management system that connects citizens with authorities for faster issue resolution.
              </motion.p>

              <motion.div variants={fadeUp} style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                <Link to="/register">
                  <Button size="lg" icon={HiArrowRight}>Get Started Free</Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </a>
              </motion.div>
            </motion.div>

            {/* Dashboard mockup */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div style={{ padding: 32, background: 'rgba(255,255,255,0.08)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(16px)' }}>
                {/* Browser chrome */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f87171' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fbbf24' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#34d399' }} />
                  <div style={{ flex: 1 }} />
                  <div style={{ height: 16, width: 120, background: 'rgba(255,255,255,0.1)', borderRadius: 8 }} />
                </div>
                {/* Content skeleton */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ height: 32, background: 'rgba(255,255,255,0.08)', borderRadius: 8, width: '70%' }} />
                  <div style={{ height: 20, background: 'rgba(255,255,255,0.06)', borderRadius: 8, width: '45%' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 8 }}>
                    {['📊', '✅', '⏳', '🔔'].map((icon, i) => (
                      <div key={i} style={{ height: 80, background: `rgba(${i === 0 ? '99,102,241' : i === 1 ? '16,185,129' : i === 2 ? '245,158,11' : '239,68,68'},0.15)`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <span style={{ fontSize: 28 }}>{icon}</span>
                      </div>
                    ))}
                  </div>
                  {/* Mini chart */}
                  <div style={{ height: 100, background: 'rgba(255,255,255,0.04)', borderRadius: 12, display: 'flex', alignItems: 'flex-end', padding: '12px 16px', gap: 6, border: '1px solid rgba(255,255,255,0.06)' }}>
                    {[35, 55, 40, 70, 50, 65, 85, 60, 75].map((h, i) => (
                      <div key={i} style={{ flex: 1, height: `${h}%`, background: 'linear-gradient(to top, rgba(99,102,241,0.6), rgba(139,92,246,0.3))', borderRadius: '4px 4px 0 0' }} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section style={{ padding: '80px 0', background: '#ffffff' }} className="dark:bg-slate-900">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }} className="max-sm:grid-cols-2">
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} style={{ textAlign: 'center', padding: '24px 0' }}>
                <h3 className="gradient-text" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, marginBottom: 8 }}>{stat.value}</h3>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#64748b' }} className="dark:text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section id="features" style={{ padding: '100px 0' }} className="bg-slate-50 dark:bg-dark-bg">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="section-label">Features</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 800, marginBottom: 16 }} className="text-slate-900 dark:text-white">
              Powerful Features
            </h2>
            <p style={{ fontSize: 18, maxWidth: 560, margin: '0 auto' }} className="text-slate-500 dark:text-slate-400">
              Everything you need to manage complaints efficiently
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="max-md:grid-cols-1 max-lg:grid-cols-2">
            {features.map((feature) => (
              <motion.div key={feature.title} variants={fadeUp} className="glass-card" style={{ padding: 32 }}>
                <div className={`bg-gradient-to-br ${feature.gradient}`} style={{ width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 8px 24px rgba(99,102,241,0.2)' }}>
                  <feature.icon style={{ width: 28, height: 28, color: '#ffffff' }} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }} className="text-slate-900 dark:text-white">{feature.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.7 }} className="text-slate-500 dark:text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section id="how-it-works" style={{ padding: '100px 0' }} className="bg-white dark:bg-slate-900">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="section-label">Process</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 800, marginBottom: 16 }} className="text-slate-900 dark:text-white">How It Works</h2>
            <p style={{ fontSize: 18 }} className="text-slate-500 dark:text-slate-400">Simple steps to get your complaint resolved</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }} className="max-md:grid-cols-2 max-sm:grid-cols-1">
            {steps.map((step, i) => (
              <motion.div key={step.num} variants={fadeUp} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 12px 32px rgba(99,102,241,0.25)' }}>
                  <span style={{ fontSize: 32 }}>{step.emoji}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block" style={{ position: 'absolute', top: 40, left: '60%', width: '80%', height: 3, background: 'linear-gradient(to right, #a5b4fc, #e0e7ff)', borderRadius: 4 }} />
                )}
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }} className="text-slate-900 dark:text-white">{step.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6 }} className="text-slate-500 dark:text-slate-400">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ CATEGORIES ═══════════════ */}
      <section id="categories" style={{ padding: '100px 0' }} className="bg-slate-50 dark:bg-dark-bg">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="section-label">Categories</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 800, marginBottom: 16 }} className="text-slate-900 dark:text-white">Complaint Categories</h2>
            <p style={{ fontSize: 18 }} className="text-slate-500 dark:text-slate-400">We handle all types of civic complaints</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }} className="max-md:grid-cols-3 max-sm:grid-cols-2">
            {CATEGORIES.map((cat) => (
              <motion.div
                key={cat.value}
                variants={fadeUp}
                whileHover={{ scale: 1.05, y: -4 }}
                className="glass-card"
                style={{ padding: 24, textAlign: 'center', cursor: 'pointer' }}
              >
                <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>{cat.icon}</span>
                <p style={{ fontSize: 14, fontWeight: 600 }} className="text-slate-700 dark:text-slate-300">{cat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section style={{ padding: '100px 0' }} className="bg-white dark:bg-slate-900">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="section-label">Testimonials</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 800, marginBottom: 16 }} className="text-slate-900 dark:text-white">What People Say</h2>
            <p style={{ fontSize: 18 }} className="text-slate-500 dark:text-slate-400">Trusted by thousands of citizens</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="max-md:grid-cols-1">
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeUp} className="glass-card" style={{ padding: 32 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ fontSize: 18, color: '#f59e0b' }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 24, fontStyle: 'italic' }} className="text-slate-600 dark:text-slate-300">
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid #e2e8f0', paddingTop: 20 }} className="dark:border-slate-700">
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700 }} className="text-slate-900 dark:text-white">{t.name}</p>
                    <p style={{ fontSize: 13 }} className="text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section id="faq" style={{ padding: '100px 0' }} className="bg-slate-50 dark:bg-dark-bg">
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="section-label">FAQ</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 800, marginBottom: 16 }} className="text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            <p style={{ fontSize: 18 }} className="text-slate-500 dark:text-slate-400">Find answers to common questions</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeUp} className="glass-card" style={{ overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 24px', border: 'none', background: 'transparent', cursor: 'pointer',
                    textAlign: 'left', fontSize: 16, fontWeight: 600, fontFamily: 'inherit',
                  }}
                  className="text-slate-900 dark:text-white"
                >
                  <span style={{ paddingRight: 16 }}>{faq.q}</span>
                  <HiChevronDown style={{
                    width: 20, height: 20, flexShrink: 0, transition: 'transform 0.3s',
                    transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', color: '#94a3b8',
                  }} />
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 24px 20px', fontSize: 15, lineHeight: 1.7 }} className="text-slate-500 dark:text-slate-400">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ CONTACT ═══════════════ */}
      <section id="contact" style={{ padding: '100px 0' }} className="bg-white dark:bg-slate-900">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="section-label">Contact</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 800, marginBottom: 16 }} className="text-slate-900 dark:text-white">Get in Touch</h2>
            <p style={{ fontSize: 18 }} className="text-slate-500 dark:text-slate-400">Have questions? We'd love to hear from you.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }} className="max-md:grid-cols-1">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Email card */}
              <div className="glass-card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 24px rgba(99,102,241,0.25)' }}>
                  <HiMail style={{ width: 24, height: 24, color: '#fff' }} />
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }} className="text-slate-400">Email</p>
                  <p style={{ fontSize: 16, fontWeight: 600 }} className="text-slate-800 dark:text-slate-200">support@complaintportal.com</p>
                </div>
              </div>
              {/* Phone card */}
              <div className="glass-card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 24px rgba(99,102,241,0.25)' }}>
                  <HiPhone style={{ width: 24, height: 24, color: '#fff' }} />
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }} className="text-slate-400">Phone</p>
                  <p style={{ fontSize: 16, fontWeight: 600 }} className="text-slate-800 dark:text-slate-200">+91 1234567890</p>
                </div>
              </div>
            </motion.div>

            <motion.form initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="glass-card" style={{ padding: 32 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }} className="max-sm:grid-cols-1">
                <input placeholder="Your Name" style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#1e293b' }} className="dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
                <input placeholder="Your Email" style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#1e293b' }} className="dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
              </div>
              <input placeholder="Subject" style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 14, outline: 'none', fontFamily: 'inherit', marginBottom: 16, color: '#1e293b' }} className="dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
              <textarea rows={5} placeholder="Your Message" style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 14, outline: 'none', fontFamily: 'inherit', resize: 'none', marginBottom: 16, color: '#1e293b' }} className="dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
              <Button type="submit" fullWidth size="lg">Send Message</Button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="gradient-primary" style={{ padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: 600, height: 600, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '-50%', left: '-20%', width: 500, height: 500, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(60px)' }} />
        </div>
        <div className="section-container" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: 20 }}>Ready to Get Started?</h2>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
              Join thousands of citizens who trust our platform for transparent and efficient complaint resolution.
            </p>
            <Link to="/register">
              <Button size="xl" className="bg-white text-primary-600 hover:bg-slate-100" style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }}>
                Register Now — It's Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
