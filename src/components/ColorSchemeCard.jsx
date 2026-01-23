/**
 * Color scheme preview card for visual settings
 */

import PropTypes from 'prop-types';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';
import { colorSchemes, getTextColorForBackground } from '../utils/colors';

export default function ColorSchemeCard({ scheme, label, isSelected, onClick }) {
  // Get preview colors based on scheme
  const getPreviewColors = () => {
    const schemeColors = colorSchemes[scheme]?.primary || colorSchemes.default.primary;
    return schemeColors.slice(0, 4);
  };

  const previewColors = getPreviewColors();

  return (
    <button
      onClick={onClick}
      className={`relative w-full p-4 bg-white/20 dark:bg-black/20 transition-[transform] duration-150 ease-out ${
        isSelected
          ? 'scale-[1.02] bg-opacity-30 dark:bg-opacity-30'
          : 'hover:bg-opacity-25 dark:hover:bg-opacity-25 hover:scale-[1.01]'
      }`}
    >
      {/* Color preview circles */}
      <div className="flex justify-center gap-2 mb-3">
        {previewColors.map((color, index) => (
          <div
            key={index}
            className="w-10 h-10 rounded-full"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      {/* Label */}
      <div className="font-sans text-body font-bold text-white dark:text-black">
        {label}
      </div>
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-white dark:bg-black rounded-full flex items-center justify-center">
          <HugeiconsIcon 
            icon={CheckmarkCircle01Icon} 
            className="w-4 h-4 text-black dark:text-white"
          />
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
