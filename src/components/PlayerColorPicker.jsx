import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { colorSchemes, playerColors } from '../utils/colors';
import { cn } from '../utils/cn';

/**
 * PlayerColorPicker Component
 * 
 * Allows players to select their color from the available palette.
 * Shows a clickable color circle that opens a popup with all available colors.
 * Highlights which colors are already taken by other players.
 * 
 * Features:
 * - Click the circle to open color picker
 * - Shows all colors from current color scheme
 * - Indicates which colors are taken (reduced opacity)
 * - Click outside to close
 * - Smooth animations
 */
export default function PlayerColorPicker({
  currentColor,
  usedColors = [],
  colorScheme = 'default',
  onColorChange,
}) {
  // State to control popup visibility
  const [isOpen, setIsOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [transformOrigin, setTransformOrigin] = useState('center center');
  
  // Refs for click-outside detection
  const containerRef = useRef(null);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);

  // Get available colors from the current color scheme
  const availableColors = colorSchemes[colorScheme]?.player || playerColors;

  // Handle clicking the color circle to toggle popup
  const handleCircleClick = (e) => {
    e.stopPropagation();
    
    // Calculate position and transform-origin for fixed positioning
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      
      // Position popover to the right of the button (to avoid covering input field)
      // Align top of popover with top of button, position to the right
      const popoverTop = buttonRect.top; // Same top as button
      const popoverLeft = buttonRect.right + 8; // 8px gap to the right of button
      
      setPopupPosition({
        top: popoverTop,
        left: popoverLeft,
      });
      
      // Transform-origin: left edge of popover (where it connects to button)
      // Vertical: align with button's top (0 from popover's top)
      // This makes the popover scale from the button's left edge
      setTransformOrigin('0 0');
    }
    
    setIsOpen(!isOpen);
  };

  // Handle selecting a color
  const handleColorSelect = (color) => {
    // Don't allow selecting the same color (no change needed)
    if (color === currentColor) {
      setIsOpen(false);
      return;
    }
    
    // Call the callback to update the player's color
    onColorChange(color);
    setIsOpen(false);
  };

  // Check if a color is currently being used by another player
  // (exclude the current player's color from the check)
  const isColorTaken = (color) => {
    // Filter out the current player's color to see if another player has this color
    const otherPlayersColors = usedColors.filter(c => c !== currentColor);
    return otherPlayersColors.includes(color);
  };

  // Close popup when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        containerRef.current &&
        popupRef.current &&
        !containerRef.current.contains(event.target) &&
        !popupRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (isOpen && event.key === 'Escape') {
        setIsOpen(false);
        // Return focus to the button that opened the popup
        if (buttonRef.current) {
          buttonRef.current.focus();
        }
      }
    };

    if (isOpen) {
      // Add listeners when popup is open
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    // Cleanup listeners when popup closes or component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      {/* Main Color Circle - Clickable */}
      <button
        ref={buttonRef}
        onClick={handleCircleClick}
        className="w-12 h-12 rounded-full flex-shrink-0 border-4 border-fg transition-transform duration-150 ease-out hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2 relative z-0"
        style={{ backgroundColor: currentColor }}
        aria-label="Change player color"
        aria-expanded={isOpen}
        type="button"
      />

      {/* Color Picker Popup - origin-aware animation scales from top-left of trigger button */}
      {isOpen && (
        <div
          ref={popupRef}
          className="fixed z-popover bg-fg text-surface p-4 shadow-2xl"
          style={{ 
            minWidth: '200px',
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
            transformOrigin: transformOrigin,
            animation: 'popoverScaleIn 200ms cubic-bezier(0.165, 0.84, 0.44, 1) forwards'
          }}
        >
          {/* Popup Title */}
          <div className="mb-3">
            <p className="font-sans text-body font-bold">
              Choose Color
            </p>
          </div>

          {/* Color Grid */}
          <div className="grid grid-cols-4 gap-3">
            {availableColors.map((color, index) => {
              const isTaken = isColorTaken(color);
              const isCurrent = color === currentColor;
              
              return (
                <button
                  key={index}
                  onClick={() => handleColorSelect(color)}
                  disabled={isTaken && !isCurrent}
                  className={cn(
                    'w-12 h-12 rounded-full border-4 transition-all duration-150 relative',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-surface',
                    isCurrent
                      ? 'border-surface scale-110 ring-2 ring-surface ring-offset-2 ring-offset-fg'
                      : isTaken
                      ? 'border-dashed border-surface/70 cursor-not-allowed'
                      : 'border-transparent hover:scale-110 hover:border-surface/40 cursor-pointer',
                  )}
                  style={{ backgroundColor: color }}
                  aria-label={`Select ${color}${isTaken && !isCurrent ? ' (taken)' : ''}`}
                  type="button"
                >
                </button>
              );
            })}
          </div>

          {/* Helper Text */}
          <p className="font-sans text-ui text-surface/70 mt-3 text-center">
            {availableColors.filter(c => {
              const otherPlayersColors = usedColors.filter(uc => uc !== currentColor);
              return !otherPlayersColors.includes(c);
            }).length === 0
              ? 'All colors taken'
              : 'Tap a color to select'}
          </p>
        </div>
      )}
    </div>
  );
}

PlayerColorPicker.propTypes = {
  currentColor: PropTypes.string.isRequired,
  usedColors: PropTypes.arrayOf(PropTypes.string),
  colorScheme: PropTypes.string,
  onColorChange: PropTypes.func.isRequired,
};
