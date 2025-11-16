import React, { useState, useEffect, useRef } from 'react';

interface TerminalProps {
  output: React.ReactNode[];
  onCommand: (command: string) => void;
  theme: 'dark' | 'light';
}

export const Terminal: React.FC<TerminalProps> = ({ output, onCommand, theme }) => {
  const [input, setInput] = useState('');
  const endOfOutputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endOfOutputRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);
  
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onCommand(input);
      setInput('');
    }
  };
  
  const bgColor = theme === 'dark' ? '#1e1e1e' : '#ffffff';
  const textColor = theme === 'dark' ? '#d4d4d4' : '#333333';
  const promptColor = theme === 'dark' ? '#569cd6' : '#0055a1';
  
  return (
    <div
      className="h-full w-full p-4 font-mono text-sm overflow-y-auto"
      style={{ backgroundColor: bgColor, color: textColor }}
      onClick={() => inputRef.current?.focus()}
    >
      {output}
      <div className="flex items-center">
        <span style={{ color: promptColor }} className="font-bold mr-2">
          user@codestudio:~$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none p-0"
          style={{ color: textColor }}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
        />
      </div>
      <div ref={endOfOutputRef} />
    </div>
  );
};
