import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useSettings } from '../context/SettingsContext';

const TOGGLE_ITEMS = [
  {
    key: 'enableSoundEffects',
    label: 'Sound Effects',
    icon: 'basil:volume-up-solid',
    iconOff: 'basil:volume-off-solid',
  },
  {
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
];

export default function QuickSettingsPopover({ textColor, playerColor }) {
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

  const isBlack = textColor === '#000000';

  return (
    <span className="relative inline-block" ref={containerRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/15 dark:hover:bg-black/15 active:scale-95 transition-all duration-150"
        style={{ color: textColor }}
        aria-label="Quick settings"
        aria-expanded={isOpen}
        aria-haspopup="true"
        type="button"
      >
        <Icon icon="basil:settings-solid" className="w-5 h-5" />
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute top-full right-0 mt-2 z-popover rounded-lg shadow-2xl p-2"
          style={{
            backgroundColor: playerColor,
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
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors duration-100 hover:bg-white/10 dark:hover:bg-black/10"
                style={{ color: textColor }}
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
                  className="w-9 h-5 rounded-full border relative transition-colors duration-150 flex-shrink-0"
                  style={{
                    borderColor: isBlack ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.5)',
                    backgroundColor: enabled
                      ? (isBlack ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)')
                      : 'transparent',
                  }}
                >
                  <div
                    className="absolute top-0.5 w-3.5 h-3.5 rounded-full transition-transform duration-150"
                    style={{
                      backgroundColor: enabled
                        ? playerColor
                        : (isBlack ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.6)'),
                      transform: enabled ? 'translateX(16px)' : 'translateX(2px)',
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </span>
  );
}

QuickSettingsPopover.propTypes = {
  textColor: PropTypes.string.isRequired,
  playerColor: PropTypes.string.isRequired,
};
