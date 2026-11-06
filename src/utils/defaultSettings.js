/**
 * Default settings for the Yahtzee Score Tracker
 * Single source of truth for all setting values
 */

export const DEFAULT_SETTINGS = {
  visual: {
    colorScheme: 'default', // 'default' | 'monochrome' | 'pastel' | 'high-contrast'
    enableDarkMode: false,
    fontSize: 'medium', // 'small' | 'medium' | 'large' | 'x-large'
    headerStyle: 'images', // 'text' | 'images'
    showHeaderTotals: true, // Show player total scores in game header
    reducedMotion: false, // Turns off app animations and the winner reveal
  },
  gameRules: {
    upperBonusThreshold: 63,
    upperBonusPoints: 35,
  },
  accessibility: {
    enableSoundEffects: false,
    enableHapticFeedback: true,
    keepScreenAwake: false,
  },
  data: {
    saveGameHistory: true,
    maxHistorySize: 50,
  },
};

export const FONT_SIZE_MULTIPLIERS = {
  small: 0.85,
  medium: 1,
  large: 1.2,
  'x-large': 1.5,
};

export const COLOR_SCHEMES = {
  default: 'Default (CMYK)',
  monochrome: 'Monochrome',
  pastel: 'Pastel',
  'high-contrast': 'High Contrast',
};

export const FONT_SIZE_OPTIONS = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  'x-large': 'XL',
};

export const HEADER_STYLE_OPTIONS = {
  images: 'Dice',
  text: 'Text',
};
