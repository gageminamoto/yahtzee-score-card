/**
 * CMYK-inspired color palette
 * Bold, saturated colors for high-impact design
 */
export const colors = {
  electricBlue: '#0066FF',
  hotMagenta: '#FF0099',
  goldenYellow: '#E6B800', // Softened from #FFDD00 - easier on eyes, better contrast
  vividOrange: '#FF6600',
  deepPurple: '#6600CC',
  brightGreen: '#00FF66',
  brightRed: '#FF0033',
  white: '#FFFFFF',
  black: '#000000',
};

/**
 * Array of primary background colors for rotation
 */
export const primaryColors = [
  colors.electricBlue,
  colors.hotMagenta,
  colors.goldenYellow,
  colors.vividOrange,
  colors.deepPurple,
  colors.brightGreen,
];

/**
 * Player colors for game assignment
 */
export const playerColors = [
  colors.electricBlue,
  colors.hotMagenta,
  colors.vividOrange,
  colors.brightGreen,
  colors.deepPurple,
  colors.goldenYellow,
];

/**
 * Get a color from the primary palette by index
 */
export const getColorByIndex = (index) => {
  return primaryColors[index % primaryColors.length];
};

/**
 * Get a player color by index
 */
export const getPlayerColor = (index) => {
  return playerColors[index % playerColors.length];
};

/**
 * Color scheme variants
 */
export const colorSchemes = {
  default: {
    primary: primaryColors,
    player: playerColors,
  },
  monochrome: {
    primary: ['#000000', '#333333', '#555555', '#777777', '#999999', '#BBBBBB'],
    player: ['#000000', '#333333', '#555555', '#777777', '#999999', '#BBBBBB'],
  },
  pastel: {
    primary: [
      '#5BA8FF', // Bright Sky Blue (vibrant but light)
      '#FF7EB3', // Bright Pink (saturated pastel)
      '#FFD84D', // Sunny Yellow (warm and bright)
      '#FFA366', // Coral Orange (vibrant pastel)
      '#B57FFF', // Bright Violet (saturated lavender)
      '#5DD9A3', // Mint Green (bright and fresh)
    ],
    player: [
      '#5BA8FF', // Bright Sky Blue
      '#FF7EB3', // Bright Pink
      '#FFA366', // Coral Orange
      '#5DD9A3', // Mint Green (bright and fresh)
      '#B57FFF', // Bright Violet
      '#FFD84D', // Sunny Yellow
    ],
  },
  'high-contrast': {
    primary: [
      '#000000', // Black
      '#FFFFFF', // White
      '#CC0000', // Dark Red (better contrast)
      '#006600', // Dark Green (better contrast)
      '#0000CC', // Dark Blue
      '#B8860B', // Dark Goldenrod
    ],
    player: [
      '#000000', // Black
      '#FFFFFF', // White
      '#CC0000', // Dark Red
      '#006600', // Dark Green
      '#0000CC', // Dark Blue
      '#B8860B', // Dark Goldenrod (replaces pure yellow)
    ],
  },
};

/**
 * Get a color by index with optional color scheme
 */
export const getColorByScheme = (index, scheme = 'default') => {
  const schemeColors = colorSchemes[scheme]?.primary || primaryColors;
  return schemeColors[index % schemeColors.length];
};

/**
 * Get a player color by index with optional color scheme
 */
export const getPlayerColorByScheme = (index, scheme = 'default') => {
  const schemeColors = colorSchemes[scheme]?.player || playerColors;
  return schemeColors[index % schemeColors.length];
};

/**
 * Convert hex color to RGB values
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Calculate relative luminance of a color (WCAG formula)
 * Returns a value between 0 (black) and 1 (white)
 */
export const getRelativeLuminance = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  // Convert to sRGB
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
    const srgb = c / 255;
    return srgb <= 0.04045
      ? srgb / 12.92
      : Math.pow((srgb + 0.055) / 1.055, 2.4);
  });

  // Calculate luminance
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * Calculate contrast ratio between two colors
 */
export const getContrastRatio = (hex1, hex2) => {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Get the appropriate text color (black or white) for a given background
 * Uses WCAG contrast ratio to ensure readability
 */
export const getTextColorForBackground = (backgroundColor) => {
  const luminance = getRelativeLuminance(backgroundColor);
  // Use black text for light backgrounds, white for dark
  // Threshold of 0.179 is commonly used (corresponds to ~4.5:1 contrast)
  return luminance > 0.25 ? colors.black : colors.white;
};

/**
 * Check if a color needs black text (is a light color)
 */
export const needsBlackText = (backgroundColor) => {
  return getRelativeLuminance(backgroundColor) > 0.25;
};
