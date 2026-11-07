import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cn } from '../utils/cn';

/**
 * Text input with bold CMYK styling. Colours follow the surrounding surface.
 */
const Input = forwardRef(function Input({ className, type = 'text', ...rest }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'w-full border-2 border-fg/40 bg-fg/10 text-fg placeholder:text-fg/60',
        'font-sans text-body-lg px-6 py-4 outline-none',
        'focus:border-fg transition-[border-color,background-color] duration-100 ease-out',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        className,
      )}
      {...rest}
    />
  );
});

Input.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
};

export default Input;
