import React from 'react';
import { Shield, AlertTriangle, X } from 'lucide-react';
import { useExam } from '../contexts/ExamContext';

interface SecurityAlertProps {
  type: 'warning';
  onClose?: () => void;
  onContinue?: () => void;
}

export function SecurityAlert({ type, onClose, onContinue }: SecurityAlertProps) {
  const { state } = useExam();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40 p-4">
      <div className={`max-w-md w-full rounded-2xl p-8 transition-colors duration-300 ${
        state.highContrast ? 'bg-yellow-900 border border-yellow-400' : 'bg-white border border-yellow-500'
      }`}>
        <div className="flex justify-between items-start mb-6">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
            state.highContrast ? 'bg-yellow-400 text-black' : 'bg-yellow-500 text-white'
          }`}>
            <AlertTriangle size={24} />
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className={`p-1 rounded-full transition-colors ${
                state.highContrast ? 'hover:bg-yellow-800 text-yellow-200' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        <h2 className={`font-bold mb-4 ${
          state.fontSize === 'small' ? 'text-xl' : 
          state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
        } ${state.highContrast ? 'text-yellow-200' : 'text-yellow-600'}`}>
          Security Warning #{state.securityWarningCount}
        </h2>
        
        <p className={`mb-6 ${
          state.fontSize === 'small' ? 'text-base' : 
          state.fontSize === 'large' ? 'text-xl' : 'text-lg'
        } ${state.highContrast ? 'text-yellow-200' : 'text-yellow-700'}`}>
          You have switched tabs or navigated away from the interview page. This action has been recorded.
        </p>
        
        <div className={`p-4 rounded-lg mb-6 ${
          state.highContrast ? 'bg-yellow-800 border border-yellow-600' : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <p className={`font-medium mb-2 ${
            state.fontSize === 'small' ? 'text-sm' : 
            state.fontSize === 'large' ? 'text-lg' : 'text-base'
          } ${state.highContrast ? 'text-yellow-200' : 'text-yellow-800'}`}>
            ⚠️ Security Notice
          </p>
          <p className={`${
            state.fontSize === 'small' ? 'text-sm' : 
            state.fontSize === 'large' ? 'text-lg' : 'text-base'
          } ${state.highContrast ? 'text-yellow-200' : 'text-yellow-700'}`}>
            Multiple security violations may affect your assessment evaluation. Please keep this window active and avoid switching tabs.
          </p>
        </div>
        
        <div className="flex space-x-4">
          {onClose && (
            <button
              onClick={onClose}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              } ${
                state.highContrast 
                  ? 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700' 
                  : 'bg-gray-200 text-gray-800 border border-gray-300 hover:bg-gray-300'
              }`}
            >
              Dismiss Warning
            </button>
          )}
          
          {onContinue && (
            <button
              onClick={onContinue}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              } ${
                state.highContrast 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
              }`}
            >
              Continue Assessment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}