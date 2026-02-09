import { useState } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import { SessionProvider } from './context/SessionContext';
import { ConfirmDialog } from './components';
import SessionErrorBoundary from './components/SessionErrorBoundary';
import Home from './pages/Home';
import SingleDeviceSetup from './pages/SingleDeviceSetup';
import GameBoard from './pages/GameBoard';
import MultiDeviceHost from './pages/MultiDeviceHost';
import MultiDeviceJoin from './pages/MultiDeviceJoin';
import MultiDeviceLobby from './pages/MultiDeviceLobby';
import MultiDeviceGameBoard from './pages/MultiDeviceGameBoard';
import Winner from './pages/Winner';
import Settings from './pages/Settings';
import Changelog from './pages/Changelog';
import Onboarding from './pages/Onboarding';
import GameHistory from './pages/GameHistory';
import { loadGameState, saveGameState, clearGameState, addGameToHistory, loadSettings, isFirstTimeUser } from './utils/storage';

/**
 * Main App component
 * Handles routing between screens using state
 * Includes slide animation transitions between screens
 */

// Check for ?join= URL param (QR code / shared link deep linking)
function extractJoinCode() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('join');
  if (code) {
    // Clean the URL so the param doesn't persist on refresh
    const url = new URL(window.location.href);
    url.searchParams.delete('join');
    window.history.replaceState({}, '', url.pathname);
  }
  return code || null;
}

// Load saved state once at module level for initialization
const initialSavedState = loadGameState();
const initialJoinCode = extractJoinCode();

