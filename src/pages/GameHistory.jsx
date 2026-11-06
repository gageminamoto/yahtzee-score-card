import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Button, Card, ConfirmDialog, PageHeader } from '../components';
import { usePageSurface } from '../hooks/useSurface';
import { loadGameHistory, deleteGameFromHistory, clearGameHistory } from '../utils/storage';

export default function GameHistory({ onBack, colorIndex }) {
  const { style: surfaceStyle } = usePageSurface(colorIndex);

  const [games, setGames] = useState(() => loadGameHistory());
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showClearAll, setShowClearAll] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

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
      className="min-h-dvh p-4 md:p-8 text-fg transition-colors duration-500"
      style={surfaceStyle}
    >
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="HISTORY"
          onBack={onBack}
          className="mb-6"
          actions={games.length > 0 && (
            <Button variant="ghost" size="small" onClick={() => setShowClearAll(true)}>
              <Icon icon="basil:trash-solid" className="w-4 h-4" />
              Clear All
            </Button>
          )}
        />

        {/* Content */}
        {games.length === 0 ? (
          <Card padding="large" className="text-center">
            <Icon
              icon="basil:document-solid"
              className="w-16 h-16 mx-auto mb-4 text-fg/70"
            />
            <p className="font-serif text-subtitle mb-2">
              No games yet
            </p>
            <p className="font-sans text-body text-fg/70">
              Completed games will appear here.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {games.map((game) => {
              const sorted = [...game.players].sort(
                (a, b) => b.totalScore - a.totalScore
              );
              return (
                <Card key={game.gameId} padding="medium">
                  {/* Date and delete row */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-sans text-body font-bold">
                        {formatDate(game.completedAt)}
                      </p>
                      <p className="font-sans text-ui text-fg/70">
                        {formatTime(game.completedAt)}
                      </p>
                    </div>
                    <div className="relative" ref={openMenuId === game.gameId ? menuRef : undefined}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setOpenMenuId(openMenuId === game.gameId ? null : game.gameId)}
                        className="-mr-3 -mt-3 text-fg/70 hover:text-fg"
                        aria-label="Game options"
                        aria-expanded={openMenuId === game.gameId}
                      >
                        <Icon icon="basil:other-1-solid" className="w-5 h-5" />
                      </Button>
                      {openMenuId === game.gameId && (
                        <div className="absolute right-0 top-full mt-1 bg-fg text-surface shadow-lg z-dropdown min-w-[140px]" style={{ animation: '100ms ease-out fadeIn' }}>
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              handleDelete(game.gameId);
                            }}
                            className="w-full px-4 py-3 text-left font-sans text-body font-bold hover:bg-surface/10 transition-colors flex items-center gap-2"
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
                                  aria-label="Winner"
                                />
                              ) : (
                                <span className="font-sans text-ui text-fg/70">
                                  {index + 1}
                                </span>
                              )}
                            </span>
                            <div
                              className="w-6 h-6 rounded-full shrink-0"
                              style={{ backgroundColor: player.color }}
                            />
                            <span className="font-sans text-body">
                              {player.name?.trim() || `Player ${player.id}`}
                            </span>
                          </div>
                          <span className="font-sans text-body font-bold tabular-nums">
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
