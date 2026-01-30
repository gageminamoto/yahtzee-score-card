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
    enableAnimations: true,
    enableConfetti: true,
    reducedMotion: false,
  },
  gameRules: {
    upperBonusThreshold: 63,
    upperBonusPoints: 35,
    yahtzeeBonus: 100,
    enableYahtzeeJoker: false, // Use Yahtzee as joker if already scored
    enableForcedZeros: true, // Must score 0 if no valid score
  },
  accessibility: {
    highContrast: false,
    enableSoundEffects: true,
    enableHapticFeedback: true,
    largeButtons: false,
    screenReaderMode: false,
    keepScreenAwake: false,
  },
  data: {
    autoSaveEnabled: true,
    saveGameHistory: true,
    maxHistorySize: 50,
  },
  preferences: {
    confirmQuit: true,
    showTutorial: true,
    defaultPlayerCount: 2,
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
  'x-large': 'Extra Large',
};

export const HEADER_STYLE_OPTIONS = {
  images: 'Dice Letters',
  text: 'Classic Text',
};
