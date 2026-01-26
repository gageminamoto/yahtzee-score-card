/**
 * Game History page that displays past completed games
 * Shows winner, scores, and date for each game
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Button, Card } from '../components';
import { getColorByScheme, getTextColorForBackground } from '../utils/colors';
import { useSettings } from '../context/SettingsContext';
import { loadGameHistory, clearGameHistory } from '../utils/storage';

export default function GameHistory({ onBack, colorIndex }) {
  const { settings } = useSettings();
  const [games, setGames] = useState([]);
  const [expandedGameId, setExpandedGameId] = useState(null);
  const backgroundColor = getColorByScheme(colorIndex, settings.visual.colorScheme);
  const textColor = getTextColorForBackground(backgroundColor);

  // Sync background color to html/body for overscroll
  useEffect(() => {
    document.documentElement.style.setProperty('--page-bg', backgroundColor);
  }, [backgroundColor]);

  // Load game history on mount
  useEffect(() => {
    setGames(loadGameHistory());
  }, []);

  // Format date to readable string
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Format relative time (e.g., "2 hours ago")
  const formatRelativeTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDate(timestamp);
  };

  // Handle clearing all history
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all game history? This cannot be undone.')) {
      clearGameHistory();
      setGames([]);
    }
  };

  // Toggle expanded game details
  const toggleExpanded = (gameId) => {
    setExpandedGameId(expandedGameId === gameId ? null : gameId);
  };

  return (
    <div
      className="min-h-dvh p-4 md:p-8 transition-colors duration-500"
      style={{ backgroundColor }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="font-sans text-body hover:opacity-70 transition-opacity flex items-center gap-2"
            style={{ color: textColor }}
          >
            <Icon icon="basil:arrow-left-solid" className="w-6 h-6" />
            Back
          </button>
          <h1
            className="font-serif text-subtitle md:text-title text-balance"
            style={{ color: textColor }}
          >
            HISTORY
          </h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>

        {/* Empty State */}
        {games.length === 0 && (
          <Card padding="medium">
            <div className="text-center py-12">
              <Icon
                icon="basil:clipboard-list-solid"
                className="w-16 h-16 mx-auto mb-4 opacity-50"
                style={{ color: textColor }}
              />
              <p
                className="font-sans text-body-lg mb-2"
                style={{ color: textColor }}
              >
                No games played yet
              </p>
              <p
                className="font-sans text-body opacity-70"
                style={{ color: textColor }}
              >
                Complete a game to see it here
              </p>
            </div>
          </Card>
        )}

        {/* Games List */}
        {games.length > 0 && (
          <div className="space-y-4">
            {/* Stats Summary */}
            <Card padding="medium">
              <div className="flex justify-between items-center">
                <div>
                  <p
                    className="font-sans text-body opacity-70"
                    style={{ color: textColor }}
                  >
                    Total Games
                  </p>
                  <p
                    className="font-serif text-title"
                    style={{ color: textColor }}
                  >
                    {games.length}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="small"
                  onClick={handleClearHistory}
                >
                  Clear All
                </Button>
              </div>
            </Card>

            {/* Game Cards */}
            {games.map((game) => {
              const winner = game.players?.reduce((prev, current) =>
                (prev.totalScore > current.totalScore) ? prev : current
              );
              const isExpanded = expandedGameId === game.gameId;

              return (
                <Card key={game.gameId} padding="medium">
                  {/* Game Summary Row */}
                  <button
                    className="w-full text-left"
                    onClick={() => toggleExpanded(game.gameId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Winner Color */}
                        <div
                          className="w-12 h-12 rounded-full flex-shrink-0 border-2 border-white/20 dark:border-black/20"
                          style={{ backgroundColor: winner?.color }}
                        />
                        {/* Winner Info */}
                        <div>
                          <p
                            className="font-sans text-body-lg font-bold"
                            style={{ color: textColor }}
                          >
                            {winner?.name || 'Unknown'}
                          </p>
                          <p
                            className="font-sans text-ui opacity-70"
                            style={{ color: textColor }}
                          >
                            {winner?.totalScore} pts • {game.players?.length || 0} players
                          </p>
                        </div>
                      </div>
                      {/* Time & Expand */}
                      <div className="flex items-center gap-3">
                        <span
                          className="font-sans text-ui opacity-60"
                          style={{ color: textColor }}
                        >
                          {formatRelativeTime(game.completedAt)}
                        </span>
                        <Icon
                          icon={isExpanded ? 'basil:chevron-up-solid' : 'basil:chevron-down-solid'}
                          className="w-5 h-5 opacity-60"
                          style={{ color: textColor }}
                        />
                      </div>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-white/20 dark:border-black/20">
                      {/* Full date */}
                      <p
                        className="font-sans text-ui opacity-60 mb-4"
                        style={{ color: textColor }}
                      >
                        {formatDate(game.completedAt)}
                      </p>

                      {/* All Players Scores */}
                      <div className="space-y-2">
                        {game.players
                          ?.slice()
                          .sort((a, b) => b.totalScore - a.totalScore)
                          .map((player, index) => (
                            <div
                              key={player.id}
                              className={`flex items-center justify-between py-2 px-3 rounded ${
                                index === 0 ? 'bg-white/10 dark:bg-black/10' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className="font-sans text-ui opacity-60 w-6"
                                  style={{ color: textColor }}
                                >
                                  #{index + 1}
                                </span>
                                <div
                                  className="w-6 h-6 rounded-full"
                                  style={{ backgroundColor: player.color }}
                                />
                                <span
                                  className="font-sans text-body"
                                  style={{ color: textColor }}
                                >
                                  {player.name}
                                </span>
                              </div>
                              <span
                                className="font-serif text-body font-bold tabular-nums"
                                style={{ color: textColor }}
                              >
                                {player.totalScore}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

GameHistory.propTypes = {
  onBack: PropTypes.func.isRequired,
  colorIndex: PropTypes.number.isRequired,
};
