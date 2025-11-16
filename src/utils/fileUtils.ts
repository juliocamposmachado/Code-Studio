import { Files } from '../types';

// JSZip is loaded from a script tag in index.html, so we declare it as a global variable.
declare var JSZip: any;

export const downloadFile = (filename: string, content: string) => {
  try {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-t' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error(`Failed to download file: ${filename}`, error);
  }
};

export const downloadProjectAsZip = async (files: Files, projectName: string = 'project') => {
    try {
        const zip = new JSZip();
        for (const fileName in files) {
            zip.file(fileName, files[fileName].content);
        }

        const blob = await zip.generateAsync({ type: 'blob' });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${projectName}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Failed to create or download ZIP file', error);
        alert('An error occurred while creating the ZIP file. Please check the console.');
    }
};
