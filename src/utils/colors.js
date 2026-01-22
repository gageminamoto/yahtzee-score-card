/**
 * CMYK-inspired color palette
 * Bold, saturated colors for high-impact design
 */
export const colors = {
  electricBlue: '#0066FF',
  hotMagenta: '#FF0099',
  brightYellow: '#FFDD00',
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
  colors.brightYellow,
  colors.vividOrange,
  colors.deepPurple,
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
  colors.brightYellow,
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
