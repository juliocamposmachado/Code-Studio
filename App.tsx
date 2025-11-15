import React, { useState, useEffect, useCallback } from 'react';
import { Message, Files, ViewMode } from './types';
import { generateContentFromChat } from './services/geminiService';
import { importRepoFromUrl } from './services/githubService';
import { ActivityBar } from './components/ActivityBar';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { StatusBar } from './components/StatusBar';

const initialFiles: Files = {
  'index.html': {
    language: 'html',
    content: `
<div class="container">
  <h1>Welcome to Code Studio!</h1>
  <p>Use the chat to build your website.</p>
  <button id="myButton">Click Me</button>
</div>
    `.trim(),
  },
  'style.css': {
    language: 'css',
    content: `
body {
  font-family: sans-serif;
  background-color: #f0f2f5;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}
.container {
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
h1 {
  color: #333;
}
button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}
button:hover {
  background-color: #0056b3;
}
    `.trim(),
  },
  'script.js': {
    language: 'javascript',
    content: `
document.getElementById('myButton').addEventListener('click', () => {
  alert('Hello from Code Studio!');
});
    `.trim(),
  },
};

const initialMessages: Message[] = [
  {
    role: 'model',
    content: "Hello! I'm your AI coding assistant. Select a file and ask me to make changes. For example, try 'Change the button color to green' while editing 'style.css'.",
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


function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [viewMode, setViewMode] = useState<ViewMode>('explorer');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [files, setFiles] = useState<Files>(getInitialFiles());
  const [openTabs, setOpenTabs] = useState<string[]>(['index.html']);
  const [activeTab, setActiveTab] = useState<string>('index.html');
  const [isLoading, setIsLoading] = useState(false);

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


  const handleSendMessage = useCallback(async (prompt: string) => {
    if (activeTab === 'Live Preview' || !files[activeTab]) {
      setMessages(prev => [...prev, { role: 'model', content: "I can't edit this. Please select a valid file to modify." }]);
      return;
    }

    setIsLoading(true);
    const updatedMessages: Message[] = [...messages, { role: 'user', content: prompt }];
    setMessages(updatedMessages);

    const result = await generateContentFromChat(updatedMessages, files, activeTab);

    setMessages(prev => [...prev, { role: 'model', content: result.message }]);
    if (result.code) {
      setFiles(prevFiles => ({
        ...prevFiles,
        [activeTab]: { ...prevFiles[activeTab], content: result.code },
      }));
    }

    setIsLoading(false);
  }, [messages, files, activeTab]);
  
  const handleImportRepo = async (url: string) => {
    const newFiles = await importRepoFromUrl(url);
    
    if (Object.keys(newFiles).length === 0) {
        throw new Error("Repository is empty or no files were found.");
    }

    setFiles(newFiles);
    
    // Reset editor state for the new project
    const newFileKeys = Object.keys(newFiles);
    const defaultFile = 
      newFileKeys.find(f => f.toLowerCase() === 'index.html') ||
      newFileKeys.find(f => f.toLowerCase() === 'readme.md') ||
      newFileKeys[0];

    setOpenTabs([defaultFile]);
    setActiveTab(defaultFile);
    setMessages(initialMessages);
    setViewMode('explorer');
  };

  const handleClearProject = () => {
    localStorage.removeItem('code-studio-files');
    setFiles(initialFiles);
    setOpenTabs(['index.html']);
    setActiveTab('index.html');
    setMessages(initialMessages);
  };


  const handleOpenFile = (fileName: string) => {
    if (!openTabs.includes(fileName)) {
      setOpenTabs([...openTabs, fileName]);
    }
    setActiveTab(fileName);
  };

  const handleCloseTab = (fileName: string) => {
    const newTabs = openTabs.filter(tab => tab !== fileName);
    setOpenTabs(newTabs);
    if (activeTab === fileName) {
      setActiveTab(newTabs.length > 0 ? newTabs[0] : 'Live Preview');
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col font-sans">
      <div className="flex flex-1 overflow-hidden">
        <ActivityBar viewMode={viewMode} setViewMode={setViewMode} />
        <Sidebar
          viewMode={viewMode}
          files={files}
          onOpenFile={handleOpenFile}
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onImportRepo={handleImportRepo}
          onClearProject={handleClearProject}
        />
        <main className="flex-1 flex flex-col bg-gray-100 dark:bg-[#1e1e1e]">
          <Editor
            files={files}
            openTabs={openTabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onCloseTab={handleCloseTab}
            theme={theme}
          />
        </main>
      </div>
      <StatusBar isLoading={isLoading} theme={theme} setTheme={setTheme} />
    </div>
  );
}

export default App;
