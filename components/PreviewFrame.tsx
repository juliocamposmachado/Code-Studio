import React from 'react';
import { Files } from '../types';

interface PreviewFrameProps {
  files: Files;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ files }) => {
  const html = files['index.html']?.content || '';
  const css = files['style.css']?.content || '';
  const js = files['script.js']?.content || '';

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
    </html>
  `;

  return (
    <div className="h-full bg-white overflow-hidden">
      <iframe
        srcDoc={srcDoc}
        title="Live Preview"
        sandbox="allow-scripts allow-same-origin"
        frameBorder="0"
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default PreviewFrame;
