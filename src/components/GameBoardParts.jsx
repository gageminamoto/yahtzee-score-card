import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import Button from './Button';
import { TOTAL_ROUNDS } from '../utils/gameConstants';
import { cn } from '../utils/cn';

/**
 * Shared building blocks for GameBoard and MultiDeviceGameBoard.
 * All colours come from the surrounding surface (fg / surface tokens).
 */

/** Header row: left action, round counter in the middle, right actions. */
export function GameHeader({ left, right, round }) {
  return (
    <div className="flex items-center mb-1.5 md:mb-2 flex-shrink-0">
      <div className="flex-1 flex justify-start">{left}</div>
      <div
        className="font-sans text-ui text-fg/70"
        aria-label={`Round ${round} of ${TOTAL_ROUNDS}`}
      >
        R{round}/{TOTAL_ROUNDS}
      </div>
      <div className="flex-1 flex items-center gap-2 justify-end">{right}</div>
    </div>
  );
}

GameHeader.propTypes = {
  left: PropTypes.node,
  right: PropTypes.node,
  round: PropTypes.number.isRequired,
};

/** Compact pill action used in the game header (Finish, Scores). */
export function HeaderPill({ className, ...props }) {
  return (
    <Button
      variant="primary"
      size="small"
      className={cn('rounded-full min-h-9 py-2', className)}
      {...props}
    />
  );
}

HeaderPill.propTypes = {
  className: PropTypes.string,
};

/**
 * A player chip in the header switcher: colour dot, name and optional score.
 * Renders a <button> when `onClick` is given, otherwise a <div>.
 */
export const PlayerTab = forwardRef(function PlayerTab({
  player,
  index,
  score,
  isActive,
  highlight = false,
  disabled = false,
  dimmed = false,
  onClick,
  badge,
  ...rest
}, ref) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      ref={ref}
      role="tab"
      aria-selected={isActive}
      {...(onClick && { type: 'button', onClick, disabled })}
      className={cn(
        'relative flex items-center gap-3 px-5 py-3 rounded-full min-w-fit min-h-[52px] text-fg',
        'transition-all duration-150 ease-out motion-reduce:transition-none',
        isActive ? 'bg-fg/20' : 'opacity-60 hover:opacity-100',
        highlight && 'ring-2 ring-fg/60',
        onClick && !disabled && 'cursor-pointer active:scale-[0.97] motion-reduce:active:scale-100',
        (disabled || dimmed) && 'cursor-not-allowed opacity-40',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-fg/40',
      )}
      {...rest}
    >
      <div className="relative flex-shrink-0">
        <div
          className="w-9 h-9 md:w-10 md:h-10 rounded-full"
          style={{ backgroundColor: player.color }}
        />
        {badge}
      </div>
      <span className="font-sans text-body font-bold uppercase tracking-wide truncate max-w-[60px] md:max-w-[80px]">
        {player.name || `P${index + 1}`}
      </span>
      {score !== undefined && (
        <span className="font-sans text-body font-bold tabular-nums">{score}</span>
      )}
    </Tag>
  );
});

PlayerTab.propTypes = {
  player: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  score: PropTypes.number,
  isActive: PropTypes.bool,
  highlight: PropTypes.bool,
  disabled: PropTypes.bool,
  dimmed: PropTypes.bool,
  onClick: PropTypes.func,
  badge: PropTypes.node,
};

/** Bottom fade + "scroll for more" button for the scorecard area. */
export function ScrollMore({ visible, onClick }) {
  return (
    <>
      <div
        className={cn(
          'scroll-fade-gradient bg-gradient-to-b from-transparent to-surface',
          visible ? 'scroll-fade-visible' : 'scroll-fade-hidden',
        )}
        aria-hidden="true"
      />
      {/* Raw button: .scroll-indicator centres with a CSS transform that a
          scale-on-press utility would override. */}
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'scroll-indicator absolute bottom-3 flex items-center justify-center w-10 h-10 rounded-full',
          'bg-fg/20 hover:bg-fg/30 text-fg backdrop-blur-sm shadow-lg',
          visible ? 'scroll-indicator-visible' : 'scroll-indicator-hidden',
        )}
        aria-label="Scroll to see more categories"
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
      >
        <Icon icon="basil:arrow-down-solid" className="w-6 h-6" />
      </button>
    </>
  );
}

ScrollMore.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
