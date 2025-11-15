import { Files } from '../types';

const GITHUB_API_URL = 'https://api.github.com';

const parseRepoUrl = (url: string): { owner: string; repo: string } | null => {
  try {
    const urlObject = new URL(url);
    if (urlObject.hostname !== 'github.com') {
      return null;
    }
    const pathParts = urlObject.pathname.split('/').filter(part => part);
    if (pathParts.length >= 2) {
      const [owner, repo] = pathParts;
      return { owner, repo: repo.replace('.git', '') };
    }
    return null;
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
};

const getLanguageFromFileName = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'js':
        case 'jsx':
            return 'javascript';
        case 'ts':
        case 'tsx':
            return 'typescript';
        case 'html':
            return 'html';
        case 'css':
            return 'css';
        case 'json':
            return 'json';
        case 'md':
            return 'markdown';
        case 'py':
            return 'python';
        case 'java':
            return 'java';
        case 'c':
        case 'cpp':
            return 'cpp';
        case 'go':
            return 'go';
        case 'rb':
            return 'ruby';
        case 'php':
            return 'php';
        case 'sh':
            return 'bash';
        case 'yml':
        case 'yaml':
            return 'yaml';
        default:
            return 'plaintext';
    }
}

const fetchContentsRecursive = async (owner: string, repo: string, path: string = ''): Promise<Files> => {
    const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${path}`);
    if (!response.ok) {
        if (response.status === 404) throw new Error(`Repository or path not found: ${owner}/${repo}/${path}`);
        if (response.status === 403) throw new Error(`API rate limit exceeded. Please wait and try again.`);
        throw new Error(`Failed to fetch repo contents for path: ${path} (Status: ${response.status})`);
    }

    const contents = await response.json();

    if (!Array.isArray(contents)) {
        return {};
    }

    let files: Files = {};

    for (const item of contents) {
        if (item.type === 'file' && item.download_url) {
            try {
                const fileResponse = await fetch(item.download_url);
                if (!fileResponse.ok) {
                    console.warn(`Skipping file ${item.path} due to fetch error: ${fileResponse.status}`);
                    continue;
                }
                const content = await fileResponse.text();
                const language = getLanguageFromFileName(item.name);
                files[item.path] = { content, language };
            } catch (error) {
                console.warn(`Skipping file ${item.path} due to error:`, error);
            }
        } else if (item.type === 'dir') {
            const subFiles = await fetchContentsRecursive(owner, repo, item.path);
            files = { ...files, ...subFiles };
        }
    }
    return files;
};

export const importRepoFromUrl = async (repoUrl: string): Promise<Files> => {
    const parsed = parseRepoUrl(repoUrl);
    if (!parsed) throw new Error('Invalid GitHub repository URL. Please use a format like https://github.com/owner/repo');
    return await fetchContentsRecursive(parsed.owner, parsed.repo);
};
