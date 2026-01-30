import { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '@iconify/react';
import Scorecard from '../components/Scorecard';
import ScoreEntryModal from '../components/ScoreEntryModal';
import { ConfirmDialog } from '../components';
import {
  createEmptyScorecard,
  calculateTotalScore,
  updateScorecard,
  isGameComplete,
  isCategoryScored,
} from '../utils/scoring';
import { TOTAL_ROUNDS } from '../utils/gameConstants';
import { getTextColorForBackground } from '../utils/colors';
import { useSettings } from '../context/SettingsContext';

/**
 * Main game board for single device mode
 * - Shows current player
 * - Displays scorecard
 * - Tracks turns and rounds
 * - Navigates to winner screen when complete
 */
export default function GameBoard({ players: initialPlayers, initialPlayerIndex = 0, onGameComplete, onQuit, onStateChange }) {
  const { settings } = useSettings();

  // Initialize players with scorecards (may already have scorecards from restored state)
  // Using setPlayers to update state when scores change
  const [players, setPlayers] = useState(() =>
    initialPlayers.map(p => ({
      ...p,
      scorecard: p.scorecard || createEmptyScorecard(),
    }))
  );

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(initialPlayerIndex);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [completedTurns, setCompletedTurns] = useState(0);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const scrollContainerRef = useRef(null);
  const scrollThrottleRef = useRef(null);

  // Guard: If players array is empty (e.g., during quit transition), return null
  // This prevents crashes when the parent clears players before unmounting
  if (players.length === 0) {
    return null;
  }

  const currentPlayer = players[currentPlayerIndex];
  // Additional safety check in case currentPlayerIndex is out of bounds
  if (!currentPlayer) {
    return null;
  }

  const backgroundColor = currentPlayer.color;
  const textColor = getTextColorForBackground(backgroundColor);
  const currentRound = Math.floor(completedTurns / players.length) + 1;

  // Sync background color to html/body for overscroll
  useEffect(() => {
    document.documentElement.style.setProperty('--page-bg', backgroundColor);
  }, [backgroundColor]);

  // Lock body scroll to prevent double scrollbars
  useEffect(() => {
    document.body.classList.add('scroll-lock');
    return () => {
      document.body.classList.remove('scroll-lock');
    };
  }, []);

  // Check if there's more content to scroll (throttled to prevent jitter)
  const checkScrollPosition = useCallback((immediate = false) => {
    const doCheck = () => {
      const container = scrollContainerRef.current;
      if (container) {
        const threshold = 20; // pixels from bottom to consider "at bottom"
        const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
        const hasScrollableContent = container.scrollHeight > container.clientHeight;

        setShowScrollIndicator(hasScrollableContent && !isAtBottom);
      }
    };

    // Immediate check skips throttling (used for initial render)
    if (immediate) {
      doCheck();
      return;
    }

    if (scrollThrottleRef.current) return;
    scrollThrottleRef.current = requestAnimationFrame(() => {
      doCheck();
      scrollThrottleRef.current = null;
    });
  }, []);

  // Set up scroll listener and initial check
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Initial check after DOM settles
    const initialTimeout = setTimeout(() => checkScrollPosition(true), 50);

    // Check on scroll (throttled)
    const handleScroll = () => checkScrollPosition(false);
    container.addEventListener('scroll', handleScroll, { passive: true });

    // Check on resize
    const handleResize = () => checkScrollPosition(false);
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(initialTimeout);
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (scrollThrottleRef.current) {
        cancelAnimationFrame(scrollThrottleRef.current);
      }
    };
  }, [checkScrollPosition, currentPlayerIndex]);

  // Scroll to bottom handler
  const scrollToBottom = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    });
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleScoreSubmit = (score) => {
    // Check if this is an edit (category was already scored)
    const isEditing = isCategoryScored(currentPlayer.scorecard, selectedCategory);

    // Update the player's scorecard
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex].scorecard = updateScorecard(
      currentPlayer.scorecard,
      selectedCategory,
      score
    );

    // Update the players state with the new scorecard
    // This ensures the UI and finish game button always have current scores
    setPlayers(updatedPlayers);
    setSelectedCategory(null);

    // Only increment turns and advance player if this was a new score, not an edit
    if (!isEditing) {
      setCompletedTurns(completedTurns + 1);

      // Check if game is complete
      if (isGameComplete(updatedPlayers[currentPlayerIndex].scorecard)) {
        // Check if all players are done
        const allComplete = updatedPlayers.every(p => isGameComplete(p.scorecard));
        if (allComplete) {
          // Calculate final scores and go to winner screen
          const finalPlayers = updatedPlayers.map(p => ({
            ...p,
            totalScore: calculateTotalScore(p.scorecard),
          }));
          onGameComplete(finalPlayers);
          return;
        }
      }

      // Move to next player
      const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
      setCurrentPlayerIndex(nextPlayerIndex);

      // Notify parent to persist state with new player index
      if (onStateChange) {
        onStateChange(updatedPlayers, nextPlayerIndex);
      }
    } else {
      // Notify parent to persist state with current player index (edit only)
      if (onStateChange) {
        onStateChange(updatedPlayers, currentPlayerIndex);
      }
    }
  };

  const handleScoreCancel = () => {
    setSelectedCategory(null);
  };

  // Handle clicking on a player's color to switch to that player
  const handlePlayerSwitch = (playerIndex) => {
    // Only allow switching if not currently entering a score
    if (!selectedCategory) {
      setCurrentPlayerIndex(playerIndex);
    }
  };

  // Handle finishing the game early
  // This allows players to end the game before all categories are filled
  // It calculates current scores and navigates to the winner screen
  const handleFinishGame = () => {
    // Check if user is currently entering a score - if so, don't allow finishing
    if (selectedCategory) {
      return;
    }
    setShowFinishDialog(true);
  };

  const handleConfirmFinish = () => {
    setShowFinishDialog(false);
    // Calculate final scores for all players (even if not all categories are filled)
    const finalPlayers = players.map(p => ({
      ...p,
      totalScore: calculateTotalScore(p.scorecard),
    }));
    // Navigate to winner screen
    onGameComplete(finalPlayers);
  };

  const handleCancelFinish = () => {
    setShowFinishDialog(false);
  };

  // Determine the finish dialog message based on game state
  const allComplete = players.every(p => isGameComplete(p.scorecard));
  const finishDialogMessage = allComplete
    ? 'Finish game and see results?'
    : 'Current scores will be used to determine the winner.';

  return (
    <div
      className="h-dvh px-2 py-1.5 md:p-6 transition-colors duration-500 flex flex-col mobile-compact overflow-hidden"
      style={{ backgroundColor }}
    >
      <div className="max-w-6xl mx-auto w-full flex flex-col flex-1 min-h-0">
        {/* Header with Quit, Finish Game, and Round */}
        <div className="flex justify-between items-center mb-1.5 md:mb-2 flex-shrink-0">
          <button
            onClick={onQuit}
            className="font-sans text-ui hover:opacity-70 transition-opacity flex items-center gap-2"
            style={{ color: textColor }}
          >
            <Icon icon="basil:arrow-left-solid" className="w-5 h-5" />
            Quit
          </button>
          <div className="flex items-center gap-3">
            {/* Round Display */}
            <div
              className="font-sans text-ui opacity-90"
              style={{ color: textColor }}
            >
              R{currentRound}/{TOTAL_ROUNDS}
            </div>
            {/* Finish Game Button */}
            <button
              onClick={handleFinishGame}
              disabled={!!selectedCategory}
              className={`
                font-sans text-ui font-bold
                px-4 py-2 rounded-full
                bg-white/15 dark:bg-black/15
                hover:bg-white/25 dark:hover:bg-black/25
                active:scale-95
                transition-all duration-150
                inline-flex items-center justify-center
                ${selectedCategory ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              style={{ color: textColor }}
              aria-label="Finish game and see results"
              title="End the game and see who won"
            >
              Finish
            </button>
          </div>
        </div>

        {/* Player Switcher */}
        <div className="flex justify-center mb-2 md:mb-4 flex-shrink-0">
          <div
            className="inline-flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full p-2"
            role="tablist"
            aria-label="Player switcher"
          >
            {players.map((player, index) => {
              const isActive = index === currentPlayerIndex;
              const playerScore = calculateTotalScore(player.scorecard);

              return (
                <button
                  key={player.id}
                  onClick={() => handlePlayerSwitch(index)}
                  disabled={!!selectedCategory}
                  role="tab"
                  aria-selected={isActive}
                  className={`
                    relative flex items-center gap-3 px-5 py-3 rounded-full min-w-fit min-h-[52px]
                    transition-all duration-150 ease-out
                    motion-reduce:transition-none
                    ${isActive
                      ? 'bg-white/25 dark:bg-black/25'
                      : 'opacity-60 hover:opacity-100'
                    }
                    ${selectedCategory ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}
                    focus:outline-none focus:ring-2 focus:ring-white/50 dark:focus:ring-black/50
                    active:scale-[0.97] motion-reduce:active:scale-100
                  `}
                  aria-label={`Switch to ${player.name || `Player ${index + 1}`}`}
                  type="button"
                >
                  {/* Player Color Indicator */}
                  <div
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full flex-shrink-0"
                    style={{ backgroundColor: player.color }}
                  />

                  {/* Player Info: Name and Score */}
                  <span
                    className="font-sans text-body font-bold uppercase tracking-wide truncate max-w-[60px] md:max-w-[80px]"
                    style={{ color: textColor }}
                  >
                    {player.name || `P${index + 1}`}
                  </span>

                  {settings.visual.showHeaderTotals && (
                    <span
                      className="font-serif text-body font-bold tabular-nums"
                      style={{ color: textColor }}
                    >
                      {playerScore}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scorecard - scrollable area */}
        <div className="relative flex-1 min-h-0">
          <div
            ref={scrollContainerRef}
            className="h-full overflow-y-auto"
          >
            <Scorecard
              scorecard={currentPlayer.scorecard}
              onCategoryClick={handleCategoryClick}
              isCurrentPlayer={true}
              textColor={textColor}
            />
          </div>

          {/* Bottom fade gradient - indicates more content below */}
          <div
            className={`scroll-fade-gradient ${showScrollIndicator ? 'scroll-fade-visible' : 'scroll-fade-hidden'}`}
            style={{
              background: `linear-gradient(to bottom, transparent, ${backgroundColor})`,
            }}
            aria-hidden="true"
          />

          {/* Scroll to bottom indicator */}
          <button
            onClick={scrollToBottom}
            className={`
              scroll-indicator absolute bottom-3
              flex items-center justify-center w-10 h-10 rounded-full
              bg-white/25 dark:bg-black/25 backdrop-blur-sm
              shadow-lg
              ${showScrollIndicator ? 'scroll-indicator-visible' : 'scroll-indicator-hidden'}
            `}
            style={{ color: textColor }}
            aria-label="Scroll to see more categories"
            aria-hidden={!showScrollIndicator}
            tabIndex={showScrollIndicator ? 0 : -1}
          >
            <Icon icon="basil:arrow-down-solid" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Score Entry Modal */}
      {selectedCategory && (
        <ScoreEntryModal
          categoryId={selectedCategory}
          onSubmit={handleScoreSubmit}
          onCancel={handleScoreCancel}
          initialScore={currentPlayer.scorecard[selectedCategory] ?? 0}
          playerColor={backgroundColor}
        />
      )}

      {/* Finish Game Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showFinishDialog}
        title={allComplete ? 'Finish Game?' : 'Finish Early?'}
        message={finishDialogMessage}
        confirmText="Finish"
        cancelText="Cancel"
        onConfirm={handleConfirmFinish}
        onCancel={handleCancelFinish}
      />
    </div>
  );
}
