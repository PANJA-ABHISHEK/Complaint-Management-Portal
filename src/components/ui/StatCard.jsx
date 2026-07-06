import React from 'react';
import Card from './Card';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, color = 'primary', className = '' }) => {
  const colorStyles = {
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`relative overflow-hidden ${className}`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">
              {title}
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {value}
            </h3>
          </div>
          {Icon && (
            <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>
        
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <span className={`font-semibold ${trend.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend.isPositive ? '+' : '-'}{trend.value}%
            </span>
            <span className="text-slate-500 ml-2">vs last month</span>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default StatCard;
