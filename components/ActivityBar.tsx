import React from 'react';
import { ViewMode } from '../types';
import { FileIcon, SparklesIcon, SearchIcon, GitIcon, ExtensionsIcon, SettingsIcon } from './icons';

interface ActivityBarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const ActivityBarIcon: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ label, isActive, onClick, children }) => (
  <button
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`relative w-12 h-12 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors focus:outline-none ${isActive ? 'text-blue-600 dark:text-blue-500' : ''}`}
  >
    {children}
    {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-600 dark:bg-blue-500"></div>}
  </button>
);


export const ActivityBar: React.FC<ActivityBarProps> = ({ viewMode, setViewMode }) => {
  return (
    <nav className="flex flex-col justify-between w-12 bg-gray-200 dark:bg-[#333333] border-r border-gray-300 dark:border-gray-900/50">
      <div>
        <ActivityBarIcon label="Explorer" isActive={viewMode === 'explorer'} onClick={() => setViewMode('explorer')}>
          <FileIcon className="w-6 h-6" />
        </ActivityBarIcon>
        <ActivityBarIcon label="AI Assistant" isActive={viewMode === 'chat'} onClick={() => setViewMode('chat')}>
          <SparklesIcon className="w-6 h-6" />
        </ActivityBarIcon>
        <ActivityBarIcon label="Search (disabled)" isActive={false} onClick={() => {}}>
          <SearchIcon className="w-6 h-6 opacity-50" />
        </ActivityBarIcon>
        <ActivityBarIcon label="Source Control (disabled)" isActive={false} onClick={() => {}}>
          <GitIcon className="w-6 h-6 opacity-50" />
        </ActivityBarIcon>
        <ActivityBarIcon label="Extensions (disabled)" isActive={false} onClick={() => {}}>
          <ExtensionsIcon className="w-6 h-6 opacity-50" />
        </ActivityBarIcon>
      </div>
      <div>
        <ActivityBarIcon label="Settings (disabled)" isActive={false} onClick={() => {}}>
          <SettingsIcon className="w-6 h-6 opacity-50" />
        </ActivityBarIcon>
      </div>
    </nav>
  );
};
