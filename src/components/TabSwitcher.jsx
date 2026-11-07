import PropTypes from 'prop-types';
import SegmentedControl from './SegmentedControl';

/**
 * Chooses the score input method (Quick / Dice).
 */
const TABS = [
  { id: 'quick', label: 'Quick', icon: 'basil:lightning-solid' },
  { id: 'dice', label: 'Dice', icon: 'basil:dice-solid' },
];

export default function TabSwitcher({ activeTab, onTabChange, firstTabRef }) {
  return (
    <SegmentedControl
      options={TABS}
      value={activeTab}
      onChange={onTabChange}
      firstRef={firstTabRef}
      ariaLabel="Input method selection"
      className="mb-4"
    />
  );
}

TabSwitcher.propTypes = {
  activeTab: PropTypes.oneOf(['dice', 'quick']).isRequired,
  onTabChange: PropTypes.func.isRequired,
  firstTabRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
};
