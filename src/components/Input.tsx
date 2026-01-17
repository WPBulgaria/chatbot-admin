import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-[13px] font-medium text-[#1d2327] mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-3 py-1.5 rounded border text-[14px] text-[#1d2327]
            ${error ? 'border-[#d63638]' : 'border-[#8c8f94]'}
            focus:outline-none focus:ring-1 focus:border-[#2271b1]
            ${error ? 'focus:ring-[#d63638]' : 'focus:ring-[#2271b1]'}
            transition-all duration-150
            disabled:bg-[#f6f7f7] disabled:text-[#a7aaad]
            placeholder:text-[#a7aaad]
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-[13px] text-[#d63638]">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-[13px] text-[#50575e]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

