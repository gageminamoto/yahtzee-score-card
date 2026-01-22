import { useState } from 'react';
import { Button, Card } from '../components';
import Scorecard from '../components/Scorecard';
import ScoreEntryModal from '../components/ScoreEntryModal';
import { getColorByIndex } from '../utils/colors';
import {
  createEmptyScorecard,
  calculateTotalScore,
  updateScorecard,
  isGameComplete,
} from '../utils/scoring';
import { TOTAL_ROUNDS } from '../utils/gameConstants';

/**
 * Main game board for single device mode
 * - Shows current player
 * - Displays scorecard
 * - Tracks turns and rounds
 * - Navigates to winner screen when complete
 */
export default function GameBoard({ players: initialPlayers, onGameComplete, onQuit }) {
  const [colorIndex] = useState(() => Math.floor(Math.random() * 5));
  const backgroundColor = getColorByIndex(colorIndex);

  // Initialize players with empty scorecards
  const [players] = useState(() =>
    initialPlayers.map(p => ({
      ...p,
      scorecard: createEmptyScorecard(),
    }))
  );

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showScores, setShowScores] = useState(false);
  const [completedTurns, setCompletedTurns] = useState(0);

  const currentPlayer = players[currentPlayerIndex];
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
      className="min-h-screen p-4 md:p-8 transition-colors duration-500"
      style={{ backgroundColor }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onQuit}
            className="font-sans text-body text-white hover:opacity-70 transition-opacity"
          >
            ← Quit
          </button>
          <div className="font-sans text-ui text-white opacity-90 text-right">
            ROUND {currentRound} / {TOTAL_ROUNDS}
          </div>
        </div>

        {/* Current Player */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-full border-4 border-black flex-shrink-0"
              style={{ backgroundColor: currentPlayer.color }}
            />
            <div>
              <div className="flex items-center gap-3">
                <span className="font-sans text-body text-white opacity-70">★</span>
                <h2 className="font-serif text-subtitle md:text-title text-white">
                  {currentPlayer.name.toUpperCase()}
                </h2>
              </div>
              <p className="font-sans text-body-lg text-white opacity-90">
                {calculateTotalScore(currentPlayer.scorecard)} pts
              </p>
            </div>
          </div>
        </div>

        {/* Scorecard */}
        <Scorecard
          scorecard={currentPlayer.scorecard}
          onCategoryClick={handleCategoryClick}
          isCurrentPlayer={true}
        />

        {/* Other Players Button */}
        <div className="mt-8">
          <Button
            variant="outline"
            size="medium"
            fullWidth
            onClick={() => setShowScores(!showScores)}
          >
            {showScores ? 'Hide Scores' : 'Show All Scores'}
          </Button>
        </div>

        {/* All Player Scores */}
        {showScores && (
          <Card padding="medium" className="mt-6">
            <h3 className="font-serif text-subtitle text-white mb-4">
              LEADERBOARD
            </h3>
            <div className="space-y-4">
              {players
                .map(p => ({
                  ...p,
                  totalScore: calculateTotalScore(p.scorecard),
                }))
                .sort((a, b) => b.totalScore - a.totalScore)
                .map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between py-3 border-b-2 border-white border-opacity-20 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-body-lg text-white opacity-50">
                        #{index + 1}
                      </span>
                      <div
                        className="w-8 h-8 rounded-full border-2 border-black"
                        style={{ backgroundColor: player.color }}
                      />
                      <span className="font-sans text-body font-bold text-white">
                        {player.name}
                      </span>
                    </div>
                    <span className="font-serif text-body-lg font-bold text-white">
                      {player.totalScore} pts
                    </span>
                  </div>
                ))}
            </div>
          </Card>
        )}
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
