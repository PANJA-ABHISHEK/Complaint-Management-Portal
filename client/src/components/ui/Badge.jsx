const badgeVariants = {
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  danger: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  secondary: 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400',
};

const Badge = ({ children, variant = 'primary', className = '', dot = false }) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
        ${badgeVariants[variant]}
        ${className}
      `}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full bg-current`} />}
      {children}
    </span>
  );
};

export default Badge;
