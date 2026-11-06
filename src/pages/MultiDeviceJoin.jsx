import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button, Input, PageHeader, PlayerColorPicker } from '../components';
import LobbyPlayerRow from '../components/LobbyPlayerRow';
import { SessionCancelledOverlay, ConnectionLostBanner } from '../components/SessionNotices';
import { getPlayerColorByScheme } from '../utils/colors';
import { useSettings } from '../context/SettingsContext';
import { useSession } from '../context/SessionContext';
import { usePageSurface } from '../hooks/useSurface';

const CODE_LENGTH = 6;

export default function MultiDeviceJoin({ onBack, onGameStart, colorIndex, initialCode = '', embedded = false }) {
  const { settings } = useSettings();
  const colorScheme = settings.visual.colorScheme;
  const { style: pageStyle } = usePageSurface(colorIndex);

  const {
    sessionCode: activeSession,
    playerId,
    players,
    sessionStatus,
    turnOrder,
    isConnected,
    error,
    joinGame,
    leaveGame,
    clearError,
  } = useSession();

  const orderedPlayers = useMemo(() => {
    if (!players || players.length === 0) return [];
    if (!Array.isArray(turnOrder) || turnOrder.length === 0) return players;
    const byId = new Map(players.map((player) => [player.id, player]));
    const ordered = turnOrder.map((id) => byId.get(id)).filter(Boolean);
    const missing = players.filter((player) => !turnOrder.includes(player.id));
    return [...ordered, ...missing];
  }, [players, turnOrder]);

  const [code, setCode] = useState(() => {
    // Pre-fill from initialCode prop (from ?join= URL param)
    const cleaned = (initialCode || '').toUpperCase().replace(/[^A-Z2-9]/g, '');
    return cleaned.slice(0, CODE_LENGTH).split('');
  });
  const [playerName, setPlayerName] = useState('');
  const [playerColor, setPlayerColor] = useState(getPlayerColorByScheme(1, colorScheme));
  const [isJoining, setIsJoining] = useState(false);
  const inputRefs = useRef([]);

  // When game status changes to "playing", notify parent
  useEffect(() => {
    if (sessionStatus === 'playing' && playerId) {
      onGameStart();
    }
  }, [sessionStatus, playerId, onGameStart]);

  // Pad code array to CODE_LENGTH
  const paddedCode = [...code, ...Array(CODE_LENGTH - code.length).fill('')];
  const codeString = paddedCode.join('');
  const isCodeComplete = paddedCode.every((c) => c !== '');

  const handleCodeInput = useCallback((index, value) => {
    // Only allow valid characters
    const char = value.toUpperCase().replace(/[^A-Z2-9]/g, '');
    if (!char) return;

    setCode((prev) => {
      const next = [...prev, ...Array(CODE_LENGTH - prev.length).fill('')];
      next[index] = char[0];
      return next;
    });

    // Auto-advance to next input
    if (index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      setCode((prev) => {
        const next = [...prev, ...Array(CODE_LENGTH - prev.length).fill('')];
        if (next[index]) {
          next[index] = '';
        } else if (index > 0) {
          next[index - 1] = '';
          inputRefs.current[index - 1]?.focus();
        }
        return next;
      });
    }
  }, []);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z2-9]/g, '');
    if (!pasted) return;

    const chars = pasted.slice(0, CODE_LENGTH).split('');
    setCode(chars);

    // Focus the next empty slot or the last one
    const focusIndex = Math.min(chars.length, CODE_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  }, []);

  const handleJoin = useCallback(async () => {
    if (!isCodeComplete) return;
    setIsJoining(true);
    clearError();
    try {
      await joinGame(codeString, playerName || 'Player', playerColor);
    } catch {
      // Error is set in context
    } finally {
      setIsJoining(false);
    }
  }, [isCodeComplete, codeString, playerName, playerColor, joinGame, clearError]);

  const handleBack = useCallback(async () => {
    if (activeSession) {
      await leaveGame();
    }
    onBack();
  }, [activeSession, leaveGame, onBack]);

  const handleSessionCancelled = useCallback(async () => {
    await leaveGame();
    onBack();
  }, [leaveGame, onBack]);

  // Colors already taken by other players in the session
  const takenColors = orderedPlayers.map((p) => p.color);

  const wrapPage = (children) => {
    if (embedded) return children;
    return (
      <div className="min-h-dvh p-8 text-fg transition-colors duration-500" style={pageStyle}>
        {children}
      </div>
    );
  };

  // Lobby view (after successfully joining)
  if (activeSession && playerId) {
    return wrapPage(
      <div className="max-w-2xl mx-auto">
        {sessionStatus === 'cancelled' && (
          <SessionCancelledOverlay onReturnHome={handleSessionCancelled} />
        )}
        {!isConnected && <ConnectionLostBanner />}

        <PageHeader
          title="WAITING"
          description="Waiting for host to start the game..."
          onBack={handleBack}
          backLabel="Leave"
        />

        {/* Session Code Display */}
        <div className="text-center mb-8">
          <p className="font-sans text-ui uppercase tracking-widest text-fg/70 mb-1">
            Session
          </p>
          <p className="font-mono text-title font-bold tracking-[0.2em]">
            {activeSession}
          </p>
        </div>

        {/* Player List */}
        <div>
          <p className="font-sans text-body-lg font-bold uppercase tracking-wider mb-4">
            Players ({players.length}/6)
          </p>
          <div className="space-y-3">
            {orderedPlayers.map((player) => (
              <LobbyPlayerRow key={player.id} player={player} isYou={player.id === playerId} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Join form
  return wrapPage(
    <div className="max-w-2xl mx-auto">
      {sessionStatus === 'cancelled' && (
          <SessionCancelledOverlay onReturnHome={handleSessionCancelled} />
        )}
      {!embedded && (
        <PageHeader
          title="JOIN GAME"
          description="Enter the 6-character code to join a session"
          onBack={onBack}
          className="mb-10"
        />
      )}

      {/* Code Input */}
      <div className="flex justify-center gap-2 mb-10" onPaste={handlePaste}>
        {paddedCode.map((char, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="text"
            maxLength={1}
            value={char}
            onChange={(e) => handleCodeInput(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            autoFocus={index === 0 && !initialCode}
            className="w-12 h-16 md:w-14 md:h-18 text-center font-mono text-title font-bold uppercase border-2 border-fg/40 bg-fg/10 text-fg outline-none focus:border-fg transition-[border-color,background-color] duration-100"
            aria-label={`Code character ${index + 1}`}
          />
        ))}
      </div>

      {/* Player Setup */}
      <div className="space-y-6 mb-8">
        <div className="flex items-center gap-4">
          <PlayerColorPicker
            currentColor={playerColor}
            usedColors={takenColors.length > 0 ? takenColors : [playerColor]}
            colorScheme={colorScheme}
            onColorChange={setPlayerColor}
          />
          <div className="flex-1">
            <Input
              placeholder="Your Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="font-sans text-body mb-4 text-center font-bold">{error}</p>
      )}

      <Button
        variant="solid"
        size="large"
        fullWidth
        onClick={handleJoin}
        disabled={!isCodeComplete || isJoining}
      >
        {isJoining ? 'Joining...' : 'Join Game'}
      </Button>
    </div>
  );
}
