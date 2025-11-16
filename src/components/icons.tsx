import React from 'react';

export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

export const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 2L9.5 7.5L4 10L9.5 12.5L12 18L14.5 12.5L20 10L14.5 7.5L12 2Z" fill="#facc15"/>
        <path d="M3 19L4.5 14.5L9 13L4.5 11.5L3 7" fill="#fb923c" />
        <path d="M15 19L16.5 14.5L21 13L16.5 11.5L15 7" fill="#fb923c" />
    </svg>
);

export const FileIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 5C4 4.44772 4.44772 4 5 4H9.58579C9.851 4 10.1054 4.10536 10.2929 4.29289L12 6H19C19.5523 6 20 6.44772 20 7V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V5Z" fill="currentColor"/>
    </svg>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9ca3af" className={className}>
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
);

export const GitIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="18" cy="18" r="3" fill="currentColor"/>
      <circle cx="6" cy="6" r="3" fill="currentColor"/>
      <path d="M6 9V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M18 15c-3.314 0-6-2.686-6-6V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);


export const ExtensionsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M14 10V4.1C14 3.5 14.4 3 15 3h5.9c.6 0 1 .5 1 1v5.9c0 .6-.5 1-1 1H16c-1.1 0-2-.9-2-2z" fill="currentColor"/>
      <path d="M10 14H4.1C3.5 14 3 14.4 3 15v5.9c0 .6.5 1 1 1H10c1.1 0 2-.9 2-2v-4.9c0-1.1-.9-2-2-2z" fill="currentColor" opacity="0.7"/>
      <path d="M10 3H4.1C3.5 3 3 3.5 3 4.1V10c0 1.1.9 2 2 2h4.9c1.1 0 2-.9 2-2V4.1C12 3.5 11.5 3 11 3z" fill="currentColor" opacity="0.7"/>
      <path d="M21 14h-5.9c-.6 0-1 .5-1 1V21c0 .6.5 1 1 1H20c.6 0 1-.5 1-1v-5.9c0-.6-.4-1.1-1-1.1z" fill="currentColor"/>
    </svg>
);

export const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.5.5 0 0 0 .12-.61l-1.92-3.32a.5.5 0 0 0-.58-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.44h-3.84a.5.5 0 0 0-.5.44l-.36 2.54c-.59-.24-1.13.57-1.62.94l-2.39-.96a.5.5 0 0 0-.58.22l-1.92 3.32a.5.5 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.5.5 0 0 0-.12.61l1.92 3.32a.5.5 0 0 0 .58.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54a.5.5 0 0 0 .5.44h3.84a.5.5 0 0 0 .5-.44l.36-2.54c.59-.24 1.13-.57-1.62-.94l2.39.96a.5.5 0 0 0 .58-.22l1.92-3.32a.5.5 0 0 0-.12-.61l-2.03-1.58zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" fill="#9ca3af"/>
    </svg>
);

export const CloseIcon: React.FC<{ className?: string; onClick: (e: React.MouseEvent) => void }> = ({ className, onClick }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} onClick={onClick}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export const CodeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
);

export const GitHubIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
);

export const RevertIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="1 4 1 10 7 10"></polyline>
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
    </svg>
);

export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    // FIX: Corrected a typo in the `viewBox` attribute. It had an extra quote.
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#9ca3af"/>
    </svg>
);

export const PanelRightCloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
    <line x1="15" x2="15" y1="3" y2="21"></line>
  </svg>
);

export const PanelLeftCloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
    <line x1="9" x2="9" y1="3" y2="21"></line>
  </svg>
);

export const PythonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M14.2 3.28c.17-.38.56-.63.98-.63h3.81c.8 0 1.25.98.81 1.62l-2.83 4.25c-.2.3-.18.72.04 1l4.41 5.4c.54.67.06 1.73-.8 1.73h-3.8c-.39 0-.76-.23-.95-.58l-2.63-4.88c-.19-.36-.6-.56-1-.56s-.8.2-1 .56l-2.62 4.88c-.19.35-.56.58-.95.58H2.19c-.86 0-1.34-1.06-.8-1.73l4.4-5.4c.23-.28.25-.7.05-1L2.17 4.27c-.44-.64.01-1.62.81-1.62h3.81c.42 0 .81.25.98.63l2.83 5.17c.21.38.7.38.92 0l2.83-5.17z"/>
    </svg>
);

export const CSharpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.03 15.01c-.63.63-1.42.98-2.42 1.02h-.59c-.21 0-.42-.02-.63-.05-.82-.12-1.5-.52-2.02-1.12s-.78-1.34-.78-2.2v-.12c0-.85.3-1.59.78-2.18.49-.59 1.18-.97 1.99-1.1.2-.03.39-.05.59-.05h.58c1.06 0 1.83.39 2.45 1.01.63.64.97 1.45.97 2.38v.12c0 .94-.34 1.75-.98 2.38zm-1.1-6.19c-.38-.38-.85-.59-1.46-.59h-.43c-.15 0-.29.02-.43.05-.5.07-.91.29-1.21.61s-.45.75-.45 1.26v.12c0 .51.15.93.45 1.26s.71.53 1.21.61c.14.02.28.04.43.04h.43c.61 0 1.08-.21 1.46-.59.37-.38.58-.87.58-1.44v-.12c0-.57-.21-1.06-.58-1.44zM16 11h-1V9h1v2zm0-3h-1V6h1v2z"/>
    </svg>
);

export const TypeScriptIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M1.5 1h21v22h-21V1zm19.5 21v-20h-19v20h19zM10.12 16.12h3.76v-1.16h-1.36V7.88h-1.04v7.08H10.12v1.16zm5.88-5.08c0 .8-.13 1.48-.4 2.04s-.64-.98-1.12 1.26c-.48.28-1.02.42-1.62.42s-1.14-.14-1.62-.42c-.48-.28-.86-.7-1.12-1.26s-.4-1.24-.4-2.04v-1.08c0-.8.13-1.48.4-2.04s.64-.98 1.12-1.26c.48-.28 1.02-.42 1.62-.42s1.14.14 1.62.42c.48.28.86.7 1.12 1.26s.4 1.24.4 2.04v1.08zm-1.04-1.08c0-.49-.06-.89-.18-1.22s-.3-.58-.52-.74c-.22-.16-.5-.24-.82-.24s-.6.08-.82.24c-.22.16-.39.41-.52.74s-.18.73-.18 1.22v1.08c0 .49.06.89.18 1.22s.3.58.52.74c.22.16.5.24.82.24s.6-.08.82.24c.22-.16.39-.41.52-.74s.18-.73-.18-1.22v-1.08z"/>
    </svg>
);

export const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M8 5v14l11-7z"></path>
  </svg>
);

// FIX: Added PauseIcon component for the radio player.
export const PauseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
  </svg>
);

// FIX: Added VolumeIcon component for the radio player.
export const VolumeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path>
  </svg>
);

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);