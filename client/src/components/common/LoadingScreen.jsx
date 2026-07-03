import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="relative w-16 h-16 mx-auto mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-full border-4 border-primary-200 dark:border-primary-800 border-t-primary-500"
          />
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading...</p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
