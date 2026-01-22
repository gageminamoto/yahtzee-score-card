import { useState } from 'react';
import { Button } from '../components';
import { getColorByIndex } from '../utils/colors';

/**
 * Home screen with bold mode selection
 * Features:
 * - Rotating background colors
 * - Large typography (YAHTZEE title)
 * - Two primary action buttons
 */
export default function Home({ onSelectMode }) {
  const [colorIndex] = useState(() => Math.floor(Math.random() * 5));
  const backgroundColor = getColorByIndex(colorIndex);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8 transition-colors duration-500"
      style={{ backgroundColor }}
    >
      {/* Main Title - Instrument Serif, massive scale */}
      <div className="text-center mb-16">
        <h1 className="font-serif text-headline md:text-display text-white mb-4 tracking-tight">
          YAHTZEE
        </h1>
        <p className="font-sans text-body-lg text-white opacity-90">
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
          onClick={() => onSelectMode('multi')}
        >
          Multi Device
        </Button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <p className="font-sans text-ui text-white opacity-70">
          Open Source • Free Forever • No Ads
        </p>
      </div>
    </div>
  );
}
