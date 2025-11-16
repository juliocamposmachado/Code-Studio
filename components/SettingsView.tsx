import React from 'react';

interface SettingsViewProps {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  onClearProject: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ theme, setTheme, onClearProject }) => {
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="p-4 space-y-6 text-sm">
      {/* Appearance Section */}
      <div>
        <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Appearance</h3>
        <div className="flex items-center justify-between">
          <label htmlFor="theme-toggle" className="text-gray-600 dark:text-gray-400">
            Color Theme
          </label>
          <button
            id="theme-toggle"
            onClick={toggleTheme}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors capitalize"
          >
            {theme}
          </button>
        </div>
      </div>

      {/* Project Section */}
      <div>
        <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Project</h3>
        <div className="flex items-center justify-between">
            <label htmlFor="clear-project" className="text-gray-600 dark:text-gray-400">
                Reset Project
            </label>
            <button
                id="clear-project"
                onClick={onClearProject}
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
                Clear All Files
            </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            This will restore the initial example project and delete all current files. This action cannot be undone.
        </p>
      </div>
    </div>
  );
};