/**
 * Yahtzee game constants and category definitions
 */

export const UPPER_SECTION_CATEGORIES = [
  {
    id: 'ones',
    name: 'Ones',
    description: 'Score the sum of all dice showing 1',
    maxScore: 5,
    section: 'upper',
  },
  {
    id: 'twos',
    name: 'Twos',
    description: 'Score the sum of all dice showing 2',
    maxScore: 10,
    section: 'upper',
  },
  {
    id: 'threes',
    name: 'Threes',
    description: 'Score the sum of all dice showing 3',
    maxScore: 15,
    section: 'upper',
  },
  {
    id: 'fours',
    name: 'Fours',
    description: 'Score the sum of all dice showing 4',
    maxScore: 20,
    section: 'upper',
  },
  {
    id: 'fives',
    name: 'Fives',
    description: 'Score the sum of all dice showing 5',
    maxScore: 25,
    section: 'upper',
  },
  {
    id: 'sixes',
    name: 'Sixes',
    description: 'Score the sum of all dice showing 6',
    maxScore: 30,
    section: 'upper',
  },
];

export const LOWER_SECTION_CATEGORIES = [
  {
    id: 'threeOfKind',
    name: '3 of a Kind',
    description: 'Score the sum of all dice (need 3+ matching)',
    maxScore: 30,
    section: 'lower',
  },
  {
    id: 'fourOfKind',
    name: '4 of a Kind',
    description: 'Score the sum of all dice (need 4+ matching)',
    maxScore: 30,
    section: 'lower',
  },
  {
    id: 'fullHouse',
    name: 'Full House',
    description: '25 points (3 of one number, 2 of another)',
    fixedScore: 25,
    section: 'lower',
  },
  {
    id: 'smallStraight',
    name: 'Small Straight',
    description: '30 points (4 consecutive numbers)',
    fixedScore: 30,
    section: 'lower',
  },
  {
    id: 'largeStraight',
    name: 'Large Straight',
    description: '40 points (5 consecutive numbers)',
    fixedScore: 40,
    section: 'lower',
  },
  {
    id: 'yahtzee',
    name: 'Yahtzee',
    description: '50 points (all 5 dice match)',
    fixedScore: 50,
    section: 'lower',
  },
  {
    id: 'chance',
    name: 'Chance',
    description: 'Score the sum of all dice (no restriction)',
    maxScore: 30,
    section: 'lower',
  },
];

export const ALL_CATEGORIES = [
  ...UPPER_SECTION_CATEGORIES,
  ...LOWER_SECTION_CATEGORIES,
];

export const UPPER_SECTION_BONUS_THRESHOLD = 63;
export const UPPER_SECTION_BONUS_POINTS = 35;
export const TOTAL_ROUNDS = 13;

/**
 * Get category by ID
 */
export const getCategoryById = (id) => {
  return ALL_CATEGORIES.find(cat => cat.id === id);
};

/**
 * Validate score for a category
 */
export const isValidScore = (categoryId, score) => {
  const category = getCategoryById(categoryId);
  if (!category) return false;

  // Must be a non-negative integer
  if (score < 0 || !Number.isInteger(score)) return false;

  // Check fixed score categories
  if (category.fixedScore) {
    return score === 0 || score === category.fixedScore;
  }

  // Check max score
  if (category.maxScore) {
    return score <= category.maxScore;
  }

  return true;
};
