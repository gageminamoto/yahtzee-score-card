import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getCategoryById } from '../utils/gameConstants';

/**
 * Adjust Input Component
 * Start at 0, use increment/decrement buttons to adjust score
 * Large +5/-5 buttons for quick jumps, small +1/-1 for precision
 */
export default function AdjustInput({ categoryId, onScoreChange, initialValue = 0 }) {
  const [score, setScore] = useState(initialValue);
  const category = getCategoryById(categoryId);
  
  const maxScore = category?.maxScore ?? 30;

  // Update parent when score changes
  useEffect(() => {
    onScoreChange(score);
  }, [score, onScoreChange]);

  // Reset when category changes (but preserve score when just switching tabs)
  useEffect(() => {
    setScore(initialValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  // Adjust score by a delta amount, clamping to valid range
  const adjustScore = (delta) => {
    const newScore = Math.max(0, Math.min(score + delta, maxScore));
    setScore(newScore);
  };

  // Reset to zero
  const handleZero = () => {
    setScore(0);
  };

  return (
    <div className="space-y-6">
      {/* Score Display */}
      <div className="bg-black/30 dark:bg-white/30 p-8 text-center rounded-lg">
        <div className="font-serif text-headline text-white dark:text-black min-h-[80px] flex items-center justify-center">
          {score}
        </div>
      </div>

      {/* Adjustment Buttons */}
      <div className="space-y-4">
        {/* Large increment/decrement buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => adjustScore(-5)}
            disabled={score <= 0}
            className="flex-1 py-4 bg-black/20 dark:bg-white/20 text-white dark:text-black font-sans text-body-lg rounded-md hover:bg-opacity-40 dark:hover:bg-opacity-40 active:scale-[0.97] transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            -5
          </button>
          <button
            onClick={() => adjustScore(-1)}
            disabled={score <= 0}
            className="flex-1 py-4 bg-black/20 dark:bg-white/20 text-white dark:text-black font-sans text-body-lg rounded-md hover:bg-opacity-40 dark:hover:bg-opacity-40 active:scale-[0.97] transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            -1
          </button>
          <button
            onClick={() => adjustScore(1)}
            disabled={score >= maxScore}
            className="flex-1 py-4 bg-black/20 dark:bg-white/20 text-white dark:text-black font-sans text-body-lg rounded-md hover:bg-opacity-40 dark:hover:bg-opacity-40 active:scale-[0.97] transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            +1
          </button>
          <button
            onClick={() => adjustScore(5)}
            disabled={score >= maxScore}
            className="flex-1 py-4 bg-black/20 dark:bg-white/20 text-white dark:text-black font-sans text-body-lg rounded-md hover:bg-opacity-40 dark:hover:bg-opacity-40 active:scale-[0.97] transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            +5
          </button>
        </div>

        {/* Zero button */}
        <button
          onClick={handleZero}
          className="w-full py-4 bg-black/20 dark:bg-white/20 text-white dark:text-black font-sans text-body-lg rounded-md hover:bg-opacity-40 dark:hover:bg-opacity-40 active:scale-[0.97] transition-all duration-150"
        >
          Zero
        </button>
      </div>
    </div>
  );
}

AdjustInput.propTypes = {
  categoryId: PropTypes.string.isRequired,
  onScoreChange: PropTypes.func.isRequired,
  initialValue: PropTypes.number,
};
