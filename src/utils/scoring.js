import {
  UPPER_SECTION_CATEGORIES,
  ALL_CATEGORIES,
  getUpperBonusThreshold,
  getUpperBonusPoints,
  getCategoryById,
} from './gameConstants';

/**
 * Initialize an empty scorecard for a player
 */
export const createEmptyScorecard = () => {
  const scorecard = {};

  // Initialize all categories to null (not yet scored)
  scorecard.ones = null;
  scorecard.twos = null;
  scorecard.threes = null;
  scorecard.fours = null;
  scorecard.fives = null;
  scorecard.sixes = null;
  scorecard.threeOfKind = null;
  scorecard.fourOfKind = null;
  scorecard.fullHouse = null;
  scorecard.smallStraight = null;
  scorecard.largeStraight = null;
  scorecard.yahtzee = null;
  scorecard.chance = null;

  return scorecard;
};

/**
 * Calculate upper section sum
 */
export const calculateUpperSectionSum = (scorecard) => {
  let sum = 0;

  UPPER_SECTION_CATEGORIES.forEach(category => {
    const score = scorecard[category.id];
    if (score != null) {
      sum += score;
    }
  });

  return sum;
};

/**
 * Calculate upper section bonus (35 points if sum >= 63, or custom values from settings)
 */
export const calculateUpperBonus = (scorecard, settings = null) => {
  const upperSum = calculateUpperSectionSum(scorecard);
  const threshold = getUpperBonusThreshold(settings);
  const bonusPoints = getUpperBonusPoints(settings);
  return upperSum >= threshold ? bonusPoints : 0;
};

/**
 * Calculate lower section sum
 */
export const calculateLowerSectionSum = (scorecard) => {
  let sum = 0;

  const lowerCategories = [
    'threeOfKind',
    'fourOfKind',
    'fullHouse',
    'smallStraight',
    'largeStraight',
    'yahtzee',
    'chance',
  ];

  lowerCategories.forEach(category => {
    const score = scorecard[category];
    if (score != null) {
      sum += score;
    }
  });

  return sum;
};

/**
 * Calculate total score
 */
export const calculateTotalScore = (scorecard, settings = null) => {
  const upperSum = calculateUpperSectionSum(scorecard);
  const upperBonus = calculateUpperBonus(scorecard, settings);
  const lowerSum = calculateLowerSectionSum(scorecard);

  return upperSum + upperBonus + lowerSum;
};

/**
 * Check if a category has been scored
 */
export const isCategoryScored = (scorecard, categoryId) => {
  return scorecard[categoryId] != null;
};

/**
 * Get all available (unscored) categories
 */
export const getAvailableCategories = (scorecard) => {
  return ALL_CATEGORIES
    .map(cat => cat.id)
    .filter(categoryId => scorecard[categoryId] == null);
};

/**
 * Check if the game is complete (all categories scored)
 */
export const isGameComplete = (scorecard) => {
  return getAvailableCategories(scorecard).length === 0;
};

/**
 * Update scorecard with a new score
 */
export const updateScorecard = (scorecard, categoryId, score) => {
  return {
    ...scorecard,
    [categoryId]: score,
  };
};

/**
 * Get all valid scores for a category
 * Returns an array of valid score values based on category type
 */
export const getValidScoresForCategory = (categoryId) => {
  const category = getCategoryById(categoryId);
  
  if (!category) return [];
  
  // Fixed score categories: only 0 and the fixed score
  if (category.fixedScore !== undefined) {
    return [0, category.fixedScore];
  }
  
  // Upper section categories: 0 to maxScore (multiples of die value)
  if (category.section === 'upper' && category.maxScore !== undefined) {
    const dieValue = category.maxScore / 5; // e.g., 15 / 5 = 3 for threes
    const scores = [];
    for (let i = 0; i <= 5; i++) {
      scores.push(i * dieValue);
    }
    return scores;
  }
  
  // Lower section variable categories (3 of a Kind, 4 of a Kind, Chance)
  if (category.section === 'lower' && category.maxScore !== undefined) {
    // Common presets: 0, 5, 10, 15, 20, 25, 30
    const presets = [0, 5, 10, 15, 20, 25, 30];
    // Filter to only include scores <= maxScore
    return presets.filter(score => score <= category.maxScore);
  }
  
  // Fallback: return empty array
  return [];
};
