import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { cn } from '../../utils/cn';
import FeedbackMenu from './FeedbackMenu';
import FeedbackForm from './FeedbackForm';
import { FEEDBACK_TYPES } from './feedbackTypes';

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [message, setMessage] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [status, setStatus] = useState('idle');

  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target)) {
        handleClose();
      }
    };

    const handleEscape = (event) => {
      if (isOpen && event.key === 'Escape') {
        handleClose();
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setSelectedType(null);
    setMessage('');
    setScreenshot(null);
    setStatus('idle');
  };

  const handleSelectType = (type) => {
    setSelectedType(type);
  };

  const handleBack = () => {
    setSelectedType(null);
    setMessage('');
    setScreenshot(null);
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setStatus('sending');
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: FEEDBACK_TYPES[selectedType].label,
          message: message.trim(),
          screenshot: screenshot?.data || null,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setStatus('success');
      setTimeout(handleClose, 2000);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-popover">
      {/* Popover Content */}
      {isOpen && (
        <div
          className={cn(
            "absolute bottom-full right-0 mb-3",
            "bg-white dark:bg-neutral-900",
            "shadow-2xl min-w-[300px] max-w-[340px]",
            "animate-scaleIn rounded-lg overflow-hidden"
          )}
          style={{ transformOrigin: 'bottom right' }}
          role="dialog"
          aria-modal="true"
          aria-label="Send feedback"
        >
          {!selectedType ? (
            <FeedbackMenu onSelect={handleSelectType} onClose={handleClose} />
          ) : (
            <FeedbackForm
              type={selectedType}
              message={message}
              onMessageChange={setMessage}
              screenshot={screenshot}
              onScreenshotChange={setScreenshot}
              onSubmit={handleSubmit}
              onBack={handleBack}
              onClose={handleClose}
              status={status}
            />
          )}
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full",
          "bg-electric-blue text-white",
          "flex items-center justify-center",
          "shadow-lg hover:shadow-xl",
          "transition-all duration-150",
          "hover:scale-105 active:scale-95",
          "focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2"
        )}
        aria-label={isOpen ? "Close feedback menu" : "Send feedback"}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Icon
          icon={isOpen ? "mdi:close" : "mdi:message-text"}
          width={24}
          className={cn(
            "transition-transform duration-200",
            isOpen && "rotate-90"
          )}
        />
      </button>
    </div>
  );
}
