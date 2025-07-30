import React, { useState, useEffect } from 'react';
import { Shield, LogOut, Clock, User } from 'lucide-react';
import { useExam } from '../contexts/ExamContext';
import { clearAdminAuth, getSessionTimeRemaining, formatTimeRemaining } from '../utils/auth';

interface AdminHeaderProps {
  onLogout: () => void;
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { state } = useExam();

  useEffect(() => {
    const updateTimer = () => {
      const remaining = getSessionTimeRemaining();
      setTimeRemaining(remaining);
      
      // Auto-logout when session expires
      if (remaining <= 0) {
        handleLogout();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    clearAdminAuth();
    onLogout();
  };

  return (
    <div className={`flex items-center justify-between p-4 border-b ${
      state.highContrast 
        ? 'bg-gray-900 border-gray-700 text-white' 
        : 'bg-white border-gray-200 text-gray-900'
    }`}>
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${
          state.highContrast ? 'bg-blue-800' : 'bg-blue-100'
        }`}>
          <Shield size={20} className={state.highContrast ? 'text-blue-200' : 'text-blue-600'} />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <User size={16} className={state.highContrast ? 'text-gray-400' : 'text-gray-600'} />
            <span className={`font-medium ${
              state.fontSize === 'small' ? 'text-sm' : 
              state.fontSize === 'large' ? 'text-lg' : 'text-base'
            }`}>
              Admin Session
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={14} className={state.highContrast ? 'text-gray-500' : 'text-gray-500'} />
            <span className={`${
              state.fontSize === 'small' ? 'text-xs' : 
              state.fontSize === 'large' ? 'text-base' : 'text-sm'
            } ${state.highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
              Session expires in: {formatTimeRemaining(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          state.fontSize === 'small' ? 'text-sm' : 
          state.fontSize === 'large' ? 'text-lg' : 'text-base'
        } ${
          state.highContrast 
            ? 'bg-red-800 text-red-200 hover:bg-red-700' 
            : 'bg-red-600 text-white hover:bg-red-700'
        }`}
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </div>
  );
}