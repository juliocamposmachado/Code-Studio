import React from 'react';
import { Files } from '../types';
import { CodeIcon } from './icons';
import { GitHubImporter } from './GitHubImporter';

interface FileExplorerProps {
  files: Files;
  onOpenFile: (fileName: string) => void;
  onImportRepo: (url: string) => Promise<void>;
  modifiedByAI: string[];
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ files, onOpenFile, onImportRepo, modifiedByAI }) => {
  return (
    <div className="p-2 flex flex-col h-full">
        <GitHubImporter onImport={onImportRepo} />
        <div className="border-t border-gray-300 dark:border-gray-700 my-2"></div>
        <h2 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-2 px-1.5">Project Files</h2>
        <ul className="overflow-y-auto flex-1">
            {Object.keys(files).sort().map(fileName => (
            <li key={fileName}>
                <button
                onClick={() => onOpenFile(fileName)}
                className="w-full flex items-center justify-between text-left p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/50 text-sm"
                title={fileName}
                >
                    <div className="flex items-center truncate">
                        <CodeIcon className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                        <span className="truncate">{fileName}</span>
                    </div>
                    {modifiedByAI.includes(fileName) && (
                        <span className="relative flex h-2 w-2 ml-2 flex-shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                        </span>
                    )}
                </button>
            </li>
            ))}
        </ul>
    </div>
  );
};