import React from 'react';
import { Message } from '../types';
import { Chat } from './Chat';

interface Roadmap {
    tasks: string[];
    currentStep: number;
}

interface ChatPanelProps {
  width: number;
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  activeRoadmap: Roadmap | null;
  onProceedWithRoadmap: () => void;
  isRoadmapRunning: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  width,
  messages,
  onSendMessage,
  isLoading,
  activeRoadmap,
  onProceedWithRoadmap,
  isRoadmapRunning,
}) => {
  return (
    <aside 
        className="bg-gray-100 dark:bg-[#252526] flex flex-col border-l border-gray-300 dark:border-gray-900/50 overflow-hidden flex-shrink-0"
        style={{ width: `${width}px` }}
    >
        {width > 0 && (
            <>
                <header className="p-2.5 text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 border-b border-gray-300 dark:border-gray-900/50 flex-shrink-0">
                    <span>AI Assistant</span>
                </header>
                <div className="flex-1 overflow-y-auto min-w-[20rem]">
                    <Chat 
                        messages={messages} 
                        onSendMessage={onSendMessage} 
                        isLoading={isLoading}
                        activeRoadmap={activeRoadmap}
                        onProceedWithRoadmap={onProceedWithRoadmap}
                        isRoadmapRunning={isRoadmapRunning}
                    />
                </div>
            </>
        )}
    </aside>
  );
};