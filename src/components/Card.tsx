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
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {(title || description) && (
        <div className="px-6 py-5 border-b border-gray-200">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
      <div className="px-6 py-5">
        {children}
      </div>
    </div>
  );
};

