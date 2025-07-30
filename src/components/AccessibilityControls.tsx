import React, { useState } from 'react';
import { Type, Eye, Settings, X } from 'lucide-react';
import { useExam } from '../contexts/ExamContext';

export function AccessibilityControls() {
  const { state, dispatch } = useExam();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 left-4 z-50">
      {!isOpen ? (
        // Settings Icon Only
        <button
          onClick={() => setIsOpen(true)}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
            state.highContrast 
              ? 'bg-gray-900 border-2 border-white text-white hover:bg-gray-800' 
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
          title="Accessibility Settings"
        >
          <Settings size={20} />
        </button>
      ) : (
        // Expanded Controls
        <div className={`flex items-center space-x-2 p-3 rounded-lg shadow-lg transition-all duration-300 ${
          state.highContrast 
            ? 'bg-gray-900 border-2 border-white text-white' 
            : 'bg-white border border-gray-200 text-gray-800'
        }`}>
          <Settings size={16} className={state.highContrast ? 'text-gray-300' : 'text-gray-600'} />
          
          {/* Font Size Controls */}
          <div className="flex items-center space-x-1">
            <Type size={14} className={state.highContrast ? 'text-gray-300' : 'text-gray-600'} />
            <select
              value={state.fontSize}
              onChange={(e) => dispatch({ 
                type: 'SET_FONT_SIZE', 
                payload: e.target.value as 'small' | 'medium' | 'large' 
              })}
              className={`text-xs px-2 py-1 rounded border transition-colors ${
                state.highContrast 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_HIGH_CONTRAST' })}
            className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
              state.highContrast 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Toggle High Contrast Mode"
          >
            <Eye size={14} />
            <span className="text-xs">
              {state.highContrast ? 'Normal' : 'High Contrast'}
            </span>
          </button>

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className={`p-1 rounded-full transition-colors ${
              state.highContrast ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-500'
            }`}
            title="Close Settings"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}