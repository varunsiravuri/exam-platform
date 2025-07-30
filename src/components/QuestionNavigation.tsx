import React from 'react';
import { Flag, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { Question, Answer, QuestionStatus } from '../types/exam';
import { useExam } from '../contexts/ExamContext';

interface QuestionNavigationProps {
  questions: Question[];
  answers: Record<string, Answer>;
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export function QuestionNavigation({ questions, answers, currentIndex, onNavigate }: QuestionNavigationProps) {
  const { state } = useExam();

  const getQuestionStatus = (question: Question): QuestionStatus => {
    const answer = answers[question.id];
    if (!answer) return 'not-answered';
    
    if (answer.selectedOption !== null && answer.isMarkedForReview) {
      return 'answered-and-marked';
    } else if (answer.selectedOption !== null) {
      return 'answered';
    } else if (answer.isMarkedForReview) {
      return 'marked-for-review';
    }
    
    return 'not-answered';
  };

  const getStatusIcon = (status: QuestionStatus) => {
    switch (status) {
      case 'answered':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'marked-for-review':
        return <Flag size={16} className="text-yellow-500" />;
      case 'answered-and-marked':
        return <AlertCircle size={16} className="text-blue-500" />;
      default:
        return <Circle size={16} className={state.highContrast ? 'text-gray-400' : 'text-gray-300'} />;
    }
  };

  const getStatusColor = (status: QuestionStatus, isActive: boolean) => {
    if (isActive) {
      return state.highContrast 
        ? 'bg-white text-black border-2 border-white' 
        : 'bg-blue-600 text-white border-2 border-blue-600';
    }

    switch (status) {
      case 'answered':
        return state.highContrast 
          ? 'bg-green-900 text-green-200 border border-green-600 hover:bg-green-800' 
          : 'bg-green-100 text-green-800 border border-green-300 hover:bg-green-200';
      case 'marked-for-review':
        return state.highContrast 
          ? 'bg-yellow-900 text-yellow-200 border border-yellow-600 hover:bg-yellow-800' 
          : 'bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200';
      case 'answered-and-marked':
        return state.highContrast 
          ? 'bg-blue-900 text-blue-200 border border-blue-600 hover:bg-blue-800' 
          : 'bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200';
      default:
        return state.highContrast 
          ? 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700' 
          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100';
    }
  };

  const statusCounts = {
    total: questions.length,
    answered: 0,
    markedForReview: 0,
    notAnswered: 0
  };

  questions.forEach(question => {
    const status = getQuestionStatus(question);
    switch (status) {
      case 'answered':
      case 'answered-and-marked':
        statusCounts.answered++;
        break;
      case 'marked-for-review':
        statusCounts.markedForReview++;
        break;
      default:
        statusCounts.notAnswered++;
        break;
    }
  });

  // Fixed: Find next unanswered question after current position
  const findNextUnanswered = () => {
    // First, look for unanswered questions after current position
    for (let i = currentIndex + 1; i < questions.length; i++) {
      if (getQuestionStatus(questions[i]) === 'not-answered') {
        return i;
      }
    }
    // If none found after current position, look from the beginning
    for (let i = 0; i < currentIndex; i++) {
      if (getQuestionStatus(questions[i]) === 'not-answered') {
        return i;
      }
    }
    return -1; // No unanswered questions found
  };

  // Fixed: Find next marked question after current position
  const findNextMarked = () => {
    // First, look for marked questions after current position
    for (let i = currentIndex + 1; i < questions.length; i++) {
      const status = getQuestionStatus(questions[i]);
      if (status === 'marked-for-review' || status === 'answered-and-marked') {
        return i;
      }
    }
    // If none found after current position, look from the beginning
    for (let i = 0; i < currentIndex; i++) {
      const status = getQuestionStatus(questions[i]);
      if (status === 'marked-for-review' || status === 'answered-and-marked') {
        return i;
      }
    }
    return -1; // No marked questions found
  };

  return (
    <div className={`${
      state.highContrast ? 'bg-gray-900 border-r-2 border-white' : 'bg-white border-r border-gray-200'
    } p-6 h-full overflow-y-auto transition-colors duration-300`}>
      <h2 className={`font-bold mb-4 ${
        state.fontSize === 'small' ? 'text-lg' : 
        state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
      }`}>
        Question Panel
      </h2>

      {/* Status Summary */}
      <div className={`mb-6 p-4 rounded-lg ${state.highContrast ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <h3 className={`font-medium mb-3 ${
          state.fontSize === 'small' ? 'text-sm' : 
          state.fontSize === 'large' ? 'text-lg' : 'text-base'
        }`}>
          Progress Summary
        </h3>
        <div className="space-y-2">
          <div className={`flex justify-between ${
            state.fontSize === 'small' ? 'text-xs' : 
            state.fontSize === 'large' ? 'text-base' : 'text-sm'
          }`}>
            <span className={state.highContrast ? 'text-gray-300' : 'text-gray-600'}>Total:</span>
            <span className="font-medium">{statusCounts.total}</span>
          </div>
          <div className={`flex justify-between ${
            state.fontSize === 'small' ? 'text-xs' : 
            state.fontSize === 'large' ? 'text-base' : 'text-sm'
          }`}>
            <span className="text-green-600">Answered:</span>
            <span className="font-medium text-green-600">{statusCounts.answered}</span>
          </div>
          <div className={`flex justify-between ${
            state.fontSize === 'small' ? 'text-xs' : 
            state.fontSize === 'large' ? 'text-base' : 'text-sm'
          }`}>
            <span className="text-yellow-600">For Review:</span>
            <span className="font-medium text-yellow-600">{statusCounts.markedForReview}</span>
          </div>
          <div className={`flex justify-between ${
            state.fontSize === 'small' ? 'text-xs' : 
            state.fontSize === 'large' ? 'text-base' : 'text-sm'
          }`}>
            <span className={state.highContrast ? 'text-gray-400' : 'text-gray-500'}>Not Answered:</span>
            <span className={`font-medium ${state.highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
              {statusCounts.notAnswered}
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className={`mb-6 p-4 rounded-lg ${state.highContrast ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <h3 className={`font-medium mb-3 ${
          state.fontSize === 'small' ? 'text-sm' : 
          state.fontSize === 'large' ? 'text-lg' : 'text-base'
        }`}>
          Legend
        </h3>
        <div className="space-y-2">
          <div className={`flex items-center space-x-2 ${
            state.fontSize === 'small' ? 'text-xs' : 
            state.fontSize === 'large' ? 'text-base' : 'text-sm'
          }`}>
            <CheckCircle size={16} className="text-green-500" />
            <span className={state.highContrast ? 'text-gray-300' : 'text-gray-600'}>Answered</span>
          </div>
          <div className={`flex items-center space-x-2 ${
            state.fontSize === 'small' ? 'text-xs' : 
            state.fontSize === 'large' ? 'text-base' : 'text-sm'
          }`}>
            <Flag size={16} className="text-yellow-500" />
            <span className={state.highContrast ? 'text-gray-300' : 'text-gray-600'}>Marked for Review</span>
          </div>
          <div className={`flex items-center space-x-2 ${
            state.fontSize === 'small' ? 'text-xs' : 
            state.fontSize === 'large' ? 'text-base' : 'text-sm'
          }`}>
            <AlertCircle size={16} className="text-blue-500" />
            <span className={state.highContrast ? 'text-gray-300' : 'text-gray-600'}>Answered & Marked</span>
          </div>
          <div className={`flex items-center space-x-2 ${
            state.fontSize === 'small' ? 'text-xs' : 
            state.fontSize === 'large' ? 'text-base' : 'text-sm'
          }`}>
            <Circle size={16} className={state.highContrast ? 'text-gray-400' : 'text-gray-300'} />
            <span className={state.highContrast ? 'text-gray-300' : 'text-gray-600'}>Not Answered</span>
          </div>
        </div>
      </div>

      {/* Question Grid */}
      <div className="grid grid-cols-5 gap-2">
        {questions.map((question, index) => {
          const status = getQuestionStatus(question);
          const isActive = index === currentIndex;
          
          return (
            <button
              key={question.id}
              onClick={() => onNavigate(index)}
              className={`
                relative p-3 rounded-lg font-medium transition-all duration-200
                ${getStatusColor(status, isActive)}
                ${
                  state.fontSize === 'small' ? 'text-xs' : 
                  state.fontSize === 'large' ? 'text-base' : 'text-sm'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                hover:scale-105 transform
              `}
              title={`Question ${index + 1} - ${status.replace('-', ' ')}`}
            >
              <div className="flex flex-col items-center space-y-1">
                <span>{index + 1}</span>
                <div className="absolute -top-1 -right-1">
                  {getStatusIcon(status)}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 space-y-2">
        <button
          onClick={() => {
            const nextUnanswered = findNextUnanswered();
            if (nextUnanswered !== -1) {
              onNavigate(nextUnanswered);
            }
          }}
          disabled={findNextUnanswered() === -1}
          className={`w-full py-2 px-3 text-left rounded-lg transition-colors ${
            state.fontSize === 'small' ? 'text-xs' : 
            state.fontSize === 'large' ? 'text-base' : 'text-sm'
          } ${
            findNextUnanswered() === -1
              ? state.highContrast 
                ? 'bg-gray-900 text-gray-600 cursor-not-allowed' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : state.highContrast 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
          }`}
        >
          Next Unanswered
        </button>
        <button
          onClick={() => {
            const nextMarked = findNextMarked();
            if (nextMarked !== -1) {
              onNavigate(nextMarked);
            }
          }}
          disabled={findNextMarked() === -1}
          className={`w-full py-2 px-3 text-left rounded-lg transition-colors ${
            state.fontSize === 'small' ? 'text-xs' : 
            state.fontSize === 'large' ? 'text-base' : 'text-sm'
          } ${
            findNextMarked() === -1
              ? state.highContrast 
                ? 'bg-gray-900 text-gray-600 cursor-not-allowed' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : state.highContrast 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
          }`}
        >
          Next Marked
        </button>
      </div>
    </div>
  );
}