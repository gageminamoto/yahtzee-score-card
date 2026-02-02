import { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { Button, Input, PlayerColorPicker } from '../components';
import { getColorByScheme, getPlayerColorByScheme, getTextColorForBackground } from '../utils/colors';
import { useSettings } from '../context/SettingsContext';
import { useSession } from '../context/SessionContext';

const CODE_LENGTH = 6;

export default function MultiDeviceJoin({ onBack, onGameStart, colorIndex, initialCode = '', embedded = false }) {
  const { settings } = useSettings();
  const colorScheme = settings.visual.colorScheme;
  const backgroundColor = getColorByScheme(colorIndex, colorScheme);
  const textColor = getTextColorForBackground(backgroundColor);

  const {
    sessionCode: activeSession,
    playerId,
    players,
    sessionStatus,
    isConnected,
    error,
    joinGame,
    leaveGame,
    clearError,
  } = useSession();

  const [code, setCode] = useState(() => {
    // Pre-fill from initialCode prop (from ?join= URL param)
    const cleaned = (initialCode || '').toUpperCase().replace(/[^A-Z2-9]/g, '');
    return cleaned.slice(0, CODE_LENGTH).split('');
  });
  const [playerName, setPlayerName] = useState('');
  const [playerColor, setPlayerColor] = useState(getPlayerColorByScheme(1, colorScheme));
  const [isJoining, setIsJoining] = useState(false);
  const inputRefs = useRef([]);

  // Sync background color to html/body for overscroll
  useEffect(() => {
    if (!embedded) {
      document.documentElement.style.setProperty('--page-bg', backgroundColor);
    }
  }, [backgroundColor, embedded]);

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

  // Colors already taken by other players in the session
  const takenColors = players.map((p) => p.color);

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

  // Lobby view (after successfully joining)
  if (activeSession && playerId) {
    return wrapPage(
      <div className="max-w-2xl mx-auto">
        {!isConnected && (
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
          Leave
        </button>

        <div className="text-center mb-8">
          <Icon
            icon="basil:clock-solid"
            className="w-12 h-12 mx-auto mb-4 opacity-60"
            style={{ color: textColor }}
          />
          <h1
            className="font-serif text-title md:text-headline mb-2 text-balance"
            style={{ color: textColor }}
          >
            WAITING
          </h1>
          <p
            className="font-sans text-body opacity-80 text-pretty"
            style={{ color: textColor }}
          >
            Waiting for host to start the game...
          </p>
        </div>

        {/* Session Code Display */}
        <div className="text-center mb-8">
          <p
            className="font-sans text-ui uppercase tracking-widest opacity-60 mb-1"
            style={{ color: textColor }}
          >
            Session
          </p>
          <p
            className="font-mono text-title font-bold tracking-[0.2em]"
            style={{ color: textColor }}
          >
            {activeSession}
          </p>
        </div>

        {/* Player List */}
        <div>
          <p
            className="font-sans text-body-lg font-bold uppercase tracking-wider mb-4"
            style={{ color: textColor }}
          >
            Players ({players.length}/6)
          </p>
          <div className="space-y-3">
            {players.map((player) => {
              const isYou = player.id === playerId;
              return (
                <div
                  key={player.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg"
                  style={{
                    backgroundColor: isYou
                      ? (textColor === '#000000'
                        ? 'rgba(0, 0, 0, 0.15)'
                        : 'rgba(255, 255, 255, 0.2)')
                      : (textColor === '#000000'
                        ? 'rgba(0, 0, 0, 0.08)'
                        : 'rgba(255, 255, 255, 0.12)'),
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full shrink-0"
                    style={{ backgroundColor: player.color }}
                  />
                  <span
                    className="font-sans text-body font-bold flex-1"
                    style={{ color: textColor }}
                  >
                    {player.name}
                    {isYou && (
                      <span className="opacity-60 font-normal ml-2">(You)</span>
                    )}
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
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Join form
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
            JOIN GAME
          </h1>
          <p
            className="font-sans text-body opacity-90 mb-10 text-pretty"
            style={{ color: textColor }}
          >
            Enter the 6-character code to join a session
          </p>
        </>
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
            className="w-12 h-16 md:w-14 md:h-18 text-center font-mono text-title font-bold border-2 rounded-lg outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent transition-[border-color,background-color,box-shadow] duration-100 uppercase"
            style={{
              borderColor: textColor === '#000000'
                ? 'rgba(0, 0, 0, 0.3)'
                : 'rgba(255, 255, 255, 0.4)',
              backgroundColor: textColor === '#000000'
                ? 'rgba(0, 0, 0, 0.08)'
                : 'rgba(255, 255, 255, 0.12)',
              color: textColor,
              '--tw-ring-color': textColor,
            }}
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
              textColor={textColor}
            />
          </div>
        </div>
      </div>

      {error && (
        <p
          className="font-sans text-body mb-4 text-center font-bold"
          style={{ color: textColor }}
        >
          {error}
        </p>
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
