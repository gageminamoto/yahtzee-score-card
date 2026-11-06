/**
 * Utility function for merging Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 *
 * Usage:
 *   cn('base-class', condition && 'conditional-class', className)
 *   cn('px-4', 'py-2', 'px-6') // 'py-2 px-6' (px-4 is overridden by px-6)
 */

import { clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Teach tailwind-merge about the custom theme so `text-body-lg` is treated as
// a font size and `text-fg` / `text-surface` as colours. Without this it
// thinks they conflict and silently drops one of them.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['display', 'headline', 'title', 'subtitle', 'body-lg', 'body', 'ui'] }],
      'text-color': [{ text: ['fg', 'surface'] }],
      'bg-color': [{ bg: ['fg', 'surface'] }],
      'border-color': [{ border: ['fg', 'surface'] }],
    },
  },
});

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
