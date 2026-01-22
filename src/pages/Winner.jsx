import { useState, useEffect } from 'react';
import { Button, Card } from '../components';
import { getColorByIndex } from '../utils/colors';

/**
 * Winner announcement screen
 * - Shows winner with celebration
 * - Displays final scores
 * - Options to play again or go home
 */
export default function Winner({ players, onPlayAgain, onGoHome }) {
  const [colorIndex] = useState(() => Math.floor(Math.random() * 5));
  const backgroundColor = getColorByIndex(colorIndex);
  const [showConfetti, setShowConfetti] = useState(true);

  // Sort players by score
  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);
  const winner = sortedPlayers[0];

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="min-h-screen p-8 flex items-center justify-center transition-colors duration-500 relative overflow-hidden"
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

      <div className="max-w-2xl w-full z-10">
        {/* Winner Announcement */}
        <div className="text-center mb-12 animate-scaleIn">
          <h1 className="font-serif text-headline md:text-display text-white mb-6">
            WINNER
          </h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div
              className="w-20 h-20 rounded-full border-6 border-black"
              style={{ backgroundColor: winner.color }}
            />
            <h2 className="font-serif text-title md:text-headline text-white">
              {winner.name.toUpperCase()}
            </h2>
          </div>
          <p className="font-serif text-subtitle text-white">
            {winner.totalScore} points
          </p>
        </div>

        {/* Final Scores */}
        <Card padding="large" className="mb-8">
          <h3 className="font-serif text-subtitle text-white mb-6 text-center">
            FINAL SCORES
          </h3>
          <div className="space-y-4">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between py-4 px-4 ${
                  index === 0 ? 'bg-bright-green bg-opacity-20' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="font-serif text-body-lg text-white opacity-70 min-w-[3rem]">
                    #{index + 1}
                  </span>
                  <div
                    className="w-10 h-10 rounded-full border-4 border-black"
                    style={{ backgroundColor: player.color }}
                  />
                  <span className="font-sans text-body-lg font-bold text-white">
                    {player.name}
                  </span>
                </div>
                <span className="font-serif text-body-lg font-bold text-white">
                  {player.totalScore}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-4">
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
          >
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}
