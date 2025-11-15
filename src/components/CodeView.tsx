import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeViewProps {
  code: string;
  language: string;
  theme: 'dark' | 'light';
}

export const CodeView: React.FC<CodeViewProps> = ({ code, language, theme }) => {
  const codeStyle = theme === 'dark' ? atomDark : coy;
  const bgColor = theme === 'dark' ? '#282c34' : '#f5f2f0';
  
  return (
    <div className="h-full overflow-auto" style={{ backgroundColor: bgColor }}>
      <SyntaxHighlighter
        language={language}
        style={codeStyle}
        customStyle={{
          margin: 0,
          height: '100%',
          padding: '1rem',
          backgroundColor: 'transparent',
          fontSize: '14px',
          lineHeight: '1.5',
        }}
        codeTagProps={{ style: { fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace" } }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeView;
