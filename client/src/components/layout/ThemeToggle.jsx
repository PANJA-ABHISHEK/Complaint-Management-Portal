import { useTheme } from '../../contexts/ThemeContext';
import { HiSun, HiMoon } from 'react-icons/hi';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <HiSun className="w-5 h-5 text-amber-400" />
        ) : (
          <HiMoon className="w-5 h-5 text-slate-600" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
