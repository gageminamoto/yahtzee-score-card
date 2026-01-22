import { useState } from 'react';
import { Button, Input, Card } from '../components';
import { getColorByIndex, getPlayerColor } from '../utils/colors';

/**
 * Single Device Setup Screen
 * - Enter 2-6 player names
 * - Auto-assign colors
 * - Start game when ready
 */
export default function SingleDeviceSetup({ onStartGame, onBack }) {
  const [colorIndex] = useState(() => Math.floor(Math.random() * 5));
  const backgroundColor = getColorByIndex(colorIndex);

  const [players, setPlayers] = useState([
    { id: 1, name: '', color: getPlayerColor(0) },
    { id: 2, name: '', color: getPlayerColor(1) },
  ]);

  const handleNameChange = (id, name) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name } : p));
  };

  const addPlayer = () => {
    if (players.length < 6) {
      const newId = players.length + 1;
      setPlayers([
        ...players,
        { id: newId, name: '', color: getPlayerColor(players.length) }
      ]);
    }
  };

  const removePlayer = (id) => {
    if (players.length > 2) {
      setPlayers(players.filter(p => p.id !== id));
    }
  };

  const canStart = players.filter(p => p.name.trim() !== '').length >= 2;

  const handleStart = () => {
    const validPlayers = players.filter(p => p.name.trim() !== '');
    onStartGame(validPlayers);
  };

  return (
    <div
      className="min-h-screen p-8 transition-colors duration-500"
      style={{ backgroundColor }}
    >
      {/* Header */}
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="font-sans text-body text-white mb-8 hover:opacity-70 transition-opacity"
        >
          ← Back
        </button>

        <h1 className="font-serif text-title md:text-headline text-white mb-4">
          PLAYERS
        </h1>
        <p className="font-sans text-body text-white opacity-90 mb-12">
          Enter 2-6 player names to begin
        </p>

        {/* Player Inputs */}
        <div className="space-y-6 mb-8">
          {players.map((player, index) => (
            <div key={player.id} className="flex items-center gap-4">
              {/* Color Indicator */}
              <div
                className="w-12 h-12 rounded-full border-4 border-black flex-shrink-0"
                style={{ backgroundColor: player.color }}
              />

              {/* Name Input */}
              <div className="flex-1">
                <Input
                  placeholder={`Player ${index + 1}`}
                  value={player.name}
                  onChange={(e) => handleNameChange(player.id, e.target.value)}
                  maxLength={20}
                  autoFocus={index === 0}
                />
              </div>

              {/* Remove Button (only if more than 2 players) */}
              {players.length > 2 && (
                <button
                  onClick={() => removePlayer(player.id)}
                  className="w-12 h-12 flex items-center justify-center text-white text-2xl font-bold hover:opacity-70 transition-opacity"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Player Button */}
        {players.length < 6 && (
          <Button
            variant="outline"
            size="medium"
            fullWidth
            onClick={addPlayer}
            className="mb-8"
          >
            + Add Player
          </Button>
        )}

        {/* Start Game Button */}
        <Button
          variant="solid"
          size="large"
          fullWidth
          onClick={handleStart}
          disabled={!canStart}
        >
          Start Game
        </Button>

        {!canStart && (
          <p className="font-sans text-ui text-white opacity-70 text-center mt-4">
            Enter at least 2 player names to start
          </p>
        )}
      </div>
    </div>
  );
}
