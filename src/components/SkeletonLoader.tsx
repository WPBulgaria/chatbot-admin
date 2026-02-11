import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  height?: string;
  width?: string;
  rounded?: boolean;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  height = 'h-4',
  width = 'w-full',
  rounded = false,
}) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 ${height} ${width} ${rounded ? 'rounded-full' : 'rounded'} ${className}`}
    ></div>
  );
};

export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded border border-[#c3c4c7] shadow-sm p-5">
      <div className="flex items-center justify-between mb-2">
        <SkeletonLoader width="w-24" height="h-4" />
        <SkeletonLoader width="w-5" height="h-5" rounded />
      </div>
      <SkeletonLoader width="w-32" height="h-8" className="mb-1" />
      <SkeletonLoader width="w-20" height="h-4" />
    </div>
  );
};

export const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 250 }) => {
  return (
    <div className="flex items-end justify-between gap-1" style={{ height }}>
      {[...Array(12)].map((_, i) => (
        <div key={i} className="flex-1 flex items-end justify-center gap-0.5" style={{ height: height - 40 }}>
          <SkeletonLoader
            height={`h-[${Math.random() * 60 + 20}%]`}
            width="w-[45%]"
            className="bg-blue-200"
          />
          <SkeletonLoader
            height={`h-[${Math.random() * 60 + 20}%]`}
            width="w-[45%]"
            className="bg-green-200"
          />
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
          <div className="flex items-center gap-3 flex-1">
            <SkeletonLoader width="w-8" height="h-8" rounded />
            <div className="flex-1">
              <SkeletonLoader width="w-32" height="h-4" className="mb-2" />
              <SkeletonLoader width="w-48" height="h-3" />
            </div>
          </div>
          <div className="text-right">
            <SkeletonLoader width="w-16" height="h-4" className="mb-2 ml-auto" />
            <SkeletonLoader width="w-20" height="h-3" className="ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
};
