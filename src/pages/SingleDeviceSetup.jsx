import { useState, useRef, useCallback, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Button, Input, Card, PlayerColorPicker } from '../components';
import { getColorByScheme, getPlayerColorByScheme, getTextColorForBackground } from '../utils/colors';
import { useSettings } from '../context/SettingsContext';

/**
 * Single Device Setup Screen
 * - Add 2-6 players (names optional)
 * - Auto-assign colors
 * - Start game when ready
 */
export default function SingleDeviceSetup({ onStartGame, onBack, colorIndex }) {
  const { settings } = useSettings();
  const colorScheme = settings.visual.colorScheme;
  const backgroundColor = getColorByScheme(colorIndex, colorScheme);
  const textColor = getTextColorForBackground(backgroundColor);

  // Sync background color to html/body for overscroll
  useEffect(() => {
    document.documentElement.style.setProperty('--page-bg', backgroundColor);
  }, [backgroundColor]);

  const [players, setPlayers] = useState([
    { id: 1, name: '', color: getPlayerColorByScheme(0, colorScheme) },
    { id: 2, name: '', color: getPlayerColorByScheme(1, colorScheme) },
  ]);

  // Track newly added players for enter animation
  const [animatingIds, setAnimatingIds] = useState(new Set());
  // Track players being removed for exit animation
  const [exitingIds, setExitingIds] = useState(new Set());
  const nextIdRef = useRef(3);

  const handleNameChange = (id, name) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name } : p));
  };

  // Handle color change for a player
  const handleColorChange = (id, newColor) => {
    setPlayers(players.map(p => p.id === id ? { ...p, color: newColor } : p));
  };

  const addPlayer = () => {
    if (players.length < 6) {
      const newId = nextIdRef.current++;
      // Mark this player as animating
      setAnimatingIds(prev => new Set(prev).add(newId));
      setPlayers([
        ...players,
        { id: newId, name: '', color: getPlayerColorByScheme(players.length, colorScheme) }
      ]);
      // Remove from animating set after animation completes
      setTimeout(() => {
        setAnimatingIds(prev => {
          const next = new Set(prev);
          next.delete(newId);
          return next;
        });
      }, 200);
    }
  };

  const removePlayer = useCallback((id) => {
    if (players.length > 2 && !exitingIds.has(id)) {
      // Start exit animation
      setExitingIds(prev => new Set(prev).add(id));
      // Remove after animation completes (200ms to match CSS)
      setTimeout(() => {
        setPlayers(prev => prev.filter(p => p.id !== id));
        setExitingIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 200);
    }
  }, [players.length, exitingIds]);

  // Allow starting with at least 2 players (names are optional)
  const canStart = players.length >= 2;

  const handleStart = () => {
    // Pass all players to the game (names are optional, will show as "Player 1", "Player 2", etc.)
    onStartGame(players);
  };

  return (
    <div
      className="min-h-dvh p-8 transition-colors duration-500"
      style={{ backgroundColor }}
    >
      {/* Header */}
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="font-sans text-body mb-8 hover:opacity-70 transition-opacity flex items-center gap-2"
          style={{ color: textColor }}
        >
          <Icon icon="basil:arrow-left-solid" className="w-6 h-6" />
          Back
        </button>

        <h1
          className="font-serif text-title md:text-headline mb-4 text-balance"
          style={{ color: textColor }}
        >
          PLAYERS
        </h1>
        <p
          className="font-sans text-body opacity-90 mb-12 text-pretty"
          style={{ color: textColor }}
        >
          Add 2-6 players to begin (names optional)
        </p>

        {/* Player Inputs */}
        <div className="space-y-6 mb-8">
          {players.map((player, index) => {
            const isEntering = animatingIds.has(player.id);
            const isExiting = exitingIds.has(player.id);
            const animationClass = isExiting
              ? 'animate-playerRowExit'
              : isEntering
              ? 'animate-playerRowEnter'
              : '';

            return (
            <div
              key={player.id}
              className={`flex items-center gap-4 ${animationClass}`}
              style={{ willChange: isEntering || isExiting ? 'transform, opacity' : 'auto' }}
            >
              {/* Color Picker - Clickable color circle with popup */}
              <PlayerColorPicker
                currentColor={player.color}
                usedColors={players.map(p => p.color)}
                colorScheme={colorScheme}
                onColorChange={(newColor) => handleColorChange(player.id, newColor)}
              />

              {/* Name Input */}
              <div className="flex-1">
                <Input
                  placeholder={`Player ${index + 1}`}
                  value={player.name}
                  onChange={(e) => handleNameChange(player.id, e.target.value)}
                  maxLength={20}
                  autoFocus={index === 0}
                  textColor={textColor}
                />
              </div>

              {/* Remove Button Container - always rendered for smooth width transition */}
              <div
                className="shrink-0 overflow-hidden"
                style={{
                  width: players.length > 2 && !exitingIds.has(player.id) ? 48 : 0,
                  marginLeft: players.length > 2 && !exitingIds.has(player.id) ? 16 : 0,
                  transition: 'width 200ms var(--ease-in-out-cubic), margin-left 200ms var(--ease-in-out-cubic)',
                }}
              >
                <button
                  onClick={() => removePlayer(player.id)}
                  className="w-12 h-12 flex items-center justify-center hover:opacity-70 transition-opacity text-2xl font-bold"
                  style={{ color: textColor }}
                  aria-label={`Remove ${player.name || `Player ${index + 1}`}`}
                  tabIndex={players.length > 2 ? 0 : -1}
                >
                  ×
                </button>
              </div>
            </div>
            );
          })}
        </div>

        {/* Add Player Button */}
        {players.length < 6 && (
          <Button
            variant="outline"
            size="medium"
            fullWidth
            onClick={addPlayer}
            className="mb-8"
            textColor={textColor}
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
            Add at least 2 players to start
          </p>
        )}
      </div>
    </div>
  );
}
