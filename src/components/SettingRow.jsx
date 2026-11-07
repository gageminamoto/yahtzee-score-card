import PropTypes from 'prop-types';
import { cn } from '../utils/cn';

/**
 * Shared layout for a single setting: label, optional description, control.
 * `inline` puts the control to the right of the label (toggles).
 */
export default function SettingRow({ label, description, inline = false, children }) {
  return (
    <div
      className={cn(
        'py-4 border-b-2 border-fg/20 last:border-0',
        inline && 'flex items-center justify-between gap-4',
      )}
    >
      <div className={cn(inline ? 'flex-1' : 'mb-3')}>
        <div className="font-sans text-body font-bold text-fg mb-1">{label}</div>
        {description && (
          <div className="font-sans text-ui text-fg/70">{description}</div>
        )}
      </div>
      {children}
    </div>
  );
}

SettingRow.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  inline: PropTypes.bool,
  children: PropTypes.node,
};
