import { forwardRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import Button from './Button';
import { TOTAL_ROUNDS } from '../utils/gameConstants';
import { cn } from '../utils/cn';
import { useSurface } from '../hooks/useSurface';

/**
 * Shared building blocks for GameBoard and MultiDeviceGameBoard.
 * All colours come from the surrounding surface (fg / surface tokens).
 */

/**
 * Compact top bar: left action, round counter in the middle, right actions.
 * The player chips sit directly underneath it.
 */
export function GameHeader({ left, right, round }) {
  return (
    <div className="flex items-center min-h-11 flex-shrink-0">
      <div className="flex-1 flex justify-start">{left}</div>
      <div
        className="font-sans text-ui font-bold uppercase tracking-wider text-fg/70 tabular-nums whitespace-nowrap"
        aria-label={`Round ${round} of ${TOTAL_ROUNDS}`}
      >
        Round {round}<span className="text-fg/40">/{TOTAL_ROUNDS}</span>
      </div>
      <div className="flex-1 flex items-center gap-1 justify-end">{right}</div>
    </div>
  );
}

GameHeader.propTypes = {
  left: PropTypes.node,
  right: PropTypes.node,
  round: PropTypes.number.isRequired,
};

/**
 * Compact pill action used in the game header (Finish, Scores).
 * `variant="ghost"` de-emphasises it (used for Finish).
 */
export function HeaderPill({ className, variant = 'primary', ...props }) {
  return (
    <Button
      variant={variant}
      size="small"
      className={cn(
        'rounded-full min-h-9 py-1.5 px-3',
        variant === 'ghost' && 'uppercase font-bold text-fg/70 hover:text-fg',
        className,
      )}
      {...props}
    />
  );
}

HeaderPill.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'ghost']),
};

/**
 * A player chip in the header switcher: colour swatch, name and optional score.
 * The swatch always shows at full strength; inactive chips only dim their text.
 * The active chip is a solid `bg-fg` pill, so the swatch (the player's themed
 * colour, i.e. the page colour) stays visible against it.
 * Renders a <button> when `onClick` is given, otherwise a <div>.
 * `autoScroll` keeps the chip centred in a horizontally scrolling tab list.
 */
export const PlayerTab = forwardRef(function PlayerTab({
  player,
  index,
  score,
  isActive,
  highlight = false,
  disabled = false,
  dimmed = false,
  autoScroll = false,
  onClick,
  badge,
  ...rest
}, forwardedRef) {
  const Tag = onClick ? 'button' : 'div';
  const surface = useSurface();
  const innerRef = useRef(null);

  const setRef = (el) => {
    innerRef.current = el;
    if (typeof forwardedRef === 'function') forwardedRef(el);
    else if (forwardedRef) forwardedRef.current = el;
  };

  useEffect(() => {
    const el = innerRef.current;
    if (!autoScroll || !el?.scrollIntoView) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', inline: 'center', block: 'nearest' });
  }, [autoScroll]);

  return (
    <Tag
      ref={setRef}
      role="tab"
      aria-selected={isActive}
      {...(onClick && { type: 'button', onClick, disabled })}
      className={cn(
        'relative flex items-center gap-2 pl-1.5 pr-3.5 h-10 rounded-full min-w-fit flex-shrink-0',
        'transition-[background-color,color,transform] duration-150 ease-out motion-reduce:transition-none',
        isActive ? 'bg-fg text-surface' : 'text-fg/70 hover:bg-fg/10 hover:text-fg',
        highlight && 'ring-2 ring-fg ring-offset-2 ring-offset-surface',
        onClick && !disabled && 'cursor-pointer active:scale-[0.97] motion-reduce:active:scale-100',
        (disabled || dimmed) && 'cursor-not-allowed opacity-40',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
      )}
      {...rest}
    >
      <div className="relative flex-shrink-0">
        <div
          className={cn(
            'w-7 h-7 rounded-full',
            isActive ? 'ring-2 ring-surface' : 'ring-1 ring-fg/20',
          )}
          style={{ backgroundColor: surface(player.color).color }}
        />
        {badge}
      </div>
      <span className="font-sans text-ui font-bold uppercase tracking-wide truncate max-w-[90px]">
        {player.name || `P${index + 1}`}
      </span>
      {score !== undefined && (
        <span className="font-serif text-body-lg leading-none tabular-nums">{score}</span>
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
  autoScroll: PropTypes.bool,
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
