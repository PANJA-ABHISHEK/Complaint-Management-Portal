import React from 'react';

const Card = ({ children, className = '', glass = false }) => {
  return (
    <div className={`
      rounded-2xl p-6
      ${glass ? 'glass-card' : 'bg-white border border-slate-200 shadow-sm dark:bg-dark-card dark:border-slate-800'}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;
