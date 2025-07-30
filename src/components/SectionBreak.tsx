import React, { useState, useEffect } from 'react';
import { Coffee, Clock, ChevronRight, BookOpen } from 'lucide-react';
import { useExam } from '../contexts/ExamContext';
import { EXAM_CONFIG } from '../data/examData';

interface SectionBreakProps {
  onBreakEnd: () => void;
}

export function SectionBreak({ onBreakEnd }: SectionBreakProps) {
  const [breakTime, setBreakTime] = useState(120); // 2 minutes
  const [isBreakActive, setIsBreakActive] = useState(false);
  const { state } = useExam();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isBreakActive && breakTime > 0) {
      interval = setInterval(() => {
        setBreakTime(prev => {
          if (prev <= 1) {
            onBreakEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isBreakActive, breakTime, onBreakEnd]);

  const startBreak = () => {
    setIsBreakActive(true);
  };

  const skipBreak = () => {
    onBreakEnd();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const getCurrentSection = () => {
    if (!state.session) return 'Section';
    const sections = ['networking', 'aptitude', 'logical'];
    const currentIndex = sections.indexOf(state.session.currentSection);
    const nextSection = sections[currentIndex + 1];
    return EXAM_CONFIG.sections[nextSection as keyof typeof EXAM_CONFIG.sections]?.name || 'Next Section';
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      state.highContrast 
        ? 'bg-black text-white' 
        : 'bg-white'
    }`}>
      <div className={`max-w-md w-full rounded-2xl p-8 text-center transition-colors duration-300 ${
        state.highContrast 
          ? 'bg-gray-900 border border-gray-700' 
          : 'bg-white shadow-2xl border border-gray-100'
      }`}>
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
          state.highContrast ? 'bg-green-400 text-black' : 'bg-black text-white'
        }`}>
          <Coffee size={32} />
        </div>

        <h1 className={`font-bold mb-4 ${
          state.fontSize === 'small' ? 'text-2xl' : 
          state.fontSize === 'large' ? 'text-4xl' : 'text-3xl'
        }`}>
          Section Complete!
        </h1>

        <p className={`mb-6 ${
          state.fontSize === 'small' ? 'text-base' : 
          state.fontSize === 'large' ? 'text-xl' : 'text-lg'
        } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
          Great job! You've completed the current section. 
          Take a moment to relax before continuing to <strong>{getCurrentSection()}</strong>.
        </p>

        {!isBreakActive ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${
              state.highContrast ? 'bg-gray-800 border border-gray-600' : 'bg-orange-50 border border-orange-200'
            }`}>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className={state.highContrast ? 'text-orange-300' : 'text-orange-600'} size={20} />
                <span className={`font-medium ${
                  state.fontSize === 'small' ? 'text-base' : 
                  state.fontSize === 'large' ? 'text-xl' : 'text-lg'
                } ${state.highContrast ? 'text-orange-300' : 'text-orange-700'}`}>
                  Optional 2-minute break
                </span>
              </div>
              <p className={`${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              } ${state.highContrast ? 'text-orange-200' : 'text-orange-600'}`}>
                Use this time to stretch, relax your eyes, or take a deep breath
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={startBreak}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                } ${
                  state.highContrast 
                    ? 'bg-white text-black hover:bg-gray-200' 
                    : 'bg-black text-white hover:bg-gray-800'
                } shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
              >
                Take Break (2:00)
              </button>
              <button
                onClick={skipBreak}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                } ${
                  state.highContrast 
                    ? 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700' 
                    : 'bg-gray-200 text-gray-700 border border-gray-300 hover:bg-gray-300'
                }`}
              >
                Skip Break
                <ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className={`p-6 rounded-xl ${
              state.highContrast ? 'bg-gray-800 border border-gray-600' : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Clock className={`animate-pulse ${state.highContrast ? 'text-green-300' : 'text-black'}`} size={24} />
                <span className={`font-mono font-bold ${
                  state.fontSize === 'small' ? 'text-2xl' : 
                  state.fontSize === 'large' ? 'text-4xl' : 'text-3xl'
                } ${state.highContrast ? 'text-green-300' : 'text-black'}`}>
                  {formatTime(breakTime)}
                </span>
              </div>
              <p className={`${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                Break time remaining
              </p>
            </div>

            <div className={`p-4 rounded-lg ${
              state.highContrast ? 'bg-yellow-900 border border-yellow-600' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <p className={`${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              } ${state.highContrast ? 'text-yellow-200' : 'text-yellow-700'}`}>
                <strong>Reminder:</strong> The next section will start automatically when the break ends. 
                Stay on this page to continue your interview assessment.
              </p>
            </div>

            <button
              onClick={skipBreak}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              } ${
                state.highContrast 
                  ? 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              End Break Early
            </button>
          </div>
        )}
      </div>
    </div>
  );
}