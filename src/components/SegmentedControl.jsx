import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { cn } from '../utils/cn';

/**
 * Tab-style segmented control. Arrow keys move between options.
 * Colours follow the surrounding surface.
 *
 * options: [{ id, label, icon? }]
 */
export default function SegmentedControl({ options, value, onChange, ariaLabel, firstRef, className }) {
  const handleKeyDown = (e, currentId) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const index = options.findIndex(o => o.id === currentId);
    const direction = e.key === 'ArrowLeft' ? -1 : 1;
    onChange(options[(index + direction + options.length) % options.length].id);
  };

  return (
    <div className={cn('flex gap-1 bg-fg/10 p-1', className)} role="tablist" aria-label={ariaLabel}>
      {options.map((option, index) => {
        const isActive = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            ref={index === 0 ? firstRef : null}
            onClick={() => onChange(option.id)}
            onKeyDown={(e) => handleKeyDown(e, option.id)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${option.id}`}
            className={cn(
              'flex-1 py-3 px-4 font-sans font-bold uppercase text-body flex items-center justify-center gap-2',
              'transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97]',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-fg',
              isActive ? 'bg-fg text-surface' : 'text-fg/70 hover:text-fg hover:bg-fg/10',
            )}
          >
            {option.icon && <Icon icon={option.icon} className="w-6 h-6" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

SegmentedControl.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    icon: PropTypes.string,
  })).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string,
  firstRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  className: PropTypes.string,
};
