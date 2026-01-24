import { useState, useRef, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { Button, DiceAnimation } from '../components';
import { getColorByScheme, getTextColorForBackground } from '../utils/colors';
import { useSettings } from '../context/SettingsContext';

// Import header letter images
import letterY from '../assets/header/Y.png';
import letterA from '../assets/header/A.png';
import letterH from '../assets/header/H.png';
import letterT from '../assets/header/T.png';
import letterZ from '../assets/header/Z.png';
import letterE from '../assets/header/E.png';

/**
 * Home screen with bold mode selection
 * Features:
 * - Rotating background colors
 * - Large typography (YAHTZEE title)
 * - Two primary action buttons
 * - Settings button
 */
export default function Home({ onSelectMode, onOpenSettings, onOpenChangelog, colorIndex, onTitleClick }) {
  const { settings } = useSettings();
  const [diceKey, setDiceKey] = useState(0);
  const [diceFromTop, setDiceFromTop] = useState(false);
  const [isExplosion, setIsExplosion] = useState(false);
  const [explosionCooldown, setExplosionCooldown] = useState(false);
  const clickCountRef = useRef(0);
  const backgroundColor = getColorByScheme(colorIndex, settings.visual.colorScheme);
  const textColor = getTextColorForBackground(backgroundColor);

  // Drag state for letter images
  // Using refs for drag start positions to avoid stale closure issues
  const [dragState, setDragState] = useState({ index: null, x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragStartIndex = useRef(null);

  const handleDragStart = useCallback((e, index) => {
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    isDragging.current = true;
    dragStartPos.current = { x: clientX, y: clientY };
    dragStartIndex.current = index;
    setDragState({ index, x: 0, y: 0 });
  }, []);

  const handleDragMove = useCallback((e) => {
    if (!isDragging.current || dragStartIndex.current === null) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - dragStartPos.current.x;
    const y = clientY - dragStartPos.current.y;
    setDragState({ index: dragStartIndex.current, x, y });
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    dragStartIndex.current = null;
    setDragState({ index: null, x: 0, y: 0 });
  }, []);

  const handleTitleClick = () => {
    // If on cooldown, ignore clicks for explosion tracking
    if (explosionCooldown) {
      // Still allow color change
      if (onTitleClick) {
        onTitleClick();
      }
      return;
    }

    // Track clicks for easter egg
    clickCountRef.current += 1;

    // Check for 5 clicks - dice explosion!
    const shouldExplode = clickCountRef.current >= 5;
    if (shouldExplode) {
      clickCountRef.current = 0;
      // Start cooldown for 5 seconds
      setExplosionCooldown(true);
      setTimeout(() => {
        setExplosionCooldown(false);
      }, 5000);
    }

    setIsExplosion(shouldExplode);
    setDiceFromTop(false);
    setDiceKey(Date.now()); // Use timestamp for unique key

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
      {/* exploreMode makes dice scatter across entire screen instead of just falling */}
      {diceKey > 0 && <DiceAnimation key={diceKey} fromTop={diceFromTop} count={isExplosion ? 30 : 5} exploreMode={isExplosion} />}

      {/* Main Title */}
      <div className="text-center mb-16">
        {settings.visual.headerStyle === 'images' ? (
          <div
            className="flex items-center justify-center gap-[4px] mb-4 select-none"
            onClick={handleTitleClick}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            {[letterY, letterA, letterH, letterT, letterZ, letterE, letterE].map((letter, index) => {
              // Map index to letter name for accessibility
              const letterNames = ['Y', 'A', 'H', 'T', 'Z', 'E', 'E'];
              return (
                <img
                  key={index}
                  src={letter}
                  alt={letterNames[index]}
                  className="h-16 md:h-24 w-auto cursor-grab active:cursor-grabbing transition-transform hover:scale-105"
                  draggable={false}
                  onMouseDown={(e) => handleDragStart(e, index)}
                  onTouchStart={(e) => handleDragStart(e, index)}
                  style={{
                    transform: dragState.index === index
                      ? `translate(${dragState.x}px, ${dragState.y}px)`
                      : 'translate(0, 0)',
                    transition: dragState.index === index ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                />
              );
            })}
          </div>
        ) : (
          <h1
            className="font-serif text-headline md:text-display mb-4 cursor-pointer select-none active:scale-95 transition-transform text-balance tracking-wide"
            style={{ color: textColor }}
            onClick={handleTitleClick}
          >
            YAHTZEE
          </h1>
        )}
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
          <a
            href="https://github.com/gageminamoto/yahtzee-score-card"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-100 transition-opacity cursor-pointer"
            style={{ color: textColor }}
          >
            Open Source
          </a>
          {' • '}Free Forever • No Ads{' • '}
          <button
            onClick={onOpenChangelog}
            className="underline hover:opacity-100 transition-opacity cursor-pointer"
            style={{ color: textColor }}
          >
            Changelog
          </button>
        </p>
      </div>
    </div>
  );
}
