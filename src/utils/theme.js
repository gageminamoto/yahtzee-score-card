/**
 * Surface theming.
 *
 * Every coloured surface (a page, a player panel, a modal) sets two CSS
 * variables that Tailwind reads through the `fg` and `surface` colours:
 *
 *   --fg       black or white, whichever reads best on the surface
 *   --surface  the surface colour itself (for inverted text on solid fills)
 *
 * Children then style themselves with `text-fg`, `bg-fg/20`, `border-fg/30`,
 * `bg-fg text-surface`, ... and stay legible on any background without
 * threading a textColor prop through the tree.
 */
import { getTextColorForBackground } from './colors';

const hexToTriplet = (hex) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  if (!m) return '0 0 0';
  return `${parseInt(m[1], 16)} ${parseInt(m[2], 16)} ${parseInt(m[3], 16)}`;
};

/**
 * Darken a hex colour by mixing it with near-black.
 * @param {string} hex
 * @param {number} amount 0 (unchanged) to 1 (fully dark)
 */
export const darken = (hex, amount = 0.55) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  if (!m) return hex;
  const base = 18; // #121212
  const mix = (c) => Math.round(parseInt(c, 16) * (1 - amount) + base * amount)
    .toString(16)
    .padStart(2, '0');
  return `#${mix(m[1])}${mix(m[2])}${mix(m[3])}`.toUpperCase();
};

/** Apply the dark-mode treatment to a surface colour when enabled. */
export const themedColor = (hex, darkMode) => (darkMode ? darken(hex) : hex);

/** Black or white for text on the given surface colour. */
export const fgFor = (hex) => getTextColorForBackground(hex);

/**
 * Inline style that paints a surface and scopes the fg/surface variables to it.
 * @param {string} hex surface colour (already themed)
 * @param {{ paint?: boolean }} options set paint:false to only set variables
 */
export const surfaceStyle = (hex, { paint = true } = {}) => ({
  ...(paint ? { backgroundColor: hex } : {}),
  '--fg': hexToTriplet(fgFor(hex)),
  '--surface': hexToTriplet(hex),
});
