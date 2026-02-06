import { useState, useEffect, useCallback, useMemo } from 'react';
import { Icon } from '@iconify/react';
import QRCode from 'qrcode';
import { Button, Input, PlayerColorPicker } from '../components';
import { getColorByScheme, getPlayerColorByScheme, getTextColorForBackground } from '../utils/colors';
import { useSettings } from '../context/SettingsContext';
import { useSession } from '../context/SessionContext';

export default function MultiDeviceHost({ onBack, onGameStart, colorIndex, embedded = false }) {
  const { settings } = useSettings();
  const colorScheme = settings.visual.colorScheme;
  const backgroundColor = getColorByScheme(colorIndex, colorScheme);
  const textColor = getTextColorForBackground(backgroundColor);

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

  // Sync background color to html/body for overscroll
  useEffect(() => {
    if (!embedded) {
      document.documentElement.style.setProperty('--page-bg', backgroundColor);
    }
  }, [backgroundColor, embedded]);

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
      <div
        className="min-h-dvh p-8 transition-colors duration-500"
        style={{ backgroundColor }}
      >
        {children}
      </div>
    );
  };

  // Pre-session: name + color entry
  if (!sessionCode) {
    return wrapPage(
      <div className="max-w-2xl mx-auto">
        {!embedded && (
          <>
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
              HOST GAME
            </h1>
            <p
              className="font-sans text-body opacity-90 mb-12 text-pretty"
              style={{ color: textColor }}
            >
              Create a session for others to join
            </p>
          </>
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
                textColor={textColor}
              />
            </div>
          </div>
        </div>

        {error && (
          <p
            className="font-sans text-body mb-4 text-center"
            style={{ color: textColor }}
          >
            {error}
          </p>
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
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-white/95 dark:bg-black/90">
          <div className="max-w-md w-full text-center">
            <h1 className="font-serif text-title text-black dark:text-white mb-3">Session Cancelled</h1>
            <p className="font-sans text-body text-black/70 dark:text-white/70 mb-6">
              The host ended the session. You can return home to start a new game.
            </p>
            <Button variant="solid" size="large" fullWidth onClick={handleSessionCancelled}>
              Return Home
            </Button>
          </div>
        </div>
      )}
      {!isConnected && sessionCode && (
        <div
          className="mb-4 text-center py-2 px-4 rounded-lg bg-bright-red/90"
          role="alert"
          aria-live="assertive"
        >
          <p className="font-sans text-ui font-bold text-white">
            Connection lost — reconnecting...
          </p>
        </div>
      )}

      <button
        onClick={handleBack}
        className="font-sans text-body mb-8 hover:opacity-70 transition-opacity flex items-center gap-2"
        style={{ color: textColor }}
      >
        <Icon icon="basil:arrow-left-solid" className="w-6 h-6" />
        Cancel
      </button>

      {/* Session Code */}
      <div className="text-center mb-8">
        <p
          className="font-sans text-body-lg uppercase tracking-widest opacity-80 mb-2"
          style={{ color: textColor }}
        >
          Session Code
        </p>
        <p
          className="font-mono text-[3rem] md:text-[4rem] font-bold tracking-[0.3em] leading-none mb-4 select-all"
          style={{ color: textColor }}
        >
          {sessionCode}
        </p>
        <Button
          variant="outline"
          size="small"
          onClick={handleCopyCode}
          textColor={textColor}
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </Button>
      </div>

      {/* QR Code */}
      {qrDataUrl && (
        <div className="flex justify-center mb-8">
          <div className="bg-white p-3 rounded-lg">
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
        <p
          className="font-sans text-body-lg font-bold uppercase tracking-wider mb-4"
          style={{ color: textColor }}
        >
          Players ({players.length}/6)
        </p>
        {canReorder && (
          <p className="font-sans text-ui opacity-70 mb-3" style={{ color: textColor }}>
            Drag the handle to set turn order
          </p>
        )}
        <div className="space-y-3">
          {orderedPlayers.map((player) => (
            <div
              key={player.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-shadow ${
                dropTargetId === player.id ? 'ring-2 ring-white/50 dark:ring-black/50' : ''
              } ${draggedPlayerId === player.id ? 'opacity-60' : ''}`}
              style={{
                backgroundColor: textColor === '#000000'
                  ? 'rgba(0, 0, 0, 0.08)'
                  : 'rgba(255, 255, 255, 0.12)',
              }}
              onDragOver={handleDragOver(player.id)}
              onDrop={handleDrop(player.id)}
              aria-grabbed={draggedPlayerId === player.id}
            >
              {canReorder && (
                <div
                  className="flex flex-col gap-1 mr-1 cursor-grab active:cursor-grabbing"
                  aria-hidden="true"
                  draggable
                  onDragStart={handleDragStart(player.id)}
                  onDragEnd={handleDragEnd}
                >
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: textColor === '#000000' ? 'rgba(0, 0, 0, 0.45)' : 'rgba(255, 255, 255, 0.6)',
                      }}
                    />
                  ))}
                </div>
              )}
              <div
                className="w-8 h-8 rounded-full shrink-0"
                style={{ backgroundColor: player.color }}
              />
              <span
                className="font-sans text-body font-bold flex-1"
                style={{ color: textColor }}
              >
                {player.name}
              </span>
              {player.isHost && (
                <span
                  className="font-sans text-ui uppercase opacity-60"
                  style={{ color: textColor }}
                >
                  Host
                </span>
              )}
              <div
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  player.isConnected ? 'bg-bright-green' : 'bg-bright-red'
                }`}
                aria-label={player.isConnected ? 'Connected' : 'Disconnected'}
              />
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p
          className="font-sans text-body mb-4 text-center"
          style={{ color: textColor }}
        >
          {error}
        </p>
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
        <p
          className="font-sans text-ui opacity-70 text-center mt-4"
          style={{ color: textColor }}
        >
          Waiting for at least 2 players to join...
        </p>
      )}
    </div>
  );
}
