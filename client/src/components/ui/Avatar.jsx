import { getInitials } from '../../utils/constants';

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const Avatar = ({ src, name = '', size = 'md', className = '' }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        title={name}
      className={`${sizes[size]} rounded-full object-cover ring-2 ring-white dark:ring-slate-700 ${className}`}
      />
    );
  }

  return (
    <div
      className={`
        ${sizes[size]} rounded-full flex items-center justify-center font-semibold
        bg-gradient-to-br from-primary-400 to-primary-600 text-white
        ring-2 ring-white dark:ring-slate-700
        ${className}
      `}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
