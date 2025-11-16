import React, { useState, useEffect } from 'react';

interface ExtensionsViewProps {
  currentApiKey: string;
  onApiKeyChange: (newKey: string) => void;
}

export const ExtensionsView: React.FC<ExtensionsViewProps> = ({ currentApiKey, onApiKeyChange }) => {
  const [apiKeyInput, setApiKeyInput] = useState(currentApiKey);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setApiKeyInput(currentApiKey);
  }, [currentApiKey]);

  const handleSave = () => {
    onApiKeyChange(apiKeyInput);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000); // Hide message after 2s
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="p-4 space-y-6 text-sm">
      <div>
        <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Google Gemini API</h3>
        <div className="space-y-2">
           <label htmlFor="api-key-input" className="text-gray-600 dark:text-gray-400">
            API Key
          </label>
          <input
            id="api-key-input"
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your Gemini API Key"
            className="w-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 rounded-md px-2 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
          />
           <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSave}
                className="w-full text-center px-2 py-1.5 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 disabled:bg-gray-500 transition-colors"
              >
                {saved ? 'Salva!' : 'Salvar Chave'}
              </button>
              <a
                href="https://aistudio.google.com/app/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center block px-2 py-1.5 bg-gray-600 text-white rounded-md text-xs font-semibold hover:bg-gray-700 transition-colors"
              >
                Criar Chave de API
              </a>
          </div>
           <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Your API key is stored securely in your browser's local storage and is only sent to the Google Gemini API.
          </p>
        </div>
      </div>
    </div>
  );
};