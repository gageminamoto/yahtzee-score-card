/**
 * Segmented single-choice control for discrete settings (e.g. text size).
 * Shares SegmentedControl's styling but uses radio semantics, since it
 * selects a value rather than switching tab panels.
 */

import PropTypes from 'prop-types';
import SettingRow from './SettingRow';
import { cn } from '../utils/cn';

export default function SettingButtonGroup({ label, description, value, options, onChange }) {
  const keys = Object.keys(options);

  const handleKeyDown = (e, key) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const direction = e.key === 'ArrowLeft' ? -1 : 1;
    const next = keys[(keys.indexOf(key) + direction + keys.length) % keys.length];
    onChange(next);
    e.currentTarget.parentElement?.querySelector(`[data-key="${next}"]`)?.focus();
  };

  return (
    <SettingRow label={label} description={description} wrap>
      <div className="grow flex gap-1 bg-fg/10 p-1" role="radiogroup" aria-label={label}>
        {Object.entries(options).map(([key, labelText]) => {
          const isActive = value === key;
          return (
            <button
              key={key}
              type="button"
              role="radio"
              data-key={key}
              aria-checked={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(key)}
              onKeyDown={(e) => handleKeyDown(e, key)}
              className={cn(
                'flex-1 py-2 px-2 font-sans text-ui font-bold whitespace-nowrap',
                'transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-fg',
                isActive ? 'bg-fg text-surface' : 'text-fg/70 hover:text-fg hover:bg-fg/10',
              )}
            >
              {labelText}
            </button>
          );
        })}
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
