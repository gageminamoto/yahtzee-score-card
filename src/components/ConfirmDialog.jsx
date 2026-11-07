import PropTypes from 'prop-types';
import Button from './Button';
import Modal from './Modal';
import { useSettings } from '../context/SettingsContext';

/**
 * Simple confirmation dialog to replace browser's default confirm()
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
  const { settings } = useSettings();
  if (!isOpen) return null;

  return (
    <Modal
      color={settings.visual.enableDarkMode ? '#121212' : '#FFFFFF'}
      themed={false}
      onDismiss={onCancel}
    >
      {title && (
        <h2 className="font-serif text-subtitle mb-4 text-balance">{title}</h2>
      )}
      <p className="font-sans text-body text-fg/70 mb-8 text-pretty">{message}</p>
      <div className="flex gap-4">
        <Button variant="solid" size="medium" onClick={onConfirm}>
          {confirmText}
        </Button>
        <Button variant="outline" size="medium" onClick={onCancel}>
          {cancelText}
        </Button>
      </div>
    </Modal>
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
