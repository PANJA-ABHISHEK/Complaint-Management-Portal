import React from 'react';

const Avatar = ({ src, name, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const getInitials = (n) => n?.substring(0, 2).toUpperCase() || 'U';

  return (
    <div className={`relative inline-flex items-center justify-center overflow-hidden bg-primary-100 dark:bg-primary-900 rounded-full shrink-0 ${sizes[size]} ${className}`}>
      {src ? (
        <img src={src} alt={name || 'Avatar'} className="w-full h-full object-cover" />
      ) : (
        <span className="font-semibold text-primary-700 dark:text-primary-300">
          {getInitials(name)}
        </span>
      )}
    </div>
  );
};

export default Avatar;
