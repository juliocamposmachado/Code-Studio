

import React from 'react';
import { Files } from '../types';
import { CodeView } from './CodeView';
import { PreviewFrame } from './PreviewFrame';
import { CloseIcon } from './icons';
import { Terminal } from './Terminal';
import { ActionToolbar } from './ActionToolbar';

interface EditorProps {
  files: Files;
  previewFiles: Files | null;
  openTabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onCloseTab: (tab: string) => void;
  theme: 'dark' | 'light';
  modifiedByAI: string[];
  onTerminalCommand: (command: string) => void;
  terminalOutput: React.ReactNode[];
  onRunProject: () => void;
  onDownloadProject: () => void;
  onUploadProject: () => void;
  onImportRepo: (url: string) => Promise<void>;
}

const Tab: React.FC<{
  fileName: string;
  isActive: boolean;
  isModified: boolean;
  onClick: () => void;
  onClose: (e: React.MouseEvent) => void;
}> = ({ fileName, isActive, onClick, onClose, isModified }) => {
  const activeClasses = 'bg-gray-100 dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-200';
  const inactiveClasses = 'bg-gray-200 dark:bg-[#2d2d2d] text-gray-600 dark:text-gray-400 hover:bg-gray-300/60 dark:hover:bg-gray-700/50';

  return (
    <div
      className={`flex items-center justify-between px-4 py-2 cursor-pointer text-sm ${isActive ? activeClasses : inactiveClasses}`}
      onClick={onClick}
      title={isModified ? `${fileName} (Salvo na sua pasta de Downloads)` : fileName}
    >
      <div className="flex items-center">
        <span>{fileName}</span>
        {isModified && (
            <span className="relative flex h-2 w-2 ml-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
        )}
      </div>
      <CloseIcon 
        className="w-4 h-4 ml-3 p-0.5 rounded-sm hover:bg-gray-400/50 dark:hover:bg-gray-500/50" 
        onClick={onClose} 
      />
    </div>
  );
};

const StaticTab: React.FC<{ name: string; isActive: boolean; onClick: () => void; }> = ({ name, isActive, onClick }) => {
  const activeClasses = 'bg-gray-100 dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-200';
  const inactiveClasses = 'bg-gray-200 dark:bg-[#2d2d2d] text-gray-600 dark:text-gray-400 hover:bg-gray-300/60 dark:hover:bg-gray-700/50';
  return (
    <div
      className={`px-4 py-2 cursor-pointer text-sm ${isActive ? activeClasses : inactiveClasses}`}
      onClick={onClick}
    >
      {name}
    </div>
  );
};

export const Editor: React.FC<EditorProps> = ({ 
    files, 
    previewFiles,
    openTabs, 
    activeTab, 
    setActiveTab, 
    onCloseTab, 
    theme, 
    modifiedByAI,
    onTerminalCommand,
    terminalOutput,
    onRunProject,
    onDownloadProject,
    onUploadProject,
    onImportRepo
}) => {

  const handleClose = (e: React.MouseEvent, fileName: string) => {
    e.stopPropagation();
    onCloseTab(fileName);
  };

  const filesForPreview = previewFiles || files;

  return (
    <div className="flex flex-col h-full">
      <ActionToolbar 
        onRunProject={onRunProject} 
        onDownloadProject={onDownloadProject}
        onUploadProject={onUploadProject}
        onImportRepo={onImportRepo}
      />
      <div className="flex-shrink-0 bg-gray-200 dark:bg-[#252526] flex items-end">
        {openTabs.map(tabName => (
          <Tab
            key={tabName}
            fileName={tabName}
            isActive={activeTab === tabName}
            onClick={() => setActiveTab(tabName)}
            onClose={(e) => handleClose(e, tabName)}
            isModified={modifiedByAI.includes(tabName)}
          />
        ))}
        
        {(openTabs.length > 0) && <div className="border-l border-gray-300 dark:border-gray-800/70 h-full self-center my-1.5"></div>}
        
        <StaticTab name="Terminal" isActive={activeTab === 'Terminal'} onClick={() => setActiveTab('Terminal')} />
        <StaticTab name="Live Preview" isActive={activeTab === 'Live Preview'} onClick={() => setActiveTab('Live Preview')} />
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'Live Preview' ? (
          <PreviewFrame files={filesForPreview} />
        ) : activeTab === 'Terminal' ? (
          <Terminal output={terminalOutput} onCommand={onTerminalCommand} theme={theme} />
        ) : (
          openTabs.includes(activeTab) && <CodeView code={files[activeTab]?.content || ''} language={files[activeTab]?.language || 'plaintext'} theme={theme} />
        )}
      </div>
    </div>
  );
};