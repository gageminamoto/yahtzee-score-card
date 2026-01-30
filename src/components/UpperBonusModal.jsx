import PropTypes from 'prop-types';
import Button from './Button';
import { getTextColorForBackground } from '../utils/colors';

/**
 * Celebratory modal shown when a player earns the upper section bonus.
 * Displays the player name, bonus points earned, and an explanation.
 */
export default function UpperBonusModal({ playerName, bonusPoints, threshold, onDismiss, playerColor }) {
  const textColor = getTextColorForBackground(playerColor);

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onDismiss}
      />

      {/* Dialog */}
      <div
        className="relative p-8 max-w-md w-full animate-scaleIn"
        style={{ backgroundColor: playerColor }}
      >
        <p
          className="font-sans text-body-lg font-bold uppercase tracking-wide mb-2"
          style={{ color: textColor }}
        >
          +{bonusPoints} Bonus
        </p>

        <h2
          className="font-serif text-subtitle mb-4 text-balance"
          style={{ color: textColor }}
        >
          {playerName} earned the upper bonus!
        </h2>

        <p
          className="font-sans text-body mb-8 text-pretty opacity-80"
          style={{ color: textColor }}
        >
          Scoring {threshold} or more points across the upper section
          (Ones through Sixes) earns a {bonusPoints}-point bonus.
        </p>

        <Button
          variant="outline"
          size="medium"
          onClick={onDismiss}
          textColor={textColor}
        >
          Nice
        </Button>
      </div>
    </div>
  );
}

UpperBonusModal.propTypes = {
  playerName: PropTypes.string.isRequired,
  bonusPoints: PropTypes.number.isRequired,
  threshold: PropTypes.number.isRequired,
  onDismiss: PropTypes.func.isRequired,
  playerColor: PropTypes.string.isRequired,
};
