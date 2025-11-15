import React from 'react';
import { Files } from '../types';
import { CodeView } from './CodeView';
import { PreviewFrame } from './PreviewFrame';
import { CloseIcon } from './icons';

interface EditorProps {
  files: Files;
  openTabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onCloseTab: (tab: string) => void;
  theme: 'dark' | 'light';
}

const Tab: React.FC<{
  fileName: string;
  isActive: boolean;
  onClick: () => void;
  onClose: (e: React.MouseEvent) => void;
}> = ({ fileName, isActive, onClick, onClose }) => {
  const activeClasses = 'bg-gray-100 dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-200';
  const inactiveClasses = 'bg-gray-200 dark:bg-[#2d2d2d] text-gray-600 dark:text-gray-400 hover:bg-gray-300/60 dark:hover:bg-gray-700/50';

  return (
    <div
      className={`flex items-center justify-between px-4 py-2 cursor-pointer text-sm ${isActive ? activeClasses : inactiveClasses}`}
      onClick={onClick}
    >
      <span>{fileName}</span>
      <CloseIcon 
        className="w-4 h-4 ml-3 p-0.5 rounded-sm hover:bg-gray-400/50 dark:hover:bg-gray-500/50" 
        onClick={onClose} 
      />
    </div>
  );
};

export const Editor: React.FC<EditorProps> = ({ files, openTabs, activeTab, setActiveTab, onCloseTab, theme }) => {

  const allTabs = [...openTabs, 'Live Preview'];

  const handleClose = (e: React.MouseEvent, fileName: string) => {
    e.stopPropagation();
    onCloseTab(fileName);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 bg-gray-200 dark:bg-[#252526] flex items-end">
        {allTabs.map(tabName => (
          tabName !== 'Live Preview' ? (
             <Tab
                key={tabName}
                fileName={tabName}
                isActive={activeTab === tabName}
                onClick={() => setActiveTab(tabName)}
                onClose={(e) => handleClose(e, tabName)}
              />
          ) : null
        ))}
        <div className="border-l border-gray-300 dark:border-gray-800/70 h-full self-center my-1.5"></div>
         <div
            className={`px-4 py-2 cursor-pointer text-sm ${activeTab === 'Live Preview' ? 'bg-gray-100 dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-200' : 'bg-gray-200 dark:bg-[#2d2d2d] text-gray-600 dark:text-gray-400 hover:bg-gray-300/60 dark:hover:bg-gray-700/50'}`}
            onClick={() => setActiveTab('Live Preview')}
        >
          Live Preview
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {activeTab === 'Live Preview' ? (
          <PreviewFrame files={files} />
        ) : (
          <CodeView code={files[activeTab]?.content || ''} language={files[activeTab]?.language || 'plaintext'} theme={theme} />
        )}
      </div>
    </div>
  );
};
