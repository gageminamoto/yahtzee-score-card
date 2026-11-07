import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useSettings } from '../context/SettingsContext';
import Button from './Button';
import { cn } from '../utils/cn';

const supportsVibration = 'vibrate' in navigator;

const TOGGLE_ITEMS = [
  {
    key: 'enableSoundEffects',
    label: 'Sound Effects',
    icon: 'basil:volume-up-solid',
    iconOff: 'basil:volume-off-solid',
  },
  supportsVibration && {
    key: 'enableHapticFeedback',
    label: 'Haptics',
    icon: 'basil:notification-on-solid',
    iconOff: 'basil:notification-off-solid',
  },
  {
    key: 'keepScreenAwake',
    label: 'Keep Screen On',
    icon: 'basil:lightbulb-solid',
    iconOff: 'basil:lightbulb-outline',
  },
].filter(Boolean);

const MENU_ITEM = 'w-full flex items-center gap-3 px-3 py-2.5 text-fg transition-colors duration-100 hover:bg-fg/10';

/**
 * Quick settings menu for the game header. The panel uses the surrounding
 * surface (bg-surface / text-fg), so it matches the current player colour.
 */
export default function QuickSettingsPopover({ onQuitGame }) {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSetting } = useSettings();

  const containerRef = useRef(null);
  const popoverRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <span className="relative inline-block" ref={containerRef}>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full"
        aria-label="Quick settings"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icon icon="basil:settings-solid" className="w-5 h-5" />
      </Button>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute top-full right-0 mt-2 z-popover bg-surface border-2 border-fg/20 shadow-2xl p-2"
          style={{
            minWidth: '200px',
            transformOrigin: 'top right',
            animation: 'popoverScaleIn 200ms cubic-bezier(0.165, 0.84, 0.44, 1) forwards',
          }}
          role="menu"
          aria-label="Quick settings"
        >
          {TOGGLE_ITEMS.map(({ key, label, icon, iconOff }) => {
            const enabled = settings.accessibility[key];
            return (
              <button
                key={key}
                onClick={() => updateSetting('accessibility', key, !enabled)}
                className={MENU_ITEM}
                role="menuitemcheckbox"
                aria-checked={enabled}
                type="button"
              >
                <Icon
                  icon={enabled ? icon : iconOff}
                  className="w-5 h-5 flex-shrink-0"
                />
                <span className="font-sans text-ui font-bold flex-1 text-left whitespace-nowrap">
                  {label}
                </span>
                <div
                  className={cn(
                    'w-9 h-5 rounded-full border border-fg/40 relative transition-colors duration-150 flex-shrink-0',
                    enabled ? 'bg-fg' : 'bg-transparent',
                  )}
                >
                  <div
                    className={cn(
                      'absolute top-0.5 w-3.5 h-3.5 rounded-full transition-transform duration-150',
                      enabled ? 'translate-x-4 bg-surface' : 'translate-x-0.5 bg-fg/70',
                    )}
                  />
                </div>
              </button>
            );
          })}

          {/* Divider */}
          <div className="my-1 mx-3 border-t border-fg/20" />

          {/* Quit Game */}
          <button
            onClick={() => {
              setIsOpen(false);
              onQuitGame();
            }}
            className={MENU_ITEM}
            role="menuitem"
            type="button"
          >
            <Icon
              icon="basil:logout-solid"
              className="w-5 h-5 flex-shrink-0"
            />
            <span className="font-sans text-ui font-bold flex-1 text-left whitespace-nowrap">
              Quit Game
            </span>
          </button>
        </div>
      )}
    </span>
  );
}

QuickSettingsPopover.propTypes = {
  onQuitGame: PropTypes.func.isRequired,
};
