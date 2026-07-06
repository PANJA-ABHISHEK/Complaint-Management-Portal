import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Zap, Eye, BarChart3, Clock, Users, ChevronRight, Star,
  ArrowRight, FileText, Bell, CheckCircle, MessageSquare, Send
} from 'lucide-react';
import Button from '../../components/ui/Button';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const HomePage = () => {
  const features = [
    { icon: FileText, title: 'Easy Registration', desc: 'File complaints in minutes with our intuitive form builder and smart categorization.', color: 'bg-blue-50 text-blue-500 dark:bg-blue-500/10' },
    { icon: Eye, title: 'Real-time Tracking', desc: 'Monitor complaint progress with live status updates and timeline view.', color: 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10' },
    { icon: Bell, title: 'Instant Notifications', desc: 'Get notified via email and in-app alerts when your complaint status changes.', color: 'bg-amber-50 text-amber-500 dark:bg-amber-500/10' },
    { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Powerful analytics with charts and reports for administrators.', color: 'bg-purple-50 text-purple-500 dark:bg-purple-500/10' },
    { icon: ShieldCheck, title: 'Secure & Private', desc: 'Enterprise-grade security with encrypted data storage and access controls.', color: 'bg-red-50 text-red-500 dark:bg-red-500/10' },
    { icon: Users, title: 'Role-based Access', desc: 'Separate dashboards for citizens, officers, and administrators.', color: 'bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10' },
  ];

  const steps = [
    { step: '01', title: 'Register Account', desc: 'Create your free account in under a minute.' },
    { step: '02', title: 'File Complaint', desc: 'Submit your complaint with all relevant details and attachments.' },
    { step: '03', title: 'Track Progress', desc: 'Monitor real-time status updates from submission to resolution.' },
    { step: '04', title: 'Get Resolved', desc: 'Receive resolution confirmation and provide your feedback.' },
  ];

  const stats = [
    { value: '10K+', label: 'Complaints Resolved' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '24h', label: 'Avg. Resolution' },
    { value: '500+', label: 'Active Users' },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Citizen', avatar: '👩‍💼', text: 'ComplaintPortal resolved my water issue in just 18 hours. The real-time tracking made me feel heard.' },
    { name: 'Michael Chen', role: 'City Officer', avatar: '👨‍💻', text: 'The admin dashboard gives us incredible visibility. Our department efficiency improved by 40%.' },
    { name: 'Emily Davis', role: 'Citizen', avatar: '👩‍🔬', text: 'Finally a platform that treats civic issues seriously. Beautiful interface and incredibly easy to use.' },
  ];

  const faqs = [
    { q: 'How do I file a complaint?', a: 'Simply register for an account, click "New Complaint", fill in the details and submit. You\'ll receive a tracking number instantly.' },
    { q: 'How long does resolution take?', a: 'Most complaints are resolved within 24-48 hours. Complex issues may take longer, but you\'ll receive real-time status updates.' },
    { q: 'Is my data secure?', a: 'Absolutely. We use enterprise-grade encryption and follow strict privacy policies to protect your information.' },
    { q: 'Can I track multiple complaints?', a: 'Yes! Your dashboard shows all your complaints with their current status, timeline, and resolution details.' },
  ];

  return (
    <div className="overflow-hidden">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-violet-50 dark:from-dark-bg dark:via-dark-bg dark:to-primary-950/20" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-200/30 dark:bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-200/30 dark:bg-violet-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-6">
              <Zap className="w-4 h-4" /> Now with AI-powered categorization
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6"
          >
            Resolve Civic Issues
            <br />
            <span className="bg-gradient-to-r from-primary-500 to-violet-500 bg-clip-text text-transparent">
              With Transparency
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The modern platform for registering, tracking, and resolving complaints.
            Built for citizens who demand accountability and officers who deliver results.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register">
              <Button size="lg" icon={ArrowRight}>
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section id="features" className="py-24 bg-white dark:bg-dark-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">Features</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Powerful tools for citizens to report issues and for administrators to manage and resolve them efficiently.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                whileHover={{ y: -6 }}
                className="p-8 rounded-2xl bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-5`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 mb-4">
              How it works
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Four simple steps from filing to resolution. We keep you informed every step of the way.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="relative text-center"
              >
                <div className="text-6xl font-extrabold text-primary-100 dark:text-primary-900/30 mb-4">{s.step}</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 translate-x-1/2">
                    <ChevronRight className="w-6 h-6 text-slate-300 dark:text-slate-700" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-24 bg-white dark:bg-dark-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 mb-4">
              What our users say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="p-8 rounded-2xl bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-slate-800"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{t.avatar}</span>
                  <div>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="py-24 bg-slate-50 dark:bg-dark-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.details
                key={i}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="group bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-semibold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {faq.q}
                  <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed -mt-2">
                  {faq.a}
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to make your voice heard?
            </h2>
            <p className="text-lg text-primary-200 mb-8 max-w-xl mx-auto">
              Join thousands of citizens already using ComplaintPortal to drive meaningful change in their communities.
            </p>
            <Link to="/register">
              <Button size="xl" className="bg-white text-primary-700 hover:bg-primary-50 shadow-2xl shadow-black/20">
                Start Filing Complaints <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
