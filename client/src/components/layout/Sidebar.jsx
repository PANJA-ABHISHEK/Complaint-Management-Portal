import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiHome, HiDocumentText, HiPlusCircle, HiUser, HiBell,
  HiUsers, HiOfficeBuilding, HiChartBar, HiCog, HiLogout,
  HiClipboardList, HiX, HiChat,
} from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../ui/Avatar';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userLinks = [
    { name: 'Dashboard', icon: HiHome, path: '/user/dashboard' },
    { name: 'New Complaint', icon: HiPlusCircle, path: '/user/new-complaint' },
    { name: 'My Complaints', icon: HiDocumentText, path: '/user/complaints' },
    { name: 'Notifications', icon: HiBell, path: '/user/notifications' },
    { name: 'Profile', icon: HiUser, path: '/user/profile' },
  ];

  const officerLinks = [
    { name: 'Dashboard', icon: HiHome, path: '/officer/dashboard' },
    { name: 'Assigned', icon: HiClipboardList, path: '/officer/complaints' },
    { name: 'Notifications', icon: HiBell, path: '/officer/notifications' },
    { name: 'Profile', icon: HiUser, path: '/officer/profile' },
  ];

  const adminLinks = [
    { name: 'Dashboard', icon: HiHome, path: '/admin/dashboard' },
    { name: 'Complaints', icon: HiDocumentText, path: '/admin/complaints' },
    { name: 'Users', icon: HiUsers, path: '/admin/users' },
    { name: 'Departments', icon: HiOfficeBuilding, path: '/admin/departments' },
    { name: 'Reports', icon: HiChartBar, path: '/admin/reports' },
    { name: 'Feedback', icon: HiChat, path: '/admin/feedback' },
    { name: 'Notifications', icon: HiBell, path: '/admin/notifications' },
    { name: 'Settings', icon: HiCog, path: '/admin/settings' },
  ];

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'officer' ? officerLinks : userLinks;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <Avatar src={user?.avatar} name={user?.name} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-primary-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={() => onClose?.()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <HiLogout className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 z-50 lg:hidden shadow-2xl"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <HiX className="w-5 h-5 text-slate-500" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
