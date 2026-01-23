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
  // Theme-aware input with proper colors for both light and dark modes
  const baseStyles = "w-full bg-transparent border-4 border-white dark:border-black text-white dark:text-black font-sans text-body-lg px-6 py-4 outline-none focus:ring-2 focus:ring-white dark:focus:ring-black focus:ring-offset-2 focus:ring-offset-transparent transition-[border-color,box-shadow] duration-100 ease-out placeholder-white dark:placeholder-black placeholder-opacity-50 disabled:opacity-40 disabled:cursor-not-allowed";

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
