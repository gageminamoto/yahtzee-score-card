import { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { getCategoryById } from '../utils/gameConstants';
import { playDiceAdd, playDiceDud, isSoundEnabled } from '../utils/sounds';
import { cn } from '../utils/cn';

const DICE_FACES = [
  { value: 1, symbol: '⚀' },
  { value: 2, symbol: '⚁' },
  { value: 3, symbol: '⚂' },
  { value: 4, symbol: '⚃' },
  { value: 5, symbol: '⚄' },
  { value: 6, symbol: '⚅' },
];

const UPPER_TARGET = { ones: 1, twos: 2, threes: 3, fours: 4, fives: 5, sixes: 6 };

const getSymbol = (value) => DICE_FACES.find(d => d.value === value)?.symbol || '';

/**
 * Dice Input Component
 * Tap dice faces to build the roll; the score is calculated for the category.
 * The roll, its score and a clear button share one compact strip.
 * Reports null while no dice are selected.
 */
export default function DiceInput({ categoryId, onScoreChange }) {
  const [selectedDice, setSelectedDice] = useState([]);
  const category = getCategoryById(categoryId);
  const upperTargetValue = category?.section === 'upper' ? UPPER_TARGET[category.id] ?? null : null;

  const scoreFor = (dice) => {
    if (!category || dice.length === 0) return null;
    if (upperTargetValue !== null) {
      return dice.filter(die => die === upperTargetValue).length * upperTargetValue;
    }
    return dice.reduce((sum, die) => sum + die, 0);
  };

  const updateDice = (dice) => {
    setSelectedDice(dice);
    onScoreChange(scoreFor(dice));
  };

  const handleDieClick = (dieValue) => {
    if (selectedDice.length >= 5) return;
    updateDice([...selectedDice, dieValue]);
    if (isSoundEnabled()) {
      if (upperTargetValue !== null && dieValue !== upperTargetValue) {
        playDiceDud();
      } else {
        playDiceAdd(selectedDice.length + 1);
      }
    }
  };

  const handleRemoveDie = (index) => updateDice(selectedDice.filter((_, i) => i !== index));
  const handleClear = () => updateDice([]);

  const score = scoreFor(selectedDice);

  return (
    <div className="space-y-3">
      {/* Roll strip: 5 slots + score / hint + clear */}
      <div className="flex items-center gap-1.5 h-12">
        {[0, 1, 2, 3, 4].map((slotIndex) => {
          const hasDie = slotIndex < selectedDice.length;
          const dieValue = selectedDice[slotIndex];
          return (
            <button
              key={slotIndex}
              type="button"
              onClick={() => hasDie && handleRemoveDie(slotIndex)}
              disabled={!hasDie}
              className={cn(
                'w-10 h-10 flex-shrink-0 flex items-center justify-center transition-[background-color,transform] duration-150 ease-out',
                hasDie
                  ? 'bg-fg text-surface text-body-lg leading-none cursor-pointer active:scale-95 hover:bg-fg/85'
                  : 'border-2 border-dashed border-fg/40 cursor-default',
              )}
              aria-label={hasDie ? `Remove ${dieValue}` : `Empty slot ${slotIndex + 1}`}
            >
              {hasDie && <span className="-translate-y-0.5 leading-none">{getSymbol(dieValue)}</span>}
            </button>
          );
        })}

        <div className="flex-1 min-w-0 flex items-center justify-end gap-1">
          {score === null ? (
            <p className="font-sans text-ui text-fg/70 text-right leading-tight">
              Tap dice below
            </p>
          ) : (
            <>
              <output className="font-serif text-body-lg tabular-nums leading-none" aria-live="polite" aria-label="Dice score">
                {score}
              </output>
              <button
                type="button"
                onClick={handleClear}
                className="w-8 h-8 flex items-center justify-center text-fg/70 hover:text-fg hover:bg-fg/10"
                aria-label="Reset dice"
                title="Reset dice"
              >
                <Icon icon="basil:cross-solid" className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Dice faces */}
      <div className="grid grid-cols-6 gap-2">
        {DICE_FACES.map((die) => (
          <button
            key={die.value}
            type="button"
            onClick={() => handleDieClick(die.value)}
            disabled={selectedDice.length >= 5}
            aria-label={`Add ${die.value}`}
            className="
              aspect-square bg-fg/10 text-fg p-1
              transition-[background-color,transform,opacity] duration-150 ease-out
              active:scale-95
              hover:bg-fg/20
              disabled:opacity-30 disabled:cursor-not-allowed
              flex flex-col items-center justify-center leading-none
            "
          >
            <span className="text-subtitle leading-none -translate-y-0.5">{die.symbol}</span>
            <span className="text-ui font-medium text-fg/70">{die.value}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

DiceInput.propTypes = {
  categoryId: PropTypes.string.isRequired,
  onScoreChange: PropTypes.func.isRequired,
};
