import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import {
  UPPER_SECTION_CATEGORIES,
  LOWER_SECTION_CATEGORIES,
} from '../utils/gameConstants';
import {
  calculateUpperSectionSum,
  calculateUpperBonus,
  isCategoryScored,
} from '../utils/scoring';
import { getUpperBonusThreshold } from '../utils/gameConstants';

/**
 * Scorecard component displaying all Yahtzee categories
 */
export default function Scorecard({ scorecard, onCategoryClick, isCurrentPlayer, settings = null }) {
  const upperSum = calculateUpperSectionSum(scorecard);
  const upperBonus = calculateUpperBonus(scorecard, settings);
  const upperThreshold = getUpperBonusThreshold(settings);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-4 pb-16">
      {/* Upper Section */}
      <div className="flex flex-col">
        <h3 className="font-sans text-body-lg uppercase tracking-wider text-fg/70 mb-1 px-3">
          Upper
        </h3>
        <div className="space-y-0">
          {UPPER_SECTION_CATEGORIES.map(category => (
            <CategoryRow
              key={category.id}
              category={category}
              score={scorecard[category.id]}
              isScored={isCategoryScored(scorecard, category.id)}
              onClick={() => onCategoryClick(category.id)}
              isClickable={isCurrentPlayer}
            />
          ))}
        </div>

        {/* Upper Section Bonus */}
        <div className="flex justify-between items-center py-2 px-3 mt-1 bg-fg/10">
          <span className="font-sans text-ui text-fg/70">
            Bonus ({upperSum}/{upperThreshold})
          </span>
          <span className="font-sans text-body font-bold tabular-nums">
            {upperBonus > 0 ? `+${upperBonus}` : '—'}
          </span>
        </div>
      </div>

      {/* Lower Section */}
      <div className="flex flex-col mt-2 lg:mt-0">
        <h3 className="font-sans text-body-lg uppercase tracking-wider text-fg/70 mb-1 px-3">
          Lower
        </h3>
        <div className="space-y-0">
          {LOWER_SECTION_CATEGORIES.map(category => (
            <CategoryRow
              key={category.id}
              category={category}
              score={scorecard[category.id]}
              isScored={isCategoryScored(scorecard, category.id)}
              onClick={() => onCategoryClick(category.id)}
              isClickable={isCurrentPlayer}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

Scorecard.propTypes = {
  scorecard: PropTypes.object.isRequired,
  onCategoryClick: PropTypes.func.isRequired,
  isCurrentPlayer: PropTypes.bool,
  settings: PropTypes.object,
};

/**
 * Individual category row
 * Made keyboard accessible with tabIndex, role, and keyboard event handlers
 */
function CategoryRow({ category, score, isScored, onClick, isClickable }) {
  const baseStyles = "flex justify-between items-center text-fg py-2 md:py-2.5 px-3 min-h-[44px] transition-[background-color] duration-100 ease-out";

  // Interactive and scored styles (fg tokens follow the surface)
  const interactiveStyles = isClickable
    ? "cursor-pointer hover:bg-fg/10 active:bg-fg/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-fg/40"
    : "";

  const scoredStyles = isScored ? "bg-fg/20" : "opacity-50";

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
      className={`${baseStyles} ${interactiveStyles} ${scoredStyles}`}
      onClick={isClickable ? onClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      aria-label={isClickable ? (isScored ? `Edit score for ${category.name.toLowerCase()}` : `Enter score for ${category.name.toLowerCase()}`) : `${category.name.toLowerCase()}`}
      aria-disabled={!isClickable}
    >
      <span className="font-sans text-body font-bold uppercase">
        {category.name}
      </span>

      <div className="flex items-center gap-2">
        {isScored ? (
          <>
            <Icon
              icon={isClickable ? "basil:edit-solid" : "basil:check-solid"}
              className="w-5 h-5 opacity-50"
             
            />
            <span className="font-sans text-body font-bold min-w-[2.5rem] text-right tabular-nums">
              {score}
            </span>
          </>
        ) : (
          <span className="font-sans text-body opacity-30 min-w-[2.5rem] text-right">
            —
          </span>
        )}
      </div>
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
