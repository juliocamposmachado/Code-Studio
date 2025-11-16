

import React from 'react';
import { ViewMode, Files } from '../types';
import { FileExplorer } from './FileExplorer';
import { SettingsView } from './SettingsView';
import { SourceControlView } from './SourceControlView';
import { ExtensionsView } from './ExtensionsView';
import { AccountsView } from './AccountsView';

interface GitHubUser {
    username: string;
    name: string | null;
    avatarUrl: string;
}

interface SidebarProps {
  width: number;
  viewMode: ViewMode;
  files: Files;
  onOpenFile: (fileName: string) => void;
  onClearProject: () => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  committedFiles: Files;
  onCommitChanges: () => void;
  onDiscardFileChanges: (fileName: string) => void;
  apiKey: string;
  onApiKeyChange: (newKey: string) => void;
  modifiedByAI: string[];
  githubUser: GitHubUser | null;
  setGithubUser: (user: GitHubUser | null) => void;
}

const viewTitles: Record<ViewMode, string> = {
    explorer: 'Explorer',
    settings: 'Settings',
    'source-control': 'Source Control',
    extensions: 'Extensions',
    accounts: 'Accounts',
};

export const Sidebar: React.FC<SidebarProps> = ({
  width,
  viewMode,
  files,
  onOpenFile,
  onClearProject,
  theme,
  setTheme,
  committedFiles,
  onCommitChanges,
  onDiscardFileChanges,
  apiKey,
  onApiKeyChange,
  modifiedByAI,
  githubUser,
  setGithubUser,
}) => {
  return (
    <aside 
        className="bg-gray-100 dark:bg-[#252526] flex flex-col border-r border-gray-300 dark:border-gray-900/50 overflow-hidden flex-shrink-0"
        style={{ width: `${width}px` }}
    >
       {width > 0 && (
         <>
            <header className="p-2.5 text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 border-b border-gray-300 dark:border-gray-900/50 flex-shrink-0">
                <span>{viewTitles[viewMode]}</span>
            </header>
            <div className="flex-1 overflow-y-auto min-w-[16rem]">
            {viewMode === 'explorer' && (
                <FileExplorer
                    files={files}
                    onOpenFile={onOpenFile}
                    modifiedByAI={modifiedByAI}
                />
            )}
            {viewMode === 'settings' && (
                <SettingsView
                    theme={theme}
                    setTheme={setTheme}
                    onClearProject={onClearProject}
                />
            )}
            {viewMode === 'source-control' && (
                <SourceControlView
                    files={files}
                    committedFiles={committedFiles}
                    onCommitChanges={onCommitChanges}
                    onDiscardFileChanges={onDiscardFileChanges}
                />
            )}
            {viewMode === 'extensions' && (
                <ExtensionsView
                    currentApiKey={apiKey}
                    onApiKeyChange={onApiKeyChange}
                />
            )}
            {viewMode === 'accounts' && (
                <AccountsView 
                    githubUser={githubUser}
                    setGithubUser={setGithubUser}
                />
            )}
            </div>
         </>
       )}
    </aside>
  );
};