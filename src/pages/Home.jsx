import { useState } from 'react';
import { Button } from '../components';
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
export default function Home({ onSelectMode, onOpenSettings }) {
  const { settings } = useSettings();
  const [colorIndex] = useState(() => Math.floor(Math.random() * 5));
  const backgroundColor = getColorByScheme(colorIndex, settings.visual.colorScheme);
  const textColor = getTextColorForBackground(backgroundColor);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8 transition-colors duration-500"
      style={{ backgroundColor }}
    >
      {/* Settings Button - Top Right */}
      <div className="absolute top-8 right-8">
        <Button
          variant="outline"
          size="small"
          onClick={onOpenSettings}
        >
          Settings
        </Button>
      </div>

      {/* Main Title - Instrument Serif, massive scale */}
      <div className="text-center mb-16">
        <h1
          className="font-serif text-headline md:text-display mb-4 tracking-tight"
          style={{ color: textColor }}
        >
          YAHTZEE
        </h1>
        <p
          className="font-sans text-body-lg opacity-90"
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
          onClick={() => onSelectMode('single')}
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                clipRule="evenodd"
              />
            </svg>
          </span>
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
