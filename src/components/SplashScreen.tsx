import React from 'react';
import { SparklesIcon } from './icons';
import { exampleProjects } from '../services/exampleProjects';
import { Files } from '../types';

interface SplashScreenProps {
  onEnter: () => void;
  onLoadExample: (files: Files) => void;
}

const ExampleCard: React.FC<{
    project: typeof exampleProjects[0];
    onClick: () => void;
}> = ({ project, onClick }) => (
    <button 
        onClick={onClick}
        className="bg-gray-200/50 dark:bg-gray-800/60 p-5 rounded-lg text-left w-full hover:bg-gray-300/50 dark:hover:bg-gray-700/60 transition-all duration-200 transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
        <div className="flex items-center mb-2">
            <project.icon className="w-6 h-6 mr-3 text-blue-500" />
            <h3 className="font-bold text-gray-800 dark:text-white">{project.name}</h3>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">
            {project.description}
        </p>
    </button>
);


export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter, onLoadExample }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-100 dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-300 font-sans transition-colors duration-300 p-4">
      <main className="flex flex-col items-center justify-center text-center p-8 max-w-5xl w-full">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
          <SparklesIcon className="w-24 h-24" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Code Studio com Gemini API
        </h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          Crie e modifique websites em tempo real conversando com a IA do Gemini. Uma experiência de desenvolvimento moderna, diretamente no seu navegador.
        </p>
        <button
          onClick={onEnter}
          className="bg-blue-600 text-white font-semibold py-3 px-10 rounded-lg text-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transform hover:scale-105 transition-all duration-300"
        >
          Entrar no Code Studio
        </button>

        <div className="w-full mt-16">
            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-gray-100 dark:bg-[#1e1e1e] px-2 text-sm text-gray-500">Ou comece com um exemplo</span>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {exampleProjects.map(proj => (
                    <ExampleCard key={proj.id} project={proj} onClick={() => onLoadExample(proj.files)} />
                ))}
            </div>
        </div>

      </main>
      <footer className="w-full text-center p-6 text-gray-500 dark:text-gray-600 text-xs mt-auto">
        <span>👨‍💻 Julio Campos Machado | Fullstack Developer @ Like Look Solutions</span>
      </footer>
    </div>
  );
};
