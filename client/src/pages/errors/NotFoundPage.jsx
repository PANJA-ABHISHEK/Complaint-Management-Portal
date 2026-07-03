import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import { HiHome } from 'react-icons/hi';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.h1
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-[10rem] font-bold gradient-text leading-none"
        >
          404
        </motion.h1>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-4 mb-2">
          Page Not Found
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button icon={HiHome}>Back to Home</Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
