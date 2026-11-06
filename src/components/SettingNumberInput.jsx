/**
 * Compact stepper for numeric settings (e.g. bonus thresholds), shown to the
 * right of the setting's label.
 */

import PropTypes from 'prop-types';
import SettingRow from './SettingRow';

const STEP_BUTTON = 'shrink-0 w-10 h-10 bg-fg/20 hover:bg-fg/30 text-fg font-sans text-body-lg font-bold leading-none disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-fg transition-[transform,background-color,opacity] duration-100 ease-out';

export default function SettingNumberInput({ label, description, value, min, max, onChange }) {
  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <SettingRow label={label} description={description} inline>
      <div className="flex items-center gap-1 shrink-0">
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
          inputMode="numeric"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          aria-label={label}
          className="w-16 h-10 bg-transparent border-2 border-fg/40 focus:border-fg outline-none text-fg font-serif text-body-lg text-center tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
