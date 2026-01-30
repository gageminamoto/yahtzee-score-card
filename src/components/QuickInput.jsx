import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getCategoryById } from '../utils/gameConstants';
import { getValidScoresForCategory } from '../utils/scoring';

/**
 * Quick Input Component
 * Shows category-aware preset buttons for quick score selection
 * Upper section: multiples of die value (0 to 5×value)
 * Lower variable: common presets (0, 10, 15, 20, 25) + fine-tune
 */
export default function QuickInput({ categoryId, onScoreChange, playerColor, textColor }) {
  const isDarkText = textColor === '#000000';
  const [selectedScore, setSelectedScore] = useState(null);
  const category = getCategoryById(categoryId);
  
  // Get valid scores for this category
  const rawScores = getValidScoresForCategory(categoryId);

  // For lower variable categories, we'll show presets + fine-tune
  const isLowerVariable = category?.section === 'lower' &&
                          category?.maxScore !== undefined &&
                          !category?.fixedScore;

  // Filter presets for lower variable categories: 0, 10, 15, 20, 25 (skip 5 and 30)
  const validScores = isLowerVariable
    ? rawScores.filter(score => [0, 10, 15, 20, 25].includes(score))
    : rawScores;

  // Handle preset button click
  const handlePresetClick = (score) => {
    setSelectedScore(score);
    onScoreChange(score);
  };

  // Fine-tune handlers for lower variable categories
  const handleFineTune = (delta) => {
    if (selectedScore === null) {
      // Start from 0 if nothing selected
      const newScore = Math.max(0, Math.min(delta, category.maxScore));
      setSelectedScore(newScore);
      onScoreChange(newScore);
    } else {
      const newScore = Math.max(0, Math.min(selectedScore + delta, category.maxScore));
      setSelectedScore(newScore);
      onScoreChange(newScore);
    }
  };

  // Reset when category changes
  useEffect(() => {
    setSelectedScore(null);
  }, [categoryId]);

  return (
    <div className="space-y-4">
      {/* Preset Buttons Grid */}
      <div className={`grid gap-3 ${
        validScores.length <= 5 ? 'grid-cols-5' : 'grid-cols-6'
      }`}>
        {validScores.map((score) => {
          const isSelected = selectedScore === score;
          return (
            <button
              key={score}
              onClick={() => handlePresetClick(score)}
              className={`
                py-4 px-4
                font-sans text-body-lg rounded-md
                transition-all duration-150 ease-out
                active:scale-[0.95]
                ${
                  isSelected
                    ? `ring-2 ${isDarkText ? 'ring-black' : 'ring-white'}`
                    : 'bg-black/20 hover:bg-opacity-40'
                }
              `}
              style={{ color: textColor, ...(isSelected ? { backgroundColor: playerColor } : {}) }}
            >
              {score}
            </button>
          );
        })}
      </div>

      {/* Fine-tune controls for lower variable categories */}
      {isLowerVariable && (
        <div className={`space-y-3 pt-2 border-t ${isDarkText ? 'border-black/20' : 'border-white/20'}`}>
          <p className="font-sans text-ui text-center opacity-90" style={{ color: textColor }}>
            Fine tune:
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => handleFineTune(-5)}
              disabled={selectedScore !== null && selectedScore <= 0}
              className="px-6 py-3 bg-black/20 font-sans text-body-lg rounded-md hover:bg-opacity-40 active:scale-[0.97] transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ color: textColor }}
            >
              -5
            </button>
            <button
              onClick={() => handleFineTune(-1)}
              disabled={selectedScore !== null && selectedScore <= 0}
              className="px-6 py-3 bg-black/20 font-sans text-body-lg rounded-md hover:bg-opacity-40 active:scale-[0.97] transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ color: textColor }}
            >
              -1
            </button>
            <button
              onClick={() => handleFineTune(1)}
              disabled={selectedScore !== null && selectedScore >= category.maxScore}
              className="px-6 py-3 bg-black/20 font-sans text-body-lg rounded-md hover:bg-opacity-40 active:scale-[0.97] transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ color: textColor }}
            >
              +1
            </button>
            <button
              onClick={() => handleFineTune(5)}
              disabled={selectedScore !== null && selectedScore >= category.maxScore}
              className="px-6 py-3 bg-black/20 font-sans text-body-lg rounded-md hover:bg-opacity-40 active:scale-[0.97] transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ color: textColor }}
            >
              +5
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

QuickInput.propTypes = {
  categoryId: PropTypes.string.isRequired,
  onScoreChange: PropTypes.func.isRequired,
  playerColor: PropTypes.string,
  textColor: PropTypes.string,
};
