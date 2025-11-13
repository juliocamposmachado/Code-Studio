
import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyIcon, CheckIcon } from './icons';

interface CodeViewProps {
  code: string;
}

export const CodeView: React.FC<CodeViewProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div className="relative h-full bg-[#282c34] rounded-2xl shadow-xl overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-12 bg-gray-800 flex items-center px-4 justify-between">
        <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-200 transition-colors"
        >
          {copied ? (
            <>
              <CheckIcon className="w-4 h-4 mr-2 text-green-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon className="w-4 h-4 mr-2" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="h-full pt-12 overflow-auto">
        <SyntaxHighlighter
          language="html"
          style={atomDark}
          customStyle={{ margin: 0, height: '100%', padding: '1rem', backgroundColor: '#282c34' }}
          codeTagProps={{ style: { fontFamily: "monospace" } }}
          showLineNumbers
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeView;
