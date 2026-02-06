import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  createSession,
  joinSession,
  getSession,
  subscribeToSession,
  subscribeToPlayers,
  updateScore,
  advanceTurn,
  startGame as startGameService,
  endGame as endGameService,
  leaveSession,
  setupPresence,
  updateTurnOrder as updateTurnOrderService,
} from '../services/sessionService';
import { db, ref, onValue } from '../services/firebase';

const SessionContext = createContext(null);

const SESSION_STORAGE_KEY = 'yahtzee_multi_session';

const INITIAL_STATE = {
  sessionCode: null,
  playerId: null,
  isHost: false,
  sessionStatus: null,
  players: [],
  gameState: null,
  settings: null,
  turnOrder: [],
  isConnected: false,
  error: null,
};

/**
 * Convert Firebase players object to an ordered array.
 * Preserves player ID as a property on each entry.
 */
function playersObjectToArray(playersObj) {
  if (!playersObj) return [];
  return Object.entries(playersObj).map(([id, data]) => ({
    id,
    ...data,
  }));
}

/**
 * Save minimal session info to localStorage for reconnection after refresh.
 */
function saveSessionToStorage(sessionCode, playerId, isHost) {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ sessionCode, playerId, isHost }));
  } catch {
    // localStorage may be unavailable
  }
}

function clearSessionStorage() {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // localStorage may be unavailable
  }
}

