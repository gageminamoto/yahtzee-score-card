/**
 * Button group component for selecting from discrete options (e.g., font size)
 */

import PropTypes from 'prop-types';

export default function SettingButtonGroup({ label, description, value, options, onChange }) {
  const optionEntries = Object.entries(options);

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
      <div className="flex gap-2">
        {optionEntries.map(([key, labelText]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex-1 py-2 px-3 font-sans text-ui font-bold transition-colors border-2 ${
              value === key
                ? 'bg-white dark:bg-black text-black dark:text-white border-white dark:border-black'
                : 'bg-transparent text-white dark:text-black border-white/50 dark:border-black/50 hover:border-white dark:hover:border-black'
            }`}
          >
            {labelText}
          </button>
        ))}
      </div>
    </div>
  );
}

SettingButtonGroup.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  value: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
