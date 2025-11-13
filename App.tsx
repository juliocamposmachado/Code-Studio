
import React, { useState, useEffect, useCallback } from 'react';
import { Message } from './types';
import { generateContentFromChat } from './services/geminiService';
import Chat from './components/Chat';
import CodeView from './components/CodeView';
import PreviewFrame from './components/PreviewFrame';

const initialMessages: Message[] = [
  {
    role: 'model',
    content: "Hello! I'm your Code Assistant. Ask me to create a web page, and I'll generate the code and a live preview for you. For example, try 'Create a portfolio page'.",
  },
];

const initialCode = `
<div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f0f0f0; font-family: sans-serif;">
  <h1 style="color: #333;">Welcome to Code Studio!</h1>
</div>
`;

function App() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const storedMessages = localStorage.getItem('chatMessages');
      return storedMessages ? JSON.parse(storedMessages) : initialMessages;
    } catch (error) {
      return initialMessages;
    }
  });

  const [code, setCode] = useState<string>(() => {
    try {
      const storedCode = localStorage.getItem('generatedCode');
      return storedCode || initialCode;
    } catch (error) {
      return initialCode;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    localStorage.setItem('generatedCode', code);
  }, [messages, code]);

  const handleSendMessage = useCallback(async (prompt: string) => {
    setIsLoading(true);
    const updatedMessages: Message[] = [...messages, { role: 'user', content: prompt }];
    setMessages(updatedMessages);

    const result = await generateContentFromChat(updatedMessages);
    
    setMessages(prev => [...prev, { role: 'model', content: result.message }]);
    if (result.code) {
        setCode(result.code);
    }
    
    setIsLoading(false);
  }, [messages]);

  const handleNewProject = () => {
    setMessages(initialMessages);
    setCode(initialCode);
    localStorage.removeItem('chatMessages');
    localStorage.removeItem('generatedCode');
  };

  return (
    <div className="h-screen w-screen bg-gray-900 text-gray-100 flex flex-col p-4 gap-4">
      <header className="flex-shrink-0 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Code Studio</h1>
        <button
          onClick={handleNewProject}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-colors"
        >
          Novo Projeto
        </button>
      </header>
      <main className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
        <section className="w-full md:w-2/5 h-full">
          <Chat messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />
        </section>
        <section className="w-full md:w-3/5 h-full flex flex-col gap-4">
          <div className="flex-1 h-1/2 overflow-hidden">
            <CodeView code={code} />
          </div>
          <div className="flex-1 h-1/2 overflow-hidden">
            <PreviewFrame code={code} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
