import { useEffect, useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

/**
 * Short-lived toast with an Undo action, floating at the bottom of the
 * current surface. Calls `onExpire` after `duration` ms.
 * Re-key it (e.g. with a counter) to restart the timer for a new action.
 */
export default function UndoToast({ message, onUndo, onExpire, duration = 4000 }) {
  // Keep the latest callback without restarting the timer on every render
  const onExpireRef = useRef(onExpire);
  useLayoutEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    const timer = setTimeout(() => onExpireRef.current(), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div
      className="fixed inset-x-0 bottom-4 z-popover flex justify-center px-4 pointer-events-none animate-fadeIn"
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-auto flex items-center gap-3 w-full max-w-sm bg-fg text-surface pl-4 pr-1 py-1 shadow-lg">
        <Icon icon="basil:check-solid" className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
        <span className="flex-1 min-w-0 font-sans text-ui truncate">{message}</span>
        <button
          type="button"
          onClick={onUndo}
          className="min-h-[44px] px-4 font-sans text-ui font-bold uppercase hover:bg-surface/20 active:scale-[0.97] transition-[background-color,transform] duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-surface"
        >
          Undo
        </button>
      </div>
    </div>
  );
}

UndoToast.propTypes = {
  message: PropTypes.string.isRequired,
  onUndo: PropTypes.func.isRequired,
  onExpire: PropTypes.func.isRequired,
  duration: PropTypes.number,
};
