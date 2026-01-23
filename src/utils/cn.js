/**
 * Utility function for merging Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 * 
 * Usage:
 *   cn('base-class', condition && 'conditional-class', className)
 *   cn('px-4', 'py-2', 'px-6') // 'py-2 px-6' (px-4 is overridden by px-6)
 */

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
