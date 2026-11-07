/**
 * Button group component for selecting from discrete options (e.g., font size)
 */

import PropTypes from 'prop-types';
import SettingRow from './SettingRow';
import { cn } from '../utils/cn';

export default function SettingButtonGroup({ label, description, value, options, onChange }) {
  return (
    <SettingRow label={label} description={description}>
      <div className="flex gap-2" role="radiogroup" aria-label={label}>
        {Object.entries(options).map(([key, labelText]) => (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={value === key}
            onClick={() => onChange(key)}
            className={cn(
              'flex-1 py-2 px-3 font-sans text-ui font-bold border-2 transition-colors',
              value === key
                ? 'bg-fg text-surface border-fg'
                : 'text-fg border-fg/40 hover:border-fg',
            )}
          >
            {labelText}
          </button>
        ))}
      </div>
    </SettingRow>
  );
}

SettingButtonGroup.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  value: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
