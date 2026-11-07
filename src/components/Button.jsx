import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cn } from '../utils/cn';

/**
 * Button following the CMYK design principles.
 * Colours come from the surrounding surface (`fg` / `surface` tokens), so a
 * Button reads correctly on any page or player colour with no colour props.
 *
 * Variants:
 *   primary - translucent fill, inverts on hover (main menu actions)
 *   solid   - full fg fill with surface-coloured text (the main call to action)
 *   outline - bordered, for secondary actions next to a solid button
 *   ghost   - text only, for back links, icon buttons and inline actions
 */
const VARIANTS = {
  primary: 'bg-fg/20 text-fg hover:bg-fg hover:text-surface uppercase font-bold',
  solid: 'bg-fg text-surface hover:bg-fg/85 uppercase font-bold',
  outline: 'border-2 border-fg/40 bg-fg/10 text-fg hover:bg-fg/20 hover:border-fg/60 uppercase font-bold',
  ghost: 'text-fg hover:bg-fg/10',
};

const SIZES = {
  large: 'text-body-lg py-5 px-8 min-h-[80px]',
  medium: 'text-body py-4 px-6 min-h-[60px]',
  small: 'text-ui py-3 px-4 min-h-[44px]',
  icon: 'w-11 h-11 p-0',
};

const Button = forwardRef(function Button({
  children,
  variant = 'primary',
  size = 'large',
  fullWidth = false,
  className,
  type = 'button',
  ...rest
}, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-sans cursor-pointer',
        'transition-[transform,background-color,border-color,color,opacity] duration-150 ease-out active:scale-[0.97]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'solid', 'outline', 'ghost']),
  size: PropTypes.oneOf(['large', 'medium', 'small', 'icon']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;
