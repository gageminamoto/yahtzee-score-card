import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { Button, Card } from '../components';
import { getColorByIndex, getTextColorForBackground } from '../utils/colors';
import { useSettings } from '../context/SettingsContext';
import { useSession } from '../context/SessionContext';
import { playTrumpetFanfare, playRevealTick } from '../utils/sounds';

/**
 * Winner announcement screen with suspenseful phased reveal
 * - Phase 1: "Final Scores" title on dark background
 * - Phase 2: Scores appear one at a time (anonymous — no names)
 * - Phase 3: Names + colors revealed next to scores
 * - Phase 4: Winner celebration with confetti and fanfare
 * - Tap anywhere to skip to the end
 */
export default function Winner({ players, onPlayAgain, onGoHome, colorIndex, gameMode }) {
  const winnerBg = getColorByIndex(colorIndex);
  const winnerTextColor = getTextColorForBackground(winnerBg);
  const { settings } = useSettings();
  const { isHost, sessionCode, leaveGame } = useSession();
  const timersRef = useRef([]);

  const isMulti = gameMode === 'multi';

  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);
  const winner = sortedPlayers[0];
  const isSinglePlayer = players.length === 1;

  // Scores ordered lowest → highest for reveal
  const scoresLowestFirst = [...sortedPlayers].reverse();

  const shouldSkipReveal = isSinglePlayer || settings.visual.reducedMotion;

  // Phase: 'title' → 'scores' → 'names' → 'winner'
  const [revealPhase, setRevealPhase] = useState(() => shouldSkipReveal ? 'winner' : 'title');
  const [revealedScoreCount, setRevealedScoreCount] = useState(() => shouldSkipReveal ? sortedPlayers.length : 0);
  const [showConfetti, setShowConfetti] = useState(shouldSkipReveal);
  const [showActions, setShowActions] = useState(shouldSkipReveal);

  const isNamesVisible = revealPhase === 'names' || revealPhase === 'winner';
  const currentBg = revealPhase === 'winner' ? winnerBg : '#1a1a1a';
  const currentTextColor = revealPhase === 'winner' ? winnerTextColor : '#FFFFFF';

  const handlePlayAgain = async () => {
    if (isMulti && sessionCode) await leaveGame();
    onPlayAgain();
  };

  const handleGoHome = async () => {
    if (isMulti && sessionCode) await leaveGame();
    onGoHome();
  };

  // Sync background color to html/body for overscroll
  useEffect(() => {
    document.documentElement.style.setProperty('--page-bg', currentBg);
  }, [currentBg]);

  // Play fanfare immediately for skipped reveal
  useEffect(() => {
    if (shouldSkipReveal && settings.accessibility.enableSoundEffects) {
      playTrumpetFanfare();
    }
  }, []);

  // Hide confetti after 3s
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // Timer chain for phased reveal
  useEffect(() => {
    if (shouldSkipReveal) return;

    const addTimer = (fn, delay) => {
      const id = setTimeout(fn, delay);
      timersRef.current.push(id);
    };

    // Phase 1 → Phase 2: start showing scores
    addTimer(() => setRevealPhase('scores'), 1200);

    // Reveal each score (anonymous), lowest first
    scoresLowestFirst.forEach((_, index) => {
      addTimer(() => {
        setRevealedScoreCount(index + 1);
        if (settings.accessibility.enableSoundEffects) {
          playRevealTick();
        }
      }, 1200 + index * 600);
    });

    // Phase 3: reveal names after all scores shown + pause
    const namesDelay = 1200 + scoresLowestFirst.length * 600 + 1000;
    addTimer(() => {
      setRevealPhase('names');
      if (settings.accessibility.enableSoundEffects) {
        playRevealTick();
      }
    }, namesDelay);

    // Phase 4: winner celebration
    const winnerDelay = namesDelay + 800;
    addTimer(() => {
      setRevealPhase('winner');
      setShowConfetti(true);
      if (settings.accessibility.enableSoundEffects) {
        playTrumpetFanfare();
      }
    }, winnerDelay);

    // Show action buttons
    addTimer(() => setShowActions(true), winnerDelay + 800);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const handleSkip = () => {
    if (revealPhase === 'winner' && showActions) return;

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (revealPhase !== 'winner' && settings.accessibility.enableSoundEffects) {
      playTrumpetFanfare();
    }

    setRevealPhase('winner');
    setRevealedScoreCount(sortedPlayers.length);
    setShowConfetti(true);
    setShowActions(true);
  };

  // Pre-generate confetti particle data to avoid Math.random during render
  const [confettiParticles] = useState(() =>
    [...Array(30)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `-${Math.random() * 20}%`,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${2 + Math.random() * 2}s`,
      backgroundColor: getColorByIndex(Math.floor(Math.random() * 5)),
      rotation: `rotate(${Math.random() * 360}deg)`,
    })),
  );

  // Scores revealed so far, re-ordered by rank (1st at top) for display
  const visibleScores = scoresLowestFirst.slice(0, revealedScoreCount).reverse();

  return (
    <div
      className="min-h-dvh p-8 flex items-center justify-center transition-colors duration-500 relative overflow-hidden"
      style={{ backgroundColor: currentBg }}
      onClick={handleSkip}
    >
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {confettiParticles.map((particle, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.animationDelay,
                animationDuration: particle.animationDuration,
              }}
            >
              <div
                className="w-3 h-3"
                style={{
                  backgroundColor: particle.backgroundColor,
                  transform: particle.rotation,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-2xl w-full z-dropdown">
        {/* Phase 1: Title only */}
        {revealPhase === 'title' && (
          <div className="text-center animate-fadeIn">
            <h1
              className="font-serif text-headline md:text-display text-balance"
              style={{ color: currentTextColor }}
            >
              FINAL SCORES
            </h1>
          </div>
        )}

        {/* Phases 2-4: Scores, names, winner */}
        {revealPhase !== 'title' && (
          <>
            {/* Winner announcement (Phase 4 only) */}
            {revealPhase === 'winner' && (
              <div className="text-center mb-8 animate-revealScaleIn">
                <Icon
                  icon="mdi:trophy"
                  className="text-[3rem] md:text-[4rem] mx-auto mb-2"
                  style={{ color: currentTextColor }}
                />
                <h1
                  className="font-serif text-headline md:text-display mb-2 text-balance"
                  style={{ color: currentTextColor }}
                >
                  WINNER
                </h1>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-full shrink-0 border-2"
                    style={{ backgroundColor: winner.color, borderColor: currentTextColor + '40' }}
                  />
                  <h2
                    className="font-serif text-title md:text-headline text-balance"
                    style={{ color: currentTextColor }}
                  >
                    {winner.name.toUpperCase()}
                  </h2>
                </div>
                <p
                  className="font-sans text-title md:text-headline text-pretty tabular-nums"
                  style={{ color: currentTextColor }}
                >
                  {winner.totalScore} points
                </p>
              </div>
            )}

            {/* Scores card */}
            <Card padding="medium" className="mb-6">
              <h3
                className="font-sans text-body-lg font-bold uppercase tracking-wider mb-4 text-center text-balance opacity-70"
                style={{ color: currentTextColor }}
              >
                Final Scores
              </h3>
              <div className="space-y-1">
                {visibleScores.map((player) => {
                  const rank = sortedPlayers.indexOf(player) + 1;
                  const isWinner = rank === 1;
                  return (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between py-3 px-3 ${
                        isWinner && revealPhase === 'winner' ? 'bg-bright-green/20 dark:bg-bright-green/20' : ''
                      } ${revealPhase === 'scores' && visibleScores[0]?.id === player.id ? 'animate-revealSlideUp' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="font-sans text-body opacity-50 min-w-[2rem]"
                          style={{ color: currentTextColor }}
                        >
                          #{rank}
                        </span>
                        {/* Name + color: hidden during scores phase, revealed in names/winner phase */}
                        {isNamesVisible ? (
                          <>
                            <div
                              className="w-8 h-8 rounded-full shrink-0 animate-fadeIn border-2"
                              style={{ backgroundColor: player.color, borderColor: currentTextColor + '40' }}
                            />
                            <span
                              className="font-sans text-body font-bold animate-fadeIn"
                              style={{ color: currentTextColor }}
                            >
                              {player.name}
                            </span>
                          </>
                        ) : (
                          <span
                            className="font-sans text-body opacity-30"
                            style={{ color: currentTextColor }}
                          >
                            ???
                          </span>
                        )}
                      </div>
                      <span
                        className="font-sans text-body-lg font-bold tabular-nums"
                        style={{ color: currentTextColor }}
                      >
                        {player.totalScore}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Actions */}
            {showActions && (
              <div className="space-y-3 animate-fadeIn">
                {(!isMulti || isHost) && (
                  <Button
                    variant="solid"
                    size="large"
                    fullWidth
                    onClick={handlePlayAgain}
                  >
                    Play Again
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="medium"
                  fullWidth
                  onClick={handleGoHome}
                  textColor={currentTextColor}
                >
                  Home
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
