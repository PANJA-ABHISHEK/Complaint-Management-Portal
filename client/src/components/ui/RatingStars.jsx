import { HiStar } from 'react-icons/hi';
import { useState } from 'react';

const RatingStars = ({ value = 0, onChange, size = 'md', readonly = false }) => {
  const [hover, setHover] = useState(0);
  const sizes = { sm: 'w-5 h-5', md: 'w-7 h-7', lg: 'w-9 h-9' };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`transition-all duration-150 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        >
          <HiStar
            className={`${sizes[size]} ${
              star <= (hover || value)
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-300 dark:text-slate-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default RatingStars;
