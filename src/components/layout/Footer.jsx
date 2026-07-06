import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ExternalLink, Globe, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-dark-bg border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                ComplaintPortal
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Modernizing civic issue resolution through transparency, efficiency, and real-time tracking.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors">
                <ExternalLink className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/#features" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors">Features</Link></li>
              <li><Link to="/#how-it-works" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors">How it Works</Link></li>
              <li><Link to="/pricing" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors">Pricing</Link></li>
              <li><Link to="/changelog" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors">Changelog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/docs" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors">Documentation</Link></li>
              <li><Link to="/api" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors">API Reference</Link></li>
              <li><Link to="/blog" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors">Blog</Link></li>
              <li><Link to="/community" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors">Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} ComplaintPortal Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
