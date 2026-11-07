import PropTypes from 'prop-types';
import { useSurface } from '../hooks/useSurface';
import { surfaceStyle } from '../utils/theme';
import { cn } from '../utils/cn';

/**
 * Centered modal on a dimmed backdrop. The panel is a themed surface, so
 * children use text-fg / bg-fg/N and Buttons need no colour props.
 *
 * @param color  surface colour for the panel
 * @param themed apply dark-mode darkening to `color` (default true)
 */
export default function Modal({ color, themed = true, onDismiss, className, children }) {
  const surface = useSurface();
  const style = themed ? surface(color).style : surfaceStyle(color);

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onDismiss} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn('relative p-8 max-w-md w-full text-fg animate-scaleIn', className)}
        style={style}
      >
        {children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  color: PropTypes.string.isRequired,
  themed: PropTypes.bool,
  onDismiss: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};
