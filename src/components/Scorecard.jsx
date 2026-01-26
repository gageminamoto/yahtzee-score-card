import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Card } from './';
import {
  UPPER_SECTION_CATEGORIES,
  LOWER_SECTION_CATEGORIES,
} from '../utils/gameConstants';
import {
  calculateUpperSectionSum,
  calculateUpperBonus,
  isCategoryScored,
} from '../utils/scoring';
import { UPPER_SECTION_BONUS_THRESHOLD } from '../utils/gameConstants';

/**
 * Scorecard component displaying all Yahtzee categories
 */
export default function Scorecard({ scorecard, onCategoryClick, isCurrentPlayer, textColor = '#FFFFFF' }) {
  const upperSum = calculateUpperSectionSum(scorecard);
  const upperBonus = calculateUpperBonus(scorecard);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4">
      {/* Upper Section */}
      <Card padding="xs" className="flex flex-col h-full md:p-3">
        <h3
          className="font-serif text-body-lg mb-0.5 md:mb-1 border-b-2 border-white/30 dark:border-black/30 pb-0.5 md:pb-1 text-center"
          style={{ color: textColor }}
        >
          UPPER SECTION
        </h3>
        <div className="flex-grow space-y-0">
          {UPPER_SECTION_CATEGORIES.map(category => (
            <CategoryRow
              key={category.id}
              category={category}
              score={scorecard[category.id]}
              isScored={isCategoryScored(scorecard, category.id)}
              onClick={() => onCategoryClick(category.id)}
              isClickable={isCurrentPlayer}
              textColor={textColor}
            />
          ))}
        </div>

        {/* Upper Section Bonus */}
        <div className="border-t-2 border-white/30 dark:border-black/30 pt-1 md:pt-2 mt-auto">
          <div className="flex justify-between items-center py-0.5 md:py-1 px-2">
            <span className="font-sans text-ui" style={{ color: textColor }}>
              BONUS ({upperSum}/{UPPER_SECTION_BONUS_THRESHOLD})
            </span>
            <span className="font-serif text-body font-bold tabular-nums" style={{ color: textColor }}>
              {upperBonus > 0 ? `+${upperBonus}` : '—'}
            </span>
          </div>
        </div>
      </Card>

      {/* Lower Section */}
      <Card padding="xs" className="flex flex-col h-full md:p-3">
        <h3
          className="font-serif text-body-lg mb-0.5 md:mb-1 border-b-2 border-white/30 dark:border-black/30 pb-0.5 md:pb-1 text-center"
          style={{ color: textColor }}
        >
          LOWER SECTION
        </h3>
        <div className="flex-grow space-y-0">
          {LOWER_SECTION_CATEGORIES.map(category => (
            <CategoryRow
              key={category.id}
              category={category}
              score={scorecard[category.id]}
              isScored={isCategoryScored(scorecard, category.id)}
              onClick={() => onCategoryClick(category.id)}
              isClickable={isCurrentPlayer}
              textColor={textColor}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

Scorecard.propTypes = {
  scorecard: PropTypes.object.isRequired,
  onCategoryClick: PropTypes.func.isRequired,
  isCurrentPlayer: PropTypes.bool,
  textColor: PropTypes.string,
};

/**
 * Individual category row
 * Made keyboard accessible with tabIndex, role, and keyboard event handlers
 */
function CategoryRow({ category, score, isScored, onClick, isClickable, textColor = '#FFFFFF' }) {
  const baseStyles = "flex justify-between items-center py-1.5 md:py-2 px-2 min-h-[36px] md:min-h-[44px] transition-[background-color] duration-100 ease-out";

  // Theme-aware interactive and scored styles
  const interactiveStyles = isClickable
    ? "cursor-pointer hover:bg-white/10 dark:hover:bg-black/10 active:bg-white/20 dark:active:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-black focus:ring-offset-2"
    : "";

  const scoredStyles = isScored ? "bg-black/20 dark:bg-white/20" : "";

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
      <span className="font-sans text-body font-bold uppercase" style={{ color: textColor }}>
        {category.name}
      </span>

      <div className="flex items-center gap-2">
        {isScored ? (
          <>
            <Icon
              icon={isClickable ? "basil:edit-solid" : "basil:check-solid"}
              className="w-5 h-5 opacity-50"
              style={{ color: textColor }}
            />
            <span className="font-serif text-body font-bold min-w-[2.5rem] text-right tabular-nums" style={{ color: textColor }}>
              {score}
            </span>
          </>
        ) : (
          <span className="font-serif text-body opacity-30 min-w-[2.5rem] text-right" style={{ color: textColor }}>
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
  textColor: PropTypes.string,
};
