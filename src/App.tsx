

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Message, Files, ViewMode } from './types';
import { generateContentFromChat } from './services/geminiService';
import { importRepoFromUrl } from './services/githubService';
import { executeCommand } from './services/commandExecutor';
import { handleGitHubCallback, exchangeCodeForToken, fetchGitHubUser } from './services/authService';
import { ActivityBar } from './components/ActivityBar';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { StatusBar } from './components/StatusBar';
import { ChatPanel } from './components/ChatPanel';
import { Resizer } from './components/Resizer';
import { SplashScreen } from './components/SplashScreen';
import { exampleProjects } from './services/exampleProjects';
import { downloadFile, downloadProjectAsZip } from './utils/fileUtils';
import { RunConfirmationModal } from './components/RunConfirmationModal';
import { generatePowerShellScript } from './utils/scriptGenerator';

interface Roadmap {
    tasks: string[];
    currentStep: number;
}
interface GitHubUser {
    username: string;
    name: string | null;
    avatarUrl: string;
}

const initialFiles: Files = exampleProjects.find(p => p.id === 'js-pong')?.files || {};

const initialMessages: Message[] = [
  {
    role: 'model',
    content: "Hello! I'm Julio, your expert AI fullstack assistant. I can write and modify code in any language, and even run commands in the terminal. How can I help you today?",
  },
];

const getInitialFiles = (): Files => {
  const savedFiles = localStorage.getItem('code-studio-files');
  if (savedFiles) {
    try {
      // Basic validation to ensure it's a record of file objects
      const parsed = JSON.parse(savedFiles);
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          const firstKey = Object.keys(parsed)[0];
          if (!firstKey || (typeof parsed[firstKey] === 'object' && 'content' in parsed[firstKey])) {
             return parsed;
          }
      }
    } catch (e) {
      console.error("Failed to parse saved files from localStorage", e);
      localStorage.removeItem('code-studio-files');
    }
  }
  return initialFiles;
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
        case 'cs':
            return 'csharp';
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

const initialProjectFiles = getInitialFiles();

const MIN_PANEL_WIDTH = 200;