function loadSessionFromStorage() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.sessionCode && parsed?.playerId) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function SessionProvider({ children }) {
  const [state, setState] = useState(INITIAL_STATE);
  const unsubscribersRef = useRef([]);
  const isMountedRef = useRef(true);

  // Track mount status to avoid setState after unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Clean up all Firebase subscriptions.
   */
  const cleanup = useCallback(() => {
    unsubscribersRef.current.forEach((unsub) => {
      if (typeof unsub === 'function') unsub();
    });
    unsubscribersRef.current = [];
    clearSessionStorage();
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      unsubscribersRef.current.forEach((unsub) => {
        if (typeof unsub === 'function') unsub();
      });
      unsubscribersRef.current = [];
    };
  }, []);

  /**
   * Shared error handler for Firebase listener failures.
   */
  const handleListenerError = useCallback(() => {
    if (!isMountedRef.current) return;
    setState((prev) => ({
      ...prev,
      error: 'Lost connection to server. Attempting to reconnect...',
    }));
  }, []);

  /**
   * Set up real-time listeners for a session.
   */
  const setupSubscriptions = useCallback(async (sessionCode) => {
    // Listen to the full session for status, settings, gameState
    const unsubSession = await subscribeToSession(
      sessionCode,
      (session) => {
        if (!isMountedRef.current) return;
        if (!session) {
          // Session was deleted
          setState((prev) => ({
            ...prev,
            sessionStatus: null,
            turnOrder: [],
            error: 'Session no longer exists',
          }));
          cleanup();
          return;
        }

        setState((prev) => ({
          ...prev,
          sessionStatus: session.status,
          settings: session.settings ?? null,
          gameState: session.gameState ?? null,
          turnOrder: Array.isArray(session.turnOrder) ? session.turnOrder : [],
          error: prev.error === 'Lost connection to server. Attempting to reconnect...' ? null : prev.error,
        }));
      },
      handleListenerError,
    );

    // Listen to players separately for more granular updates
    const unsubPlayers = await subscribeToPlayers(
      sessionCode,
      (playersObj) => {
        if (!isMountedRef.current) return;
        setState((prev) => ({
          ...prev,
          players: playersObjectToArray(playersObj),
        }));
      },
      handleListenerError,
    );

    // Track own connection state via Firebase .info/connected
    const connectedRef = ref(db, '.info/connected');
    const unsubConnected = onValue(
      connectedRef,
      (snapshot) => {
        if (!isMountedRef.current) return;
        setState((prev) => ({
          ...prev,
          isConnected: snapshot.val() === true,
        }));
      },
      handleListenerError,
    );

    unsubscribersRef.current.push(unsubSession, unsubPlayers, unsubConnected);
  }, [cleanup, handleListenerError]);

  /**
   * Attempt to recover a previous session after page refresh.
   */
  useEffect(() => {
    const saved = loadSessionFromStorage();
    if (!saved) return;

    let cancelled = false;

    (async () => {
      try {
        const session = await getSession(saved.sessionCode);
        if (cancelled) return;

        // Only recover if session exists and is still active
        if (!session || session.status === 'finished' || session.status === 'cancelled') {
          clearSessionStorage();
          return;
        }

        // Verify this player still exists in the session
        if (!session.players?.[saved.playerId]) {
          clearSessionStorage();
          return;
        }

        const presenceCleanup = await setupPresence(saved.sessionCode, saved.playerId);
        unsubscribersRef.current.push(presenceCleanup);

          setState((prev) => ({
            ...prev,
            sessionCode: saved.sessionCode,
            playerId: saved.playerId,
            isHost: saved.isHost,
            sessionStatus: session.status,
            turnOrder: Array.isArray(session.turnOrder) ? session.turnOrder : [],
          }));

        await setupSubscriptions(saved.sessionCode);
      } catch {
        clearSessionStorage();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [setupSubscriptions]);

  /**
   * Host a new game session.
   */
  const hostGame = useCallback(async (playerName, playerColor, gameSettings = {}) => {
    try {
      setState((prev) => ({ ...prev, error: null }));

      const { sessionCode, playerId } = await createSession(
        playerName,
        playerColor,
        gameSettings,
      );

      const presenceCleanup = await setupPresence(sessionCode, playerId);
      unsubscribersRef.current.push(presenceCleanup);

      setState((prev) => ({
        ...prev,
        sessionCode,
        playerId,
        isHost: true,
        sessionStatus: 'lobby',
      }));

      saveSessionToStorage(sessionCode, playerId, true);
      await setupSubscriptions(sessionCode);

      return { sessionCode, playerId };
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message }));
      throw err;
    }
  }, [setupSubscriptions]);

  /**
   * Join an existing game session.
   */
  const joinGame = useCallback(async (sessionCode, playerName, playerColor) => {
    try {
      setState((prev) => ({ ...prev, error: null }));

      const normalizedCode = sessionCode.toUpperCase().trim();
      const { playerId } = await joinSession(normalizedCode, playerName, playerColor);

      const presenceCleanup = await setupPresence(normalizedCode, playerId);
      unsubscribersRef.current.push(presenceCleanup);

      setState((prev) => ({
        ...prev,
        sessionCode: normalizedCode,
        playerId,
        isHost: false,
        sessionStatus: 'lobby',
      }));

      saveSessionToStorage(normalizedCode, playerId, false);
      await setupSubscriptions(normalizedCode);

      return { playerId };
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message }));
      throw err;
    }
  }, [setupSubscriptions]);

  /**
   * Host starts the game.
   */
  const startGame = useCallback(async () => {
    if (!state.isHost || !state.sessionCode) return;
    try {
      await startGameService(state.sessionCode);
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message }));
    }
  }, [state.isHost, state.sessionCode]);

  /**
   * Submit a score for the current player.
   * In strict turn mode, also advances the turn.
   */
  const submitScore = useCallback(async (category, score) => {
    if (!state.sessionCode || !state.playerId) return;

    try {
      await updateScore(state.sessionCode, state.playerId, category, score);

      // In strict mode, advance the turn after scoring
      if (state.settings?.turnMode === 'strict' && state.gameState) {
        const playerCount = state.turnOrder.length > 0 ? state.turnOrder.length : state.players.length;
        if (playerCount === 0) return;
        const nextIndex = (state.gameState.currentPlayerIndex + 1) % playerCount;
        const newCompletedTurns = state.gameState.completedTurns + 1;
        const newRound = Math.floor(newCompletedTurns / playerCount) + 1;

        await advanceTurn(
          state.sessionCode,
          nextIndex,
          newCompletedTurns,
          newRound,
        );
      }
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message }));
      throw err;
    }
  }, [state.sessionCode, state.playerId, state.settings, state.gameState, state.players.length, state.turnOrder.length]);

  /**
   * End the game.
   */
  const endGame = useCallback(async () => {
    if (!state.sessionCode) return;
    try {
      await endGameService(state.sessionCode);
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message }));
    }
  }, [state.sessionCode]);

  /**
   * Leave the current game and clean up subscriptions.
   */
  const leaveGame = useCallback(async () => {
    if (state.sessionCode && state.playerId) {
      try {
        await leaveSession(state.sessionCode, state.playerId);
      } catch {
        // Ignore errors during cleanup
      }
    }
    cleanup();
    setState(INITIAL_STATE);
  }, [state.sessionCode, state.playerId, cleanup]);

  /**
   * Clear the current error.
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  /**
   * Update turn order (host only).
   */
  const updateTurnOrder = useCallback(async (nextOrder) => {
    if (!state.sessionCode || !state.isHost) return;
    try {
      await updateTurnOrderService(state.sessionCode, nextOrder);
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message }));
      throw err;
    }
  }, [state.sessionCode, state.isHost]);

  const value = {
    ...state,
    hostGame,
    joinGame,
    startGame,
    submitScore,
    endGame,
    leaveGame,
    clearError,
    updateTurnOrder,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

SessionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
