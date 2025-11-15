import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { SendIcon } from './icons';

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
            <div className={`max-w-[90%] p-3 rounded-lg text-sm ${isModel ? 'bg-gray-600/50 dark:bg-gray-700/70 rounded-bl-none' : 'bg-blue-600 text-white rounded-br-none'}`}>
                <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
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
  }, [messages, isLoading]);

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
    <div className="flex flex-col h-full bg-transparent">
        <div ref={chatContainerRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
            {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
            ))}
            {isLoading && (
                 <div className="flex justify-start">
                    <div className="max-w-[85%] p-3 rounded-lg bg-gray-600/50 dark:bg-gray-700/70 rounded-bl-none">
                        <LoadingIndicator />
                    </div>
                </div>
            )}
        </div>
        <div className="p-2 border-t border-gray-300 dark:border-gray-700">
            <div className="relative">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask to modify the code..."
                    className="w-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 rounded-lg py-2 pl-3 pr-12 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    rows={2}
                    aria-label="Chat input"
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                    aria-label="Send message"
                >
                    <SendIcon className="w-4 h-4 text-white" />
                </button>
            </div>
        </div>
    </div>
  );
};

export default Chat;