function App() {
  // Initialize state from localStorage if available
  const [screen, setScreen] = useState(() => {
    // If there's a ?join= param, go straight to multi-join
    if (initialJoinCode) return 'multi-lobby';

    const savedScreen = initialSavedState?.screen;
    // Restore game, winner, settings, changelog, history, and setup screens
    if (savedScreen === 'game' || savedScreen === 'winner' ||
        savedScreen === 'settings' || savedScreen === 'changelog' ||
        savedScreen === 'history' ||
        (savedScreen === 'setup' && initialSavedState?.gameMode)) {
      return savedScreen;
    }
    // Show onboarding for first-time users (no settings saved yet)
    if (isFirstTimeUser()) {
      return 'onboarding';
    }
    return 'home';
  });
  const [gameMode, setGameMode] = useState(() => initialSavedState?.gameMode || null);
  const [players, setPlayers] = useState(() => initialSavedState?.players || []);
  const [finalPlayers, setFinalPlayers] = useState(() => initialSavedState?.finalPlayers || []);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(() => initialSavedState?.currentPlayerIndex || 0);
  const [homeColorIndex, setHomeColorIndex] = useState(() => Math.floor(Math.random() * 5));
  // Use homeColorIndex for setup page so color changes from Home page reflect there too
  const setupColorIndex = homeColorIndex;
  const [winnerColorIndex] = useState(() => Math.floor(Math.random() * 5));

  // Join code from URL param
  const [joinCode] = useState(initialJoinCode);

  // Transition state for slide animations
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousScreen, setPreviousScreen] = useState(null);
  const [nextScreen, setNextScreen] = useState('home');

  // Quit confirmation dialog state
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  // Track whether quit is from multi-device game
  const [quitIsMulti, setQuitIsMulti] = useState(false);

  /**
   * Helper function to transition between screens with slide animation
   * @param {string} newScreen - The screen to transition to
   * @param {Function} callback - Optional callback to run after transition starts
   */
  const transitionToScreen = (newScreen, callback) => {
    // If already transitioning, don't start a new transition
    if (isTransitioning) return;

    // Store the current screen as previous
    setPreviousScreen(screen);
    // Set the next screen
    setNextScreen(newScreen);
    // Start transition
    setIsTransitioning(true);

    // After animation completes (200ms), update the actual screen state
    // and run the callback (which may clear state used by the previous screen)
    setTimeout(() => {
      setScreen(newScreen);
      setIsTransitioning(false);
      setPreviousScreen(null);
      // Run callback after transition completes to avoid clearing state
      // while previous screen is still being rendered
      if (callback) callback();
    }, 200);
  };

  // Navigation handlers
  const handleSelectMode = (mode) => {
    setGameMode(mode);
    if (mode === 'single') {
      saveGameState({ screen: 'setup', gameMode: mode });
      transitionToScreen('setup');
    } else if (mode === 'multi') {
      setGameMode('multi');
      transitionToScreen('multi-lobby');
    } else if (mode === 'multi-host') {
      setGameMode('multi');
      transitionToScreen('multi-host');
    } else if (mode === 'multi-join') {
      setGameMode('multi');
      transitionToScreen('multi-join');
    }
  };

  const handleStartGame = (gamePlayers) => {
    setPlayers(gamePlayers);
    setCurrentPlayerIndex(0);
    saveGameState({ screen: 'game', gameMode, players: gamePlayers, finalPlayers: [], currentPlayerIndex: 0 });
    transitionToScreen('game');
  };

  // Called by GameBoard when scores change to persist state
  const handleGameStateChange = (updatedPlayers, playerIndex) => {
    setPlayers(updatedPlayers);
    setCurrentPlayerIndex(playerIndex);
    saveGameState({ screen: 'game', gameMode, players: updatedPlayers, finalPlayers: [], currentPlayerIndex: playerIndex });
  };

  const handleGameComplete = (completedPlayers) => {
    setFinalPlayers(completedPlayers);
    // Only save to localStorage for single-device games.
    // Multi-device sessions cannot be restored from localStorage.
    if (gameMode !== 'multi') {
      saveGameState({ screen: 'winner', gameMode, players, finalPlayers: completedPlayers });
    }

    // Auto-save to game history if enabled
    const currentSettings = loadSettings();
    if (currentSettings.data.saveGameHistory) {
      addGameToHistory({
        players: completedPlayers.map(p => ({
          id: p.id,
          name: p.name,
          color: p.color,
          totalScore: p.totalScore,
        })),
        schemaVersion: 1,
      }, currentSettings.data.maxHistorySize);
    }

    transitionToScreen('winner');
  };

  // Multi-device: host/join pages signal game started
  const handleMultiGameStart = () => {
    transitionToScreen('multi-game');
  };

  const handlePlayAgain = () => {
    if (gameMode === 'multi') {
      transitionToScreen('multi-host');
    } else {
      // Keep same players but reset game
      transitionToScreen('game');
    }
  };

  const handleGoHome = () => {
    clearGameState();
    transitionToScreen('home', () => {
      setGameMode(null);
      setPlayers([]);
      setFinalPlayers([]);
    });
  };

  const handleQuit = () => {
    setQuitIsMulti(false);
    setShowQuitDialog(true);
  };

  const handleMultiQuit = () => {
    setQuitIsMulti(true);
    setShowQuitDialog(true);
  };

  const handleConfirmQuit = () => {
    setShowQuitDialog(false);
    handleGoHome();
  };

  const handleCancelQuit = () => {
    setShowQuitDialog(false);
  };

  const handleBackFromSetup = () => {
    saveGameState({ screen: 'home' });
    transitionToScreen('home', () => {
      setGameMode(null);
    });
  };

  const handleBackFromMulti = () => {
    transitionToScreen('home', () => {
      setGameMode(null);
    });
  };

  const handleOpenSettings = () => {
    saveGameState({ screen: 'settings' });
    transitionToScreen('settings');
  };

  const handleBackFromSettings = () => {
    saveGameState({ screen: 'home' });
    transitionToScreen('home');
  };

  const handleOpenChangelog = () => {
    saveGameState({ screen: 'changelog' });
    transitionToScreen('changelog');
  };

  const handleBackFromChangelog = () => {
    saveGameState({ screen: 'home' });
    transitionToScreen('home');
  };

  const handleOpenHistory = () => {
    saveGameState({ screen: 'history' });
    transitionToScreen('history');
  };

  const handleBackFromHistory = () => {
    saveGameState({ screen: 'home' });
    transitionToScreen('home');
  };

  const handleOnboardingComplete = () => {
    transitionToScreen('home');
  };

  /**
   * Handle title click on Home screen
   * Cycles through background colors by incrementing the color index
   */
  const handleHomeTitleClick = () => {
    setHomeColorIndex((prev) => (prev + 1) % 5);
  };

  /**
   * Render a screen component with optional animation class
   * Wraps the screen in a fixed container for slide animations
   */
  const renderScreen = (screenName, component, animationClass = '') => {
    const zIndexClass = screenName === nextScreen ? 'z-dropdown' : 'z-base';
    return (
      <div
        key={screenName}
        className={`fixed inset-0 ${zIndexClass} ${animationClass}`}
      >
        {component}
      </div>
    );
  };

  // Screen component map to reduce repetition
  const screenComponents = {
    home: (
      <Home
        onSelectMode={handleSelectMode}
        onOpenSettings={handleOpenSettings}
        onOpenChangelog={handleOpenChangelog}
        onOpenHistory={handleOpenHistory}
        colorIndex={homeColorIndex}
        onTitleClick={handleHomeTitleClick}
      />
    ),
    settings: (
      <Settings
        onBack={handleBackFromSettings}
        colorIndex={homeColorIndex}
      />
    ),
    changelog: (
      <Changelog
        onBack={handleBackFromChangelog}
        colorIndex={homeColorIndex}
      />
    ),
    history: (
      <GameHistory
        onBack={handleBackFromHistory}
        colorIndex={homeColorIndex}
      />
    ),
    setup: gameMode === 'single' ? (
      <SingleDeviceSetup
        onStartGame={handleStartGame}
        onBack={handleBackFromSetup}
        colorIndex={setupColorIndex}
      />
    ) : null,
    game: (
      <GameBoard
        players={players}
        initialPlayerIndex={currentPlayerIndex}
        onGameComplete={handleGameComplete}
        onQuit={handleQuit}
        onStateChange={handleGameStateChange}
      />
    ),
    'multi-lobby': (
      <MultiDeviceLobby
        onBack={handleBackFromMulti}
        onGameStart={handleMultiGameStart}
        colorIndex={homeColorIndex}
        initialCode={joinCode || ''}
      />
    ),
    'multi-host': (
      <MultiDeviceHost
        onBack={handleBackFromMulti}
        onGameStart={handleMultiGameStart}
        colorIndex={homeColorIndex}
      />
    ),
    'multi-join': (
      <MultiDeviceJoin
        onBack={handleBackFromMulti}
        onGameStart={handleMultiGameStart}
        colorIndex={homeColorIndex}
        initialCode={joinCode || ''}
      />
    ),
    'multi-game': (
      <MultiDeviceGameBoard
        onGameComplete={handleGameComplete}
        onQuit={handleMultiQuit}
        onSessionCancelled={handleGoHome}
      />
    ),
    winner: (
      <Winner
        players={finalPlayers}
        onPlayAgain={handlePlayAgain}
        onGoHome={handleGoHome}
        colorIndex={winnerColorIndex}
        gameMode={gameMode}
      />
    ),
    onboarding: (
      <Onboarding
        onComplete={handleOnboardingComplete}
        colorIndex={homeColorIndex}
      />
    ),
  };

  // Render appropriate screen(s)
  return (
    <SettingsProvider>
      <SessionErrorBoundary onReset={handleGoHome}>
        <SessionProvider>
          <div className="relative w-full min-h-dvh overflow-hidden">
            {/* Render previous screen with slide-out animation during transition */}
            {isTransitioning && previousScreen && screenComponents[previousScreen] && (
              renderScreen(previousScreen, screenComponents[previousScreen], 'animate-slideOutToLeft')
            )}

            {/* Render next screen with slide-in animation during transition, or current screen normally */}
            {isTransitioning ? (
              screenComponents[nextScreen] && renderScreen(nextScreen, screenComponents[nextScreen], 'animate-slideInFromRight')
            ) : (
              screenComponents[screen] && screenComponents[screen]
            )}
          </div>

          {/* Quit confirmation dialog */}
          <ConfirmDialog
            isOpen={showQuitDialog}
            title="Quit Game?"
            message={quitIsMulti
              ? 'Are you sure you want to leave? You will disconnect from the session.'
              : 'Are you sure you want to quit? Your progress will be lost.'}
            confirmText="Quit"
            cancelText="Cancel"
            onConfirm={handleConfirmQuit}
            onCancel={handleCancelQuit}
          />
        </SessionProvider>
      </SessionErrorBoundary>
    </SettingsProvider>
  );
}

export default App;
