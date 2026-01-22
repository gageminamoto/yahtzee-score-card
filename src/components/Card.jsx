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
  const baseStyles = "bg-black bg-opacity-20";
  const borderStyles = border ? "border-4 border-black" : "";

  const paddingStyles = {
    none: "p-0",
    small: "p-4",
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
  padding: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  border: PropTypes.bool,
};
