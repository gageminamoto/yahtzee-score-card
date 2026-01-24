import PropTypes from 'prop-types';
import Button from './Button';

/**
 * Simple confirmation dialog to replace browser's default confirm()
 * - Centered modal with backdrop
 * - Title, message, and action buttons
 */
export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-white dark:bg-black p-8 max-w-md w-full animate-scaleIn">
        {title && (
          <h2 className="font-serif text-subtitle text-black dark:text-white mb-4 text-balance">
            {title}
          </h2>
        )}

        <p className="font-sans text-body text-black/80 dark:text-white/80 mb-8 text-pretty">
          {message}
        </p>

        <div className="flex gap-4 justify-start">
          <Button
            variant="solid"
            size="medium"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
          <Button
            variant="outline"
            size="medium"
            onClick={onCancel}
            className="border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
}

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
