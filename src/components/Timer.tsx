import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { EXAM_CONFIG } from '../data/examData';
import { useExam } from '../contexts/ExamContext';

interface TimerProps {
  startTime: Date;
  onTimeUp: () => void;
  onWarning: () => void;
}

export function Timer({ startTime, onTimeUp, onWarning }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [hasWarned, setHasWarned] = useState(false);
  const { state } = useExam();

  // Total exam duration is 45 minutes
  const totalSeconds = 45 * 60; // 45 minutes in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      const remaining = Math.max(0, totalSeconds - elapsed);

      setTimeRemaining(remaining);

      // Warning threshold (5 minutes remaining)
      const warningThreshold = EXAM_CONFIG.warningThreshold * 60;
      if (remaining <= warningThreshold && !hasWarned && remaining > 0) {
        setHasWarned(true);
        onWarning();
      }

      // Time up
      if (remaining === 0) {
        onTimeUp();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, totalSeconds, hasWarned, onTimeUp, onWarning]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isWarning = timeRemaining <= EXAM_CONFIG.warningThreshold * 60;
  const isCritical = timeRemaining <= 60;

  return (
    <div className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 ${
      isCritical 
        ? state.highContrast ? 'bg-red-900 border-2 border-red-400' : 'bg-red-100 border-2 border-red-400'
        : isWarning 
          ? state.highContrast ? 'bg-yellow-900 border border-yellow-600' : 'bg-yellow-100 border border-yellow-400'
          : state.highContrast ? 'bg-gray-800 border border-gray-600' : 'bg-gray-100 border border-gray-300'
    }`}>
      <div className={`p-2 rounded-full ${
        isCritical 
          ? state.highContrast ? 'bg-red-400 text-black' : 'bg-red-500 text-white'
          : isWarning 
            ? state.highContrast ? 'bg-yellow-400 text-black' : 'bg-yellow-500 text-white'
            : state.highContrast ? 'bg-gray-600 text-white' : 'bg-blue-500 text-white'
      } animate-pulse`}>
        {isWarning ? <AlertTriangle size={16} /> : <Clock size={16} />}
      </div>
      
      <div>
        <p className={`font-medium ${
          state.fontSize === 'small' ? 'text-sm' : 
          state.fontSize === 'large' ? 'text-lg' : 'text-base'
        } ${
          isCritical 
            ? state.highContrast ? 'text-red-200' : 'text-red-700'
            : isWarning 
              ? state.highContrast ? 'text-yellow-200' : 'text-yellow-700'
              : state.highContrast ? 'text-white' : 'text-gray-800'
        }`}>
          Total Exam Time
        </p>
        <p className={`font-mono font-bold ${
          state.fontSize === 'small' ? 'text-lg' : 
          state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
        } ${
          isCritical 
            ? state.highContrast ? 'text-red-200' : 'text-red-700'
            : isWarning 
              ? state.highContrast ? 'text-yellow-200' : 'text-yellow-700'
              : state.highContrast ? 'text-white' : 'text-gray-900'
        }`}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </p>
      </div>
    </div>
  );
}