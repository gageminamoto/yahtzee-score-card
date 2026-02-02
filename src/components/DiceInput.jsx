import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getCategoryById } from '../utils/gameConstants';
import { playDiceAdd, playDiceDud, isSoundEnabled } from '../utils/sounds';

/**
 * Dice Input Component
 * Allows users to tap dice icons to build their roll
 * Auto-calculates score based on selected category
 */
export default function DiceInput({ categoryId, onScoreChange, playerColor, textColor }) {
  const isDarkText = textColor === '#000000';
  const [selectedDice, setSelectedDice] = useState([]);
  const category = getCategoryById(categoryId);

  // Dice faces with Unicode characters
  const diceFaces = [
    { value: 1, symbol: '⚀' },
    { value: 2, symbol: '⚁' },
    { value: 3, symbol: '⚂' },
    { value: 4, symbol: '⚃' },
    { value: 5, symbol: '⚄' },
    { value: 6, symbol: '⚅' },
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

  // Map upper section category IDs to their target die value
  const upperTargetValue = category?.section === 'upper'
    ? { ones: 1, twos: 2, threes: 3, fours: 4, fives: 5, sixes: 6 }[category.id] || null
    : null;

  // Handle die selection - always adds a die when clicking the button
  const handleDieClick = (dieValue) => {
    if (selectedDice.length < 5) {
      const newCount = selectedDice.length + 1;
      setSelectedDice([...selectedDice, dieValue]);
      if (isSoundEnabled()) {
        if (upperTargetValue !== null && dieValue !== upperTargetValue) {
          playDiceDud();
        } else {
          playDiceAdd(newCount);
        }
      }
    }
  };

  // Handle removing a specific die from the lineup
  const handleRemoveDie = (index) => {
    setSelectedDice(selectedDice.filter((_, i) => i !== index));
  };

  // Clear all selections
  const handleClear = () => {
    setSelectedDice([]);
  };

  // Get symbol for a die value
  const getSymbol = (value) => {
    return diceFaces.find(d => d.value === value)?.symbol || '';
  };

  return (
    <div className="space-y-4">
      {/* Dice Lineup - 5 slots */}
      <div className="grid grid-cols-5 gap-2">
        {[0, 1, 2, 3, 4].map((slotIndex) => {
          const hasDie = slotIndex < selectedDice.length;
          const dieValue = selectedDice[slotIndex];

          return (
            <button
              key={slotIndex}
              onClick={() => hasDie && handleRemoveDie(slotIndex)}
              disabled={!hasDie}
              className={`
                aspect-square rounded-lg flex items-center justify-center relative
                transition-all duration-150 ease-out
                ${
                  hasDie
                    ? 'text-5xl cursor-pointer active:scale-95 hover:opacity-80 leading-none'
                    : `border-2 border-dashed ${isDarkText ? 'border-black/30' : 'border-white/30'} cursor-default`
                }
              `}
              style={hasDie ? { backgroundColor: playerColor, color: textColor } : undefined}
            >
              {hasDie && (
                <>
                  <span className="-translate-y-1 leading-none">{getSymbol(dieValue)}</span>
                  <span
                    className={`absolute -top-1 -right-1 w-5 h-5 ${isDarkText ? 'bg-black/90' : 'bg-white/90'} rounded-full text-xs font-bold flex items-center justify-center`}
                    style={{ color: playerColor }}
                  >
                    ×
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Instructions / Reset Dice */}
      {selectedDice.length > 0 ? (
        <button
          onClick={handleClear}
          className="w-full font-sans text-body underline opacity-70 hover:opacity-100 transition-all text-center"
          style={{ color: textColor }}
        >
          Reset Dice
        </button>
      ) : (
        <p className="font-sans text-body text-center opacity-70" style={{ color: textColor }}>
          Tap dice below to add to your roll
        </p>
      )}

      {/* Dice Selection Grid */}
      <div className="grid grid-cols-6 gap-2">
        {diceFaces.map((die) => (
          <button
            key={die.value}
            onClick={() => handleDieClick(die.value)}
            disabled={selectedDice.length >= 5}
            className="
              aspect-square bg-black/20
              rounded-md p-1
              transition-all duration-150 ease-out
              active:scale-95
              hover:bg-opacity-40
              disabled:opacity-30 disabled:cursor-not-allowed
              flex flex-col items-center justify-center leading-none
            "
            style={{ color: textColor }}
          >
            <span className="text-4xl -translate-y-0.5">{die.symbol}</span>
            <span className="text-xs font-medium opacity-70">{die.value}</span>
          </button>
        ))}
      </div>

    </div>
  );
}

DiceInput.propTypes = {
  categoryId: PropTypes.string.isRequired,
  onScoreChange: PropTypes.func.isRequired,
  playerColor: PropTypes.string,
  textColor: PropTypes.string,
};
