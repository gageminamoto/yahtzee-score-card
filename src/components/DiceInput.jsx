import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getCategoryById } from '../utils/gameConstants';

/**
 * Dice Input Component
 * Allows users to tap dice icons to build their roll
 * Auto-calculates score based on selected category
 */
export default function DiceInput({ categoryId, onScoreChange }) {
  const [selectedDice, setSelectedDice] = useState([]);
  const category = getCategoryById(categoryId);

  // Dice faces with Unicode characters
  const diceFaces = [
    { value: 1, symbol: '⚀', label: '1' },
    { value: 2, symbol: '⚁', label: '2' },
    { value: 3, symbol: '⚂', label: '3' },
    { value: 4, symbol: '⚃', label: '4' },
    { value: 5, symbol: '⚄', label: '5' },
    { value: 6, symbol: '⚅', label: '6' },
  ];

  // Calculate score based on selected dice and category
  useEffect(() => {
    if (!category || selectedDice.length === 0) {
      onScoreChange(0);
      return;
    }

    // For upper section categories, sum only the matching dice
    if (category.section === 'upper') {
      // Map category ID to die value (e.g., 'ones' -> 1, 'threes' -> 3)
      const categoryToValue = {
        'ones': 1,
        'twos': 2,
        'threes': 3,
        'fours': 4,
        'fives': 5,
        'sixes': 6,
      };
      
      const targetValue = categoryToValue[category.id] || (category.maxScore / 5);
      const score = selectedDice.filter(die => die === targetValue).length * targetValue;
      onScoreChange(score);
    } else {
      // For lower section categories, sum all dice
      const score = selectedDice.reduce((sum, die) => sum + die, 0);
      onScoreChange(score);
    }
  }, [selectedDice, category, onScoreChange]);

  // Handle die selection - always adds a die when clicking the button
  // Users remove dice by clicking on them in the "Selected" area below
  const handleDieClick = (dieValue) => {
    // Always add the die if under the limit (max 5 dice total)
    if (selectedDice.length < 5) {
      setSelectedDice([...selectedDice, dieValue]);
    }
  };

  // Handle removing a specific die from selection
  const handleRemoveDie = (index) => {
    setSelectedDice(selectedDice.filter((_, i) => i !== index));
  };

  // Clear all selections
  const handleClear = () => {
    setSelectedDice([]);
  };

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="text-center">
        <p className="font-sans text-body text-white/90 dark:text-black/90 mb-4">
          Your Roll (tap to add):
        </p>
      </div>

      {/* Dice Selection Grid */}
      <div className="grid grid-cols-6 gap-2 mb-4">
        {diceFaces.map((die) => {
          const count = selectedDice.filter(d => d === die.value).length;
          const isSelected = count > 0;
          
          return (
            <button
              key={die.value}
              onClick={() => handleDieClick(die.value)}
              disabled={selectedDice.length >= 5}
              className={`
                aspect-square bg-black/20 dark:bg-white/20 text-white dark:text-black 
                font-serif text-subtitle rounded-md
                transition-all duration-150 ease-out
                active:scale-[0.95]
                ${
                  isSelected
                    ? 'bg-electric-blue bg-opacity-80 dark:bg-opacity-80 ring-2 ring-white dark:ring-black'
                    : 'hover:bg-opacity-40 dark:hover:bg-opacity-40 disabled:opacity-30 disabled:cursor-not-allowed'
                }
              `}
            >
              <div className="flex flex-col items-center justify-center h-full py-1">
                {/* Die icon at the top */}
                <span className="text-2xl leading-none">{die.symbol}</span>
                {/* Main number label in the middle */}
                <span className="text-xs leading-tight mt-0.5">{die.label}</span>
                {/* Multiplier text at the bottom - shows when count > 1 */}
                {count > 1 && (
                  <span className="text-xs font-bold leading-tight mt-0.5">×{count}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Dice Display */}
      {selectedDice.length > 0 && (
        <div className="space-y-2">
          <p className="font-sans text-ui text-white/90 dark:text-black/90 text-center">
            Selected: {selectedDice.map((die, index) => {
              const face = diceFaces.find(d => d.value === die);
              return (
                <button
                  key={index}
                  onClick={() => handleRemoveDie(index)}
                  className="inline-block mx-1 text-2xl hover:scale-110 transition-transform"
                  title="Tap to remove"
                >
                  {face?.symbol}
                </button>
              );
            })}
          </p>
          <button
            onClick={handleClear}
            className="w-full py-2 bg-black/20 dark:bg-white/20 text-white dark:text-black font-sans text-body rounded-md hover:bg-opacity-40 dark:hover:bg-opacity-40 active:scale-[0.97] transition-all duration-150"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

DiceInput.propTypes = {
  categoryId: PropTypes.string.isRequired,
  onScoreChange: PropTypes.func.isRequired,
};
