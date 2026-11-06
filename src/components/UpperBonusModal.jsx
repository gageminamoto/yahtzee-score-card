import PropTypes from 'prop-types';
import Button from './Button';
import Modal from './Modal';

/**
 * Celebratory modal shown when a player earns the upper section bonus.
 */
export default function UpperBonusModal({ playerName, bonusPoints, threshold, onDismiss, playerColor }) {
  return (
    <Modal color={playerColor} onDismiss={onDismiss}>
      <p className="font-sans text-body-lg font-bold uppercase tracking-wide mb-2">
        +{bonusPoints} Bonus
      </p>
      <h2 className="font-serif text-subtitle mb-4 text-balance">
        {playerName} earned the upper bonus!
      </h2>
      <p className="font-sans text-body text-fg/70 mb-8 text-pretty">
        Scoring {threshold} or more points across the upper section
        (Ones through Sixes) earns a {bonusPoints}-point bonus.
      </p>
      <Button variant="solid" size="medium" onClick={onDismiss}>
        Nice
      </Button>
    </Modal>
  );
}

UpperBonusModal.propTypes = {
  playerName: PropTypes.string.isRequired,
  bonusPoints: PropTypes.number.isRequired,
  threshold: PropTypes.number.isRequired,
  onDismiss: PropTypes.func.isRequired,
  playerColor: PropTypes.string.isRequired,
};
