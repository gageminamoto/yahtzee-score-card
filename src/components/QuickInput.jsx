import PropTypes from 'prop-types';
import { getCategoryById } from '../utils/gameConstants';
import { getValidScoresForCategory } from '../utils/scoring';
import { cn } from '../utils/cn';

const OPTION = 'font-sans text-body-lg tabular-nums transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.95] focus:outline-none focus-visible:ring-2 focus-visible:ring-fg';
const FINE_TUNE_BUTTON = 'h-12 bg-fg/10 text-fg font-sans text-body hover:bg-fg/20 active:scale-[0.97] transition-[background-color,transform] duration-150 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-fg';

/**
 * Category-aware preset buttons (controlled).
 *
 * Upper section: one button per non-zero multiple of the die value. These are
 * exact scores, so when `onCommit` is given a tap submits straight away.
 * Lower variable (3/4 of a Kind, Chance): 10-25 starting points plus a fine
 * tune row with a compact readout; these always select, never submit.
 * Scoring 0 is a separate, explicit "Scratch (0)" button.
 *
 * @param value    currently selected score, or null for none
 * @param onChange select a score (the parent shows a Confirm button)
 * @param onCommit optional: submit an exact score immediately
 */
export default function QuickInput({ categoryId, value, onChange, onCommit }) {
  const category = getCategoryById(categoryId);
  if (!category) return null;

  const isLowerVariable = category.section === 'lower' &&
                          category.maxScore !== undefined &&
                          category.fixedScore === undefined;

  const rawScores = getValidScoresForCategory(categoryId).filter(score => score > 0);
  const presets = isLowerVariable
    ? rawScores.filter(score => [10, 15, 20, 25].includes(score))
    : rawScores;

  // Exact scores submit immediately when the parent allows it
  const pickExact = (score) => (onCommit ? onCommit(score) : onChange(score));
  const handlePresetClick = (score) => (isLowerVariable ? onChange(score) : pickExact(score));

  const handleFineTune = (delta) => {
    const base = value ?? 0;
    onChange(Math.max(0, Math.min(base + delta, category.maxScore)));
  };

  // Selection highlights only matter when a tap selects rather than submits
  const showsSelection = (score) => (isLowerVariable || !onCommit) && value === score;
  const scratchSelected = !onCommit && value === 0;

  return (
    <div className="space-y-3">
      <div className={cn('grid gap-2', presets.length <= 4 ? 'grid-cols-4' : 'grid-cols-5')}>
        {presets.map((score) => {
          const isSelected = showsSelection(score);
          return (
            <button
              key={score}
              type="button"
              onClick={() => handlePresetClick(score)}
              aria-pressed={isLowerVariable || !onCommit ? isSelected : undefined}
              aria-label={!isLowerVariable && onCommit ? `Score ${score}` : undefined}
              className={cn(
                OPTION,
                'h-14',
                isSelected ? 'bg-fg text-surface' : 'bg-fg/10 text-fg hover:bg-fg/20',
              )}
            >
              {score}
            </button>
          );
        })}
      </div>

      {/* Fine-tune with compact readout for lower variable categories */}
      {isLowerVariable && (
        <div className="grid grid-cols-5 gap-2 items-center" role="group" aria-label="Fine tune score">
          <button
            type="button"
            onClick={() => handleFineTune(-5)}
            disabled={value === null || value <= 0}
            className={FINE_TUNE_BUTTON}
            aria-label="Minus 5"
          >
            -5
          </button>
          <button
            type="button"
            onClick={() => handleFineTune(-1)}
            disabled={value === null || value <= 0}
            className={FINE_TUNE_BUTTON}
            aria-label="Minus 1"
          >
            -1
          </button>
          <output
            className="h-12 flex items-center justify-center font-serif text-body-lg tabular-nums border-2 border-fg/40"
            aria-live="polite"
            aria-label="Selected score"
          >
            {value ?? '–'}
          </output>
          <button
            type="button"
            onClick={() => handleFineTune(1)}
            disabled={value !== null && value >= category.maxScore}
            className={FINE_TUNE_BUTTON}
            aria-label="Plus 1"
          >
            +1
          </button>
          <button
            type="button"
            onClick={() => handleFineTune(5)}
            disabled={value !== null && value >= category.maxScore}
            className={FINE_TUNE_BUTTON}
            aria-label="Plus 5"
          >
            +5
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => pickExact(0)}
        aria-pressed={!onCommit ? scratchSelected : undefined}
        className={cn(
          'w-full h-11 font-sans text-ui font-bold uppercase border-2 transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-fg',
          scratchSelected ? 'bg-fg text-surface border-fg' : 'border-fg/40 text-fg/70 hover:text-fg hover:bg-fg/10',
        )}
      >
        Scratch (0)
      </button>
    </div>
  );
}

QuickInput.propTypes = {
  categoryId: PropTypes.string.isRequired,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onCommit: PropTypes.func,
};
