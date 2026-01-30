/**
 * localStorage utilities for persisting settings and game data
 * Handles versioning, migration, and error handling
 */

import { DEFAULT_SETTINGS } from './defaultSettings';

const STORAGE_VERSION = 1;
const STORAGE_KEYS = {
  settings: `yahtzee_settings_v${STORAGE_VERSION}`,
  gameState: `yahtzee_game_state_v${STORAGE_VERSION}`,
  gameHistory: `yahtzee_game_history_v${STORAGE_VERSION}`,
  inputMode: `yahtzee_input_mode_v${STORAGE_VERSION}`,
};

/**
 * Load settings from localStorage with defaults fallback
 */
export function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.settings);
    if (!stored) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(stored);
    return migrateSettings(parsed);
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings) {
  try {
    const toSave = {
      ...settings,
      version: STORAGE_VERSION,
      lastModified: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(toSave));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
}

/**
 * Reset settings to defaults and clear from localStorage
 */
export function resetSettings() {
  try {
    localStorage.removeItem(STORAGE_KEYS.settings);
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error resetting settings:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Migrate settings from older versions
 */
function migrateSettings(loadedSettings) {
  const version = loadedSettings.version || 0;

  // Start with defaults and merge loaded settings
  let settings = { ...DEFAULT_SETTINGS };

  // Deep merge each category
  Object.keys(DEFAULT_SETTINGS).forEach(category => {
    if (loadedSettings[category]) {
      settings[category] = {
        ...DEFAULT_SETTINGS[category],
        ...loadedSettings[category],
      };
    }
  });

  // Version-specific migrations
  if (version < 1) {
    // Initial version - no migration needed
  }

  // Future migrations go here
  // if (version < 2) { ... }

  return settings;
}

/**
 * Load game state from localStorage
 */
export function loadGameState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.gameState);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return parsed;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
}

/**
 * Save game state to localStorage
 */
export function saveGameState(gameState) {
  try {
    const toSave = {
      ...gameState,
      version: STORAGE_VERSION,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.gameState, JSON.stringify(toSave));
    return true;
  } catch (error) {
    console.error('Error saving game state:', error);
    return false;
  }
}

/**
 * Clear saved game state
 */
export function clearGameState() {
  try {
    localStorage.removeItem(STORAGE_KEYS.gameState);
    return true;
  } catch (error) {
    console.error('Error clearing game state:', error);
    return false;
  }
}

/**
 * Load game history from localStorage
 */
export function loadGameHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.gameHistory);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading game history:', error);
    return [];
  }
}

/**
 * Add a completed game to history
 */
export function addGameToHistory(game, maxHistorySize = 50) {
  try {
    const history = loadGameHistory();
    const newGame = {
      ...game,
      gameId: generateGameId(),
      completedAt: Date.now(),
    };

    // Add to beginning and limit size
    const updatedHistory = [newGame, ...history].slice(0, maxHistorySize);
    localStorage.setItem(STORAGE_KEYS.gameHistory, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Error adding game to history:', error);
    return false;
  }
}

/**
 * Delete a single game from history by gameId
 */
export function deleteGameFromHistory(gameId) {
  try {
    const history = loadGameHistory();
    const updatedHistory = history.filter(game => game.gameId !== gameId);
    localStorage.setItem(STORAGE_KEYS.gameHistory, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Error deleting game from history:', error);
    return false;
  }
}

/**
 * Clear all game history
 */
export function clearGameHistory() {
  try {
    localStorage.removeItem(STORAGE_KEYS.gameHistory);
    return true;
  } catch (error) {
    console.error('Error clearing game history:', error);
    return false;
  }
}

/**
 * Export all data as JSON
 */
export function exportAllData() {
  try {
    const data = {
      settings: loadSettings(),
      gameState: loadGameState(),
      gameHistory: loadGameHistory(),
      exportedAt: Date.now(),
      version: STORAGE_VERSION,
    };
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
}

/**
 * Clear all localStorage data
 */
export function clearAllData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.settings);
    localStorage.removeItem(STORAGE_KEYS.gameState);
    localStorage.removeItem(STORAGE_KEYS.gameHistory);
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
}

/**
 * Check if this is a first-time user (no settings saved yet)
 */
export function isFirstTimeUser() {
  return localStorage.getItem(STORAGE_KEYS.settings) === null;
}

/**
 * Generate a unique game ID
 */
function generateGameId() {
  return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get the preferred input mode (dice or quick)
 * Defaults to 'quick' if not set
 */
export function getInputMode() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.inputMode);
    if (!stored) return 'quick';

    const mode = stored;
    // Validate that it's one of the allowed modes
    if (['dice', 'quick'].includes(mode)) {
      return mode;
    }
    return 'quick';
  } catch (error) {
    console.error('Error loading input mode:', error);
    return 'quick';
  }
}

/**
 * Save the preferred input mode
 */
export function setInputMode(mode) {
  try {
    // Validate mode before saving
    if (!['dice', 'quick'].includes(mode)) {
      console.warn('Invalid input mode:', mode);
      return false;
    }
    localStorage.setItem(STORAGE_KEYS.inputMode, mode);
    return true;
  } catch (error) {
    console.error('Error saving input mode:', error);
    return false;
  }
}
