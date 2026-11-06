import { useState, useRef, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { Button, Input, PageHeader, PlayerColorPicker } from '../components';
import { getPlayerColorByScheme } from '../utils/colors';
import { usePageSurface } from '../hooks/useSurface';
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
  const { style: surfaceStyle } = usePageSurface(colorIndex);

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
      className="min-h-dvh p-8 text-fg transition-colors duration-500"
      style={surfaceStyle}
    >
      {/* Header */}
      <div className="max-w-2xl mx-auto">
        <PageHeader
          title="PLAYERS"
          description="Add 2-6 players to begin (names optional)"
          onBack={onBack}
          className="mb-12"
        />

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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePlayer(player.id)}
                  className="w-12 h-12"
                  aria-label={`Remove ${player.name || `Player ${index + 1}`}`}
                  tabIndex={players.length > 2 ? 0 : -1}
                >
                  <Icon icon="basil:close-solid" className="w-6 h-6" />
                </Button>
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
          <p className="font-sans text-ui text-fg/70 text-center mt-4">
            Add at least 2 players to start
          </p>
        )}
      </div>
    </div>
  );
}
