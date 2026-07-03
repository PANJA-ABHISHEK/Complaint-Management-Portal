import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, padding = 'p-6', onClick }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: '0 12px 40px rgba(99, 102, 241, 0.1)' } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`
        glass-card ${padding}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default Card;
