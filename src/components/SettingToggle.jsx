/**
 * Toggle switch component for boolean settings
 */

import PropTypes from 'prop-types';

export default function SettingToggle({ label, description, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between py-4 border-b-2 border-white border-opacity-20 last:border-0">
      <div className="flex-1 pr-4">
        <div className="font-sans text-body font-bold text-white mb-1">
          {label}
        </div>
        {description && (
          <div className="font-sans text-ui text-white opacity-70">
            {description}
          </div>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-14 h-8 rounded-full border-2 border-white transition-colors duration-150 ease-[cubic-bezier(0.645,0.045,0.355,1)] ${
          enabled ? 'bg-white' : 'bg-transparent'
        }`}
        aria-label={`Toggle ${label}`}
      >
        <div
          className={`absolute top-1 left-1 w-5 h-5 rounded-full transition-transform duration-200 ease-[cubic-bezier(0.645,0.045,0.355,1)] ${
            enabled ? 'translate-x-6 bg-black' : 'translate-x-0 bg-white'
          }`}
        />
      </button>
    </div>
  );
}

SettingToggle.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  enabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};
