import { forwardRef } from 'react';

const Textarea = forwardRef(({
  label, error, rows = 4, className = '', ...props
}, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full rounded-xl border bg-white dark:bg-slate-800
          px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100
          placeholder:text-slate-400 dark:placeholder:text-slate-500
          transition-all duration-200 resize-none
          focus:outline-none focus-visible:ring-2 focus:ring-primary-500/50 focus:border-primary-500
          ${error
            ? 'border-red-400'
            : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
          }
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
