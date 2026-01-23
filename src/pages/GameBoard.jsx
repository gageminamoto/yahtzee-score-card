import { useState } from 'react';
import Scorecard from '../components/Scorecard';
import ScoreEntryModal from '../components/ScoreEntryModal';
import {
  createEmptyScorecard,
  calculateTotalScore,
  updateScorecard,
  isGameComplete,
} from '../utils/scoring';
import { TOTAL_ROUNDS } from '../utils/gameConstants';
import { getTextColorForBackground } from '../utils/colors';

/**
 * Main game board for single device mode
 * - Shows current player
 * - Displays scorecard
 * - Tracks turns and rounds
 * - Navigates to winner screen when complete
 */
export default function GameBoard({ players: initialPlayers, onGameComplete, onQuit }) {
  // Initialize players with empty scorecards
  const [players] = useState(() =>
    initialPlayers.map(p => ({
      ...p,
      scorecard: createEmptyScorecard(),
    }))
  );

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [completedTurns, setCompletedTurns] = useState(0);

  const currentPlayer = players[currentPlayerIndex];
  const backgroundColor = currentPlayer.color;
  const textColor = getTextColorForBackground(backgroundColor);
  const currentRound = Math.floor(completedTurns / players.length) + 1;

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleScoreSubmit = (score) => {
    // Update the player's scorecard
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex].scorecard = updateScorecard(
      currentPlayer.scorecard,
      selectedCategory,
      score
    );

    setSelectedCategory(null);
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
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
  };

  const handleScoreCancel = () => {
    setSelectedCategory(null);
  };

  return (
    <div
      className="min-h-screen p-3 md:p-6 transition-colors duration-500"
      style={{ backgroundColor }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header with Quit and Round */}
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={onQuit}
            className="font-sans text-ui hover:opacity-70 transition-opacity"
            style={{ color: textColor }}
          >
            ← Quit
          </button>
          <div
            className="font-sans text-ui opacity-90"
            style={{ color: textColor }}
          >
            R{currentRound}/{TOTAL_ROUNDS}
          </div>
        </div>

        {/* VS Score Display */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {/* Current Player */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full border-3 border-white"
              style={{ backgroundColor: currentPlayer.color, boxShadow: '0 0 0 2px black' }}
            />
            <span
              className="font-serif text-subtitle md:text-title"
              style={{ color: textColor }}
            >
              {calculateTotalScore(currentPlayer.scorecard)}
            </span>
          </div>

          {/* VS */}
          {players.length > 1 && (
            <>
              <span
                className="font-sans text-body opacity-70"
                style={{ color: textColor }}
              >
                vs
              </span>

              {/* Opponents */}
              {players
                .filter((_, idx) => idx !== currentPlayerIndex)
                .map(player => (
                  <div key={player.id} className="flex items-center gap-2">
                    <span
                      className="font-serif text-subtitle md:text-title"
                      style={{ color: textColor }}
                    >
                      {calculateTotalScore(player.scorecard)}
                    </span>
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: player.color }}
                    />
                  </div>
                ))}
            </>
          )}
        </div>

        {/* Scorecard */}
        <Scorecard
          scorecard={currentPlayer.scorecard}
          onCategoryClick={handleCategoryClick}
          isCurrentPlayer={true}
          textColor={textColor}
        />

      </div>

      {/* Score Entry Modal */}
      {selectedCategory && (
        <ScoreEntryModal
          categoryId={selectedCategory}
          onSubmit={handleScoreSubmit}
          onCancel={handleScoreCancel}
        />
      )}
    </div>
  );
}
