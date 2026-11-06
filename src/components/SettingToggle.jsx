/**
 * Toggle switch component for boolean settings
 */

import PropTypes from 'prop-types';
import SettingRow from './SettingRow';
import { cn } from '../utils/cn';

export default function SettingToggle({ label, description, enabled, onChange }) {
  return (
    <SettingRow label={label} description={description} inline>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={() => onChange(!enabled)}
        className={cn(
          'relative shrink-0 w-14 h-8 rounded-full border-2 border-fg transition-colors duration-150 ease-out',
          enabled ? 'bg-fg' : 'bg-transparent',
        )}
      >
        <span
          className={cn(
            'absolute top-1 left-1 w-5 h-5 rounded-full transition-transform duration-200 ease-out',
            enabled ? 'translate-x-6 bg-surface' : 'translate-x-0 bg-fg',
          )}
        />
      </button>
    </SettingRow>
  );
}

SettingToggle.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  enabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};
