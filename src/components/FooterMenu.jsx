import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * FooterMenu Component
 *
 * A popover menu triggered by an "Info" button that displays:
 * - GitHub (link to repo)
 * - Changelog (button)
 * - Roadmap (link to Notion)
 * - "Free Forever • No Ads" tagline
 *
 * Features:
 * - Click outside to close
 * - Escape key to close
 * - Smooth scale-in animation
 */
export default function FooterMenu({ textColor, onOpenChangelog }) {
  const [isOpen, setIsOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ bottom: 0, left: null, right: null });

  const containerRef = useRef(null);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);

  const handleButtonClick = (e) => {
    e.stopPropagation();

    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const padding = 12; // padding from viewport edges

      // Position popover above the button
      const popoverBottom = window.innerHeight - buttonRect.top + 8;

      // Position from right edge to ensure it stays in viewport
      const rightDistance = window.innerWidth - buttonRect.right;

      setPopupPosition({
        bottom: popoverBottom,
        left: null,
        right: Math.max(padding, rightDistance - buttonRect.width / 2),
      });
    }

    setIsOpen(!isOpen);
  };

  const handleChangelogClick = () => {
    setIsOpen(false);
    onOpenChangelog();
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
        if (buttonRef.current) {
          buttonRef.current.focus();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <span className="relative inline-block" ref={containerRef}>
      {/* Info Button */}
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className="font-sans text-ui opacity-70 hover:opacity-100 transition-opacity cursor-pointer underline"
        style={{ color: textColor }}
        aria-label="Open info menu"
        type="button"
      >
        Info
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          ref={popupRef}
          className="fixed z-[10000] bg-black/90 dark:bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-2xl"
          style={{
            minWidth: '180px',
            maxWidth: 'calc(100vw - 24px)',
            bottom: `${popupPosition.bottom}px`,
            right: `${popupPosition.right}px`,
            transformOrigin: 'bottom right',
            animation: 'popoverScaleIn 200ms cubic-bezier(0.165, 0.84, 0.44, 1) forwards',
          }}
        >
          {/* Menu Items */}
          <div className="flex flex-col gap-3 text-center">
            <a
              href="https://github.com/gageminamoto/yahtzee-score-card"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-body text-white dark:text-black hover:opacity-70 transition-opacity"
            >
              GitHub
            </a>
            <button
              onClick={handleChangelogClick}
              className="font-sans text-body text-white dark:text-black hover:opacity-70 transition-opacity"
              type="button"
            >
              Changelog
            </button>
            <a
              href="https://gageminamoto.notion.site/ba3aa99c094c4e2eaec51c80ce6ba251?v=8e0862ea3dcc4a028acfacc9125b35d4&source=copy_link"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-body text-white dark:text-black hover:opacity-70 transition-opacity"
            >
              Roadmap
            </a>
          </div>
        </div>
      )}
    </span>
  );
}

FooterMenu.propTypes = {
  textColor: PropTypes.string.isRequired,
  onOpenChangelog: PropTypes.func.isRequired,
};
