import React from 'react';
import { Files } from '../types';

export interface CommandResult {
  output: (string | React.ReactElement)[];
  newFiles?: Files;
  newCommittedFiles?: Files;
  newInstalledPackages?: string[];
  startServer?: 'flask';
  stopServer?: boolean;
}

const helpMessage = `
Available commands:
  help              - Show this help message.
  clear             - Clear the terminal screen.
  ls                - List files in the project.
  cat [filename]    - Display the content of a file.
  npm run build     - Simulate building the project into a 'dist' folder.
  pip install [pkg] - Simulate installing a Python package.
  python [filename] - Simulate running a Python script.
  stop-server       - Stops any running server simulation.
  git status        - Show the status of changes.
  git add .         - Stage all changes for the next commit.
  git commit -m "..." - Record changes to the repository (commit message is mandatory).
  
Note: Some commands are simplified for this simulated environment.
`;

export const executeCommand = (
  command: string,
  files: Files,
  committedFiles: Files,
  installedPackages: string[]
): CommandResult => {
  const [cmd, ...args] = command.trim().split(/\s+/);

  switch (cmd) {
    case 'help':
      return { output: [helpMessage] };
    case 'clear':
      return { output: [] }; 
    case 'ls': {
      const fileList = Object.keys(files).sort().join('\n');
      return { output: [fileList] };
    }
    case 'cat': {
      const fileName = args[0];
      if (!fileName) {
        return { output: ['Usage: cat [filename]'] };
      }
      if (files[fileName]) {
        return { output: [files[fileName].content] };
      }
      return { output: [`cat: ${fileName}: No such file or directory`] };
    }
    case 'npm': {
        if (args[0] === 'run' && args[1] === 'build') {
            const outputLines = [
                '> project@0.0.0 build',
                '> vite build',
                '',
                'vite v5.3.3 building for production...',
                '✓ 0 modules transformed.',
                'dist/index.html    0.50 kB',
                'dist/style.css     1.50 kB',
                'dist/script.js     4.00 kB',
                '✓ built in 123ms',
                '',
                'Build complete. Files are in the "dist" directory.'
            ];
            
            const newFiles = { ...files };
            newFiles['dist/index.html'] = { ...files['index.html'], language: 'html' };
            newFiles['dist/style.css'] = { ...files['style.css'], language: 'css' };
            newFiles['dist/script.js'] = { ...files['script.js'], language: 'javascript' };

            return { output: outputLines, newFiles };
        }
        return { output: [`Unknown npm command: npm ${args.join(' ')}`] };
    }
    case 'git': {
        const subCommand = args[0];
        if (subCommand === 'status') {
            const changedFiles = Object.keys(files).filter(
                (fileName) =>
                !committedFiles[fileName] || files[fileName].content !== committedFiles[fileName].content
            );
            if (changedFiles.length === 0) {
                return { output: ['On branch main\nYour branch is up to date with \'origin/main\'.\n\nnothing to commit, working tree clean'] };
            }
            const statusOutput = [
                'On branch main',
                'Changes not staged for commit:',
                '  (use "git add <file>..." to update what will be committed)',
                '',
                ...changedFiles.map(f => `\tmodified:   ${f}`),
                ''
            ];
            return { output: statusOutput };
        }
        if (subCommand === 'add' && args[1] === '.') {
            return { output: ['Staged all changes.'] };
        }
        if (subCommand === 'commit' && args[1] === '-m') {
            const message = args.slice(2).join(' ').replace(/"/g, '');
            if (!message) {
                return { output: ['Error: commit message is required.'] };
            }
            const changedFiles = Object.keys(files).filter(
                (fileName) =>
                !committedFiles[fileName] || files[fileName].content !== committedFiles[fileName].content
            );
             if (changedFiles.length === 0) {
                return { output: ['nothing to commit, working tree clean'] };
            }
            const commitOutput = [
                `[main 1234567] ${message}`,
                ` ${changedFiles.length} file(s) changed`,
            ];
            return { output: commitOutput, newCommittedFiles: JSON.parse(JSON.stringify(files)) }; // Deep copy
        }
        return { output: [`Unknown git command: git ${args.join(' ')}`] };
    }
    case 'pip': {
        if (args[0] !== 'install' || !args[1]) {
            return { output: ['Usage: pip install [package_name]'] };
        }
        const packageName = args[1].toLowerCase();
        if (installedPackages.includes(packageName)) {
            return { output: [`Requirement already satisfied: ${packageName}`]};
        }
        
        const newInstalledPackages = [...installedPackages, packageName];
        
        return {
            output: [
                `Collecting ${packageName}`,
                `Installing collected packages: ${packageName}`,
                `Successfully installed ${packageName}`
            ],
            newInstalledPackages: newInstalledPackages
        };
    }
    case 'python': {
        const fileName = args[0];
        if (!fileName) {
            return { output: ['Usage: python [filename]'] };
        }
        if (!files[fileName]) {
            return { output: [`python: can't open file '${fileName}': [Errno 2] No such file or directory`] };
        }

        if (fileName === 'app.py') {
            if (!installedPackages.includes('flask')) {
                return {
                    output: [
                        "Traceback (most recent call last):",
                        `  File "${fileName}", line 1, in <module>`,
                        "    from flask import Flask, jsonify",
                        "ModuleNotFoundError: No module named 'flask'"
                    ]
                };
            }
            return {
                output: [
                    ' * Serving Flask app \'app.py\'',
                    ' * Environment: production',
                    '   WARNING: This is a development server. Do not use it in a production deployment.',
                    '   Use a production WSGI server instead.',
                    ' * Debug mode: on',
                    ' * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)',
                    'Server is now "running". Check the "Live Preview" tab to see the frontend.'
                ],
                startServer: 'flask'
            };
        }
        
        return { output: [`Executing ${fileName} with Python interpreter... (simulation)`] };
    }
     case 'stop-server': {
      return {
        output: ['Server simulation stopped.'],
        stopServer: true,
      };
    }
    case '':
        return { output: [] };
    default:
      return { output: [`command not found: ${cmd}`] };
  }
};