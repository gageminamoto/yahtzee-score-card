import PropTypes from 'prop-types';
import { cn } from '../utils/cn';

/**
 * Card for grouping content: a subtle fg-tinted panel on the current surface.
 */
const PADDING = {
  none: 'p-0',
  small: 'p-3',
  medium: 'p-6',
  large: 'p-8',
};

export default function Card({ children, className, padding = 'medium' }) {
  return (
    <div className={cn('bg-fg/10 text-fg', PADDING[padding], className)}>
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  padding: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
};
