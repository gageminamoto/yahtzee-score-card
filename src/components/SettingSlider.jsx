/**
 * Slider component for range-based settings (e.g., font size)
 */

import PropTypes from 'prop-types';

export default function SettingSlider({ label, description, value, options, onChange }) {
  const optionKeys = Object.keys(options);
  const currentIndex = optionKeys.indexOf(value);

  const handleChange = (e) => {
    const index = parseInt(e.target.value);
    onChange(optionKeys[index]);
  };

  return (
    <div className="py-4 border-b-2 border-white/20 dark:border-black/20 last:border-0">
      <div className="mb-3">
        <div className="font-sans text-body font-bold text-white dark:text-black mb-1">
          {label}
        </div>
        {description && (
          <div className="font-sans text-ui text-white/70 dark:text-black/70">
            {description}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min="0"
          max={optionKeys.length - 1}
          value={currentIndex}
          onChange={handleChange}
          className="flex-1 h-2 bg-black/30 dark:bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:dark:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:dark:bg-black [&::-moz-range-thumb]:cursor-pointer"
        />
        <div className="font-sans text-body font-bold text-white dark:text-black min-w-[120px] text-right">
          {options[value]}
        </div>
      </div>
    </div>
  );
}

SettingSlider.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  value: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