export function App() {
  const [showStudio, setShowStudio] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [viewMode, setViewMode] = useState<ViewMode>('explorer');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [files, setFiles] = useState<Files>(initialProjectFiles);
  const [committedFiles, setCommittedFiles] = useState<Files>(initialProjectFiles);
  const [openTabs, setOpenTabs] = useState<string[]>(['index.html']);
  const [activeTab, setActiveTab] = useState<string>('Live Preview');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('gemini-api-key') || '');
  const [modifiedByAI, setModifiedByAI] = useState<string[]>([]);
  const [installedPackages, setInstalledPackages] = useState<string[]>([]);
  const [terminalOutput, setTerminalOutput] = useState<React.ReactNode[]>([
    <div key="welcome">Welcome to the temporary terminal! Type "help" for a list of commands.</div>
  ]);
  const [apiUsageCount, setApiUsageCount] = useState<number>(() => parseInt(localStorage.getItem('gemini-api-usage') || '0', 10));
  const [activeRoadmap, setActiveRoadmap] = useState<Roadmap | null>(null);
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(() => {
    const savedUser = localStorage.getItem('github-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [runScriptError, setRunScriptError] = useState<string | null>(null);
  const [serverPreviewFiles, setServerPreviewFiles] = useState<Files | null>(null);

  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [chatPanelWidth, setChatPanelWidth] = useState(320);

  const sidebarWidthRef = useRef(sidebarWidth);
  const chatPanelWidthRef = useRef(chatPanelWidth);

  const isSidebarVisible = sidebarWidth > 0;
  const isChatPanelVisible = chatPanelWidth > 0;

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  useEffect(() => {
    try {
        localStorage.setItem('code-studio-files', JSON.stringify(files));
    } catch (e) {
        console.error("Failed to save files to localStorage", e);
    }
  }, [files]);
  
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('gemini-api-key', apiKey);
    } else {
      localStorage.removeItem('gemini-api-key');
    }
  }, [apiKey]);
  
  useEffect(() => {
    localStorage.setItem('gemini-api-usage', apiUsageCount.toString());
  }, [apiUsageCount]);

  useEffect(() => {
    if (githubUser) {
        localStorage.setItem('github-user', JSON.stringify(githubUser));
    } else {
        localStorage.removeItem('github-user');
    }
  }, [githubUser]);

  useEffect(() => {
    const processAuthCallback = async () => {
        const code = handleGitHubCallback();
        if (code) {
            setIsAuthenticating(true);
            try {
                const tokenResponse = await exchangeCodeForToken(code);
                const user = await fetchGitHubUser(tokenResponse.access_token);
                setGithubUser({ 
                    username: user.login, 
                    avatarUrl: user.avatar_url, 
                    name: user.name 
                });
                setShowStudio(true);
            } catch (error) {
                console.error('GitHub auth failed:', error);
                alert('An error occurred during GitHub authentication. Please check the console.');
            } finally {
                setIsAuthenticating(false);
            }
        }
    };
    processAuthCallback();
  }, []);

  const handleViewChange = (newMode: ViewMode | 'chat') => {
    if (newMode === 'chat') {
        setChatPanelWidth(prev => {
            if (prev > 0) {
                chatPanelWidthRef.current = prev;
                return 0;
            }
            return chatPanelWidthRef.current;
        });
    } else {
      if (viewMode === newMode && sidebarWidth > 0) {
        sidebarWidthRef.current = sidebarWidth;
        setSidebarWidth(0);
      } else {
        setViewMode(newMode);
        if (sidebarWidth === 0) {
            setSidebarWidth(sidebarWidthRef.current);
        }
      }
    }
  };

  const handleSendMessage = useCallback(async (prompt: string) => {
    setIsLoading(true);
    const updatedMessages: Message[] = [...messages, { role: 'user', content: prompt }];
    setMessages(updatedMessages);
    setApiUsageCount(prev => prev + 1);

    const result = await generateContentFromChat(updatedMessages, files, apiKey, activeRoadmap);

    setMessages(prev => [...prev, { role: 'model', content: result.message }]);
    
    if (result.roadmap && result.roadmap.length > 0) {
        setActiveRoadmap({ tasks: result.roadmap, currentStep: 0 });
    } 
    else if (activeRoadmap && Object.keys(result.filesToUpdate).length > 0) {
        const nextStep = activeRoadmap.currentStep + 1;
        if (nextStep >= activeRoadmap.tasks.length) {
            setActiveRoadmap(null);
        } else {
            setActiveRoadmap(prev => prev ? ({ ...prev, currentStep: nextStep }) : null);
        }
    }

    if (Object.keys(result.filesToUpdate).length > 0) {
      const updatedFileNames = Object.keys(result.filesToUpdate);
      setModifiedByAI(updatedFileNames);
      
      const newFilesCreated = updatedFileNames.filter(name => !files[name]);

      setFiles(prevFiles => {
        const newFiles = { ...prevFiles };
        for (const fileName in result.filesToUpdate) {
            if (Object.prototype.hasOwnProperty.call(newFiles, fileName)) {
                newFiles[fileName] = { ...newFiles[fileName], content: result.filesToUpdate[fileName] };
            } else {
                newFiles[fileName] = { 
                    content: result.filesToUpdate[fileName], 
                    language: getLanguageFromFileName(fileName) 
                };
            }
        }
        return newFiles;
      });
      
      if (newFilesCreated.length > 0) {
        const newFileToOpen = newFilesCreated[0];
        if (!openTabs.includes(newFileToOpen)) {
            setOpenTabs(prevTabs => [...prevTabs, newFileToOpen]);
        }
        setActiveTab(newFileToOpen);
      }
    }

    if (result.commandsToExecute && result.commandsToExecute.length > 0) {
      setActiveTab('Terminal');
    
      (async () => {
        let currentFiles = files;
        let currentCommittedFiles = committedFiles;
        let currentInstalledPackages = installedPackages;
    
        for (const command of result.commandsToExecute) {
          await new Promise(resolve => setTimeout(resolve, 500));
    
          const commandNode = (
            <div key={`cmd-ai-${Date.now()}-${Math.random()}`}>
              <span className="font-bold text-green-400 mr-2">ai@codestudio:~$</span>
              <span>{command}</span>
            </div>
          );
          setTerminalOutput(prev => [...prev, commandNode]);
    
          const res = executeCommand(command, currentFiles, currentCommittedFiles, currentInstalledPackages);
    
          const outputNodes = res.output.map((line, index) => (
            <pre key={`out-ai-${Date.now()}-${Math.random()}-${index}`} className="whitespace-pre-wrap">{line}</pre>
          ));
          setTerminalOutput(prev => [...prev, ...outputNodes]);
    
          if (res.newFiles) currentFiles = res.newFiles;
          if (res.newCommittedFiles) currentCommittedFiles = res.newCommittedFiles;
          if (res.newInstalledPackages) currentInstalledPackages = res.newInstalledPackages;
        }
    
        setFiles(currentFiles);
        setCommittedFiles(currentCommittedFiles);
        setInstalledPackages(currentInstalledPackages);
      })();
    }

    setIsLoading(false);
  }, [messages, files, apiKey, activeRoadmap, openTabs, committedFiles, installedPackages]);

  const handleProceedWithRoadmap = useCallback(() => {
    if (!activeRoadmap) return;
    const task = activeRoadmap.tasks[activeRoadmap.currentStep];
    const prompt = `OK, please proceed with step ${activeRoadmap.currentStep + 1}: "${task}"`;
    handleSendMessage(prompt);
  }, [activeRoadmap, handleSendMessage]);
  
  const handleImportRepo = async (url: string) => {
    const newFiles = await importRepoFromUrl(url);
    
    if (Object.keys(newFiles).length === 0) {
        throw new Error("Repository is empty or no files were found.");
    }

    setFiles(newFiles);
    setCommittedFiles(newFiles);
    
    const newFileKeys = Object.keys(newFiles);
    const defaultFile = 
      newFileKeys.find(f => f.toLowerCase() === 'index.html') ||
      newFileKeys.find(f => f.toLowerCase() === 'readme.md') ||
      newFileKeys[0];

    setOpenTabs([defaultFile]);
    setActiveTab(defaultFile);
    setMessages(initialMessages);
    setViewMode('explorer');
    setInstalledPackages([]);
    setActiveRoadmap(null);
  };

  const handleUploadProject = async () => {
    try {
      // @ts-ignore - for showDirectoryPicker API which may not exist on all types
      const dirHandle = await window.showDirectoryPicker();
      const newFiles: Files = {};

      const processDirectory = async (directoryHandle: any, path = '') => {
        for await (const entry of directoryHandle.values()) {
          const newPath = path ? `${path}/${entry.name}` : entry.name;
          if (entry.kind === 'file') {
            const file = await entry.getFile();
            const content = await file.text();
            newFiles[newPath] = {
              content,
              language: getLanguageFromFileName(entry.name),
            };
          } else if (entry.kind === 'directory') {
            await processDirectory(entry, newPath);
          }
        }
      };

      await processDirectory(dirHandle);

      if (Object.keys(newFiles).length === 0) {
        alert("A pasta selecionada está vazia ou não foi possível ler os arquivos.");
        return;
      }

      setFiles(newFiles);
      setCommittedFiles(newFiles);
      const firstFile = Object.keys(newFiles).sort()[0] || 'Live Preview';
      setOpenTabs([firstFile]);
      setActiveTab(firstFile);
      setMessages(initialMessages);
      setInstalledPackages([]);
      setActiveRoadmap(null);

    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Erro ao carregar o projeto:", error);
        alert("Ocorreu um erro ao carregar a pasta do projeto. Verifique as permissões do navegador e tente novamente. Esta funcionalidade é suportada em navegadores baseados em Chromium.");
      }
    }
  };

  const handleClearProject = () => {
    if (window.confirm('Are you sure you want to clear the project? This will delete all files and cannot be undone.')) {
      localStorage.removeItem('code-studio-files');
      setFiles(initialFiles);
      setCommittedFiles(initialFiles);
      setOpenTabs(['index.html']);
      setActiveTab('index.html');
      setMessages(initialMessages);
      setApiUsageCount(0);
      setInstalledPackages([]);
      setActiveRoadmap(null);
    }
  };

  const handleLoadExampleProject = (projectFiles: Files) => {
    setFiles(projectFiles);
    setCommittedFiles(projectFiles);

    const fileKeys = Object.keys(projectFiles);
    const mainFile = 
        fileKeys.find(f => f.toLowerCase().includes('index.html')) ||
        fileKeys.find(f => f.toLowerCase().includes('app.py')) ||
        fileKeys.find(f => f.toLowerCase().includes('program.cs')) ||
        fileKeys.find(f => f.toLowerCase().includes('index.ts')) ||
        fileKeys[0] || 
        'Live Preview';

    setOpenTabs([mainFile]);
    setActiveTab(mainFile);
    setMessages(initialMessages);
    setInstalledPackages([]);
    setActiveRoadmap(null);
    setShowStudio(true);
  };

  const handleCommitChanges = () => {
    setCommittedFiles(files);
  };

  const handleDiscardFileChanges = (fileName: string) => {
    setFiles(prevFiles => ({
      ...prevFiles,
      [fileName]: committedFiles[fileName],
    }));
  };

  const handleTerminalCommand = useCallback((command: string) => {
    const commandNode = (
        <div key={`cmd-${terminalOutput.length}`}>
            <span className="font-bold text-blue-400 mr-2">user@codestudio:~$</span>
            <span>{command}</span>
        </div>
    );
    
    if (command.trim() === 'clear') {
        setTerminalOutput([]);
        return;
    }
    
    const result = executeCommand(command, files, committedFiles, installedPackages);

    const outputNodes = result.output.map((line, index) => (
      <pre key={`out-${terminalOutput.length}-${index}`} className="whitespace-pre-wrap">{line}</pre>
    ));
    
    setTerminalOutput(prev => [...prev, commandNode, ...outputNodes]);
    
    if (result.newFiles) setFiles(result.newFiles);
    if (result.newCommittedFiles) setCommittedFiles(result.newCommittedFiles);
    if (result.newInstalledPackages) setInstalledPackages(result.newInstalledPackages);
    if (result.startServer === 'flask') {
        setServerPreviewFiles(Object.keys(files)
            .filter(name => ['index.html', 'style.css', 'script.js'].includes(name))
            .reduce((acc, key) => { acc[key] = files[key]; return acc; }, {} as Files)
        );
    }
    if (result.stopServer) {
        setServerPreviewFiles(null);
    }
  }, [files, committedFiles, terminalOutput, installedPackages]);

  const handleTabSelection = (tabName: string) => {
    setActiveTab(tabName);
    setModifiedByAI(prev => prev.filter(f => f !== tabName));
  };

  const handleOpenFile = (fileName: string) => {
    if (!isSidebarVisible) {
        handleViewChange(viewMode);
    }
    if (!openTabs.includes(fileName)) {
      setOpenTabs([...openTabs, fileName]);
    }
    handleTabSelection(fileName);
    setViewMode('explorer');
  };

  const handleCloseTab = (fileName: string) => {
    const newTabs = openTabs.filter(tab => tab !== fileName);
    setOpenTabs(newTabs);
    if (activeTab === fileName) {
      const newActiveTab = newTabs.length > 0 ? newTabs[0] : 'Live Preview';
      handleTabSelection(newActiveTab);
    }
  };

  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey);
  };
  
  const handleRunProject = () => {
    const { error } = generatePowerShellScript(files);
    setRunScriptError(error || null);
    setIsRunModalOpen(true);
  };

  const handleConfirmRun = () => {
    const { scriptContent, fileName, error } = generatePowerShellScript(files);
    if (error) {
        console.error("Error generating script:", error);
        setRunScriptError(error);
        return;
    }
    
    downloadFile(fileName, scriptContent);
    setIsRunModalOpen(false);
  };

  const handleDownloadProject = () => {
    downloadProjectAsZip(files, 'code-studio-project');
  };

  const handleSidebarResize = useCallback((delta: number) => {
    setSidebarWidth(prev => Math.max(MIN_PANEL_WIDTH, prev + delta));
  }, []);

  const handleChatPanelResize = useCallback((delta: number) => {
    setChatPanelWidth(prev => Math.max(MIN_PANEL_WIDTH, prev - delta));
  }, []);

  if (isAuthenticating) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-100 dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-300">
            <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                <span className="text-lg">Authenticating with GitHub...</span>
            </div>
        </div>
    );
  }

  if (!showStudio) {
    return <SplashScreen onEnter={() => setShowStudio(true)} onLoadExample={handleLoadExampleProject} />;
  }

  return (
    <div className="h-screen w-screen flex flex-col font-sans">
      <RunConfirmationModal
        isOpen={isRunModalOpen}
        onClose={() => setIsRunModalOpen(false)}
        onConfirm={handleConfirmRun}
        error={runScriptError}
      />
      <div className="flex flex-1 overflow-hidden">
        <ActivityBar 
            viewMode={viewMode} 
            onViewChange={handleViewChange}
            isSidebarVisible={isSidebarVisible}
            isChatPanelVisible={isChatPanelVisible}
        />

        {isSidebarVisible &&
            <Sidebar
            width={sidebarWidth}
            viewMode={viewMode}
            files={files}
            onOpenFile={handleOpenFile}
            // FIX: Passed the correct 'handleClearProject' function to the 'onClearProject' prop.
            onClearProject={handleClearProject}
            theme={theme}
            setTheme={setTheme}
            committedFiles={committedFiles}
            onCommitChanges={handleCommitChanges}
            onDiscardFileChanges={handleDiscardFileChanges}
            apiKey={apiKey}
            onApiKeyChange={handleApiKeyChange}
            modifiedByAI={modifiedByAI}
            githubUser={githubUser}
            setGithubUser={setGithubUser}
            />
        }
        {isSidebarVisible && <Resizer onResize={handleSidebarResize} />}
        
        <main className="flex-1 flex flex-col bg-gray-100 dark:bg-[#1e1e1e] min-w-0">
          <Editor
            files={files}
            previewFiles={serverPreviewFiles}
            openTabs={openTabs}
            activeTab={activeTab}
            setActiveTab={handleTabSelection}
            onCloseTab={handleCloseTab}
            theme={theme}
            modifiedByAI={modifiedByAI}
            onTerminalCommand={handleTerminalCommand}
            terminalOutput={terminalOutput}
            onRunProject={handleRunProject}
            onDownloadProject={handleDownloadProject}
            onUploadProject={handleUploadProject}
            onImportRepo={handleImportRepo}
          />
        </main>
        
        {isChatPanelVisible && <Resizer onResize={handleChatPanelResize} />}
        {isChatPanelVisible && 
            <ChatPanel 
            width={chatPanelWidth}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            activeRoadmap={activeRoadmap}
            onProceedWithRoadmap={handleProceedWithRoadmap}
            isRoadmapRunning={isLoading}
            />
        }

      </div>
      <StatusBar isLoading={isLoading} apiUsageCount={apiUsageCount} />
      <footer className="flex-shrink-0 px-4 py-2 bg-gray-200 dark:bg-[#252526] text-gray-500 dark:text-gray-400 text-xs border-t border-gray-300 dark:border-gray-900/50">
        <div className="flex flex-col md:flex-row items-center justify-center md:space-x-4 space-y-1 md:space-y-0 text-center md:text-left">
            <div className="font-semibold">
                <span>👨‍💻 Julio Campos Machado | Fullstack Developer @ Like Look Solutions</span>
            </div>
            <div className="hidden md:block border-l border-gray-400 dark:border-gray-600 h-4"></div>
            <div className="flex items-center space-x-4">
                <a href="https://likelook.wixsite.com/solutions" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                    🌐 Site Oficial
                </a>
                <span>📱 WhatsApp: +55 11 99294-6628</span>
            </div>
        </div>
      </footer>
    </div>
  );
}