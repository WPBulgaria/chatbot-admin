import React from 'react';
import type { ChartDataPoint } from '../types/stats';

interface SimpleChartProps {
  data: ChartDataPoint[];
  height?: number;
  className?: string;
}

export const SimpleChart: React.FC<SimpleChartProps> = ({
  data,
  height = 200,
  className = '',
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
    );
  }

  const maxChats = Math.max(...data.map(d => d.chats), 1);
  const maxQuestions = Math.max(...data.map(d => d.questions), 1);
  const maxValue = Math.max(maxChats, maxQuestions);

  return (
    <div className={className}>
      <div className="flex gap-4 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-xs text-gray-600">Chats</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-xs text-gray-600">Questions</span>
        </div>
      </div>
      <div className="flex items-end justify-between gap-1" style={{ height }}>
        {data.map((point, index) => {
          const chatHeight = (point.chats / maxValue) * 100;
          const questionHeight = (point.questions / maxValue) * 100;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end justify-center gap-0.5" style={{ height: height - 40 }}>
                <div
                  className="bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer relative group"
                  style={{ height: `${chatHeight}%`, width: '45%' }}
                  title={`${point.chats} chats`}
                >
                  <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap left-1/2 transform -translate-x-1/2">
                    {point.chats} chats
                  </div>
                </div>
                <div
                  className="bg-green-500 rounded-t hover:bg-green-600 transition-colors cursor-pointer relative group"
                  style={{ height: `${questionHeight}%`, width: '45%' }}
                  title={`${point.questions} questions`}
                >
                  <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap left-1/2 transform -translate-x-1/2">
                    {point.questions} questions
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-600 mt-1 transform -rotate-45 origin-top-left whitespace-nowrap">
                {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
