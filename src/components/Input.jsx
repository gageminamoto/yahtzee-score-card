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
}) {
  const baseStyles = "w-full bg-transparent border-4 border-white text-white font-sans text-body-lg px-6 py-4 outline-none focus:border-bright-green transition-colors duration-150 placeholder-white placeholder-opacity-50 disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      maxLength={maxLength}
      autoFocus={autoFocus}
      className={`${baseStyles} ${className}`}
    />
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
};
