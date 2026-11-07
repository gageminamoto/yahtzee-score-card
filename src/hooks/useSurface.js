import { useCallback, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { getColorByScheme } from '../utils/colors';
import { themedColor, surfaceStyle, fgFor } from '../utils/theme';

/**
 * Returns a function that turns a raw colour (player colour, page colour)
 * into a themed surface: { color, fg, style }.
 * Dark mode darkens the colour; fg follows automatically.
 */
export function useSurface() {
  const { settings } = useSettings();
  const dark = settings.visual.enableDarkMode;
  return useCallback((hex) => {
    const color = themedColor(hex, dark);
    const fg = fgFor(color, { bestContrast: dark });
    return { color, fg, style: surfaceStyle(color, { fg }) };
  }, [dark]);
}

/**
 * Themed page background for a colour-rotation index (or an explicit colour).
 * Also syncs --page-bg on <html> so overscroll matches the page.
 * Spread `style` on the page root and use `text-fg` / `bg-fg/20` inside.
 */
export function usePageSurface(colorIndexOrHex) {
  const { settings } = useSettings();
  const surface = useSurface();
  const raw = typeof colorIndexOrHex === 'string'
    ? colorIndexOrHex
    : getColorByScheme(colorIndexOrHex ?? 0, settings.visual.colorScheme);
  const result = surface(raw);

  useEffect(() => {
    document.documentElement.style.setProperty('--page-bg', result.color);
  }, [result.color]);

  return result;
}
