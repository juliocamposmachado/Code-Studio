
import React, { useMemo } from 'react';

interface PreviewFrameProps {
  code: string;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ code }) => {
  const srcDoc = useMemo(() => {
    return `
      <html>
        <head>
          <style>
            /* Simple reset and styles for better preview */
            body { 
              font-family: sans-serif; 
              margin: 0;
              padding: 1rem;
              color: #333;
            }
          </style>
        </head>
        <body>${code}</body>
      </html>
    `;
  }, [code]);

  return (
    <div className="h-full bg-white rounded-2xl shadow-xl overflow-hidden">
      <iframe
        srcDoc={srcDoc}
        title="Live Preview"
        sandbox="allow-scripts"
        frameBorder="0"
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default PreviewFrame;
