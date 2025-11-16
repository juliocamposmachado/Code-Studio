
import React from 'react';
import { PlayIcon, DownloadIcon, UploadIcon } from './icons';
import { GitHubImporter } from './GitHubImporter';

interface ActionToolbarProps {
  onRunProject: () => void;
  onDownloadProject: () => void;
  onUploadProject: () => void;
  onImportRepo: (url: string) => Promise<void>;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({ onRunProject, onDownloadProject, onUploadProject, onImportRepo }) => {
  return (
    <div className="flex-shrink-0 bg-gray-200 dark:bg-[#252526] flex items-center justify-between px-3 py-1 border-b border-gray-300 dark:border-gray-900/50 space-x-4">
      <div className="flex-grow">
         <GitHubImporter onImport={onImportRepo} />
      </div>
      <div className="flex items-center space-x-1">
        <button 
          onClick={onUploadProject}
          className="p-1.5 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 flex items-center space-x-1.5"
          title="Carregar Pasta do Computador"
        >
          <UploadIcon className="w-4 h-4" />
          <span className="text-xs font-semibold hidden sm:inline">Carregar</span>
        </button>
        <button 
          onClick={onDownloadProject}
          className="p-1.5 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 flex items-center space-x-1.5"
          title="Baixar Projeto (.zip)"
        >
          <DownloadIcon className="w-4 h-4" />
          <span className="text-xs font-semibold hidden sm:inline">Baixar</span>
        </button>
        <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>
        <button 
          onClick={onRunProject}
          className="p-1.5 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700/50 text-green-500 flex items-center space-x-1.5"
          title="Executar Projeto Localmente"
        >
          <PlayIcon className="w-4 h-4" />
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 hidden sm:inline">Executar</span>
        </button>
      </div>
    </div>
  );
};