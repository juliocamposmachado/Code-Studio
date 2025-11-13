
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { SendIcon, SparklesIcon } from './icons';

interface ChatProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const LoadingIndicator: React.FC = () => (
    <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-75"></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
    </div>
);

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
    const isModel = message.role === 'model';
    return (
        <div className={`flex ${isModel ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${isModel ? 'bg-gray-700 rounded-bl-none' : 'bg-blue-600 text-white rounded-br-none'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
        </div>
    );
};

export const Chat: React.FC<ChatProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <header className="flex items-center justify-center p-4 border-b border-gray-700">
            <SparklesIcon className="w-6 h-6 text-blue-400 mr-3" />
            <h1 className="text-xl font-bold text-gray-100">Code Assistant</h1>
        </header>
        <div ref={chatContainerRef} className="flex-1 p-6 space-y-6 overflow-y-auto">
            {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
            ))}
            {isLoading && (
                 <div className="flex justify-start">
                    <div className="max-w-[85%] p-4 rounded-2xl bg-gray-700 rounded-bl-none">
                        <LoadingIndicator />
                    </div>
                </div>
            )}
        </div>
        <div className="p-4 border-t border-gray-700">
            <div className="relative">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me to build a website..."
                    className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 rounded-xl py-3 pl-4 pr-14 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows={1}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                    <SendIcon className="w-5 h-5 text-white" />
                </button>
            </div>
        </div>
    </div>
  );
};

export default Chat;
