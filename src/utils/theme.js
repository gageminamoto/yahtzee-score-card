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
import { getTextColorForBackground, getContrastRatio } from './colors';

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

/** Whichever of black or white has the higher contrast on the colour. */
const bestContrastFg = (hex) =>
  getContrastRatio(hex, '#000000') >= getContrastRatio(hex, '#FFFFFF') ? '#000000' : '#FFFFFF';

/**
 * Black or white for text on the given surface colour.
 * Light mode keeps the design's palette rule (white on all but the lightest
 * colours). Darkened surfaces have no such rule and can land mid-grey (white
 * becomes #7D7D7D), so there we take whichever reads best.
 */
export const fgFor = (hex, { bestContrast = false } = {}) =>
  (bestContrast ? bestContrastFg(hex) : getTextColorForBackground(hex));

/**
 * Inline style that paints a surface and scopes the fg/surface variables to it.
 * @param {string} hex surface colour (already themed)
 * @param {{ paint?: boolean, fg?: string }} options set paint:false to only set
 *   variables; pass fg to override the computed text colour
 */
export const surfaceStyle = (hex, { paint = true, fg = fgFor(hex) } = {}) => ({
  ...(paint ? { backgroundColor: hex } : {}),
  '--fg': hexToTriplet(fg),
  '--surface': hexToTriplet(hex),
});
