import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'vaul';
import { Icon } from '@iconify/react';
import Button from './Button';
import TabSwitcher from './TabSwitcher';
import DiceInput from './DiceInput';
import QuickInput from './QuickInput';
import { getCategoryById, isValidScore } from '../utils/gameConstants';
import { getInputMode, setInputMode } from '../utils/storage';
import { playerColors } from '../utils/colors';
import { useSurface } from '../hooks/useSurface';
import { playYahtzeeSound, isSoundEnabled } from '../utils/sounds';
import useIsMobile from '../hooks/useIsMobile';

/**
 * Score entry UI — renders as a Vaul bottom drawer on mobile,
 * and a centered modal on desktop (md+).
 *
 * New entries open with nothing selected. With `instantSubmit`, exact
 * choices (upper presets, fixed scores, Scratch) submit on tap; the parent is
 * expected to offer an undo. Otherwise, and when editing an already-scored
 * category (`initialScore` is a number), a choice selects and Confirm submits.
 */
export default function ScoreEntryModal({ categoryId, onSubmit, onCancel, initialScore = null, playerColor, instantSubmit = false }) {
  const isMobile = useIsMobile();
  const initial = initialScore ?? null;
  const isEditing = initial !== null;
  const commitImmediately = instantSubmit && !isEditing;

  const [activeTab, setActiveTab] = useState(() => getInputMode());
  const [score, setScore] = useState(initial);
  const category = getCategoryById(categoryId);
  const surface = useSurface();
  const { style: surfaceStyle } = surface(playerColor || playerColors[0]);
  const modalRef = useRef(null);
  const firstTabRef = useRef(null);

  // Save tab preference when it changes
  useEffect(() => {
    setInputMode(activeTab);
  }, [activeTab]);

  const isValid = score !== null && isValidScore(categoryId, score);

  const commit = useCallback((value) => {
    if (!isValidScore(categoryId, value)) return;
    if (categoryId === 'yahtzee' && value === 50 && isSoundEnabled()) {
      playYahtzeeSound();
    }
    onSubmit(value);
  }, [categoryId, onSubmit]);

  const handleSubmit = useCallback(() => {
    if (score !== null) commit(score);
  }, [score, commit]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape — only needed for the desktop modal; Vaul handles its own
      if (!isMobile && e.key === 'Escape') {
        onCancel();
        return;
      }

      if (e.key === 'Enter' && isValid) {
        // Let Enter on an option button select that option instead
        const isOption = e.target.hasAttribute?.('aria-pressed');
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && !isOption) {
          e.preventDefault();
          handleSubmit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, isValid, onCancel, handleSubmit]);

  // Focus management for desktop modal
  useEffect(() => {
    if (isMobile) return undefined;
    const focusTimer = setTimeout(() => {
      if (firstTabRef.current) firstTabRef.current.focus();
      else if (modalRef.current) modalRef.current.focus();
    }, 100);
    return () => clearTimeout(focusTimer);
  }, [isMobile]);

  if (!category) return null;

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;
    setActiveTab(tabId);
    // A score built in one mode shouldn't carry into the other
    setScore(initial);
  };

  const isFixedScoreCategory = category.fixedScore !== undefined;
  const isUpper = category.section === 'upper';
  // Quick-mode upper presets submit on tap, so no Confirm is needed there
  const needsConfirm = !commitImmediately || activeTab === 'dice' || (!isUpper && !isFixedScoreCategory);

  const confirmLabel = score === null
    ? 'Confirm'
    : `${isEditing ? 'Save' : 'Score'} ${score}`;

  const confirmButton = (
    <Button variant="solid" size="medium" fullWidth onClick={handleSubmit} disabled={!isValid}>
      {confirmLabel}
    </Button>
  );

  const fixedOption = (value, label, primary) => {
    const selected = !commitImmediately && score === value;
    return (
      <Button
        variant={selected || (commitImmediately && primary) ? 'solid' : 'outline'}
        size="medium"
        fullWidth
        onClick={() => (commitImmediately ? commit(value) : setScore(value))}
        aria-pressed={commitImmediately ? undefined : selected}
      >
        {label}
      </Button>
    );
  };

  /* ---- shared inner content ---- */
  const content = (
    <>
      {/* Category Info */}
      <div className="mb-4">
        {isMobile ? (
          <Drawer.Title className="font-serif text-subtitle md:text-title mb-1">
            {category.name.toUpperCase()}
          </Drawer.Title>
        ) : (
          <h2 id="modal-title" className="font-serif text-subtitle md:text-title mb-1">
            {category.name.toUpperCase()}
          </h2>
        )}
        <p className="font-sans text-ui md:text-body text-fg/70">
          {category.description}
        </p>
      </div>

      {isFixedScoreCategory ? (
        <div className="space-y-3">
          {fixedOption(category.fixedScore, `Add ${category.fixedScore} Points`, true)}
          {fixedOption(0, 'Scratch (0)', false)}
          {!commitImmediately && confirmButton}
        </div>
      ) : (
        <>
          <TabSwitcher
            activeTab={activeTab}
            onTabChange={handleTabChange}
            firstTabRef={isMobile ? undefined : firstTabRef}
          />

          <div id={`tabpanel-${activeTab}`} role="tabpanel" className="mb-4">
            {activeTab === 'dice' && (
              <DiceInput categoryId={categoryId} onScoreChange={setScore} />
            )}
            {activeTab === 'quick' && (
              <QuickInput
                categoryId={categoryId}
                value={score}
                onChange={setScore}
                onCommit={commitImmediately ? commit : undefined}
              />
            )}
            {score !== null && !isValid && (
              <p className="font-sans text-ui text-bright-red mt-2 text-center" role="alert">
                Invalid score for this category
              </p>
            )}
          </div>

          {needsConfirm && confirmButton}
        </>
      )}
    </>
  );

  /* ---- mobile: Vaul drawer ---- */
  if (isMobile) {
    return (
      <Drawer.Root open={true} onOpenChange={(open) => { if (!open) onCancel(); }}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/80 z-popover" />
          <Drawer.Content
            className="fixed bottom-0 left-0 right-0 z-popover outline-none"
            aria-describedby={undefined}
          >
            <div
              className="mx-auto max-w-md w-full px-6 pt-3 pb-6 text-fg"
              style={surfaceStyle}
            >
              {/* Drag Handle */}
              <div className="flex justify-center mb-3">
                <div className="w-10 h-1.5 rounded-full bg-fg/40" />
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
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-popover animate-fadeIn"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative max-w-md w-full p-6 md:p-8 text-fg animate-scaleIn focus:outline-none"
        style={surfaceStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="absolute top-4 right-4 rounded-full"
          aria-label="Close"
        >
          <Icon icon="basil:cross-solid" className="w-6 h-6" />
        </Button>

        {content}
      </div>
    </div>
  );
}

ScoreEntryModal.propTypes = {
  categoryId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  /** Existing score when editing; null/undefined for a new entry */
  initialScore: PropTypes.number,
  playerColor: PropTypes.string,
  /** Submit exact choices on tap (the parent must offer an undo) */
  instantSubmit: PropTypes.bool,
};
