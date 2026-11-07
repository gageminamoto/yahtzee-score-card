/**
 * Color scheme preview card for visual settings
 */

import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { colorSchemes } from '../utils/colors';
import { cn } from '../utils/cn';

export default function ColorSchemeCard({ scheme, label, isSelected, onClick }) {
  const previewColors = (colorSchemes[scheme]?.primary || colorSchemes.default.primary).slice(0, 4);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={cn(
        'relative w-full p-4 border-2 transition-[background-color,border-color] duration-150 ease-out',
        isSelected ? 'bg-fg/20 border-fg' : 'bg-fg/10 border-transparent hover:bg-fg/20',
      )}
    >
      <div className="flex justify-center gap-2 mb-3">
        {previewColors.map((color, index) => (
          <div
            key={index}
            className="w-10 h-10 rounded-full"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <div className="font-sans text-body font-bold text-fg">{label}</div>
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-fg rounded-full flex items-center justify-center">
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
};
