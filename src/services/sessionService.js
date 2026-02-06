import {
  db,
  ensureAuth,
  ref,
  set,
  get,
  update,
  remove,
  onValue,
  onDisconnect,
  serverTimestamp,
} from './firebase';
import { createEmptyScorecard } from '../utils/scoring';

// Characters for session codes — excludes 0/O, 1/I/L to avoid confusion
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 6;
const MAX_PLAYERS = 6;
const MAX_CODE_ATTEMPTS = 10;

function generateId() {
  return crypto.randomUUID();
}

/**
 * Generate a random session code and verify it's unique in Firebase.
 */
export async function generateSessionCode() {
  await ensureAuth();
  let code;
  let attempts = 0;

  while (attempts < MAX_CODE_ATTEMPTS) {
    code = '';
    for (let i = 0; i < CODE_LENGTH; i++) {
      code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    }
    try {
      const snapshot = await get(ref(db, `sessions/${code}`));
      if (!snapshot.exists()) return code;
    } catch {
      throw new Error('Unable to connect to server. Check your internet connection.');
    }
    attempts++;
  }

  throw new Error('Could not generate a unique session code. Please try again.');
}

/**
 * Create a new multiplayer session.
 * @returns {{ sessionCode: string, playerId: string }}
 */
export async function createSession(hostName, hostColor, settings = {}) {
  const sessionCode = await generateSessionCode();
  const playerId = generateId();

  const sessionData = {
    hostId: playerId,
    status: 'lobby',
    createdAt: serverTimestamp(),
    lastActivity: serverTimestamp(),
    settings: {
      upperBonusThreshold: settings.upperBonusThreshold ?? 63,
      bonusPoints: settings.bonusPoints ?? 35,
      turnMode: settings.turnMode ?? 'strict',
    },
    turnOrder: [playerId],
    players: {
      [playerId]: {
        name: hostName,
        color: hostColor,
        isHost: true,
        isConnected: true,
        joinedAt: serverTimestamp(),
        scorecard: createEmptyScorecard(),
      },
    },
    gameState: {
      currentPlayerIndex: 0,
      completedTurns: 0,
      round: 1,
    },
  };

  try {
    await set(ref(db, `sessions/${sessionCode}`), sessionData);
  } catch {
    throw new Error('Failed to create session. Check your internet connection.');
  }

  return { sessionCode, playerId };
}

/**
 * Join an existing session.
 * @returns {{ playerId: string }}
 */
export async function joinSession(sessionCode, playerName, playerColor) {
  await ensureAuth();
  const normalizedCode = sessionCode.toUpperCase().trim();

  let snapshot;
  try {
    snapshot = await get(ref(db, `sessions/${normalizedCode}`));
  } catch {
    throw new Error('Unable to connect to server. Check your internet connection.');
  }

  if (!snapshot.exists()) {
    throw new Error('Session not found');
  }

  const session = snapshot.val();

  if (session.status !== 'lobby') {
    if (session.status === 'cancelled') {
      throw new Error('Session was cancelled by the host');
    }
    if (session.status === 'finished') {
      throw new Error('Session has ended');
    }
    throw new Error('Game already in progress');
  }

  const playerCount = session.players ? Object.keys(session.players).length : 0;
  if (playerCount >= MAX_PLAYERS) {
    throw new Error('Session is full');
  }

  const playerId = generateId();
  const existingOrder = Array.isArray(session.turnOrder) && session.turnOrder.length > 0
    ? session.turnOrder
    : Object.keys(session.players || {});
  const nextOrder = [...existingOrder, playerId].filter((id, index, arr) => arr.indexOf(id) === index);

  try {
    await update(ref(db, `sessions/${normalizedCode}`), {
      [`players/${playerId}`]: {
        name: playerName,
        color: playerColor,
        isHost: false,
        isConnected: true,
        joinedAt: serverTimestamp(),
        scorecard: createEmptyScorecard(),
      },
      turnOrder: nextOrder,
      lastActivity: serverTimestamp(),
    });
  } catch {
    throw new Error('Failed to join session. Check your internet connection.');
  }

  return { playerId };
}

/**
 * One-time read of a session. Returns null if not found.
 */
export async function getSession(sessionCode) {
  await ensureAuth();
  const normalizedCode = sessionCode.toUpperCase().trim();
  try {
    const snapshot = await get(ref(db, `sessions/${normalizedCode}`));
    return snapshot.exists() ? snapshot.val() : null;
  } catch {
    return null;
  }
}

/**
 * Subscribe to real-time changes on the entire session.
 * @param {Function} onError - Optional error callback.
 * @returns {Function} Unsubscribe function.
 */
export async function subscribeToSession(sessionCode, callback, onError) {
  await ensureAuth();
  const sessionRef = ref(db, `sessions/${sessionCode}`);
  return onValue(
    sessionRef,
    (snapshot) => {
      callback(snapshot.exists() ? snapshot.val() : null);
    },
    (err) => {
      if (onError) onError(err);
    },
  );
}

