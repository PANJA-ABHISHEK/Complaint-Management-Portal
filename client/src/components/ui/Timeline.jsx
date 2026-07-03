import { motion } from 'framer-motion';
import { HiCheck } from 'react-icons/hi';
import { STATUS_FLOW, getStatusColor, formatDateTime } from '../../utils/constants';

const Timeline = ({ entries = [], currentStatus }) => {
  const currentStep = STATUS_FLOW.indexOf(currentStatus);

  return (
    <div className="space-y-0">
      {STATUS_FLOW.map((status, index) => {
        const isCompleted = index <= currentStep;
        const isCurrent = index === currentStep;
        const entry = entries.find((e) => e.status === status);
        const color = getStatusColor(status);

        return (
          <motion.div
            key={status}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4"
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'border-transparent text-white'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                }`}
                style={isCompleted ? { backgroundColor: color } : {}}
              >
                {isCompleted && <HiCheck className="w-4 h-4" />}
              </div>
              {index < STATUS_FLOW.length - 1 && (
                <div
                  className={`w-0.5 h-12 transition-all duration-300 ${
                    index < currentStep
                      ? 'bg-primary-500'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              )}
            </div>
            <div className={`pb-8 ${!isCompleted ? 'opacity-40' : ''}`}>
              <h4 className={`text-sm font-semibold ${isCurrent ? 'text-primary-600 dark:text-primary-400' : 'text-slate-900 dark:text-white'}`}>
                {status}
              </h4>
              {entry && (
                <>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {formatDateTime(entry.createdAt)}
                  </p>
                  {entry.message && (
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{entry.message}</p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Timeline;
