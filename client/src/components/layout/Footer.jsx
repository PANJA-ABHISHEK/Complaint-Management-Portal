import { Link } from 'react-router-dom';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: 'Features', href: '/#features' },
      { name: 'How It Works', href: '/#how-it-works' },
      { name: 'Categories', href: '/#categories' },
      { name: 'FAQ', href: '/#faq' },
    ],
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/#contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
    Support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Register Complaint', href: '/login' },
      { name: 'Track Complaint', href: '/login' },
      { name: 'Status', href: '/status' },
    ],
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-lg text-white">
                Complaint<span className="text-primary-400">Portal</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-6 max-w-sm">
              A modern complaint management platform for transparent, accountable, and faster issue resolution.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <HiMail className="w-4 h-4 text-primary-400" />
                <span>support@complaintportal.com</span>
              </div>
              <div className="flex items-center gap-2">
                <HiPhone className="w-4 h-4 text-primary-400" />
                <span>+91 1234567890</span>
              </div>
              <div className="flex items-center gap-2">
                <HiLocationMarker className="w-4 h-4 text-primary-400" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-sm text-slate-400 hover:text-primary-400 transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Complaint Management Portal. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-500 hover:text-primary-400 transition-colors">
              <FaGithub className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-500 hover:text-primary-400 transition-colors">
              <FaLinkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-500 hover:text-primary-400 transition-colors">
              <FaTwitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