/**
 * Subscribe to real-time changes on the players node.
 * @param {Function} onError - Optional error callback.
 * @returns {Function} Unsubscribe function.
 */
export async function subscribeToPlayers(sessionCode, callback, onError) {
  await ensureAuth();
  const playersRef = ref(db, `sessions/${sessionCode}/players`);
  return onValue(
    playersRef,
    (snapshot) => {
      callback(snapshot.exists() ? snapshot.val() : null);
    },
    (err) => {
      if (onError) onError(err);
    },
  );
}

/**
 * Update a player's score for a specific category.
 */
export async function updateScore(sessionCode, playerId, category, score) {
  await ensureAuth();
  try {
    await update(ref(db, `sessions/${sessionCode}/players/${playerId}/scorecard`), {
      [category]: score,
    });
    await update(ref(db, `sessions/${sessionCode}`), {
      lastActivity: serverTimestamp(),
    });
  } catch {
    throw new Error('Failed to save score. Check your connection and try again.');
  }
}

/**
 * Advance the turn to the next player.
 */
export async function advanceTurn(sessionCode, nextPlayerIndex, completedTurns, round) {
  await ensureAuth();
  try {
    await update(ref(db, `sessions/${sessionCode}/gameState`), {
      currentPlayerIndex: nextPlayerIndex,
      completedTurns,
      round,
    });
    await update(ref(db, `sessions/${sessionCode}`), {
      lastActivity: serverTimestamp(),
    });
  } catch {
    throw new Error('Failed to advance turn. Check your connection.');
  }
}

/**
 * Update the turn order for a session.
 */
export async function updateTurnOrder(sessionCode, turnOrder) {
  await ensureAuth();
  try {
    await update(ref(db, `sessions/${sessionCode}`), {
      turnOrder,
      lastActivity: serverTimestamp(),
    });
  } catch {
    throw new Error('Failed to update turn order. Check your connection.');
  }
}

/**
 * Host starts the game (lobby → playing).
 */
export async function startGame(sessionCode) {
  await ensureAuth();
  try {
    await update(ref(db, `sessions/${sessionCode}`), {
      status: 'playing',
      lastActivity: serverTimestamp(),
    });
    await update(ref(db, `sessions/${sessionCode}/gameState`), {
      currentPlayerIndex: 0,
      completedTurns: 0,
      round: 1,
    });
  } catch {
    throw new Error('Failed to start game. Check your connection.');
  }
}

/**
 * Mark the game as finished.
 */
export async function endGame(sessionCode) {
  await ensureAuth();
  try {
    await update(ref(db, `sessions/${sessionCode}`), {
      status: 'finished',
      lastActivity: serverTimestamp(),
    });
  } catch {
    throw new Error('Failed to end game. Check your connection.');
  }
}

/**
 * Set up Firebase presence tracking for a player.
 * Marks the player as disconnected automatically when they go offline.
 * @returns {Function} Cleanup function to remove the onDisconnect handler.
 */
export async function setupPresence(sessionCode, playerId) {
  await ensureAuth();
  const connectedRef = ref(db, `sessions/${sessionCode}/players/${playerId}/isConnected`);

  // Set connected to true
  set(connectedRef, true);

  // When this client disconnects, set to false
  const disconnectRef = onDisconnect(connectedRef);
  disconnectRef.set(false);

  // Return a cleanup that cancels the onDisconnect handler
  return () => {
    disconnectRef.cancel();
  };
}

/**
 * Player leaves the session. If the host leaves, end the session.
 */
export async function leaveSession(sessionCode, playerId) {
  await ensureAuth();
  try {
    const session = await getSession(sessionCode);
    if (!session) return;

    if (session.hostId === playerId) {
      // Host leaving cancels the session (unless already finished)
      if (session.status !== 'finished') {
        await update(ref(db, `sessions/${sessionCode}`), {
          status: 'cancelled',
          endedBy: playerId,
          endedAt: serverTimestamp(),
          lastActivity: serverTimestamp(),
        });
      }
    } else {
      // Remove the player
      await remove(ref(db, `sessions/${sessionCode}/players/${playerId}`));
      const existingOrder = Array.isArray(session.turnOrder) && session.turnOrder.length > 0
        ? session.turnOrder
        : Object.keys(session.players || {});
      const nextOrder = existingOrder.filter((id) => id !== playerId);
      await update(ref(db, `sessions/${sessionCode}`), {
        turnOrder: nextOrder,
        lastActivity: serverTimestamp(),
      });
    }
  } catch {
    // Best-effort cleanup — don't throw during teardown
  }
}

/**
 * Delete an entire session from Firebase.
 */
export async function deleteSession(sessionCode) {
  await ensureAuth();
  try {
    await remove(ref(db, `sessions/${sessionCode}`));
  } catch {
    // Best-effort cleanup
  }
}
