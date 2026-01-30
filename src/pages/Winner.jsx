import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Button, Card } from '../components';
import { getColorByIndex, getTextColorForBackground } from '../utils/colors';
import { useSettings } from '../context/SettingsContext';
import { playTrumpetFanfare } from '../utils/sounds';

/**
 * Winner announcement screen
 * - Shows winner with celebration
 * - Displays final scores
 * - Options to play again or go home
 */
export default function Winner({ players, onPlayAgain, onGoHome, colorIndex }) {
  const backgroundColor = getColorByIndex(colorIndex);
  const textColor = getTextColorForBackground(backgroundColor);
  const [showConfetti, setShowConfetti] = useState(true);
  const { settings } = useSettings();

  // Sync background color to html/body for overscroll
  useEffect(() => {
    document.documentElement.style.setProperty('--page-bg', backgroundColor);
  }, [backgroundColor]);

  // Sort players by score
  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);
  const winner = sortedPlayers[0];

  // Play trumpet fanfare on mount
  useEffect(() => {
    if (settings.accessibility.enableSoundEffects) {
      playTrumpetFanfare();
    }
  }, [settings.accessibility.enableSoundEffects]);

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="min-h-dvh p-8 flex items-center justify-center transition-colors duration-500 relative overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Confetti effect (simple version) */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-3 h-3"
                style={{
                  backgroundColor: getColorByIndex(Math.floor(Math.random() * 5)),
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-2xl w-full z-dropdown">
        {/* Winner Announcement */}
        <div className="text-center mb-8 animate-scaleIn">
          <Icon
            icon="mdi:trophy"
            className="text-[3rem] md:text-[4rem] mx-auto mb-2"
            style={{ color: textColor }}
          />
          <h1
            className="font-serif text-headline md:text-display mb-2 text-balance"
            style={{ color: textColor }}
          >
            WINNER
          </h1>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-full shrink-0"
              style={{ backgroundColor: winner.color }}
            />
            <h2
              className="font-serif text-title md:text-headline text-balance"
              style={{ color: textColor }}
            >
              {winner.name.toUpperCase()}
            </h2>
          </div>
          <p className="font-sans text-title md:text-headline text-pretty tabular-nums" style={{ color: textColor }}>
            {winner.totalScore} points
          </p>
        </div>

        {/* Final Scores */}
        <Card padding="medium" className="mb-6">
          <h3
            className="font-sans text-body-lg font-bold uppercase tracking-wider mb-4 text-center text-balance opacity-70"
            style={{ color: textColor }}
          >
            Final Scores
          </h3>
          <div className="space-y-1">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between py-3 px-3 ${
                  index === 0 ? 'bg-bright-green/20 dark:bg-bright-green/20' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="font-sans text-body opacity-50 min-w-[2rem]"
                    style={{ color: textColor }}
                  >
                    #{index + 1}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full shrink-0"
                    style={{ backgroundColor: player.color }}
                  />
                  <span
                    className="font-sans text-body font-bold"
                    style={{ color: textColor }}
                  >
                    {player.name}
                  </span>
                </div>
                <span
                  className="font-sans text-body-lg font-bold tabular-nums"
                  style={{ color: textColor }}
                >
                  {player.totalScore}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="solid"
            size="large"
            fullWidth
            onClick={onPlayAgain}
          >
            Play Again
          </Button>
          <Button
            variant="outline"
            size="medium"
            fullWidth
            onClick={onGoHome}
            textColor={textColor}
          >
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}
