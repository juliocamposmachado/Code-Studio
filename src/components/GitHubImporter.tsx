import React, { useState } from 'react';
import { GitHubIcon } from './icons';

interface GitHubImporterProps {
  onImport: (url: string) => Promise<void>;
}

export const GitHubImporter: React.FC<GitHubImporterProps> = ({ onImport }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImportClick = async () => {
    if (!url.trim()) {
      setError("URL é obrigatória.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await onImport(url);
      setUrl('');
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido durante a importação.';
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
    <div className="relative flex items-center w-full max-w-sm">
        <GitHubIcon className="w-4 h-4 text-gray-500 absolute left-2 pointer-events-none" />
        <input
          type="text"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError(null); }}
          onKeyPress={handleKeyPress}
          placeholder="Importar de URL do GitHub..."
          className={`w-full bg-gray-100 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 rounded-md pl-8 pr-16 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs ${error ? 'ring-2 ring-red-500' : ''}`}
          aria-label="GitHub Repository URL"
          disabled={isLoading}
        />
        <button
          onClick={handleImportClick}
          disabled={isLoading}
          className="absolute right-1 top-1/2 -translate-y-1/2 text-center px-2 py-0.5 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '...' : 'Importar'}
        </button>
        {error && <p className="absolute top-full left-0 text-xs text-red-500 dark:text-red-400 mt-1">{error}</p>}
    </div>
  );
};