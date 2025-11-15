import React from 'react';
import { ViewMode, Files, Message } from '../types';
import { FileExplorer } from './FileExplorer';
import { Chat } from './Chat';

interface SidebarProps {
  viewMode: ViewMode;
  files: Files;
  onOpenFile: (fileName: string) => void;
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onImportRepo: (url: string) => Promise<void>;
  onClearProject: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  viewMode,
  files,
  onOpenFile,
  messages,
  onSendMessage,
  isLoading,
  onImportRepo,
  onClearProject
}) => {
  return (
    <aside className="w-64 bg-gray-100 dark:bg-[#252526] flex flex-col border-r border-gray-300 dark:border-gray-900/50">
        <header className="p-2.5 text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 border-b border-gray-300 dark:border-gray-900/50">
            {viewMode === 'explorer' ? 'Explorer' : 'AI Assistant'}
        </header>
        <div className="flex-1 overflow-y-auto">
        {viewMode === 'explorer' && (
            <FileExplorer
                files={files}
                onOpenFile={onOpenFile}
                onImportRepo={onImportRepo}
                onClearProject={onClearProject}
            />
        )}
        {viewMode === 'chat' && (
            <Chat messages={messages} onSendMessage={onSendMessage} isLoading={isLoading} />
        )}
        </div>
    </aside>
  );
};
