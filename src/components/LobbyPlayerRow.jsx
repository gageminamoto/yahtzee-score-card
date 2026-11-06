import PropTypes from 'prop-types';
import { cn } from '../utils/cn';

/**
 * One player in a multi-device lobby list: colour dot, name, host tag and
 * connection status. `leading` is an optional slot (e.g. a drag handle).
 */
export default function LobbyPlayerRow({ player, isYou = false, leading, className, ...rest }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 text-fg',
        isYou ? 'bg-fg/20' : 'bg-fg/10',
        className,
      )}
      {...rest}
    >
      {leading}
      <div className="w-8 h-8 rounded-full shrink-0" style={{ backgroundColor: player.color }} />
      <span className="font-sans text-body font-bold flex-1">
        {player.name}
        {isYou && <span className="text-fg/70 font-normal ml-2">(You)</span>}
      </span>
      {player.isHost && (
        <span className="font-sans text-ui uppercase text-fg/70">Host</span>
      )}
      <div
        className={cn('w-2.5 h-2.5 rounded-full shrink-0', player.isConnected ? 'bg-bright-green' : 'bg-bright-red')}
        role="img"
        aria-label={player.isConnected ? 'Connected' : 'Disconnected'}
      />
    </div>
  );
}

LobbyPlayerRow.propTypes = {
  player: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    color: PropTypes.string,
    isHost: PropTypes.bool,
    isConnected: PropTypes.bool,
  }).isRequired,
  isYou: PropTypes.bool,
  leading: PropTypes.node,
  className: PropTypes.string,
};
