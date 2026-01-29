import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { FEEDBACK_TYPE_LIST } from './feedbackTypes';

export default function FeedbackMenu({ onSelect, onClose }) {
  return (
    <div className="p-2">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/10 dark:border-white/10">
        <h3 className="font-sans text-body font-bold text-black dark:text-white">
          Send Feedback
        </h3>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
          aria-label="Close"
        >
          <Icon icon="mdi:close" width={20} />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="py-2" role="menu">
        {FEEDBACK_TYPE_LIST.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className="w-full px-4 py-3 flex items-center gap-4 text-left hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            role="menuitem"
          >
            <div className="w-10 h-10 rounded-full bg-electric-blue/10 dark:bg-electric-blue/20 flex items-center justify-center flex-shrink-0">
              <Icon icon={type.icon} width={20} className="text-electric-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-sans text-body font-bold text-black dark:text-white">
                {type.label}
              </div>
              <div className="font-sans text-ui text-black/60 dark:text-white/60 truncate">
                {type.subtitle}
              </div>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
}

FeedbackMenu.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
