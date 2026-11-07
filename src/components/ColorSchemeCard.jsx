/**
 * Color scheme preview card for visual settings
 */

import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { colorSchemes } from '../utils/colors';
import { cn } from '../utils/cn';

export default function ColorSchemeCard({ scheme, label, isSelected, onClick, compact = false }) {
  const previewColors = (colorSchemes[scheme]?.primary || colorSchemes.default.primary).slice(0, 4);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={cn(
        'relative w-full border-2 transition-[background-color,border-color] duration-150 ease-out',
        compact ? 'p-3' : 'p-4',
        isSelected ? 'bg-fg/20 border-fg' : 'bg-fg/10 border-transparent hover:bg-fg/20',
      )}
    >
      <div className={cn('flex justify-center', compact ? 'gap-1.5 mb-2' : 'gap-2 mb-3')}>
        {previewColors.map((color, index) => (
          <div
            key={index}
            className={cn('shrink-0 rounded-full', compact ? 'w-6 h-6' : 'w-10 h-10')}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <div className="font-sans text-body font-bold text-fg">{label}</div>
      {isSelected && (
        <div className={cn('absolute bg-fg rounded-full flex items-center justify-center', compact ? 'top-1 right-1 w-5 h-5' : 'top-2 right-2 w-6 h-6')}>
          <Icon icon="basil:check-solid" className="w-4 h-4 text-surface" />
        </div>
      )}
    </button>
  );
}

ColorSchemeCard.propTypes = {
  scheme: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  compact: PropTypes.bool,
};
