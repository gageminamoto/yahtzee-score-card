import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
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

  // Handle clicking on a player's color to switch to that player
  const handlePlayerSwitch = (playerIndex) => {
    // Only allow switching if not currently entering a score
    if (!selectedCategory) {
      setCurrentPlayerIndex(playerIndex);
    }
  };

  return (
    <div
      className="min-h-dvh p-3 md:p-6 transition-colors duration-500"
      style={{ backgroundColor }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header with Quit and Round */}
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={onQuit}
            className="font-sans text-ui hover:opacity-70 transition-opacity flex items-center gap-2"
            style={{ color: textColor }}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5" />
            Quit
          </button>
          <div
            className="font-sans text-ui opacity-90"
            style={{ color: textColor }}
          >
            R{currentRound}/{TOTAL_ROUNDS}
          </div>
        </div>

        {/* Player Selector - Shows all players with names and clickable colors */}
        <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
          {players.map((player, index) => {
            const isActive = index === currentPlayerIndex;
            const playerScore = calculateTotalScore(player.scorecard);
            
            return (
              <button
                key={player.id}
                onClick={() => handlePlayerSwitch(index)}
                disabled={!!selectedCategory}
                className={`
                  flex flex-col items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-white/20 dark:bg-black/20 scale-105' 
                    : 'hover:bg-white/10 dark:hover:bg-black/10 hover:scale-[1.02]'
                  }
                  ${selectedCategory ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-black focus:ring-offset-2
                `}
                aria-label={`Switch to ${player.name || `Player ${index + 1}`}`}
                type="button"
              >
                {/* Player Color Circle - Clickable */}
                <div
                  className={`
                    w-12 h-12 rounded-full border-4 transition-all duration-200
                    ${isActive 
                      ? 'border-white dark:border-black ring-4 ring-white/50 dark:ring-black/50 scale-110' 
                      : 'border-white/50 dark:border-black/50 hover:border-white dark:hover:border-black hover:scale-105'
                    }
                  `}
                  style={{ backgroundColor: player.color }}
                />
                
                {/* Player Name */}
                <span
                  className={`
                    font-sans text-body font-medium text-center max-w-[80px] truncate
                    ${isActive ? 'opacity-100' : 'opacity-80'}
                  `}
                  style={{ color: textColor }}
                >
                  {player.name || `Player ${index + 1}`}
                </span>
                
                {/* Player Score */}
                <span
                  className={`
                    font-serif text-subtitle tabular-nums
                    ${isActive ? 'opacity-100 font-bold' : 'opacity-70'}
                  `}
                  style={{ color: textColor }}
                >
                  {playerScore}
                </span>
                
                {/* Active Indicator */}
                {isActive && (
                  <div
                    className="w-2 h-2 rounded-full mt-1"
                    style={{ backgroundColor: textColor }}
                  />
                )}
              </button>
            );
          })}
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
