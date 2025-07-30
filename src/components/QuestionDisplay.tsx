import React, { useState, useEffect } from 'react';
import { Flag, ChevronLeft, ChevronRight, AlertTriangle, Clock } from 'lucide-react';
import { Question, Answer } from '../types/exam';
import { EXAM_CONFIG } from '../data/examData';
import { useExam } from '../contexts/ExamContext';

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  answer: Answer | undefined;
  onAnswer: (answer: number | null) => void;
  onMarkForReview: (marked: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  answer,
  onAnswer,
  onMarkForReview,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext
}: QuestionDisplayProps) {
  const [timeOnQuestion, setTimeOnQuestion] = useState(0);
  const [showLongTimeWarning, setShowLongTimeWarning] = useState(false);
  const { state } = useExam();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOnQuestion(prev => {
        const newTime = prev + 1;
        const minutes = Math.floor(newTime / 60);
        
        if (minutes >= EXAM_CONFIG.longQuestionThreshold && !showLongTimeWarning) {
          setShowLongTimeWarning(true);
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [question.id, showLongTimeWarning]);

  useEffect(() => {
    setTimeOnQuestion(0);
    setShowLongTimeWarning(false);
  }, [question.id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className={`flex-1 p-8 transition-colors duration-300 ${
      state.highContrast ? 'bg-black text-white' : 'bg-gray-50'
    } overflow-y-auto`}>
      {showLongTimeWarning && (
        <div className={`mb-6 p-4 rounded-lg border-l-4 ${
          state.highContrast 
            ? 'bg-yellow-900 border-yellow-400 text-yellow-200' 
            : 'bg-yellow-50 border-yellow-400 text-yellow-800'
        }`}>
          <div className="flex items-center">
            <AlertTriangle size={20} className="mr-2" />
            <div>
              <h4 className={`font-medium ${
                state.fontSize === 'small' ? 'text-base' : 
                state.fontSize === 'large' ? 'text-xl' : 'text-lg'
              }`}>
                Time Warning
              </h4>
              <p className={`${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              }`}>
                You've been working on this question for over {EXAM_CONFIG.longQuestionThreshold} minutes. 
                Consider reviewing your answer and moving to the next question.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={`${
        state.highContrast ? 'bg-gray-900 border-2 border-gray-600' : 'bg-white border border-gray-200'
      } rounded-2xl p-8 shadow-lg transition-colors duration-300`}>
        {/* Question Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <h1 className={`font-bold ${
                state.fontSize === 'small' ? 'text-xl' : 
                state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
              }`}>
                Question {questionNumber} of {totalQuestions}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                state.highContrast ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                {question.section.charAt(0).toUpperCase() + question.section.slice(1)}
              </span>
            </div>
            <div className={`flex items-center space-x-4 ${
              state.fontSize === 'small' ? 'text-sm' : 
              state.fontSize === 'large' ? 'text-lg' : 'text-base'
            } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className="flex items-center space-x-1">
                <Clock size={16} />
                <span>Time on question: {formatTime(timeOnQuestion)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onMarkForReview(!answer?.isMarkedForReview)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              answer?.isMarkedForReview
                ? state.highContrast 
                  ? 'bg-yellow-800 text-yellow-200 border border-yellow-600' 
                  : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                : state.highContrast 
                  ? 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
            } ${
              state.fontSize === 'small' ? 'text-sm' : 
              state.fontSize === 'large' ? 'text-lg' : 'text-base'
            }`}
          >
            <Flag size={16} className={answer?.isMarkedForReview ? 'fill-current' : ''} />
            <span>{answer?.isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}</span>
          </button>
        </div>

        {/* Question Text */}
        <div className="mb-8">
          <p className={`leading-relaxed ${
            state.fontSize === 'small' ? 'text-base' : 
            state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
          } ${state.highContrast ? 'text-white' : 'text-gray-900'}`}>
            {question.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-start space-x-4 p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                answer?.selectedOption === index
                  ? state.highContrast 
                    ? 'bg-blue-900 border-2 border-blue-400 text-blue-200' 
                    : 'bg-blue-50 border-2 border-blue-400 text-blue-900'
                  : state.highContrast 
                    ? 'bg-gray-800 border border-gray-600 hover:bg-gray-700' 
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={index}
                checked={answer?.selectedOption === index}
                onChange={() => onAnswer(index)}
                className="mt-1 scale-125"
              />
              <span className={`flex-1 ${
                state.fontSize === 'small' ? 'text-base' : 
                state.fontSize === 'large' ? 'text-xl' : 'text-lg'
              }`}>
                <span className="font-medium mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </span>
            </label>
          ))}
        </div>

        {/* Clear Selection */}
        {answer?.selectedOption !== null && (
          <div className="mb-8">
            <button
              onClick={() => onAnswer(null)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              } ${
                state.highContrast 
                  ? 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              Clear Selection
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              state.fontSize === 'small' ? 'text-sm' : 
              state.fontSize === 'large' ? 'text-lg' : 'text-base'
            } ${
              canGoPrevious
                ? state.highContrast 
                  ? 'bg-gray-800 text-white border border-gray-600 hover:bg-gray-700' 
                  : 'bg-gray-200 text-gray-800 border border-gray-300 hover:bg-gray-300'
                : state.highContrast 
                  ? 'bg-gray-900 text-gray-600 cursor-not-allowed' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>

          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            state.highContrast ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
          }`}>
            <span className={`${
              state.fontSize === 'small' ? 'text-sm' : 
              state.fontSize === 'large' ? 'text-lg' : 'text-base'
            }`}>
              {questionNumber} / {totalQuestions}
            </span>
          </div>

          <button
            onClick={onNext}
            disabled={!canGoNext}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              state.fontSize === 'small' ? 'text-sm' : 
              state.fontSize === 'large' ? 'text-lg' : 'text-base'
            } ${
              canGoNext
                ? state.highContrast 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                : state.highContrast 
                  ? 'bg-gray-900 text-gray-600 cursor-not-allowed' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>Next</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}