import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

/**
 * Tab switcher component for selecting input method
 * Shows two tabs: Dice and Quick
 * Active tab is highlighted in electric blue
 * Supports keyboard navigation with arrow keys
 */
export default function TabSwitcher({ activeTab, onTabChange, firstTabRef, textColor }) {
  const isDarkText = textColor === '#000000';
  const tabs = [
    { id: 'quick', label: 'Quick', name: 'Quick', icon: 'basil:lightning-solid' },
    { id: 'dice', label: 'Dice', name: 'Dice', icon: 'mdi:dice-5' },
  ];

  // Handle arrow key navigation between tabs
  const handleKeyDown = (e, currentTabId) => {
    const currentIndex = tabs.findIndex(tab => tab.id === currentTabId);
    
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const direction = e.key === 'ArrowLeft' ? -1 : 1;
      const newIndex = (currentIndex + direction + tabs.length) % tabs.length;
      onTabChange(tabs[newIndex].id);
    }
  };

  return (
    <div 
      className="flex gap-2 mb-6 bg-black/20 p-1 rounded-lg"
      role="tablist"
      aria-label="Input method selection"
    >
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            ref={index === 0 ? firstTabRef : null}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            className={`
              flex-1 py-3 px-4 rounded-md font-sans font-bold text-body
              transition-all duration-150 ease-out
              active:scale-[0.97]
              flex items-center justify-center gap-2
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${isDarkText ? 'focus:ring-black' : 'focus:ring-white'}
              ${
                isActive
                  ? `${isDarkText ? 'bg-black/10' : 'bg-white/30'} shadow-lg`
                  : 'opacity-60 hover:opacity-80 hover:bg-black/20'
              }
            `}
            style={{ color: textColor }}
          >
            {tab.icon && (
              <Icon
                icon={tab.icon}
                className="w-6 h-6"
              />
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

TabSwitcher.propTypes = {
  activeTab: PropTypes.oneOf(['dice', 'quick']).isRequired,
  onTabChange: PropTypes.func.isRequired,
  firstTabRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  textColor: PropTypes.string,
};
