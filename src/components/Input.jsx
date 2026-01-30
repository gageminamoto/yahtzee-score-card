import { useId } from 'react';
import PropTypes from 'prop-types';

/**
 * Input component with bold CMYK styling:
 * - White border, transparent fill
 * - Large, readable text
 * - Clear focus states
 */
export default function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  maxLength,
  className = '',
  autoFocus = false,
  textColor = '#ffffff',
}) {
  const isBlack = textColor === '#000000';
  const baseStyles = "w-full border-2 font-sans text-body-lg px-6 py-4 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent transition-[border-color,background-color,box-shadow] duration-100 ease-out disabled:opacity-40 disabled:cursor-not-allowed";

  // Use React's useId for stable unique ID
  const reactId = useId();
  const inputId = `input${reactId.replace(/:/g, '')}`;

  return (
    <>
      <style>{`#${inputId}::placeholder { color: ${textColor}; opacity: 0.6; }`}</style>
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxLength}
        autoFocus={autoFocus}
        className={`${baseStyles} ${className}`}
        style={{
          borderColor: isBlack ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.4)',
          backgroundColor: isBlack ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)',
          color: textColor,
          '--tw-ring-color': textColor,
        }}
      />
    </>
  );
}

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
  className: PropTypes.string,
  autoFocus: PropTypes.bool,
  textColor: PropTypes.string,
};
