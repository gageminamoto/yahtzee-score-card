import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { cn } from '../utils/cn';

/**
 * FooterMenu Component
 *
 * A popover menu triggered by an "Info" button that displays:
 * - GitHub (link to repo)
 * - Changelog (button)
 * - Roadmap (link to Notion)
 *
 * Features:
 * - Click outside to close
 * - Escape key to close
 * - Smooth scale-in animation
 */
export default function FooterMenu({ textColor, onOpenChangelog }) {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  const handleButtonClick = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChangelogClick = () => {
    handleClose();
    onOpenChangelog();
  };

  // Close popup when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target)) {
        handleClose();
      }
    };

    const handleEscape = (event) => {
      if (isOpen && event.key === 'Escape') {
        handleClose();
        buttonRef.current?.focus();
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

  const menuItems = [
    {
      label: 'GitHub',
      icon: 'mdi:github',
      href: 'https://github.com/gageminamoto/yahtzee-score-card',
    },
    {
      label: 'Changelog',
      icon: 'mdi:text-box-outline',
      onClick: handleChangelogClick,
    },
    {
      label: 'Roadmap',
      icon: 'mdi:map-outline',
      href: 'https://gageminamoto.notion.site/ba3aa99c094c4e2eaec51c80ce6ba251?v=8e0862ea3dcc4a028acfacc9125b35d4&source=copy_link',
    },
  ];

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
          className={cn(
            "absolute bottom-full right-0 mb-3 z-popover",
            "bg-white dark:bg-neutral-900",
            "shadow-2xl min-w-[240px]",
            "animate-scaleIn rounded-lg overflow-hidden"
          )}
          style={{ transformOrigin: 'bottom right' }}
          role="menu"
          aria-label="Info menu"
        >
          <div className="p-2">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/10 dark:border-white/10">
              <h3 className="font-sans text-body font-bold text-black dark:text-white">
                Info
              </h3>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Close"
                type="button"
              >
                <Icon icon="mdi:close" width={20} />
              </button>
            </div>

            {/* Menu Items */}
            <nav className="py-2">
              {menuItems.map((item) => {
                const content = (
                  <>
                    <div className="w-10 h-10 rounded-full bg-electric-blue/10 dark:bg-electric-blue/20 flex items-center justify-center flex-shrink-0">
                      <Icon icon={item.icon} width={20} className="text-electric-blue" />
                    </div>
                    <span className="font-sans text-body font-bold text-black dark:text-white">
                      {item.label}
                    </span>
                  </>
                );

                if (item.href) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-3 flex items-center gap-4 text-left hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      role="menuitem"
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="w-full px-4 py-3 flex items-center gap-4 text-left hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    role="menuitem"
                    type="button"
                  >
                    {content}
                  </button>
                );
              })}
            </nav>
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
