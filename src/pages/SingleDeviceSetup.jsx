import { useState } from 'react';
import { Button, Input, Card } from '../components';
import { getColorByScheme, getPlayerColorByScheme, getTextColorForBackground } from '../utils/colors';
import { useSettings } from '../context/SettingsContext';

/**
 * Single Device Setup Screen
 * - Enter 2-6 player names
 * - Auto-assign colors
 * - Start game when ready
 */
export default function SingleDeviceSetup({ onStartGame, onBack }) {
  const { settings } = useSettings();
  const colorScheme = settings.visual.colorScheme;
  const [colorIndex] = useState(() => Math.floor(Math.random() * 5));
  const backgroundColor = getColorByScheme(colorIndex, colorScheme);
  const textColor = getTextColorForBackground(backgroundColor);

  const [players, setPlayers] = useState([
    { id: 1, name: '', color: getPlayerColorByScheme(0, colorScheme) },
    { id: 2, name: '', color: getPlayerColorByScheme(1, colorScheme) },
  ]);

  const handleNameChange = (id, name) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name } : p));
  };

  const addPlayer = () => {
    if (players.length < 6) {
      const newId = players.length + 1;
      setPlayers([
        ...players,
        { id: newId, name: '', color: getPlayerColorByScheme(players.length, colorScheme) }
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
          className="font-sans text-body mb-8 hover:opacity-70 transition-opacity"
          style={{ color: textColor }}
        >
          ← Back
        </button>

        <h1
          className="font-serif text-title md:text-headline mb-4"
          style={{ color: textColor }}
        >
          PLAYERS
        </h1>
        <p
          className="font-sans text-body opacity-90 mb-12"
          style={{ color: textColor }}
        >
          Enter 2-6 player names to begin
        </p>

        {/* Player Inputs */}
        <div className="space-y-6 mb-8">
          {players.map((player, index) => (
            <div key={player.id} className="flex items-center gap-4">
              {/* Color Indicator */}
              <div
                className="w-12 h-12 rounded-full flex-shrink-0 border-4 border-white"
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
                  className="w-12 h-12 flex items-center justify-center text-2xl font-bold hover:opacity-70 transition-opacity"
                  style={{ color: textColor }}
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
          <p
            className="font-sans text-ui opacity-70 text-center mt-4"
            style={{ color: textColor }}
          >
            Enter at least 2 player names to start
          </p>
        )}
      </div>
    </div>
  );
}
