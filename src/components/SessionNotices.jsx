import PropTypes from 'prop-types';
import Button from './Button';
import { useSettings } from '../context/SettingsContext';
import { surfaceStyle } from '../utils/theme';

/** Full-screen notice shown when the host ends a multi-device session. */
export function SessionCancelledOverlay({ onReturnHome }) {
  const { settings } = useSettings();
  return (
    <div
      className="fixed inset-0 z-popover flex items-center justify-center p-6 text-fg"
      style={surfaceStyle(settings.visual.enableDarkMode ? '#121212' : '#FFFFFF')}
    >
      <div className="max-w-md w-full text-center">
        <h1 className="font-serif text-title mb-3">Session Cancelled</h1>
        <p className="font-sans text-body text-fg/70 mb-6">
          The host ended the session. You can return home to start a new game.
        </p>
        <Button variant="solid" size="large" fullWidth onClick={onReturnHome}>
          Return Home
        </Button>
      </div>
    </div>
  );
}

SessionCancelledOverlay.propTypes = {
  onReturnHome: PropTypes.func.isRequired,
};

/** Inline alert shown while the realtime connection is down. */
export function ConnectionLostBanner({ className = 'mb-4' }) {
  return (
    <div
      className={`text-center py-2 px-4 bg-bright-red text-white ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <p className="font-sans text-ui font-bold">Connection lost — reconnecting...</p>
    </div>
  );
}

ConnectionLostBanner.propTypes = {
  className: PropTypes.string,
};
