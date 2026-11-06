import PropTypes from 'prop-types';
import { cn } from '../utils/cn';

/**
 * Shared layout for a single setting: label, optional description, control.
 * `inline` puts the control to the right of the label (toggles, steppers).
 * `wrap` puts it on the right when it fits and below the label when it
 * doesn't (segmented controls, whose width grows with the text size).
 * Rows stack inside a Card and are separated by `border-fg/20` dividers.
 */
export default function SettingRow({ label, description, inline = false, wrap = false, children }) {
  return (
    <div
      className={cn(
        'py-3 border-b-2 border-fg/20 last:border-0',
        inline && 'flex items-center justify-between gap-4',
        wrap && 'flex flex-wrap items-center justify-between gap-x-4 gap-y-2',
      )}
    >
      <div className={cn(inline && 'flex-1 min-w-0', wrap && 'shrink-0', !inline && !wrap && 'mb-2')}>
        <div className="font-sans text-body font-bold text-fg">{label}</div>
        {description && (
          <div className="font-sans text-ui text-fg/70 text-pretty">{description}</div>
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
  wrap: PropTypes.bool,
  children: PropTypes.node,
};
