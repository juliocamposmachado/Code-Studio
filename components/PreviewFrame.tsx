import React from 'react';

interface PreviewFrameProps {
  code: string;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ code }) => {
  return (
    <div className="h-full bg-white rounded-2xl shadow-xl overflow-hidden">
      <iframe
        srcDoc={code}
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