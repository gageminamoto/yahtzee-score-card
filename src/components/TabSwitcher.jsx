import PropTypes from 'prop-types';
import { HugeiconsIcon } from '@hugeicons/react';
import { DiceIcon, Lightning } from '@hugeicons/core-free-icons';

/**
 * Tab switcher component for selecting input method
 * Shows three tabs: Dice, Quick, and Adjust
 * Active tab is highlighted in electric blue
 */
export default function TabSwitcher({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'dice', label: 'Dice', name: 'Dice', icon: DiceIcon },
    { id: 'quick', label: 'Quick', name: 'Quick', icon: Lightning },
    { id: 'adjust', label: '+/- Adjust', name: 'Adjust', icon: null },
  ];

  return (
    <div className="flex gap-2 mb-6 bg-black/20 dark:bg-white/20 p-1 rounded-lg">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1 py-3 px-4 rounded-md font-sans font-bold text-body
              transition-all duration-150 ease-out
              active:scale-[0.97]
              flex items-center justify-center gap-2
              ${
                isActive
                  ? 'bg-electric-blue text-white dark:text-white shadow-lg'
                  : 'text-white dark:text-black opacity-60 dark:opacity-60 hover:opacity-80 dark:hover:opacity-80 hover:bg-black/20 dark:hover:bg-white/20'
              }
            `}
          >
            {tab.icon && (
              <HugeiconsIcon
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
  activeTab: PropTypes.oneOf(['dice', 'quick', 'adjust']).isRequired,
  onTabChange: PropTypes.func.isRequired,
};
