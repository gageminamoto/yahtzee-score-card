import PropTypes from 'prop-types';
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
export default function Scorecard({ scorecard, onCategoryClick, isCurrentPlayer }) {
  const upperSum = calculateUpperSectionSum(scorecard);
  const upperBonus = calculateUpperBonus(scorecard);

  return (
    <div className="space-y-6">
      {/* Upper Section */}
      <Card padding="medium">
        <h3 className="font-serif text-subtitle text-white mb-4 border-b-4 border-black pb-2">
          UPPER SECTION
        </h3>
        <div className="space-y-2">
          {UPPER_SECTION_CATEGORIES.map(category => (
            <CategoryRow
              key={category.id}
              category={category}
              score={scorecard[category.id]}
              isScored={isCategoryScored(scorecard, category.id)}
              onClick={() => onCategoryClick(category.id)}
              isClickable={isCurrentPlayer && !isCategoryScored(scorecard, category.id)}
            />
          ))}

          {/* Upper Section Bonus */}
          <div className="border-t-4 border-black pt-2 mt-4">
            <div className="flex justify-between items-center py-2">
              <span className="font-sans text-body text-white">
                BONUS ({upperSum}/{UPPER_SECTION_BONUS_THRESHOLD})
              </span>
              <span className="font-serif text-body-lg font-bold text-white">
                {upperBonus > 0 ? `+${upperBonus}` : '—'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Lower Section */}
      <Card padding="medium">
        <h3 className="font-serif text-subtitle text-white mb-4 border-b-4 border-black pb-2">
          LOWER SECTION
        </h3>
        <div className="space-y-2">
          {LOWER_SECTION_CATEGORIES.map(category => (
            <CategoryRow
              key={category.id}
              category={category}
              score={scorecard[category.id]}
              isScored={isCategoryScored(scorecard, category.id)}
              onClick={() => onCategoryClick(category.id)}
              isClickable={isCurrentPlayer && !isCategoryScored(scorecard, category.id)}
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
};

/**
 * Individual category row
 */
function CategoryRow({ category, score, isScored, onClick, isClickable }) {
  const baseStyles = "flex justify-between items-center py-3 px-4 transition-all duration-150";

  const interactiveStyles = isClickable
    ? "cursor-pointer hover:bg-white hover:bg-opacity-10 active:bg-opacity-20"
    : "";

  const scoredStyles = isScored ? "bg-black bg-opacity-20" : "";

  return (
    <div
      className={`${baseStyles} ${interactiveStyles} ${scoredStyles}`}
      onClick={isClickable ? onClick : undefined}
    >
      <div>
        <div className="font-sans text-body font-bold text-white uppercase">
          {category.name}
        </div>
        <div className="font-sans text-ui text-white opacity-70">
          {category.description}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isScored ? (
          <>
            <span className="font-sans text-ui text-white opacity-50">✓</span>
            <span className="font-serif text-body-lg font-bold text-white min-w-[3rem] text-right">
              {score}
            </span>
          </>
        ) : (
          <>
            {isClickable && (
              <span className="font-sans text-body-lg text-white opacity-50">→</span>
            )}
            <span className="font-serif text-body-lg text-white opacity-30 min-w-[3rem] text-right">
              —
            </span>
          </>
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
