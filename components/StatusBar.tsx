import React from 'react';

interface StatusBarProps {
  isLoading: boolean;
  apiUsageCount: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ isLoading, apiUsageCount }) => {
  return (
    <footer className="h-6 flex items-center justify-between px-4 bg-blue-600 dark:bg-[#007acc] text-white text-xs">
      <div className="flex items-center space-x-4">
        <span>main*</span>
        <div className="flex items-center space-x-1">
          <span>{isLoading ? 'AI Thinking...' : 'Gemini Ready'}</span>
          {isLoading && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
        </div>
        <div className="flex items-center space-x-1" title="Approximate number of API calls made in this session.">
          <span>API Calls: {apiUsageCount}</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span>UTF-8</span>
        <span>Spaces: 2</span>
      </div>
    </footer>
  );
};