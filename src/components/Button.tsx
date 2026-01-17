import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'font-medium rounded transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed border';
  
  // WordPress Admin button styles
  const variantStyles = {
    primary: 'bg-[#2271b1] hover:bg-[#135e96] text-white border-[#2271b1] hover:border-[#135e96] focus:ring-[#2271b1]',
    secondary: 'bg-[#f6f7f7] hover:bg-white text-[#2271b1] border-[#2271b1] hover:text-[#135e96] hover:border-[#135e96] focus:ring-[#2271b1]',
    danger: 'bg-[#d63638] hover:bg-[#a41c1e] text-white border-[#d63638] hover:border-[#a41c1e] focus:ring-[#d63638]',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1 text-[13px]',
    md: 'px-4 py-1.5 text-[13px]',
    lg: 'px-5 py-2 text-sm',
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

