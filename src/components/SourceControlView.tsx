import React, { useState, useMemo } from 'react';
import { Files } from '../types';
import { RevertIcon } from './icons';

interface SourceControlViewProps {
  files: Files;
  committedFiles: Files;
  onCommitChanges: () => void;
  onDiscardFileChanges: (fileName: string) => void;
}

export const SourceControlView: React.FC<SourceControlViewProps> = ({
  files,
  committedFiles,
  onCommitChanges,
  onDiscardFileChanges,
}) => {
  const [commitMessage, setCommitMessage] = useState('');

  const changedFiles = useMemo(() => {
    return Object.keys(files).filter(
      (fileName) =>
        !committedFiles[fileName] || files[fileName].content !== committedFiles[fileName].content
    );
  }, [files, committedFiles]);

  const handleCommit = () => {
    if (commitMessage.trim() && changedFiles.length > 0) {
      onCommitChanges();
      setCommitMessage('');
    }
  };

  return (
    <div className="p-2 text-sm h-full flex flex-col">
      <div className="mb-2">
        <textarea
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          placeholder="Message"
          className="w-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 rounded-md px-2 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
          rows={3}
          aria-label="Commit message"
        />
        <button
          onClick={handleCommit}
          disabled={!commitMessage.trim() || changedFiles.length === 0}
          className="w-full text-center mt-1 px-2 py-1.5 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Commit
        </button>
      </div>
      <div className="border-t border-gray-300 dark:border-gray-700 my-2"></div>
      <h3 className="font-bold text-gray-600 dark:text-gray-300 mb-2 px-1.5">
        Changes ({changedFiles.length})
      </h3>
      {changedFiles.length > 0 ? (
        <ul className="overflow-y-auto flex-1">
          {changedFiles.map((fileName) => (
            <li
              key={fileName}
              className="flex items-center justify-between p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/50 group"
            >
              <span className="truncate" title={fileName}>{fileName}</span>
              <button
                onClick={() => onDiscardFileChanges(fileName)}
                title="Discard Changes"
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 transition-opacity"
              >
                <RevertIcon className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-gray-500 dark:text-gray-400 px-1.5">
          No changes detected.
        </p>
      )}
    </div>
  );
};