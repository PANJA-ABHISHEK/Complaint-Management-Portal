import React from 'react';

const Timeline = ({ items = [] }) => {
  return (
    <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 py-2 space-y-8">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isFirst = index === 0;
        
        return (
          <div key={index} className="relative pl-6">
            {/* Timeline Dot */}
            <div className={`
              absolute left-[-9px] top-1 w-4 h-4 rounded-full border-2 bg-white dark:bg-dark-card
              ${isLast ? 'border-primary-500' : 'border-slate-300 dark:border-slate-600'}
            `} />
            
            {/* Timeline Content */}
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
              <h4 className={`text-sm font-bold ${isLast ? 'text-primary-600 dark:text-primary-400' : 'text-slate-900 dark:text-white'}`}>
                {item.title}
              </h4>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {item.date}
              </span>
            </div>
            {item.description && (
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                {item.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
