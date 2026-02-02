import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'vaul';
import { Button } from './';
import TabSwitcher from './TabSwitcher';
import DiceInput from './DiceInput';
import QuickInput from './QuickInput';
import { getCategoryById, isValidScore } from '../utils/gameConstants';
import { getInputMode, setInputMode } from '../utils/storage';
import { playerColors, getTextColorForBackground } from '../utils/colors';
import { playYahtzeeSound, isSoundEnabled } from '../utils/sounds';
import useIsMobile from '../hooks/useIsMobile';

/**
 * Score entry UI — renders as a Vaul bottom drawer on mobile,
 * and the original centered modal on desktop (md+).
 */
export default function ScoreEntryModal({ categoryId, onSubmit, onCancel, initialScore = 0, playerColor }) {
  const isMobile = useIsMobile();
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

  const handleScoreChange = (newScore) => setScore(newScore);
  const handleTabChange = (tabId) => setActiveTab(tabId);

  const handleSubmit = useCallback(() => {
    if (isValidScore(categoryId, score)) {
      onSubmit(score);
    }
  }, [categoryId, score, onSubmit]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape — only needed for the desktop modal; Vaul handles its own
      if (!isMobile && e.key === 'Escape') {
        onCancel();
        return;
      }

      if (e.key === 'Enter' && isValidScore(categoryId, score)) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          handleSubmit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Focus management for desktop modal
    if (!isMobile) {
      const focusTimer = setTimeout(() => {
        if (firstTabRef.current) firstTabRef.current.focus();
        else if (modalRef.current) modalRef.current.focus();
      }, 100);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        clearTimeout(focusTimer);
      };
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, categoryId, score, onCancel, handleSubmit]);

  const handleFixedScoreClick = (scoreValue) => {
    if (isValidScore(categoryId, scoreValue)) {
      if (categoryId === 'yahtzee' && scoreValue === 50 && isSoundEnabled()) {
        playYahtzeeSound();
      }
      onSubmit(scoreValue);
    }
  };

  const isValid = isValidScore(categoryId, score);
  const isFixedScoreCategory = category.fixedScore !== undefined;

  /* ---- shared inner content ---- */
  const content = (
    <>
      {/* Category Info */}
      <div className="mb-4 md:mb-6">
        {isMobile ? (
          <Drawer.Title className="font-serif text-subtitle md:text-title mb-2" style={{ color: textColor }}>
            {category.name.toUpperCase()}
          </Drawer.Title>
        ) : (
          <h2 id="modal-title" className="font-serif text-subtitle md:text-title mb-2" style={{ color: textColor }}>
            {category.name.toUpperCase()}
          </h2>
        )}
        <p className="font-sans text-ui md:text-body opacity-90" style={{ color: textColor }}>
          {category.description}
        </p>
      </div>

      {isFixedScoreCategory ? (
        <div className="space-y-3">
          <Button variant="solid" size="medium" fullWidth onClick={() => handleFixedScoreClick(category.fixedScore)}>
            Add {category.fixedScore} Points
          </Button>
          <Button variant="outline" size="medium" fullWidth textColor={textColor} onClick={() => handleFixedScoreClick(0)}>
            Zero Out (0 Points)
          </Button>
        </div>
      ) : (
        <>
          <TabSwitcher
            activeTab={activeTab}
            onTabChange={handleTabChange}
            firstTabRef={isMobile ? undefined : firstTabRef}
            textColor={textColor}
          />

          <div className="mb-4 md:mb-6">
            <div className="bg-black/20 p-4 md:p-6 text-center rounded-lg">
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

          <div className="mb-4 md:mb-6">
            {activeTab === 'dice' && (
              <DiceInput categoryId={categoryId} onScoreChange={handleScoreChange} playerColor={effectiveColor} textColor={textColor} />
            )}
            {activeTab === 'quick' && (
              <QuickInput categoryId={categoryId} onScoreChange={handleScoreChange} playerColor={effectiveColor} textColor={textColor} />
            )}
          </div>

          <Button variant="solid" size="medium" fullWidth onClick={handleSubmit} disabled={!isValid}>
            Confirm
          </Button>
        </>
      )}
    </>
  );

  /* ---- mobile: Vaul drawer ---- */
  if (isMobile) {
    return (
      <Drawer.Root open={true} onOpenChange={(open) => { if (!open) onCancel(); }}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/80 dark:bg-black/90 z-popover" />
          <Drawer.Content
            className="fixed bottom-0 left-0 right-0 z-popover outline-none"
            aria-describedby={undefined}
          >
            <div
              className="mx-auto max-w-md w-full p-6 rounded-t-2xl"
              style={{ backgroundColor: effectiveColor }}
            >
              {/* Drag Handle */}
              <div className="flex justify-center mb-4">
                <div
                  className="w-10 h-1.5 rounded-full"
                  style={{ backgroundColor: textColor, opacity: 0.4 }}
                />
              </div>
              {content}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  /* ---- desktop: centered modal ---- */
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
        style={{ backgroundColor: effectiveColor }}
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

        {content}
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
