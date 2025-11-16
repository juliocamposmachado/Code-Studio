import React from 'react';
import { ViewMode } from '../types';
import { FileIcon, SparklesIcon, SearchIcon, GitIcon, ExtensionsIcon, SettingsIcon, UserIcon } from './icons';

interface ActivityBarProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode | 'chat') => void;
  isSidebarVisible: boolean;
  isChatPanelVisible: boolean;
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
    className={`relative w-10 h-9 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/20 transition-colors focus:outline-none ${isActive ? 'bg-gray-200 dark:bg-gray-700/20' : ''}`}
  >
    {children}
    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-blue-500 rounded-full"></div>}
  </button>
);


export const ActivityBar: React.FC<ActivityBarProps> = ({ viewMode, onViewChange, isSidebarVisible, isChatPanelVisible }) => {
  return (
    <nav className="flex flex-col justify-between w-11 bg-gray-200 dark:bg-[#333333] border-r border-gray-300 dark:border-gray-900/50">
      <div className="mt-1 space-y-1">
        <ActivityBarIcon label="Explorer" isActive={isSidebarVisible && viewMode === 'explorer'} onClick={() => onViewChange('explorer')}>
          <FileIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
        </ActivityBarIcon>
        <ActivityBarIcon label="AI Assistant" isActive={isChatPanelVisible} onClick={() => onViewChange('chat')}>
          <SparklesIcon className="w-5 h-5" />
        </ActivityBarIcon>
        <ActivityBarIcon label="Search (disabled)" isActive={false} onClick={() => {}}>
          <SearchIcon className="w-5 h-5 opacity-40" />
        </ActivityBarIcon>
        <ActivityBarIcon label="Source Control" isActive={isSidebarVisible && viewMode === 'source-control'} onClick={() => onViewChange('source-control')}>
          <GitIcon className="w-5 h-5 text-orange-500 dark:text-orange-400" />
        </ActivityBarIcon>
        <ActivityBarIcon label="Extensions" isActive={isSidebarVisible && viewMode === 'extensions'} onClick={() => onViewChange('extensions')}>
          <ExtensionsIcon className="w-5 h-5 text-green-500 dark:text-green-400" />
        </ActivityBarIcon>
      </div>
      <div className="mb-1 space-y-1">
        <ActivityBarIcon label="Accounts" isActive={isSidebarVisible && viewMode === 'accounts'} onClick={() => onViewChange('accounts')}>
          <UserIcon className="w-5 h-5" />
        </ActivityBarIcon>
        <ActivityBarIcon label="Settings" isActive={isSidebarVisible && viewMode === 'settings'} onClick={() => onViewChange('settings')}>
          <SettingsIcon className="w-5 h-5" />
        </ActivityBarIcon>
      </div>
    </nav>
  );
};