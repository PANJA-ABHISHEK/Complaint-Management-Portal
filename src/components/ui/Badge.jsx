import React from 'react';

const colors = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  red: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400',
};

const Badge = ({ children, color = 'slate', className = '' }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const getStatusColor = (s) => {
    switch (s?.toLowerCase()) {
      case 'submitted': return 'slate';
      case 'under review': return 'amber';
      case 'assigned': return 'blue';
      case 'in progress': return 'purple';
      case 'resolved': return 'emerald';
      case 'closed': return 'slate';
      default: return 'slate';
    }
  };

  return <Badge color={getStatusColor(status)}>{status}</Badge>;
};

export const PriorityBadge = ({ priority }) => {
  const getPriorityColor = (p) => {
    switch (p?.toLowerCase()) {
      case 'high': return 'red';
      case 'medium': return 'amber';
      case 'low': return 'emerald';
      default: return 'slate';
    }
  };

  return <Badge color={getPriorityColor(priority)}>{priority}</Badge>;
};

export default Badge;
