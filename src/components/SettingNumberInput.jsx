/**
 * Number input component for numeric settings (e.g., bonus thresholds)
 */

import PropTypes from 'prop-types';
import SettingRow from './SettingRow';

const STEP_BUTTON = 'w-12 h-12 bg-fg text-surface font-sans text-body-lg font-bold hover:bg-fg/85 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.97] transition-[transform,background-color,opacity] duration-100 ease-out';

export default function SettingNumberInput({ label, description, value, min, max, onChange }) {
  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <SettingRow label={label} description={description}>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => value > min && onChange(value - 1)}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className={STEP_BUTTON}
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          aria-label={label}
          className="flex-1 h-12 px-4 bg-fg/10 border-2 border-fg/40 focus:border-fg outline-none text-fg font-sans text-body-lg font-bold text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => value < max && onChange(value + 1)}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className={STEP_BUTTON}
        >
          +
        </button>
      </div>
    </SettingRow>
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
