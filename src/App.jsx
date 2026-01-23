import { useState } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import Home from './pages/Home';
import SingleDeviceSetup from './pages/SingleDeviceSetup';
import GameBoard from './pages/GameBoard';
import Winner from './pages/Winner';
import Settings from './pages/Settings';

/**
 * Main App component
 * Handles routing between screens using state
 */
function App() {
  const [screen, setScreen] = useState('home');
  const [gameMode, setGameMode] = useState(null);
  const [players, setPlayers] = useState([]);
  const [finalPlayers, setFinalPlayers] = useState([]);
  const [homeColorIndex] = useState(() => Math.floor(Math.random() * 5));

  // Navigation handlers
  const handleSelectMode = (mode) => {
    setGameMode(mode);
    if (mode === 'single') {
      setScreen('setup');
    } else {
      // Multi-device mode (future implementation)
      alert('Multi-device mode coming soon!');
    }
  };

  const handleStartGame = (gamePlayers) => {
    setPlayers(gamePlayers);
    setScreen('game');
  };

  const handleGameComplete = (completedPlayers) => {
    setFinalPlayers(completedPlayers);
    setScreen('winner');
  };

  const handlePlayAgain = () => {
    // Keep same players but reset game
    setScreen('game');
  };

  const handleGoHome = () => {
    setScreen('home');
    setGameMode(null);
    setPlayers([]);
    setFinalPlayers([]);
  };

  const handleQuit = () => {
    if (window.confirm('Are you sure you want to quit? Your progress will be lost.')) {
      handleGoHome();
    }
  };

  const handleBackFromSetup = () => {
    setScreen('home');
    setGameMode(null);
  };

  const handleOpenSettings = () => {
    setScreen('settings');
  };

  const handleBackFromSettings = () => {
    setScreen('home');
  };

  // Render appropriate screen
  return (
    <SettingsProvider>
      {screen === 'home' && (
        <Home
          onSelectMode={handleSelectMode}
          onOpenSettings={handleOpenSettings}
        />
      )}

      {screen === 'settings' && (
        <Settings
          onBack={handleBackFromSettings}
          colorIndex={homeColorIndex}
        />
      )}

      {screen === 'setup' && gameMode === 'single' && (
        <SingleDeviceSetup
          onStartGame={handleStartGame}
          onBack={handleBackFromSetup}
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
        />
      )}
    </SettingsProvider>
  );
}

export default App;
