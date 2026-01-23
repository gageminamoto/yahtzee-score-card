import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Button, DiceAnimation } from '../components';
import { getColorByScheme, getTextColorForBackground } from '../utils/colors';
import { useSettings } from '../context/SettingsContext';

/**
 * Home screen with bold mode selection
 * Features:
 * - Rotating background colors
 * - Large typography (YAHTZEE title)
 * - Two primary action buttons
 * - Settings button
 */
export default function Home({ onSelectMode, onOpenSettings, colorIndex, onTitleClick }) {
  const { settings } = useSettings();
  const [diceKey, setDiceKey] = useState(0);
  const [diceFromTop, setDiceFromTop] = useState(false);
  const backgroundColor = getColorByScheme(colorIndex, settings.visual.colorScheme);
  const textColor = getTextColorForBackground(backgroundColor);

  const handleTitleClick = () => {
    // Title click: dice come from their default position (not from top)
    setDiceFromTop(false);
    setDiceKey(prev => prev + 1);
    // Also swap the background color when title is clicked
    if (onTitleClick) {
      onTitleClick();
    }
  };

  /**
   * Handle Single Device button click
   * Triggers dice animation from the top, then navigates to setup screen after delay
   * This gives time for the dice falling animation to complete
   */
  const handleSingleDeviceClick = () => {
    // Single device button: dice come from the top of the screen
    setDiceFromTop(true);
    setDiceKey(prev => prev + 1);
    
    // Wait for animation to complete before transitioning
    // Dice have random delays (0-500ms) plus falling time
    setTimeout(() => {
      onSelectMode('single');
    }, 1000); // 1 second delay to allow animation to play
  };

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center p-8 transition-colors duration-500"
      style={{ backgroundColor }}
    >
      {/* Dice Animation Overlay */}
      {/* fromTop prop determines if dice start from top (button click) or default position (title click) */}
      {diceKey > 0 && <DiceAnimation key={diceKey} fromTop={diceFromTop} />}

      {/* Main Title - Instrument Serif, massive scale */}
      <div className="text-center mb-16">
        <h1
          className="font-serif text-headline md:text-display mb-4 cursor-pointer select-none active:scale-95 transition-transform text-balance tracking-wide"
          style={{ color: textColor }}
          onClick={handleTitleClick}
        >
          YAHTZEE
        </h1>
        <p
          className="font-sans text-body-lg opacity-90 text-pretty"
          style={{ color: textColor }}
        >
          Score Tracker
        </p>
      </div>

      {/* Mode Selection Buttons */}
      <div className="w-full max-w-md space-y-6">
        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={handleSingleDeviceClick}
        >
          Single Device
        </Button>

        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={() => {}}
          className="opacity-60 cursor-not-allowed"
        >
          <span className="flex items-center justify-center gap-2">
            Multiplayer
            <Icon icon="basil:lock-solid" className="w-5 h-5" />
          </span>
        </Button>

        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={onOpenSettings}
        >
          Settings
        </Button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <p
          className="font-sans text-ui opacity-70"
          style={{ color: textColor }}
        >
          Open Source • Free Forever • No Ads
        </p>
      </div>
    </div>
  );
}
