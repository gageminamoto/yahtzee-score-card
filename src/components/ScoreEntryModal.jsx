import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from './';
import TabSwitcher from './TabSwitcher';
import DiceInput from './DiceInput';
import QuickInput from './QuickInput';
import { getCategoryById, isValidScore } from '../utils/gameConstants';
import { getInputMode, setInputMode } from '../utils/storage';
import { playerColors, getTextColorForBackground } from '../utils/colors';
import { playYahtzeeSound, isSoundEnabled } from '../utils/sounds';

/**
 * Modal for entering scores with two input methods:
 * 1. Dice Selector - tap dice icons to build roll
 * 2. Quick Presets - category-aware preset buttons
 */
export default function ScoreEntryModal({ categoryId, onSubmit, onCancel, initialScore = 0, playerColor }) {
  // Load saved input mode preference, default to 'dice'
  const [activeTab, setActiveTab] = useState(() => getInputMode());
  const [score, setScore] = useState(initialScore);
  const category = getCategoryById(categoryId);
  const effectiveColor = playerColor || playerColors[0];
  const textColor = getTextColorForBackground(effectiveColor);
  const modalRef = useRef(null);
  const firstTabRef = useRef(null);

  // Save tab preference when it changes
  useEffect(() => {
    setInputMode(activeTab);
  }, [activeTab]);

  // Reset score when category changes
  useEffect(() => {
    setScore(initialScore);
  }, [categoryId, initialScore]);

  if (!category) return null;

  // Handle score changes from input components
  const handleScoreChange = (newScore) => {
    setScore(newScore);
  };

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Handle submit - memoized to avoid recreating on every render
  const handleSubmit = useCallback(() => {
    if (isValidScore(categoryId, score)) {
      onSubmit(score);
    }
  }, [categoryId, score, onSubmit]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape key closes the modal
      if (e.key === 'Escape') {
        onCancel();
        return;
      }

      // Enter key confirms the score (if valid)
      if (e.key === 'Enter' && isValidScore(categoryId, score)) {
        // Don't trigger if user is typing in an input field
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          handleSubmit();
        }
        return;
      }

      // Number keys (0-9) can be used for quick score entry
      // Only if we're not in an input field
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        const num = parseInt(e.key);
        if (!isNaN(num) && num >= 0 && num <= 9) {
          // For single digits, append to score
          // For multi-digit, we'd need more complex logic, so we'll keep it simple
          // Users can use the number pad or adjust input for larger numbers
        }
      }
    };

    // Add event listener when modal is open
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [categoryId, score, onCancel, handleSubmit]);

  // Handle fixed score click (for fixed-score categories)
  const handleFixedScoreClick = (scoreValue) => {
    if (isValidScore(categoryId, scoreValue)) {
      if (categoryId === 'yahtzee' && scoreValue === 50 && isSoundEnabled()) {
        playYahtzeeSound();
      }
      onSubmit(scoreValue);
    }
  };

  // Validate current score
  const isValid = isValidScore(categoryId, score);

  // Check if this is a fixed-score category
  const isFixedScoreCategory = category.fixedScore !== undefined;

  return (
    <div 
      className="fixed inset-0 bg-black/80 dark:bg-black/90 flex items-center justify-center p-4 z-popover animate-fadeIn"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative max-w-md w-full p-6 md:p-8 animate-scaleIn focus:outline-none"
        style={{ backgroundColor: playerColor || playerColors[0] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-black/20 hover:bg-black/30 rounded-full transition-colors"
          style={{ color: textColor }}
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Category Info */}
        <div className="mb-4 md:mb-6">
          <h2 id="modal-title" className="font-serif text-subtitle md:text-title mb-2" style={{ color: textColor }}>
            {category.name.toUpperCase()}
          </h2>
          <p className="font-sans text-ui md:text-body opacity-90" style={{ color: textColor }}>
            {category.description}
          </p>
        </div>

        {isFixedScoreCategory ? (
          /* Fixed Score Buttons - Keep existing behavior for fixed categories */
          <div className="space-y-3">
            <Button
              variant="solid"
              size="medium"
              fullWidth
              onClick={() => handleFixedScoreClick(category.fixedScore)}
            >
              Add {category.fixedScore} Points
            </Button>
            <Button
              variant="outline"
              size="medium"
              fullWidth
              textColor={textColor}
              onClick={() => handleFixedScoreClick(0)}
            >
              Zero Out (0 Points)
            </Button>
          </div>
        ) : (
          <>
            {/* Tab Switcher */}
            <TabSwitcher
              activeTab={activeTab}
              onTabChange={handleTabChange}
              firstTabRef={firstTabRef}
              textColor={textColor}
            />

            {/* Score Display */}
            <div className="mb-4 md:mb-6">
              <div className="bg-black/20 p-4 md:p-6 text-center">
                <div className="font-sans text-subtitle md:text-headline min-h-[60px] md:min-h-[80px] flex items-center justify-center tabular-nums" style={{ color: textColor }}>
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
            <div className="mb-4 md:mb-6">
              {activeTab === 'dice' && (
                <DiceInput categoryId={categoryId} onScoreChange={handleScoreChange} playerColor={effectiveColor} textColor={textColor} />
              )}
              {activeTab === 'quick' && (
                <QuickInput categoryId={categoryId} onScoreChange={handleScoreChange} playerColor={effectiveColor} textColor={textColor} />
              )}
            </div>

            {/* Action Button */}
            <Button
              variant="solid"
              size="medium"
              fullWidth
              onClick={handleSubmit}
              disabled={!isValid}
            >
              Confirm
            </Button>
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
  initialScore: PropTypes.number,
  playerColor: PropTypes.string,
};
