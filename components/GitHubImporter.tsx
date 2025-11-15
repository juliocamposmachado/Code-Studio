import React, { useState } from 'react';
import { GitHubIcon } from './icons';

interface GitHubImporterProps {
  onImport: (url: string) => Promise<void>;
  onClear: () => void;
}

export const GitHubImporter: React.FC<GitHubImporterProps> = ({ onImport, onClear }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImportClick = async () => {
    if (!url.trim()) {
      setError("Please enter a GitHub repository URL.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await onImport(url);
      setUrl('');
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during import.';
      setError(errorMessage);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleImportClick();
    }
  };

  return (
    <div className="p-1.5">
      <div className="flex items-center space-x-2">
        <GitHubIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300">Import Project</h3>
      </div>
      <div className="mt-2 space-y-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="https://github.com/owner/repo"
          className="w-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 rounded-md px-2 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
          aria-label="GitHub Repository URL"
          disabled={isLoading}
        />
        <button
          onClick={handleImportClick}
          disabled={isLoading}
          className="w-full text-center px-2 py-1.5 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Importing...' : 'Import from GitHub'}
        </button>
        <button
          onClick={onClear}
          disabled={isLoading}
          className="w-full text-center px-2 py-1 bg-gray-600 text-white rounded-md text-xs hover:bg-gray-700 disabled:bg-gray-500/50"
        >
          Clear Project
        </button>
        {error && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{error}</p>}
      </div>
    </div>
  );
};
