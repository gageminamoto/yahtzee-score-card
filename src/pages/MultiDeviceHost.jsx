import { useState, useEffect, useCallback, useMemo } from 'react';
import QRCode from 'qrcode';
import { Button, Input, PageHeader, PlayerColorPicker } from '../components';
import LobbyPlayerRow from '../components/LobbyPlayerRow';
import { SessionCancelledOverlay, ConnectionLostBanner } from '../components/SessionNotices';
import { getPlayerColorByScheme } from '../utils/colors';
import { useSettings } from '../context/SettingsContext';
import { useSession } from '../context/SessionContext';
import { usePageSurface } from '../hooks/useSurface';

export default function MultiDeviceHost({ onBack, onGameStart, colorIndex, embedded = false }) {
  const { settings } = useSettings();
  const colorScheme = settings.visual.colorScheme;
  const { style: pageStyle } = usePageSurface(colorIndex);

  const {
    sessionCode,
    players,
    sessionStatus,
    turnOrder,
    isHost,
    isConnected,
    error,
    hostGame,
    startGame,
    leaveGame,
    clearError,
    updateTurnOrder,
  } = useSession();

  const [hostName, setHostName] = useState('');
  const [hostColor, setHostColor] = useState(getPlayerColorByScheme(0, colorScheme));
  const [isCreating, setIsCreating] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const [draggedPlayerId, setDraggedPlayerId] = useState(null);
  const [dropTargetId, setDropTargetId] = useState(null);

  const orderedPlayers = useMemo(() => {
    if (!players || players.length === 0) return [];
    if (!Array.isArray(turnOrder) || turnOrder.length === 0) return players;
    const byId = new Map(players.map((player) => [player.id, player]));
    const ordered = turnOrder.map((id) => byId.get(id)).filter(Boolean);
    const missing = players.filter((player) => !turnOrder.includes(player.id));
    return [...ordered, ...missing];
  }, [players, turnOrder]);

  // Generate QR code when session is created
  useEffect(() => {
    if (!sessionCode) return;
    const url = `${window.location.origin}?join=${sessionCode}`;
    QRCode.toDataURL(url, {
      width: 200,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    }).then(setQrDataUrl).catch(() => {});
  }, [sessionCode]);

  // When game status changes to "playing", notify parent
  useEffect(() => {
    if (sessionStatus === 'playing' && isHost) {
      onGameStart();
    }
  }, [sessionStatus, isHost, onGameStart]);

  const handleCreateSession = useCallback(async () => {
    setIsCreating(true);
    clearError();
    try {
      await hostGame(hostName || 'Host', hostColor, {
        upperBonusThreshold: settings.gameRules.upperBonusThreshold,
        bonusPoints: settings.gameRules.upperBonusPoints,
        turnMode: 'strict',
      });
    } catch {
      // Error is set in context
    } finally {
      setIsCreating(false);
    }
  }, [hostName, hostColor, settings, hostGame, clearError]);

  const handleCopyCode = useCallback(async () => {
    if (!sessionCode) return;
    try {
      await navigator.clipboard.writeText(sessionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may not be available
    }
  }, [sessionCode]);

  const handleBack = useCallback(async () => {
    if (sessionCode) {
      await leaveGame();
    }
    onBack();
  }, [sessionCode, leaveGame, onBack]);

  const handleStartGame = useCallback(async () => {
    await startGame();
  }, [startGame]);

  const canStart = players.length >= 2;
  const canReorder = isHost && sessionStatus === 'lobby' && orderedPlayers.length > 1;

  const handleDragStart = useCallback((playerId) => (event) => {
    if (!canReorder) return;
    setDraggedPlayerId(playerId);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', playerId);
  }, [canReorder]);

  const handleDragOver = useCallback((playerId) => (event) => {
    if (!canReorder || playerId === draggedPlayerId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDropTargetId(playerId);
  }, [canReorder, draggedPlayerId]);

  const handleDragEnd = useCallback(() => {
    setDraggedPlayerId(null);
    setDropTargetId(null);
  }, []);

  const handleDrop = useCallback((targetId) => async (event) => {
    if (!canReorder) return;
    event.preventDefault();
    const sourceId = draggedPlayerId || event.dataTransfer.getData('text/plain');
    if (!sourceId || sourceId === targetId) return;

    const currentOrder = orderedPlayers.map((player) => player.id);
    const fromIndex = currentOrder.indexOf(sourceId);
    const toIndex = currentOrder.indexOf(targetId);
    if (fromIndex < 0 || toIndex < 0) return;

    const nextOrder = [...currentOrder];
    nextOrder.splice(fromIndex, 1);
    nextOrder.splice(toIndex, 0, sourceId);

    setDraggedPlayerId(null);
    setDropTargetId(null);
    try {
      await updateTurnOrder(nextOrder);
    } catch {
      // Error handled in context
    }
  }, [canReorder, draggedPlayerId, orderedPlayers, updateTurnOrder]);

  const handleSessionCancelled = useCallback(async () => {
    await leaveGame();
    onBack();
  }, [leaveGame, onBack]);

  const wrapPage = (children) => {
    if (embedded) return children;
    return (
      <div className="min-h-dvh p-8 text-fg transition-colors duration-500" style={pageStyle}>
        {children}
      </div>
    );
  };

  // Pre-session: name + color entry
  if (!sessionCode) {
    return wrapPage(
      <div className="max-w-2xl mx-auto">
        {!embedded && (
          <PageHeader
            title="HOST GAME"
            description="Create a session for others to join"
            onBack={onBack}
            className="mb-12"
          />
        )}

        <div className="space-y-6 mb-8">
          <div className="flex items-center gap-4">
            <PlayerColorPicker
              currentColor={hostColor}
              usedColors={[hostColor]}
              colorScheme={colorScheme}
              onColorChange={setHostColor}
            />
            <div className="flex-1">
              <Input
                placeholder="Your Name"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                maxLength={20}
                autoFocus
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="font-sans text-body mb-4 text-center">{error}</p>
        )}

        <Button
          variant="solid"
          size="large"
          fullWidth
          onClick={handleCreateSession}
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Create Session'}
        </Button>
      </div>
    );
  }

  // Post-session: lobby with code, QR, player list
  return wrapPage(
    <div className="max-w-2xl mx-auto">
      {sessionStatus === 'cancelled' && (
        <SessionCancelledOverlay onReturnHome={handleSessionCancelled} />
      )}
      {!isConnected && sessionCode && <ConnectionLostBanner />}

      <PageHeader onBack={handleBack} backLabel="Cancel" />

      {/* Session Code */}
      <div className="text-center mb-8">
        <p className="font-sans text-ui uppercase tracking-widest text-fg/70 mb-2">
          Session Code
        </p>
        <p className="font-mono text-subtitle md:text-title font-bold tracking-[0.3em] leading-none mb-4 select-all">
          {sessionCode}
        </p>
        <Button variant="outline" size="small" onClick={handleCopyCode}>
          {copied ? 'Copied!' : 'Copy Code'}
        </Button>
      </div>

      {/* QR Code */}
      {qrDataUrl && (
        <div className="flex justify-center mb-8">
          <div className="bg-white p-3">
            <img
              src={qrDataUrl}
              alt={`QR code to join session ${sessionCode}`}
              className="w-[200px] h-[200px]"
            />
          </div>
        </div>
      )}

      {/* Player List */}
      <div className="mb-8">
        <p className="font-sans text-body-lg font-bold uppercase tracking-wider mb-4">
          Players ({players.length}/6)
        </p>
        {canReorder && (
          <p className="font-sans text-ui text-fg/70 mb-3">
            Drag the handle to set turn order
          </p>
        )}
        <div className="space-y-3">
          {orderedPlayers.map((player) => (
            <LobbyPlayerRow
              key={player.id}
              player={player}
              className={`transition-shadow ${dropTargetId === player.id ? 'ring-2 ring-fg/40' : ''} ${draggedPlayerId === player.id ? 'opacity-60' : ''}`}
              onDragOver={handleDragOver(player.id)}
              onDrop={handleDrop(player.id)}
              aria-grabbed={draggedPlayerId === player.id}
              leading={canReorder && (
                <div
                  className="flex flex-col gap-1 mr-1 cursor-grab active:cursor-grabbing"
                  aria-hidden="true"
                  draggable
                  onDragStart={handleDragStart(player.id)}
                  onDragEnd={handleDragEnd}
                >
                  {[0, 1, 2].map((dot) => (
                    <span key={dot} className="w-1.5 h-1.5 rounded-full bg-fg/70" />
                  ))}
                </div>
              )}
            />
          ))}
        </div>
      </div>

      {error && (
        <p className="font-sans text-body mb-4 text-center">{error}</p>
      )}

      {/* Start Game */}
      <Button
        variant="solid"
        size="large"
        fullWidth
        onClick={handleStartGame}
        disabled={!canStart}
      >
        Start Game
      </Button>

      {!canStart && (
        <p className="font-sans text-ui text-fg/70 text-center mt-4">
          Waiting for at least 2 players to join...
        </p>
      )}
    </div>
  );
}
