import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HiShieldCheck, HiLightningBolt, HiChartBar, HiClock, HiUserGroup,
  HiDocumentSearch, HiArrowRight, HiCheck, HiChevronDown, HiMail, HiPhone,
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
  const features = [
    { icon: HiShieldCheck, title: 'Secure & Transparent', desc: 'End-to-end encrypted complaint management with full transparency.' },
    { icon: HiLightningBolt, title: 'Fast Resolution', desc: 'Streamlined workflow ensures complaints are resolved quickly.' },
    { icon: HiChartBar, title: 'Real-time Analytics', desc: 'Track performance with interactive charts and dashboards.' },
    { icon: HiClock, title: 'Track Progress', desc: 'Monitor complaint status in real-time with timeline view.' },
    { icon: HiUserGroup, title: 'Role-based Access', desc: 'Dedicated dashboards for users, officers, and admins.' },
    { icon: HiDocumentSearch, title: 'Smart Search', desc: 'Find complaints instantly with advanced search and filters.' },
  ];

  const steps = [
    { num: '01', title: 'Register', desc: 'Create your account in seconds' },
    { num: '02', title: 'Submit Complaint', desc: 'File a detailed complaint with attachments' },
    { num: '03', title: 'Track Progress', desc: 'Monitor real-time status updates' },
    { num: '04', title: 'Get Resolved', desc: 'Receive notification when resolved' },
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
    { name: 'Rahul Sharma', role: 'Resident', text: 'The portal resolved my street light issue within 48 hours. Amazing transparency!' },
    { name: 'Priya Patel', role: 'Business Owner', text: 'Finally, a system where I can track my complaints. No more running around offices.' },
    { name: 'Amit Kumar', role: 'Student', text: 'The hostel complaint I filed was addressed so quickly. Great user experience!' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm text-slate-300">Platform is live</span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Resolve Complaints{' '}
                <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  Faster & Smarter
                </span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg text-slate-300 mb-8 max-w-lg">
                A modern, transparent complaint management system that connects citizens with authorities for faster issue resolution.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
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

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="glass-card p-6 bg-white/10 border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-8 bg-white/10 rounded-lg w-3/4" />
                    <div className="h-6 bg-white/10 rounded-lg w-1/2" />
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-20 bg-white/10 rounded-xl flex items-center justify-center">
                          <div className="w-8 h-8 bg-primary-400/30 rounded-lg" />
                        </div>
                      ))}
                    </div>
                    <div className="h-32 bg-white/10 rounded-xl mt-3" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="text-center">
                <h3 className="text-3xl sm:text-4xl font-bold gradient-text">{stat.value}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to manage complaints efficiently
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <motion.div key={feature.title} variants={fadeUp} className="glass-card p-6 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">Simple steps to get your complaint resolved</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div key={step.num} variants={fadeUp} className="text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-300 to-transparent" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-24 bg-slate-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">Complaint Categories</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">We handle all types of civic complaints</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <motion.div
                key={cat.value}
                variants={fadeUp}
                whileHover={{ scale: 1.05, y: -4 }}
                className="glass-card p-4 text-center cursor-pointer"
              >
                <span className="text-3xl mb-2 block">{cat.icon}</span>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{cat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">What People Say</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeUp} className="glass-card p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400">★</span>
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">"{t.text}"</p>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-slate-50 dark:bg-dark-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.details key={i} variants={fadeUp} className="glass-card group">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{faq.q}</span>
                  <HiChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="px-5 pb-5 text-sm text-slate-500 dark:text-slate-400">{faq.a}</p>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">Get in Touch</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">Have questions? We'd love to hear from you.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
                    <HiMail className="w-5 h-5 text-primary-500" />
                  </div>
                  <span className="text-slate-600 dark:text-slate-300">support@complaintportal.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
                    <HiPhone className="w-5 h-5 text-primary-500" />
                  </div>
                  <span className="text-slate-600 dark:text-slate-300">+91 1234567890</span>
                </div>
              </div>
            </motion.div>

            <motion.form initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="glass-card p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input placeholder="Name" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                <input placeholder="Email" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
              </div>
              <input placeholder="Subject" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
              <textarea rows={4} placeholder="Message" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none" />
              <Button type="submit" fullWidth>Send Message</Button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-white/80 mb-8">Join thousands of citizens who trust our platform.</p>
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-slate-100 shadow-xl">
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
