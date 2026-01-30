import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Card, ConfirmDialog } from '../components';
import { getColorByScheme, getTextColorForBackground } from '../utils/colors';
import { useSettings } from '../context/SettingsContext';
import { loadGameHistory, deleteGameFromHistory, clearGameHistory } from '../utils/storage';

export default function GameHistory({ onBack, colorIndex }) {
  const { settings } = useSettings();
  const backgroundColor = getColorByScheme(colorIndex, settings.visual.colorScheme);
  const textColor = getTextColorForBackground(backgroundColor);

  const [games, setGames] = useState(() => loadGameHistory());
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showClearAll, setShowClearAll] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--page-bg', backgroundColor);
  }, [backgroundColor]);

  // Close menu when clicking outside
  const handleClickOutside = useCallback((e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpenMenuId(null);
    }
  }, []);

  useEffect(() => {
    if (openMenuId !== null) {
      document.addEventListener('pointerdown', handleClickOutside);
      return () => document.removeEventListener('pointerdown', handleClickOutside);
    }
  }, [openMenuId, handleClickOutside]);

  const handleDelete = (gameId) => {
    setDeleteTarget(gameId);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteGameFromHistory(deleteTarget);
      setGames(prev => prev.filter(g => g.gameId !== deleteTarget));
    }
    setDeleteTarget(null);
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleConfirmClearAll = () => {
    clearGameHistory();
    setGames([]);
    setShowClearAll(false);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
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
          <div className="w-20" />
        </div>

        {/* Content */}
        {games.length === 0 ? (
          <Card padding="large" className="text-center">
            <Icon
              icon="basil:document-outline"
              className="w-16 h-16 mx-auto mb-4 opacity-50 text-white dark:text-black"
            />
            <p className="font-sans text-subtitle mb-2 text-white dark:text-black">
              No games yet
            </p>
            <p className="font-sans text-body opacity-70 text-white dark:text-black">
              Completed games will appear here.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowClearAll(true)}
                className="font-sans text-ui opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1.5"
                style={{ color: textColor }}
              >
                <Icon icon="basil:trash-solid" className="w-4 h-4" />
                Clear All
              </button>
            </div>
            {games.map((game) => {
              const sorted = [...game.players].sort(
                (a, b) => b.totalScore - a.totalScore
              );
              return (
                <Card key={game.gameId} padding="medium">
                  {/* Date and delete row */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-sans text-body font-bold text-white dark:text-black">
                        {formatDate(game.completedAt)}
                      </p>
                      <p className="font-sans text-ui opacity-60 text-white dark:text-black">
                        {formatTime(game.completedAt)}
                      </p>
                    </div>
                    <div className="relative" ref={openMenuId === game.gameId ? menuRef : undefined}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === game.gameId ? null : game.gameId)}
                        className="p-2 -mr-2 -mt-2 opacity-60 hover:opacity-100 transition-opacity text-white dark:text-black"
                        aria-label="Game options"
                      >
                        <Icon
                          icon="basil:other-1-outline"
                          className="w-5 h-5"
                        />
                      </button>
                      {openMenuId === game.gameId && (
                        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-black shadow-lg z-dropdown min-w-[140px]" style={{ animation: '100ms ease-out fadeIn' }}>
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              handleDelete(game.gameId);
                            }}
                            className="w-full px-4 py-3 text-left font-sans text-body text-red-600 dark:text-red-400 hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
                          >
                            <Icon icon="basil:trash-solid" className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Player scores */}
                  <div className="space-y-2">
                    {sorted.map((player, index) => {
                      const topScore = sorted[0].totalScore;
                      const isWinner = player.totalScore === topScore;

                      return (
                        <div
                          key={player.id}
                          className="flex items-center justify-between py-1"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 flex items-center justify-center shrink-0">
                              {isWinner ? (
                                <Icon
                                  icon="mdi:trophy"
                                  className="w-5 h-5"
                                  style={{ color: '#facc15' }}
                                />
                              ) : (
                                <span className="font-sans text-ui opacity-50 text-white dark:text-black">
                                  {index + 1}
                                </span>
                              )}
                            </span>
                            <div
                              className="w-6 h-6 rounded-full shrink-0"
                              style={{ backgroundColor: player.color }}
                            />
                            <span className="font-sans text-body text-white dark:text-black">
                              {player.name?.trim() || `Player ${player.id}`}
                            </span>
                          </div>
                          <span className="font-sans text-body font-bold tabular-nums text-white dark:text-black">
                            {player.totalScore}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete Game?"
        message="This game will be permanently removed from your history."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Clear all confirmation */}
      <ConfirmDialog
        isOpen={showClearAll}
        title="Clear History?"
        message="All games will be permanently removed from your history."
        confirmText="Clear All"
        cancelText="Cancel"
        onConfirm={handleConfirmClearAll}
        onCancel={() => setShowClearAll(false)}
      />
    </div>
  );
}

GameHistory.propTypes = {
  onBack: PropTypes.func.isRequired,
  colorIndex: PropTypes.number.isRequired,
};
