import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Button, DiceAnimation, FooterMenu } from '../components';
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
export default function Home({ onSelectMode, onOpenSettings, onOpenChangelog, onOpenHistory, colorIndex, onTitleClick, hasActiveGame, onResumeGame }) {
  const { settings } = useSettings();
  const [diceKey, setDiceKey] = useState(0);
  const [diceFromTop, setDiceFromTop] = useState(false);
  const [isExplosion, setIsExplosion] = useState(false);
  const [explosionCooldown, setExplosionCooldown] = useState(false);
  const [logoFallen, setLogoFallen] = useState(false);
  const clickCountRef = useRef(0);
  const backgroundColor = getColorByScheme(colorIndex, settings.visual.colorScheme);
  const textColor = getTextColorForBackground(backgroundColor);

  // Sync background color to html/body for overscroll
  useEffect(() => {
    document.documentElement.style.setProperty('--page-bg', backgroundColor);
  }, [backgroundColor]);
  
  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }, []);
  
  // Generate random animation values for each letter (7 letters: Y, A, H, T, Z, E, E)
  // These values stay consistent once generated, so letters always fall the same way
  const letterAnimations = useMemo(() => {
    return Array.from({ length: 7 }, () => ({
      // Random horizontal scatter: -200px to +200px
      translateX: (Math.random() - 0.5) * 400,
      // Fall down: viewport height + padding (we'll use 100vh + 200px)
      translateY: typeof window !== 'undefined' ? window.innerHeight + 200 : 1000,
      // Random rotation: -45deg to +45deg
      rotate: (Math.random() - 0.5) * 90,
      // Staggered delay: 0-300ms for cascading effect
      delay: Math.random() * 300,
    }));
  }, []);

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
    // If on cooldown, ignore clicks (both for explosion tracking and reset)
    if (explosionCooldown) {
      // Still allow color change
      if (onTitleClick) {
        onTitleClick();
      }
      return;
    }

    // If logo has fallen, reset everything on next click (only if not on cooldown)
    if (logoFallen) {
      setLogoFallen(false);
      setIsExplosion(false);
      setDiceKey(0); // Hide 3D dice
      clickCountRef.current = 0;
      // Still allow background color change
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
      // Start cooldown for 3 seconds
      setExplosionCooldown(true);
      setTimeout(() => {
        setExplosionCooldown(false);
      }, 3000);
      // Set logoFallen to true to trigger falling animation
      setLogoFallen(true);
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
   * Handle Pass & Play button click
   * Triggers dice animation from the top, then navigates to setup screen after delay
   * This gives time for the dice falling animation to complete
   */
  const handleSingleDeviceClick = () => {
    // Pass & Play button: dice come from the top of the screen
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
      <div className="text-center mb-16 w-full">
        {settings.visual.headerStyle === 'images' ? (
          <div
            className="flex items-center justify-center flex-nowrap gap-0.5 sm:gap-1 md:gap-[4px] mb-4 select-none"
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
              const animation = letterAnimations[index];
              
              // Determine transform based on state
              let transform = 'translate(0, 0)';
              let transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
              
              if (logoFallen && !prefersReducedMotion) {
                // Falling animation: combine translateX, translateY, and rotate
                transform = `translate(${animation.translateX}px, ${animation.translateY}px) rotate(${animation.rotate}deg)`;
                // Smooth falling animation with gravity effect
                transition = `transform 1.8s cubic-bezier(0.4, 0, 0.2, 1) ${animation.delay}ms`;
              } else if (dragState.index === index) {
                // User is dragging this letter
                transform = `translate(${dragState.x}px, ${dragState.y}px)`;
                transition = 'none';
              } else if (!logoFallen) {
                // Reset state: instantly snap back (no transition)
                transition = 'none';
              }
              
              return (
                <img
                  key={index}
                  src={letter}
                  alt={letterNames[index]}
                  className="h-12 sm:h-14 md:h-20 lg:h-24 xl:h-28 w-auto shrink-0 cursor-grab active:cursor-grabbing transition-transform hover:scale-105 max-w-none"
                  draggable={false}
                  onMouseDown={(e) => handleDragStart(e, index)}
                  onTouchStart={(e) => handleDragStart(e, index)}
                  style={{
                    transform,
                    transition,
                  }}
                />
              );
            })}
          </div>
        ) : (
          <h1
            className="font-serif text-headline md:text-display mb-4 cursor-pointer select-none active:scale-95 text-balance tracking-wide"
            style={{ color: textColor }}
            onClick={handleTitleClick}
          >
            {'YAHTZEE'.split('').map((letter, index) => {
              const animation = letterAnimations[index];
              
              // Determine transform based on state
              let transform = 'translate(0, 0)';
              let transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
              
              if (logoFallen && !prefersReducedMotion) {
                // Falling animation: combine translateX, translateY, and rotate
                transform = `translate(${animation.translateX}px, ${animation.translateY}px) rotate(${animation.rotate}deg)`;
                // Smooth falling animation with gravity effect
                transition = `transform 1.8s cubic-bezier(0.4, 0, 0.2, 1) ${animation.delay}ms`;
              } else if (!logoFallen) {
                // Reset state: instantly snap back (no transition)
                transition = 'none';
              }
              
              return (
                <span
                  key={index}
                  className="inline-block transition-transform"
                  style={{
                    transform,
                    transition,
                  }}
                >
                  {letter}
                </span>
              );
            })}
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
        {hasActiveGame ? (
          <Button
            variant="primary"
            size="large"
            fullWidth
            onClick={onResumeGame}
          >
            Resume Game
          </Button>
        ) : (
          <Button
            variant="primary"
            size="large"
            fullWidth
            onClick={handleSingleDeviceClick}
          >
            Pass & Play
          </Button>
        )}

        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={() => onSelectMode('multi')}
        >
          Join Game
        </Button>

        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={onOpenHistory}
        >
          History
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
          Free Forever • No Ads • <FooterMenu textColor={textColor} onOpenChangelog={onOpenChangelog} />
        </p>
      </div>
    </div>
  );
}
