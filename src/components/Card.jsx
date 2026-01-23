import PropTypes from 'prop-types';

/**
 * Card component for content grouping:
 * - Bold borders
 * - Clean geometric shapes
 * - Flexible background colors
 */
export default function Card({
  children,
  className = '',
  padding = 'medium',
  border = true,
}) {
  // Use theme-aware overlay colors that work in both light and dark modes
  const baseStyles = "bg-black/20 dark:bg-white/20";
  const borderStyles = "";

  const paddingStyles = {
    none: "p-0",
    xs: "p-2",
    small: "p-3",
    medium: "p-6",
    large: "p-8",
  };

  return (
    <div className={`${baseStyles} ${borderStyles} ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  padding: PropTypes.oneOf(['none', 'xs', 'small', 'medium', 'large']),
  border: PropTypes.bool,
};
