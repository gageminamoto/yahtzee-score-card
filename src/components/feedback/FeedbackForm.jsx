import { useRef } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import Button from '../Button';
import { FEEDBACK_TYPES } from './feedbackTypes';

export default function FeedbackForm({
  type,
  message,
  onMessageChange,
  screenshot,
  onScreenshotChange,
  onSubmit,
  onBack,
  onClose,
  status,
}) {
  const fileInputRef = useRef(null);
  const feedbackType = FEEDBACK_TYPES[type];
  const isDisabled = status === 'sending' || !message.trim();

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onScreenshotChange({
          name: file.name,
          data: event.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveScreenshot = () => {
    onScreenshotChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Success state
  if (status === 'success') {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-bright-green/20 flex items-center justify-center mx-auto mb-4">
          <Icon icon="mdi:check" width={32} className="text-bright-green" />
        </div>
        <p className="font-sans text-body-lg font-bold text-black dark:text-white">
          Thank you!
        </p>
        <p className="font-sans text-ui text-black/60 dark:text-white/60 mt-1">
          Your feedback has been submitted.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
          aria-label="Back to menu"
        >
          <Icon icon="mdi:arrow-left" width={20} />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <Icon icon={feedbackType.icon} width={20} className="text-electric-blue" />
          <h3 className="font-sans text-body font-bold text-black dark:text-white">
            {feedbackType.label}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
          aria-label="Close"
        >
          <Icon icon="mdi:close" width={20} />
        </button>
      </div>

      {/* Textarea */}
      <textarea
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        placeholder={feedbackType.placeholder}
        className="w-full h-32 p-4 bg-black/5 dark:bg-white/10 border-2 border-transparent focus:border-electric-blue text-black dark:text-white font-sans text-body resize-none outline-none transition-colors placeholder:text-black/40 dark:placeholder:text-white/40"
        disabled={status === 'sending'}
        autoFocus
      />

      {/* Screenshot Section */}
      <div className="mt-3">
        {screenshot ? (
          <div className="flex items-center gap-3 p-2 bg-black/5 dark:bg-white/10">
            <img
              src={screenshot.data}
              alt="Screenshot preview"
              className="w-12 h-12 object-cover"
            />
            <span className="flex-1 font-sans text-ui text-black/60 dark:text-white/60 truncate">
              {screenshot.name}
            </span>
            <button
              onClick={handleRemoveScreenshot}
              className="w-8 h-8 flex items-center justify-center text-black/60 dark:text-white/60 hover:text-bright-red transition-colors"
              aria-label="Remove screenshot"
            >
              <Icon icon="mdi:close" width={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors font-sans text-ui"
          >
            <Icon icon="mdi:image-plus" width={20} />
            <span>Attach screenshot</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Error message */}
      {status === 'error' && (
        <p className="font-sans text-ui text-bright-red mt-3">
          Failed to submit. Please try again.
        </p>
      )}

      {/* Submit button */}
      <div className="mt-4">
        <Button
          variant="solid"
          size="small"
          fullWidth
          onClick={onSubmit}
          disabled={isDisabled}
        >
          {status === 'sending' ? (
            <span className="flex items-center justify-center gap-2">
              <Icon icon="mdi:loading" width={20} className="animate-spin" />
              Sending...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Icon icon="mdi:send" width={18} />
              Send
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}

FeedbackForm.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onMessageChange: PropTypes.func.isRequired,
  screenshot: PropTypes.shape({
    name: PropTypes.string,
    data: PropTypes.string,
  }),
  onScreenshotChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  status: PropTypes.oneOf(['idle', 'sending', 'success', 'error']).isRequired,
};
