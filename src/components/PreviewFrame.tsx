import React, { useEffect, useState } from 'react';
import { Files } from '../types';

interface PreviewFrameProps {
  files: Files;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ files }) => {
  const [processedHtml, setProcessedHtml] = useState('');

  useEffect(() => {
    const mainHtmlFile = files['index.html'];
    if (!mainHtmlFile) {
      setProcessedHtml('<html><body><h1 style="font-family: sans-serif; text-align: center; margin-top: 2rem;">No index.html found.</h1></body></html>');
      return;
    }

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(mainHtmlFile.content, 'text/html');

        // Inline stylesheets from <link> tags
        doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
          const href = link.getAttribute('href');
          if (href && files[href]) {
            const style = doc.createElement('style');
            style.textContent = files[href].content;
            link.parentNode?.replaceChild(style, link);
          }
        });

        // Inline scripts from <script src="..."> tags
        doc.querySelectorAll('script[src]').forEach(script => {
          const src = script.getAttribute('src');
          if (src && files[src]) {
            const newScript = doc.createElement('script');
            // Preserve attributes like type="module", async, defer
            for (const attr of script.attributes) {
                newScript.setAttribute(attr.name, attr.value);
            }
            newScript.removeAttribute('src');
            newScript.textContent = files[src].content;
            script.parentNode?.replaceChild(newScript, script);
          }
        });

        const finalHtml = `<!DOCTYPE html>${doc.documentElement.outerHTML}`;
        setProcessedHtml(finalHtml);
    } catch (error) {
        console.error("Error processing HTML for preview:", error);
        setProcessedHtml('<html><body><h1 style="font-family: sans-serif; color: red;">Error rendering preview. Check console for details.</h1></body></html>');
    }

  }, [files]);

  return (
    <div className="h-full bg-white overflow-hidden">
      <iframe
        // Using a key is crucial. It forces React to re-mount the iframe component
        // when the content changes, ensuring the srcDoc is always re-evaluated by the browser.
        key={processedHtml}
        srcDoc={processedHtml}
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
