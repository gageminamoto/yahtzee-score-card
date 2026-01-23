/**
 * Number input component for numeric settings (e.g., bonus thresholds)
 */

import PropTypes from 'prop-types';

export default function SettingNumberInput({ label, description, value, min, max, onChange }) {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
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
        <button
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-12 h-12 bg-white dark:bg-black text-black dark:text-white font-sans text-body-lg font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-opacity-90 dark:hover:bg-opacity-90 active:scale-[0.97] transition-[transform,opacity] duration-100 ease-out"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          className="flex-1 h-12 px-4 bg-white dark:bg-black text-black dark:text-white font-sans text-body-lg font-bold text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-12 h-12 bg-white dark:bg-black text-black dark:text-white font-sans text-body-lg font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-opacity-90 dark:hover:bg-opacity-90 active:scale-[0.97] transition-[transform,opacity] duration-100 ease-out"
        >
          +
        </button>
      </div>
    </div>
  );
}

SettingNumberInput.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};
