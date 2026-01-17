import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  description,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded border border-[#c3c4c7] shadow-sm ${className}`}>
      {(title || description) && (
        <div className="px-5 py-4 border-b border-[#c3c4c7]">
          {title && (
            <h3 className="text-[14px] font-semibold text-[#1d2327]">{title}</h3>
          )}
          {description && (
            <p className="mt-0.5 text-[13px] text-[#50575e]">{description}</p>
          )}
        </div>
      )}
      <div className="px-5 py-4">
        {children}
      </div>
    </div>
  );
};

