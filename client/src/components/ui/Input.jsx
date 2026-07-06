import { forwardRef } from 'react';

const Input = forwardRef(({
  label, error, icon: Icon, type = 'text', className = '', ...props
}, ref) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }} className="dark:text-slate-300">
          {label}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        {Icon && (
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '14px', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
            <Icon style={{ width: '20px', height: '20px', color: '#94a3b8' }} />
          </div>
        )}
        <input
          ref={ref}
          autoFocus={props.autoFocus}
          type={type}
          style={{
            width: '100%',
            padding: `12px 16px 12px ${Icon ? '44px' : '16px'}`,
            fontSize: '15px',
            borderRadius: '12px',
            border: `1px solid ${error ? '#f87171' : '#e2e8f0'}`,
            background: '#ffffff',
            color: '#1e293b',
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
            boxSizing: 'border-box'
          }}
          className={`
            focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
            dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:focus:border-primary-500
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p style={{ fontSize: '13px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
          <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 20 20">
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
