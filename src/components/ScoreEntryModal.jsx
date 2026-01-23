import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from './';
import TabSwitcher from './TabSwitcher';
import DiceInput from './DiceInput';
import QuickInput from './QuickInput';
import AdjustInput from './AdjustInput';
import { getCategoryById, isValidScore } from '../utils/gameConstants';
import { getInputMode, setInputMode } from '../utils/storage';

/**
 * Modal for entering scores with three input methods:
 * 1. Dice Selector - tap dice icons to build roll
 * 2. Quick Presets - category-aware preset buttons
 * 3. Adjust - increment/decrement buttons
 */
export default function ScoreEntryModal({ categoryId, onSubmit, onCancel }) {
  // Load saved input mode preference, default to 'dice'
  const [activeTab, setActiveTab] = useState(() => getInputMode());
  const [score, setScore] = useState(0);
  const category = getCategoryById(categoryId);

  // Save tab preference when it changes
  useEffect(() => {
    setInputMode(activeTab);
  }, [activeTab]);

  // Reset score when category changes
  useEffect(() => {
    setScore(0);
  }, [categoryId]);

  if (!category) return null;

  // Handle score changes from input components
  const handleScoreChange = (newScore) => {
    setScore(newScore);
  };

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Handle submit
  const handleSubmit = () => {
    if (isValidScore(categoryId, score)) {
      onSubmit(score);
    }
  };

  // Handle fixed score click (for fixed-score categories)
  const handleFixedScoreClick = (scoreValue) => {
    if (isValidScore(categoryId, scoreValue)) {
      onSubmit(scoreValue);
    }
  };

  // Validate current score
  const isValid = isValidScore(categoryId, score);

  // Check if this is a fixed-score category
  const isFixedScoreCategory = category.fixedScore !== undefined;

  return (
    <div className="fixed inset-0 bg-black/80 dark:bg-black/90 flex items-center justify-center p-4 z-popover animate-fadeIn">
      <div
        className="bg-electric-blue dark:bg-electric-blue max-w-md w-full p-8 animate-scaleIn"
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
          /* Fixed Score Buttons - Keep existing behavior for fixed categories */
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
            {/* Tab Switcher */}
            <TabSwitcher activeTab={activeTab} onTabChange={handleTabChange} />

            {/* Score Display */}
            <div className="mb-6">
              <div className="bg-black/20 dark:bg-white/20 p-6 text-center">
                <div className="font-serif text-headline text-white dark:text-black min-h-[80px] flex items-center justify-center tabular-nums">
                  {score}
                </div>
              </div>
              {!isValid && score !== 0 && (
                <p className="font-sans text-ui text-bright-red mt-2 text-center">
                  Invalid score for this category
                </p>
              )}
            </div>

            {/* Input Area - Show different input based on active tab */}
            <div className="mb-6">
              {activeTab === 'dice' && (
                <DiceInput categoryId={categoryId} onScoreChange={handleScoreChange} />
              )}
              {activeTab === 'quick' && (
                <QuickInput categoryId={categoryId} onScoreChange={handleScoreChange} />
              )}
              {activeTab === 'adjust' && (
                <AdjustInput 
                  categoryId={categoryId} 
                  onScoreChange={handleScoreChange}
                  initialValue={score}
                />
              )}
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
