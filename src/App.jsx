import { useState } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import { ConfirmDialog } from './components';
import Home from './pages/Home';
import SingleDeviceSetup from './pages/SingleDeviceSetup';
import GameBoard from './pages/GameBoard';
import Winner from './pages/Winner';
import Settings from './pages/Settings';
import Changelog from './pages/Changelog';
import GameHistory from './pages/GameHistory';

/**
 * Main App component
 * Handles routing between screens using state
 * Includes slide animation transitions between screens
 */
function App() {
  const [screen, setScreen] = useState('home');
  const [gameMode, setGameMode] = useState(null);
  const [players, setPlayers] = useState([]);
  const [finalPlayers, setFinalPlayers] = useState([]);
  const [homeColorIndex, setHomeColorIndex] = useState(() => Math.floor(Math.random() * 5));
  // Use homeColorIndex for setup page so color changes from Home page reflect there too
  const setupColorIndex = homeColorIndex;
  const [winnerColorIndex] = useState(() => Math.floor(Math.random() * 5));
  
  // Transition state for slide animations
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousScreen, setPreviousScreen] = useState(null);
  const [nextScreen, setNextScreen] = useState('home');

  // Quit confirmation dialog state
  const [showQuitDialog, setShowQuitDialog] = useState(false);

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
      transitionToScreen('setup');
    } else {
      // Multi-device mode (future implementation)
      alert('Multi-device mode coming soon!');
    }
  };

  const handleStartGame = (gamePlayers) => {
    setPlayers(gamePlayers);
    transitionToScreen('game');
  };

  const handleGameComplete = (completedPlayers) => {
    setFinalPlayers(completedPlayers);
    transitionToScreen('winner');
  };

  const handlePlayAgain = () => {
    // Keep same players but reset game
    transitionToScreen('game');
  };

  const handleGoHome = () => {
    transitionToScreen('home', () => {
      setGameMode(null);
      setPlayers([]);
      setFinalPlayers([]);
    });
  };

  const handleQuit = () => {
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
    transitionToScreen('home', () => {
      setGameMode(null);
    });
  };

  const handleOpenSettings = () => {
    transitionToScreen('settings');
  };

  const handleBackFromSettings = () => {
    transitionToScreen('home');
  };

  const handleOpenChangelog = () => {
    transitionToScreen('changelog');
  };

  const handleBackFromChangelog = () => {
    transitionToScreen('home');
  };

  const handleOpenHistory = () => {
    transitionToScreen('history');
  };

  const handleBackFromHistory = () => {
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
   * @param {string} screenName - The screen identifier
   * @param {JSX.Element} component - The component to render
   * @param {string} animationClass - Optional animation class to apply
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

  // Render appropriate screen(s)
  return (
    <SettingsProvider>
      <div className="relative w-full min-h-dvh overflow-hidden">
        {/* Render previous screen with slide-out animation during transition */}
        {isTransitioning && previousScreen && (
          <>
            {previousScreen === 'home' && renderScreen(
              'home',
              <Home
                onSelectMode={handleSelectMode}
                onOpenSettings={handleOpenSettings}
                onOpenChangelog={handleOpenChangelog}
                onOpenHistory={handleOpenHistory}
                colorIndex={homeColorIndex}
                onTitleClick={handleHomeTitleClick}
              />,
              'animate-slideOutToLeft'
            )}

            {previousScreen === 'history' && renderScreen(
              'history',
              <GameHistory
                onBack={handleBackFromHistory}
                colorIndex={homeColorIndex}
              />,
              'animate-slideOutToLeft'
            )}

            {previousScreen === 'settings' && renderScreen(
              'settings',
              <Settings
                onBack={handleBackFromSettings}
                colorIndex={homeColorIndex}
              />,
              'animate-slideOutToLeft'
            )}
            
            {previousScreen === 'changelog' && renderScreen(
              'changelog',
              <Changelog
                onBack={handleBackFromChangelog}
                colorIndex={homeColorIndex}
              />,
              'animate-slideOutToLeft'
            )}
            
            {previousScreen === 'setup' && gameMode === 'single' && renderScreen(
              'setup',
              <SingleDeviceSetup
                onStartGame={handleStartGame}
                onBack={handleBackFromSetup}
                colorIndex={setupColorIndex}
              />,
              'animate-slideOutToLeft'
            )}
            
            {previousScreen === 'game' && renderScreen(
              'game',
              <GameBoard
                players={players}
                onGameComplete={handleGameComplete}
                onQuit={handleQuit}
              />,
              'animate-slideOutToLeft'
            )}
            
            {previousScreen === 'winner' && renderScreen(
              'winner',
              <Winner
                players={finalPlayers}
                onPlayAgain={handlePlayAgain}
                onGoHome={handleGoHome}
                colorIndex={winnerColorIndex}
              />,
              'animate-slideOutToLeft'
            )}
          </>
        )}

        {/* Render next screen with slide-in animation during transition, or current screen normally */}
        {isTransitioning ? (
          <>
            {nextScreen === 'home' && renderScreen(
              'home',
              <Home
                onSelectMode={handleSelectMode}
                onOpenSettings={handleOpenSettings}
                onOpenChangelog={handleOpenChangelog}
                onOpenHistory={handleOpenHistory}
                colorIndex={homeColorIndex}
                onTitleClick={handleHomeTitleClick}
              />,
              'animate-slideInFromRight'
            )}

            {nextScreen === 'history' && renderScreen(
              'history',
              <GameHistory
                onBack={handleBackFromHistory}
                colorIndex={homeColorIndex}
              />,
              'animate-slideInFromRight'
            )}

            {nextScreen === 'settings' && renderScreen(
              'settings',
              <Settings
                onBack={handleBackFromSettings}
                colorIndex={homeColorIndex}
              />,
              'animate-slideInFromRight'
            )}
            
            {nextScreen === 'changelog' && renderScreen(
              'changelog',
              <Changelog
                onBack={handleBackFromChangelog}
                colorIndex={homeColorIndex}
              />,
              'animate-slideInFromRight'
            )}
            
            {nextScreen === 'setup' && gameMode === 'single' && renderScreen(
              'setup',
              <SingleDeviceSetup
                onStartGame={handleStartGame}
                onBack={handleBackFromSetup}
                colorIndex={setupColorIndex}
              />,
              'animate-slideInFromRight'
            )}
            
            {nextScreen === 'game' && renderScreen(
              'game',
              <GameBoard
                players={players}
                onGameComplete={handleGameComplete}
                onQuit={handleQuit}
              />,
              'animate-slideInFromRight'
            )}
            
            {nextScreen === 'winner' && renderScreen(
              'winner',
              <Winner
                players={finalPlayers}
                onPlayAgain={handlePlayAgain}
                onGoHome={handleGoHome}
                colorIndex={winnerColorIndex}
              />,
              'animate-slideInFromRight'
            )}
          </>
        ) : (
          <>
            {screen === 'home' && (
              <Home
                onSelectMode={handleSelectMode}
                onOpenSettings={handleOpenSettings}
                onOpenChangelog={handleOpenChangelog}
                onOpenHistory={handleOpenHistory}
                colorIndex={homeColorIndex}
                onTitleClick={handleHomeTitleClick}
              />
            )}

            {screen === 'history' && (
              <GameHistory
                onBack={handleBackFromHistory}
                colorIndex={homeColorIndex}
              />
            )}

            {screen === 'settings' && (
              <Settings
                onBack={handleBackFromSettings}
                colorIndex={homeColorIndex}
              />
            )}

            {screen === 'changelog' && (
              <Changelog
                onBack={handleBackFromChangelog}
                colorIndex={homeColorIndex}
              />
            )}

            {screen === 'setup' && gameMode === 'single' && (
              <SingleDeviceSetup
                onStartGame={handleStartGame}
                onBack={handleBackFromSetup}
                colorIndex={setupColorIndex}
              />
            )}

            {screen === 'game' && (
              <GameBoard
                players={players}
                onGameComplete={handleGameComplete}
                onQuit={handleQuit}
              />
            )}

            {screen === 'winner' && (
              <Winner
                players={finalPlayers}
                onPlayAgain={handlePlayAgain}
                onGoHome={handleGoHome}
                colorIndex={winnerColorIndex}
              />
            )}
          </>
        )}
      </div>

      {/* Quit confirmation dialog */}
      <ConfirmDialog
        isOpen={showQuitDialog}
        title="Quit Game?"
        message="Are you sure you want to quit? Your progress will be lost."
        confirmText="Quit"
        cancelText="Cancel"
        onConfirm={handleConfirmQuit}
        onCancel={handleCancelQuit}
      />
    </SettingsProvider>
  );
}

export default App;
