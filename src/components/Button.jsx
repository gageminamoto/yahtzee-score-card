import PropTypes from 'prop-types';

/**
 * Button component following CMYK design principles:
 * - Bold, high-contrast styling
 * - Large tap targets (minimum 60px height)
 * - Clear visual states
 */
export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'large',
  disabled = false,
  fullWidth = false,
  className = ''
}) {
  const baseStyles = "font-sans font-bold uppercase tracking-wide transition-all duration-150 cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed border-4 border-black";

  const variants = {
    primary: "bg-black bg-opacity-20 text-white hover:bg-black hover:bg-opacity-100",
    solid: "bg-black text-white hover:bg-opacity-80",
    outline: "bg-transparent text-white border-white hover:bg-white hover:text-black",
  };

  const sizes = {
    large: "text-body-lg py-5 px-8 min-h-[80px]",
    medium: "text-body py-4 px-6 min-h-[60px]",
    small: "text-ui py-3 px-5 min-h-[48px]",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'solid', 'outline']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
};
