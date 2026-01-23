/**
 * Color scheme preview card for visual settings
 */

import PropTypes from 'prop-types';
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
      className={`relative w-full p-4 bg-white bg-opacity-20 transition-[transform] duration-150 ease-[cubic-bezier(0.215,0.61,0.355,1)] ${
        isSelected
          ? 'scale-[1.02] bg-opacity-30'
          : 'hover:bg-opacity-25 hover:scale-[1.01]'
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
      <div className="font-sans text-body font-bold text-white">
        {label}
      </div>
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <span className="text-black font-bold text-sm">✓</span>
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
