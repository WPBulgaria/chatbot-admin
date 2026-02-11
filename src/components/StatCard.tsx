import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  subtitle,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded border border-[#c3c4c7] shadow-sm p-5 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      {trend && (
        <div className={`flex items-center text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.isPositive ? (
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ) : (
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          )}
          <span>{Math.abs(trend.value).toFixed(1)}%</span>
        </div>
      )}
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
};
