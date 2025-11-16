
import React from 'react';
import { PlayIcon } from './icons';

interface RunConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  error: string | null;
}

export const RunConfirmationModal: React.FC<RunConfirmationModalProps> = ({ isOpen, onClose, onConfirm, error }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-gray-200 dark:bg-[#252526] rounded-lg shadow-2xl p-6 w-full max-w-md text-gray-800 dark:text-gray-300 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center mb-4">
            <div className="bg-blue-500/20 p-2 rounded-full mr-4">
                <PlayIcon className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold">Executar Código Localmente</h2>
        </div>
        
        {error ? (
          <>
            <p className="text-sm mb-6 text-red-500 dark:text-red-400">
              {error}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500 text-white font-semibold text-sm transition-colors"
              >
                Fechar
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm mb-2">
              Esta ação gerará um script <strong className="font-semibold">PowerShell (.ps1)</strong> para configurar e executar este projeto em sua máquina local.
            </p>
            <ul className="text-xs list-disc list-inside bg-gray-300 dark:bg-gray-800/50 p-3 rounded-md space-y-1 mb-6">
                <li>Você precisará ter os ambientes de execução necessários (como Python, Node.js, .NET) instalados.</li>
                <li>O script tentará instalar as dependências (ex: de \`requirements.txt\` ou \`package.json\`).</li>
                <li>Você precisará executar o script baixado manualmente no seu terminal PowerShell.</li>
            </ul>
             <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                <span className="font-bold">Aviso de Segurança:</span> Sempre inspecione scripts baixados da internet antes de executá-los.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500 text-white font-semibold text-sm transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
              >
                Gerar e Baixar Script
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
