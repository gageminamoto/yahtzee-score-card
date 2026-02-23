import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Icon } from '@iconify/react';
import Scorecard from '../components/Scorecard';
import ScoreEntryModal from '../components/ScoreEntryModal';
import { ConfirmDialog, UpperBonusModal } from '../components';
import {
  createEmptyScorecard,
  calculateTotalScore,
  calculateUpperSectionSum,
  isGameComplete,
} from '../utils/scoring';
import { TOTAL_ROUNDS, UPPER_SECTION_CATEGORIES, getUpperBonusThreshold, getUpperBonusPoints } from '../utils/gameConstants';
import { getTextColorForBackground } from '../utils/colors';
import { useSettings } from '../context/SettingsContext';
import { useSession } from '../context/SessionContext';
import { isSoundEnabled, playScoreConfirm, playUpperBonus, playTurnChange } from '../utils/sounds';

/**
 * Multi-device game board
 * Each player sees their own scorecard and can only score on their turn (strict mode)
 * or anytime (freeform mode). All state synced via Firebase through SessionContext.
 */
export default function MultiDeviceGameBoard({ onGameComplete, onQuit, onSessionCancelled }) {
  const { settings } = useSettings();
  const {
    players,
    playerId,
    isHost,
    gameState,
    settings: sessionSettings,
    sessionStatus,
    turnOrder,
    isConnected,
    error: sessionError,
    submitScore,
    endGame,
    leaveGame,
    clearError,
  } = useSession();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [bonusModalPlayer, setBonusModalPlayer] = useState(null);
  const [showScoresOverlay, setShowScoresOverlay] = useState(false);
  const [viewingPlayer, setViewingPlayer] = useState(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [scoreError, setScoreError] = useState(null);
  const scrollContainerRef = useRef(null);
  const scrollThrottleRef = useRef(null);

  const currentPlayerIndex = gameState?.currentPlayerIndex ?? 0;
  const turnMode = sessionSettings?.turnMode ?? 'strict';

  const scoringSettings = useMemo(() => {
    if (!sessionSettings) return settings;
    return {
      gameRules: {
        upperBonusThreshold: sessionSettings.upperBonusThreshold,
        upperBonusPoints: sessionSettings.bonusPoints,
      },
    };
  }, [sessionSettings, settings]);

  const orderedPlayers = useMemo(() => {
    if (!players || players.length === 0) return [];
    if (!Array.isArray(turnOrder) || turnOrder.length === 0) return players;
    const byId = new Map(players.map((player) => [player.id, player]));
    const ordered = turnOrder.map((id) => byId.get(id)).filter(Boolean);
    const missing = players.filter((player) => !turnOrder.includes(player.id));
    return [...ordered, ...missing];
  }, [players, turnOrder]);

  // Find this device's player
  const myPlayer = orderedPlayers.find((p) => p.id === playerId);
  const myPlayerIndex = orderedPlayers.findIndex((p) => p.id === playerId);
  const isMyTurn = myPlayerIndex === currentPlayerIndex;
  const currentTurnPlayer = orderedPlayers[currentPlayerIndex];

  // In strict mode, can only score on your turn. In freeform, always can.
  const canScore = turnMode === 'freeform' || isMyTurn;

  const myScorecard = myPlayer?.scorecard || createEmptyScorecard();
  const backgroundColor = myPlayer?.color || '#333333';
  const textColor = getTextColorForBackground(backgroundColor);
  const completedTurns = gameState?.completedTurns ?? 0;
  const currentRound = Math.floor(completedTurns / Math.max(orderedPlayers.length, 1)) + 1;

  const handleSessionCancelled = useCallback(async () => {
    await leaveGame();
    if (onSessionCancelled) onSessionCancelled();
  }, [leaveGame, onSessionCancelled]);

  // When session status changes to finished, trigger game complete
  useEffect(() => {
    if (sessionStatus === 'finished') {
      const finalPlayers = orderedPlayers.map((p) => ({
        ...p,
        totalScore: calculateTotalScore(p.scorecard || createEmptyScorecard(), scoringSettings),
      }));
      onGameComplete(finalPlayers);
    }
  }, [sessionStatus, orderedPlayers, onGameComplete, scoringSettings]);

  // Check for all players complete and auto-end
  useEffect(() => {
    if (sessionStatus !== 'playing') return;
    const allComplete = orderedPlayers.length > 0 && orderedPlayers.every((p) =>
      isGameComplete(p.scorecard || createEmptyScorecard())
    );
    if (allComplete && isHost) {
      const finalPlayers = orderedPlayers.map((p) => ({
        ...p,
        totalScore: calculateTotalScore(p.scorecard || createEmptyScorecard(), scoringSettings),
      }));
      endGame();
      onGameComplete(finalPlayers);
    }
  }, [orderedPlayers, sessionStatus, isHost, endGame, onGameComplete, scoringSettings]);

  // Sync background color
  useEffect(() => {
    document.documentElement.style.setProperty('--page-bg', backgroundColor);
  }, [backgroundColor]);

  // Lock body scroll
  useEffect(() => {
    document.body.classList.add('scroll-lock');
    return () => document.body.classList.remove('scroll-lock');
  }, []);

  // Keep viewingPlayer in sync with live player data
  const viewingPlayerLive = viewingPlayer
    ? players.find((p) => p.id === viewingPlayer.id) || viewingPlayer
    : null;

  // Close viewing modal on Escape
  useEffect(() => {
    if (!viewingPlayer) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setViewingPlayer(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewingPlayer]);

  // Play turn change sound when it becomes your turn
  const prevIsMyTurn = useRef(isMyTurn);
  useEffect(() => {
    if (isMyTurn && !prevIsMyTurn.current && isSoundEnabled()) {
      playTurnChange();
    }
    prevIsMyTurn.current = isMyTurn;
  }, [isMyTurn]);

  // Scroll position check
  const checkScrollPosition = useCallback((immediate = false) => {
    const doCheck = () => {
      const container = scrollContainerRef.current;
      if (container) {
        const threshold = 20;
        const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
        const hasScrollableContent = container.scrollHeight > container.clientHeight;
        setShowScrollIndicator(hasScrollableContent && !isAtBottom);
      }
    };
    if (immediate) { doCheck(); return; }
    if (scrollThrottleRef.current) return;
    scrollThrottleRef.current = requestAnimationFrame(() => {
      doCheck();
      scrollThrottleRef.current = null;
    });
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const initialTimeout = setTimeout(() => checkScrollPosition(true), 50);
    const handleScroll = () => checkScrollPosition(false);
    container.addEventListener('scroll', handleScroll, { passive: true });
    const handleResize = () => checkScrollPosition(false);
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(initialTimeout);
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (scrollThrottleRef.current) cancelAnimationFrame(scrollThrottleRef.current);
    };
  }, [checkScrollPosition]);

  const scrollToBottom = () => {
    const container = scrollContainerRef.current;
    if (container) container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  };

  const handleCategoryClick = (categoryId) => {
    if (!canScore) return;
    setSelectedCategory(categoryId);
  };

  const upperCategoryIds = UPPER_SECTION_CATEGORIES.map((c) => c.id);

  const handleScoreSubmit = async (score) => {
    const oldUpperSum = calculateUpperSectionSum(myScorecard);
    setScoreError(null);

    try {
      // Submit via Firebase
      await submitScore(selectedCategory, score);
    } catch {
      setScoreError('Failed to save score. Please try again.');
      return;
    }

    // Check bonus (locally since Firebase update is async)
    const isUpperCategory = upperCategoryIds.includes(selectedCategory);
    if (isUpperCategory) {
      const newUpperSum = oldUpperSum + score - (myScorecard[selectedCategory] ?? 0);
      const threshold = getUpperBonusThreshold(scoringSettings);
      if (oldUpperSum < threshold && newUpperSum >= threshold) {
        setBonusModalPlayer({
          name: myPlayer?.name || 'You',
          color: myPlayer?.color || '#333',
        });
      }
    }

    if (isSoundEnabled()) {
      playScoreConfirm();
      if (bonusModalPlayer) {
        setTimeout(() => playUpperBonus(), 300);
      }
    }

    setSelectedCategory(null);
  };

  const handleScoreCancel = () => setSelectedCategory(null);

  const handleFinishGame = () => {
    if (selectedCategory || !isHost) return;
    setShowFinishDialog(true);
  };

  const handleConfirmFinish = async () => {
    setShowFinishDialog(false);
    const finalPlayers = orderedPlayers.map((p) => ({
      ...p,
      totalScore: calculateTotalScore(p.scorecard || createEmptyScorecard(), scoringSettings),
    }));
    await endGame();
    onGameComplete(finalPlayers);
  };

  if (sessionStatus === 'cancelled') {
    return (
      <div
        className="min-h-dvh flex items-center justify-center p-6 bg-white/95 dark:bg-black/90"
      >
        <div className="max-w-md w-full text-center">
          <h1 className="font-serif text-title text-black dark:text-white mb-3">Session Cancelled</h1>
          <p className="font-sans text-body text-black/70 dark:text-white/70 mb-6">
            The host ended the session. You can return home to start a new game.
          </p>
          <button
            onClick={handleSessionCancelled}
            className="w-full rounded-full py-3 px-4 font-sans font-bold bg-black text-white dark:bg-white dark:text-black transition-opacity hover:opacity-90"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!myPlayer || orderedPlayers.length === 0) return null;

  const allComplete = orderedPlayers.every((p) => isGameComplete(p.scorecard || createEmptyScorecard()));

  return (
    <div
      className="h-dvh px-2 py-1.5 md:p-6 transition-colors duration-500 flex flex-col mobile-compact overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Reconnection Banner */}
      {!isConnected && (
        <div
          className="fixed top-0 left-0 right-0 z-[10000] text-center py-2 px-4 bg-bright-red/90 backdrop-blur-sm"
          role="alert"
          aria-live="assertive"
        >
          <p className="font-sans text-ui font-bold text-white">
            Connection lost — reconnecting...
          </p>
        </div>
      )}

      {/* Score Error Toast */}
      {(scoreError || sessionError) && (
        <div
          className="fixed top-0 left-0 right-0 z-[10000] text-center py-2 px-4"
          style={{
            backgroundColor: textColor === '#000000' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.9)',
          }}
          role="alert"
          aria-live="polite"
        >
          <p className="font-sans text-ui font-bold" style={{ color: textColor === '#000000' ? '#ffffff' : '#000000' }}>
            {scoreError || sessionError}
          </p>
          <button
            onClick={() => { setScoreError(null); clearError(); }}
            className="font-sans text-ui underline opacity-80 mt-0.5"
            style={{ color: textColor === '#000000' ? '#ffffff' : '#000000' }}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto w-full flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="flex items-center mb-1.5 md:mb-2 flex-shrink-0">
          <div className="flex-1 flex justify-start">
            <button
              onClick={onQuit}
              className="font-sans text-ui hover:opacity-70 transition-opacity flex items-center gap-2"
              style={{ color: textColor }}
            >
              <Icon icon="basil:arrow-left-solid" className="w-5 h-5" />
              Quit
            </button>
          </div>
          <div className="font-sans text-ui opacity-90" style={{ color: textColor }} aria-label={`Round ${currentRound} of ${TOTAL_ROUNDS}`}>
            R{currentRound}/{TOTAL_ROUNDS}
          </div>
          <div className="flex-1 flex justify-end gap-2">
            {/* Scores overlay button */}
            <button
              onClick={() => setShowScoresOverlay(true)}
              className="font-sans text-ui font-bold px-4 py-2 rounded-full bg-white/15 dark:bg-black/15 hover:bg-white/25 dark:hover:bg-black/25 active:scale-95 transition-all duration-150"
              style={{ color: textColor }}
              aria-label="View all players' scores"
            >
              Scores
            </button>
            {isHost && (
              <button
                onClick={handleFinishGame}
                disabled={!!selectedCategory}
                className={`font-sans text-ui font-bold px-4 py-2 rounded-full bg-white/15 dark:bg-black/15 hover:bg-white/25 dark:hover:bg-black/25 active:scale-95 transition-all duration-150 ${selectedCategory ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                style={{ color: textColor }}
                aria-label="Finish game"
              >
                Finish
              </button>
            )}
          </div>
        </div>

        {/* Turn Banner */}
        <div
          className="text-center py-2 mb-2 rounded-lg flex-shrink-0"
          style={{
            backgroundColor: textColor === '#000000' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)',
          }}
          role="status"
          aria-live="polite"
        >
          {turnMode === 'strict' ? (
            <p className="font-sans text-body font-bold uppercase" style={{ color: textColor }}>
              {isMyTurn
                ? 'Your Turn'
                : `${currentTurnPlayer?.name || 'Player'}'s Turn`}
            </p>
          ) : (
            <p className="font-sans text-body font-bold uppercase" style={{ color: textColor }}>
              Free Play — Score Anytime
            </p>
          )}
        </div>

        {/* Player Switcher (view-only in multi-device — shows all players) */}
        <div className="flex justify-center mb-2 md:mb-4 flex-shrink-0">
          <div
            className="inline-flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full p-2"
            role="tablist"
            aria-label="Players"
          >
            {orderedPlayers.map((player, index) => {
              const isMe = player.id === playerId;
              const isActiveTurn = index === currentPlayerIndex;
              const playerScore = calculateTotalScore(player.scorecard || createEmptyScorecard(), scoringSettings);

              const TabWrapper = isMe ? 'div' : 'button';

              return (
                <TabWrapper
                  key={player.id}
                  role="tab"
                  aria-selected={isMe}
                  {...(!isMe && { onClick: () => setViewingPlayer(player) })}
                  aria-label={`${player.name || `Player ${index + 1}`}${isMe ? ' (you)' : ''}${isActiveTurn && turnMode === 'strict' ? ' — current turn' : ''}`}
                  className={`relative flex items-center gap-3 px-5 py-3 rounded-full min-w-fit min-h-[52px] transition-all duration-150 ease-out ${
                    isMe
                      ? 'bg-white/25 dark:bg-black/25'
                      : 'opacity-60 hover:opacity-80 cursor-pointer'
                  } ${isActiveTurn && turnMode === 'strict' ? 'ring-2 ring-white/60 dark:ring-black/60' : ''}`}
                >
                  <div className="relative">
                    <div
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full flex-shrink-0"
                      style={{ backgroundColor: player.color }}
                    />
                    {!player.isConnected && (
                      <div
                        className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-bright-red border-2 border-current"
                        aria-label={`${player.name} disconnected`}
                        role="img"
                      />
                    )}
                  </div>
                  <span
                    className="font-sans text-body font-bold uppercase tracking-wide truncate max-w-[60px] md:max-w-[80px]"
                    style={{ color: textColor }}
                  >
                    {player.name || `P${index + 1}`}
                  </span>
                  {settings.visual.showHeaderTotals && (
                    <span className="font-sans text-body font-bold tabular-nums" style={{ color: textColor }}>
                      {playerScore}
                    </span>
                  )}
                </TabWrapper>
              );
            })}
          </div>
        </div>

        {/* Scorecard */}
        <div className="relative flex-1 min-h-0">
          <div ref={scrollContainerRef} className="h-full overflow-y-auto">
            <Scorecard
              scorecard={myScorecard}
              onCategoryClick={handleCategoryClick}
              isCurrentPlayer={canScore}
              textColor={textColor}
              settings={scoringSettings}
            />
          </div>

          <div
            className={`scroll-fade-gradient ${showScrollIndicator ? 'scroll-fade-visible' : 'scroll-fade-hidden'}`}
            style={{ background: `linear-gradient(to bottom, transparent, ${backgroundColor})` }}
            aria-hidden="true"
          />
          <button
            onClick={scrollToBottom}
            className={`scroll-indicator absolute bottom-3 flex items-center justify-center w-10 h-10 rounded-full bg-white/25 dark:bg-black/25 backdrop-blur-sm shadow-lg ${showScrollIndicator ? 'scroll-indicator-visible' : 'scroll-indicator-hidden'}`}
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
          initialScore={myScorecard[selectedCategory] ?? 0}
          playerColor={backgroundColor}
        />
      )}

      {/* Scores Overlay */}
      {showScoresOverlay && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={() => setShowScoresOverlay(false)}
          role="dialog"
          aria-label="Player scores"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md rounded-2xl p-6 max-h-[80vh] overflow-y-auto"
            style={{ backgroundColor }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-sans text-body-lg font-bold uppercase tracking-wider" style={{ color: textColor }}>
                Scores
              </h2>
              <button
                onClick={() => setShowScoresOverlay(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/15 dark:hover:bg-black/15 transition-colors"
                style={{ color: textColor }}
                aria-label="Close scores"
              >
                <Icon icon="basil:cross-solid" className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {[...players]
                .sort((a, b) =>
                  calculateTotalScore(b.scorecard || createEmptyScorecard(), scoringSettings) -
                  calculateTotalScore(a.scorecard || createEmptyScorecard(), scoringSettings)
                )
                .map((player, index) => {
                  const score = calculateTotalScore(player.scorecard || createEmptyScorecard(), scoringSettings);
                  const isMe = player.id === playerId;
                  const RowTag = isMe ? 'div' : 'button';
                  return (
                    <RowTag
                      key={player.id}
                      {...(!isMe && {
                        onClick: () => {
                          setShowScoresOverlay(false);
                          setViewingPlayer(player);
                        },
                      })}
                      className={`flex items-center justify-between py-3 px-3 rounded-lg w-full text-left ${isMe ? 'bg-white/15 dark:bg-black/15' : 'hover:bg-white/10 dark:hover:bg-black/10 cursor-pointer'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-sans text-body opacity-50 min-w-[2rem]" style={{ color: textColor }}>
                          #{index + 1}
                        </span>
                        <div className="w-8 h-8 rounded-full shrink-0" style={{ backgroundColor: player.color }} />
                    <span className="font-sans text-body font-bold" style={{ color: textColor }}>
                      {player.name}{isMe ? ' (You)' : ''}
                    </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-body-lg font-bold tabular-nums" style={{ color: textColor }}>
                          {score}
                        </span>
                        {!isMe && (
                          <Icon icon="basil:arrow-right-solid" className="w-4 h-4 opacity-40" style={{ color: textColor }} />
                        )}
                      </div>
                    </RowTag>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Player Scorecard Viewer */}
      {viewingPlayerLive && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col"
          onClick={() => setViewingPlayer(null)}
          role="dialog"
          aria-label={`${viewingPlayerLive.name}'s scorecard`}
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative flex flex-col w-full h-full max-w-2xl mx-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 rounded-t-2xl flex-shrink-0"
              style={{ backgroundColor: viewingPlayerLive.color }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full border-2 flex-shrink-0"
                  style={{
                    backgroundColor: viewingPlayerLive.color,
                    borderColor: getTextColorForBackground(viewingPlayerLive.color),
                  }}
                />
                <div>
                  <h2
                    className="font-sans text-body-lg font-bold uppercase tracking-wider"
                    style={{ color: getTextColorForBackground(viewingPlayerLive.color) }}
                  >
                    {viewingPlayerLive.name}
                  </h2>
                  <p
                    className="font-sans text-ui opacity-70"
                    style={{ color: getTextColorForBackground(viewingPlayerLive.color) }}
                  >
                    Total: {calculateTotalScore(viewingPlayerLive.scorecard || createEmptyScorecard(), scoringSettings)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingPlayer(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/15 dark:hover:bg-black/15 transition-colors"
                style={{ color: getTextColorForBackground(viewingPlayerLive.color) }}
                aria-label="Close scorecard"
              >
                <Icon icon="basil:cross-solid" className="w-6 h-6" />
              </button>
            </div>

            {/* Scorecard body */}
            <div
              className="flex-1 min-h-0 overflow-y-auto rounded-b-2xl p-4"
              style={{ backgroundColor: viewingPlayerLive.color }}
            >
              <Scorecard
                scorecard={viewingPlayerLive.scorecard || createEmptyScorecard()}
                onCategoryClick={() => {}}
                isCurrentPlayer={false}
                textColor={getTextColorForBackground(viewingPlayerLive.color)}
                settings={scoringSettings}
              />
            </div>
          </div>
        </div>
      )}

      {/* Finish Game Dialog (host only) */}
      <ConfirmDialog
        isOpen={showFinishDialog}
        title={allComplete ? 'Finish Game?' : 'Finish Early?'}
        message={allComplete ? 'Finish game and see results?' : 'Current scores will be used to determine the winner.'}
        confirmText="Finish"
        cancelText="Cancel"
        onConfirm={handleConfirmFinish}
        onCancel={() => setShowFinishDialog(false)}
      />

      {/* Upper Bonus Modal */}
      {bonusModalPlayer && (
        <UpperBonusModal
          playerName={bonusModalPlayer.name}
          bonusPoints={getUpperBonusPoints(scoringSettings)}
          threshold={getUpperBonusThreshold(scoringSettings)}
          playerColor={bonusModalPlayer.color}
          onDismiss={() => setBonusModalPlayer(null)}
        />
      )}
    </div>
  );
}
