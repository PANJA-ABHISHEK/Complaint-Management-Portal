import { forwardRef } from 'react';

const Select = forwardRef(({
  label, error, options = [], placeholder = 'Select...', className = '', ...props
}, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`
          w-full rounded-xl border bg-white dark:bg-slate-800
          px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100
          transition-all duration-200 cursor-pointer
          focus:outline-none focus-visible:ring-2 focus:ring-primary-500/50 focus:border-primary-500
          ${error
            ? 'border-red-400 focus:ring-red-500/50 focus:border-red-500'
            : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
          }
          ${className}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
