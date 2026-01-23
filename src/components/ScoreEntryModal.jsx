import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from './';
import { getCategoryById, isValidScore } from '../utils/gameConstants';

/**
 * Modal for entering scores with a number pad
 */
export default function ScoreEntryModal({ categoryId, onSubmit, onCancel }) {
  const [score, setScore] = useState('');
  const category = getCategoryById(categoryId);

  if (!category) return null;

  const handleNumberClick = (num) => {
    if (score.length < 2) {
      setScore(score + num);
    }
  };

  const handleBackspace = () => {
    setScore(score.slice(0, -1));
  };

  const handleZeroOut = () => {
    setScore('0');
  };

  const handleClear = () => {
    setScore('');
  };

  const handleSubmit = () => {
    const numScore = parseInt(score) || 0;
    if (isValidScore(categoryId, numScore)) {
      onSubmit(numScore);
    }
  };

  const handleFixedScoreClick = (scoreValue) => {
    if (isValidScore(categoryId, scoreValue)) {
      onSubmit(scoreValue);
    }
  };

  const numScore = parseInt(score) || 0;
  const isValid = score !== '' && isValidScore(categoryId, numScore);

  // Check if this is a fixed-score category
  const isFixedScoreCategory = category.fixedScore !== undefined;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div
        className="bg-electric-blue max-w-md w-full p-8 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Category Info */}
        <div className="mb-8">
          <h2 className="font-serif text-title text-white mb-2">
            {category.name.toUpperCase()}
          </h2>
          <p className="font-sans text-body text-white opacity-90">
            {category.description}
          </p>
        </div>

        {isFixedScoreCategory ? (
          /* Fixed Score Buttons */
          <div className="space-y-3">
            <Button
              variant="solid"
              size="large"
              fullWidth
              onClick={() => handleFixedScoreClick(category.fixedScore)}
            >
              Add {category.fixedScore} Points
            </Button>
            <Button
              variant="outline"
              size="large"
              fullWidth
              onClick={() => handleFixedScoreClick(0)}
            >
              Zero Out (0 Points)
            </Button>
            <Button
              variant="outline"
              size="medium"
              fullWidth
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <>
            {/* Score Display */}
            <div className="mb-8">
              <div className="bg-black bg-opacity-20 p-6 text-center">
                <div className="font-serif text-headline text-white min-h-[120px] flex items-center justify-center">
                  {score || '—'}
                </div>
              </div>
              {!isValid && score !== '' && (
                <p className="font-sans text-ui text-bright-red mt-2 text-center">
                  Invalid score for this category
                </p>
              )}
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[7, 8, 9, 4, 5, 6, 1, 2, 3].map(num => (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num.toString())}
                  className="bg-black bg-opacity-20 text-white font-serif text-subtitle py-4 hover:bg-opacity-40 active:scale-[0.97] transition-[transform,background-color] duration-100 ease-[cubic-bezier(0.215,0.61,0.355,1)]"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={handleZeroOut}
                className="bg-black bg-opacity-20 text-white font-sans text-body-lg py-4 hover:bg-opacity-40 active:scale-[0.97] transition-[transform,background-color] duration-100 ease-[cubic-bezier(0.215,0.61,0.355,1)]"
              >
                X
              </button>
              <button
                onClick={() => handleNumberClick('0')}
                className="bg-black bg-opacity-20 text-white font-serif text-subtitle py-4 hover:bg-opacity-40 active:scale-[0.97] transition-[transform,background-color] duration-100 ease-[cubic-bezier(0.215,0.61,0.355,1)]"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                className="bg-black bg-opacity-20 text-white font-sans text-body-lg py-4 hover:bg-opacity-40 active:scale-[0.97] transition-[transform,background-color] duration-100 ease-[cubic-bezier(0.215,0.61,0.355,1)]"
              >
                ←
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="solid"
                size="medium"
                fullWidth
                onClick={handleSubmit}
                disabled={!isValid}
              >
                Confirm
              </Button>
              <Button
                variant="outline"
                size="medium"
                fullWidth
                onClick={onCancel}
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

ScoreEntryModal.propTypes = {
  categoryId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
