import { forwardRef } from 'react';

const Input = forwardRef(({
  label, error, icon: Icon, endIcon: EndIcon, endIconClick, type = 'text', className = '', ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 flex items-center justify-center pointer-events-none text-slate-400">
            <Icon style={{ width: 20, height: 20 }} />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          style={{
            paddingLeft: Icon ? '44px' : '16px',
            paddingRight: EndIcon ? '44px' : '16px',
            paddingTop: '12px',
            paddingBottom: '12px',
            width: '100%',
          }}
          className={`
            rounded-xl border bg-white dark:bg-slate-800
            text-sm text-slate-900 dark:text-slate-100
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            transition-all duration-200 shadow-sm
            focus:outline-none focus-visible:ring-2 focus:ring-primary-500/50 focus:border-primary-500
            ${error
              ? 'border-red-400 focus:ring-red-500/50 focus:border-red-500 bg-red-50 dark:bg-red-900/10'
              : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
            }
            ${className}
          `}
          {...props}
        />
        {EndIcon && (
          <button
            type="button"
            onClick={endIconClick}
            className={`absolute right-4 flex items-center justify-center text-slate-400 hover:text-primary-500 transition-colors ${endIconClick ? 'cursor-pointer' : 'pointer-events-none'}`}
            style={{ width: 24, height: 24, background: 'transparent', border: 'none', padding: 0 }}
          >
            <EndIcon style={{ width: 20, height: 20 }} />
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500 font-medium flex items-center gap-1.5 mt-1">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
