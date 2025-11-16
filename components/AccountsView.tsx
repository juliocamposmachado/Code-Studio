import React from 'react';
import { GitHubIcon } from './icons';
import { GitHubImporter } from './GitHubImporter';
import { redirectToGitHub } from '../services/authService';

interface GitHubUser {
    username: string;
    name: string | null;
    avatarUrl: string;
}

interface AccountsViewProps {
    githubUser: GitHubUser | null;
    setGithubUser: (user: GitHubUser | null) => void;
    onImportRepo: (url: string) => Promise<void>;
}

export const AccountsView: React.FC<AccountsViewProps> = ({ githubUser, setGithubUser, onImportRepo }) => {

  const handleUnlink = () => {
    if(window.confirm(`Are you sure you want to unlink the account for ${githubUser?.username}?`)) {
        setGithubUser(null);
    }
  }

  // Dashboard View for logged-in user
  if (githubUser) {
    return (
        <div className="p-4 space-y-6 text-sm">
            <div>
                <div className="flex items-center mb-4">
                    <img src={githubUser.avatarUrl} alt={githubUser.username} className="w-12 h-12 rounded-full mr-4 border-2 border-gray-300 dark:border-gray-600" />
                    <div>
                        <h3 className="font-bold text-lg text-gray-700 dark:text-gray-300">
                            {githubUser.name || githubUser.username}
                        </h3>
                         <p className="text-xs text-green-500 dark:text-green-400">
                            GitHub Account Linked
                        </p>
                    </div>
                </div>
                <GitHubImporter onImport={onImportRepo} />
                 <div className="border-t border-gray-300 dark:border-gray-700 my-4"></div>
                <button 
                    onClick={handleUnlink}
                    className="w-full text-center px-2 py-1.5 bg-red-600/80 text-white rounded-md text-xs font-semibold hover:bg-red-700/80 transition-colors"
                >
                    Unlink Account
                </button>
            </div>
        </div>
    );
  }

  // Login View
  return (
    <div className="p-4 space-y-4 text-sm">
       <h3 className="font-bold text-gray-700 dark:text-gray-300">Linked Accounts</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
            Link your GitHub account to import your public repositories directly. This will redirect you to GitHub to authorize the application.
        </p>
        <button
            onClick={redirectToGitHub}
            className="w-full flex items-center justify-center px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
        >
            <GitHubIcon className="w-4 h-4 mr-2" />
            <span>Link GitHub Account</span>
        </button>
         <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Note: This uses the GitHub OAuth web flow. Your credentials are handled securely by GitHub.
        </p>
    </div>
  );
};
