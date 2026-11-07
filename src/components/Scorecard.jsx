import PropTypes from 'prop-types';
import {
  UPPER_SECTION_CATEGORIES,
  LOWER_SECTION_CATEGORIES,
  getUpperBonusThreshold,
} from '../utils/gameConstants';
import {
  calculateUpperSectionSum,
  calculateUpperBonus,
  calculateLowerSectionSum,
  calculateTotalScore,
  isCategoryScored,
} from '../utils/scoring';
import { cn } from '../utils/cn';

/**
 * Scorecard component displaying all Yahtzee categories.
 *
 * Hierarchy: open (still choosable) rows are full strength on a faint fill;
 * scored rows drop the fill and dim the label so the score itself is the
 * loudest thing in the row.
 */
export default function Scorecard({ scorecard, onCategoryClick, isCurrentPlayer, settings = null }) {
  const upperSum = calculateUpperSectionSum(scorecard);
  const upperBonus = calculateUpperBonus(scorecard, settings);
  const upperThreshold = getUpperBonusThreshold(settings);
  const lowerSum = calculateLowerSectionSum(scorecard);
  const total = calculateTotalScore(scorecard, settings);

  const renderRows = (categories) => (
    <div className="flex flex-col gap-px">
      {categories.map(category => (
        <CategoryRow
          key={category.id}
          category={category}
          score={scorecard[category.id]}
          isScored={isCategoryScored(scorecard, category.id)}
          onClick={() => onCategoryClick(category.id)}
          isClickable={!!isCurrentPlayer}
        />
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-x-4 pb-8">
      {/* Upper Section */}
      <section className="flex flex-col" aria-label="Upper section">
        <SectionLabel>Upper</SectionLabel>
        {renderRows(UPPER_SECTION_CATEGORIES)}
        <UpperBonus sum={upperSum} threshold={upperThreshold} bonus={upperBonus} />
      </section>

      {/* Lower Section */}
      <section className="flex flex-col mt-2 lg:mt-0" aria-label="Lower section">
        <SectionLabel>Lower</SectionLabel>
        {renderRows(LOWER_SECTION_CATEGORIES)}
      </section>

      {/* Totals */}
      <section
        className="lg:col-span-2 mt-3 pt-2 px-3 border-t-2 border-fg/20"
        aria-label="Totals"
      >
        <TotalLine label="Upper" value={upperSum + upperBonus} />
        <TotalLine label="Lower" value={lowerSum} />
        <div className="flex items-baseline justify-between pt-1">
          <span className="font-sans text-ui font-bold uppercase tracking-wider">Total</span>
          <span className="font-serif text-title leading-none tabular-nums">{total}</span>
        </div>
      </section>
    </div>
  );
}

Scorecard.propTypes = {
  scorecard: PropTypes.object.isRequired,
  onCategoryClick: PropTypes.func.isRequired,
  isCurrentPlayer: PropTypes.bool,
  settings: PropTypes.object,
};

function SectionLabel({ children }) {
  return (
    <h3 className="font-sans text-ui font-bold uppercase tracking-wider text-fg/70 px-3 h-6 flex items-end pb-0.5">
      {children}
    </h3>
  );
}

SectionLabel.propTypes = {
  children: PropTypes.node,
};

/** "Bonus 12 / 63" with a thin progress bar, "+35" once earned. */
function UpperBonus({ sum, threshold, bonus }) {
  const earned = bonus > 0;
  const progress = threshold > 0 ? Math.min(sum / threshold, 1) : 1;
  return (
    <div className="flex items-center gap-3 px-3 min-h-9">
      <span className="font-sans text-ui font-bold uppercase tracking-wider text-fg/70 whitespace-nowrap">
        Bonus{' '}
        <span className="text-fg tabular-nums">{sum}</span>
        <span className="tabular-nums"> / {threshold}</span>
      </span>
      <div
        className="flex-1 h-1 bg-fg/20 overflow-hidden"
        role="progressbar"
        aria-label="Upper bonus progress"
        aria-valuemin={0}
        aria-valuemax={threshold}
        aria-valuenow={Math.min(sum, threshold)}
      >
        <div className="h-full bg-fg" style={{ width: `${progress * 100}%` }} />
      </div>
      <span className="font-serif text-body-lg leading-none tabular-nums min-w-[2.5rem] text-right">
        {earned ? `+${bonus}` : ''}
      </span>
    </div>
  );
}

UpperBonus.propTypes = {
  sum: PropTypes.number.isRequired,
  threshold: PropTypes.number.isRequired,
  bonus: PropTypes.number.isRequired,
};

function TotalLine({ label, value }) {
  return (
    <div className="flex items-baseline justify-between py-0.5 text-fg/70">
      <span className="font-sans text-ui font-bold uppercase tracking-wider">{label}</span>
      <span className="font-sans text-body font-bold tabular-nums">{value}</span>
    </div>
  );
}

TotalLine.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

/**
 * Individual category row
 * Made keyboard accessible with tabIndex, role, and keyboard event handlers
 */
function CategoryRow({ category, score, isScored, onClick, isClickable }) {
  // Handle keyboard events for accessibility
  // Enter or Space key will trigger the click action
  const handleKeyDown = (e) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault(); // Prevent page scroll on Space
      onClick();
    }
  };

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : -1}
      className={cn(
        'flex justify-between items-center gap-3 px-3 min-h-10 text-fg',
        'transition-[background-color] duration-100 ease-out',
        isScored ? 'bg-transparent' : 'bg-fg/10',
        isClickable && 'cursor-pointer hover:bg-fg/20 active:bg-fg/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fg',
      )}
      onClick={isClickable ? onClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      aria-label={isClickable ? (isScored ? `Edit score for ${category.name.toLowerCase()}` : `Enter score for ${category.name.toLowerCase()}`) : `${category.name.toLowerCase()}${isScored ? `: ${score}` : ''}`}
      aria-disabled={!isClickable}
    >
      <span
        className={cn(
          'font-sans text-body font-bold uppercase',
          isScored && 'text-fg/70',
        )}
      >
        {category.name}
      </span>

      <span className="font-serif text-subtitle leading-none -my-1 min-w-[2.5rem] text-right tabular-nums">
        {isScored ? score : ''}
      </span>
    </div>
  );
}

CategoryRow.propTypes = {
  category: PropTypes.object.isRequired,
  score: PropTypes.number,
  isScored: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  isClickable: PropTypes.bool.isRequired,
};
