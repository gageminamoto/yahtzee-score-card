import { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Button component following CMYK design principles:
 * - Bold, high-contrast styling
 * - Large tap targets (minimum 60px height)
 * - Clear visual states
 * - Keyboard accessible (Enter and Space keys work)
 */
const Button = forwardRef(function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'large',
  disabled = false,
  fullWidth = false,
  className = ''
}, ref) {
  const baseStyles = "font-sans font-bold uppercase cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-[transform,background-color,opacity] duration-150 ease-out active:scale-[0.97] hover:scale-[1.003]";

  // Theme-aware button variants with proper contrast in both modes
  const variants = {
    primary: "bg-black/20 dark:bg-white/20 text-white dark:text-black hover:bg-black/100 dark:hover:bg-white/100 hover:text-white dark:hover:text-black",
    solid: "bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80",
    outline: "bg-transparent text-white dark:text-black border-white dark:border-black hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white",
  };

  const sizes = {
    large: "text-body-lg py-5 px-8 min-h-[80px]",
    medium: "text-body py-4 px-6 min-h-[60px]",
    small: "text-ui py-3 px-5 min-h-[48px]",
    xs: "text-xs py-2 px-4 min-h-[36px]",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
});

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'solid', 'outline']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
};

// Export Button as the default export so it can be imported via index.js
export default Button;
