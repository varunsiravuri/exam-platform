import React from 'react';
import { AlertTriangle, CheckCircle, Flag, Circle } from 'lucide-react';
import { Question, Answer } from '../types/exam';
import { useExam } from '../contexts/ExamContext';

interface SubmissionConfirmationProps {
  questions: Question[];
  answers: Record<string, Answer>;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SubmissionConfirmation({ 
  questions, 
  answers, 
  onConfirm, 
  onCancel 
}: SubmissionConfirmationProps) {
  const { state } = useExam();

  const answeredCount = questions.filter(q => 
    answers[q.id]?.selectedOption !== null && answers[q.id]?.selectedOption !== undefined
  ).length;
  
  const markedCount = questions.filter(q => 
    answers[q.id]?.isMarkedForReview
  ).length;
  
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className={`max-w-2xl w-full rounded-2xl p-8 transition-colors duration-300 ${
        state.highContrast ? 'bg-gray-900 border-2 border-white' : 'bg-white border border-gray-200'
      } max-h-[90vh] overflow-y-auto`}>
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            state.highContrast ? 'bg-red-400 text-black' : 'bg-red-100 text-red-600'
          }`}>
            <AlertTriangle size={32} />
          </div>
          <h1 className={`font-bold mb-2 ${
            state.fontSize === 'small' ? 'text-2xl' : 
            state.fontSize === 'large' ? 'text-4xl' : 'text-3xl'
          }`}>
            Confirm Submission
          </h1>
          <p className={`${
            state.fontSize === 'small' ? 'text-base' : 
            state.fontSize === 'large' ? 'text-xl' : 'text-lg'
          } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
            Are you sure you want to submit your exam? This action cannot be undone.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className={`p-4 rounded-lg text-center ${
            state.highContrast ? 'bg-green-900 border border-green-600' : 'bg-green-50 border border-green-200'
          }`}>
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className={`mr-2 ${state.highContrast ? 'text-green-300' : 'text-green-600'}`} size={20} />
              <span className={`font-bold ${
                state.fontSize === 'small' ? 'text-xl' : 
                state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
              } ${state.highContrast ? 'text-green-300' : 'text-green-600'}`}>
                {answeredCount}
              </span>
            </div>
            <p className={`${
              state.fontSize === 'small' ? 'text-sm' : 
              state.fontSize === 'large' ? 'text-lg' : 'text-base'
            } ${state.highContrast ? 'text-green-200' : 'text-green-700'}`}>
              Answered
            </p>
          </div>

          <div className={`p-4 rounded-lg text-center ${
            state.highContrast ? 'bg-yellow-900 border border-yellow-600' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-center justify-center mb-2">
              <Flag className={`mr-2 ${state.highContrast ? 'text-yellow-300' : 'text-yellow-600'}`} size={20} />
              <span className={`font-bold ${
                state.fontSize === 'small' ? 'text-xl' : 
                state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
              } ${state.highContrast ? 'text-yellow-300' : 'text-yellow-600'}`}>
                {markedCount}
              </span>
            </div>
            <p className={`${
              state.fontSize === 'small' ? 'text-sm' : 
              state.fontSize === 'large' ? 'text-lg' : 'text-base'
            } ${state.highContrast ? 'text-yellow-200' : 'text-yellow-700'}`}>
              Marked
            </p>
          </div>

          <div className={`p-4 rounded-lg text-center ${
            unansweredCount > 0 
              ? state.highContrast ? 'bg-red-900 border border-red-600' : 'bg-red-50 border border-red-200'
              : state.highContrast ? 'bg-gray-800 border border-gray-600' : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center justify-center mb-2">
              <Circle className={`mr-2 ${
                unansweredCount > 0 
                  ? state.highContrast ? 'text-red-300' : 'text-red-600'
                  : state.highContrast ? 'text-gray-400' : 'text-gray-500'
              }`} size={20} />
              <span className={`font-bold ${
                state.fontSize === 'small' ? 'text-xl' : 
                state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
              } ${
                unansweredCount > 0 
                  ? state.highContrast ? 'text-red-300' : 'text-red-600'
                  : state.highContrast ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {unansweredCount}
              </span>
            </div>
            <p className={`${
              state.fontSize === 'small' ? 'text-sm' : 
              state.fontSize === 'large' ? 'text-lg' : 'text-base'
            } ${
              unansweredCount > 0 
                ? state.highContrast ? 'text-red-200' : 'text-red-700'
                : state.highContrast ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Unanswered
            </p>
          </div>
        </div>

        {/* Warnings */}
        {unansweredCount > 0 && (
          <div className={`p-4 rounded-lg mb-6 ${
            state.highContrast ? 'bg-red-900 border border-red-600' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start">
              <AlertTriangle className={`mt-1 mr-3 flex-shrink-0 ${
                state.highContrast ? 'text-red-300' : 'text-red-600'
              }`} size={20} />
              <div>
                <h3 className={`font-medium mb-1 ${
                  state.fontSize === 'small' ? 'text-base' : 
                  state.fontSize === 'large' ? 'text-xl' : 'text-lg'
                } ${state.highContrast ? 'text-red-200' : 'text-red-800'}`}>
                  Unanswered Questions
                </h3>
                <p className={`${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                } ${state.highContrast ? 'text-red-200' : 'text-red-700'}`}>
                  You have {unansweredCount} unanswered question{unansweredCount !== 1 ? 's' : ''}. 
                  These will be marked as incorrect if you submit now.
                </p>
              </div>
            </div>
          </div>
        )}

        {markedCount > 0 && (
          <div className={`p-4 rounded-lg mb-6 ${
            state.highContrast ? 'bg-yellow-900 border border-yellow-600' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-start">
              <Flag className={`mt-1 mr-3 flex-shrink-0 ${
                state.highContrast ? 'text-yellow-300' : 'text-yellow-600'
              }`} size={20} />
              <div>
                <h3 className={`font-medium mb-1 ${
                  state.fontSize === 'small' ? 'text-base' : 
                  state.fontSize === 'large' ? 'text-xl' : 'text-lg'
                } ${state.highContrast ? 'text-yellow-200' : 'text-yellow-800'}`}>
                  Questions Marked for Review
                </h3>
                <p className={`${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                } ${state.highContrast ? 'text-yellow-200' : 'text-yellow-700'}`}>
                  You have {markedCount} question{markedCount !== 1 ? 's' : ''} marked for review. 
                  You can still go back and review them before submitting.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Final Warning */}
        <div className={`p-4 rounded-lg mb-8 ${
          state.highContrast ? 'bg-gray-800 border border-gray-600' : 'bg-gray-50 border border-gray-200'
        }`}>
          <p className={`font-medium text-center ${
            state.fontSize === 'small' ? 'text-base' : 
            state.fontSize === 'large' ? 'text-xl' : 'text-lg'
          }`}>
            ⚠️ Once submitted, you cannot make any changes to your answers
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onCancel}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              state.fontSize === 'small' ? 'text-base' : 
              state.fontSize === 'large' ? 'text-xl' : 'text-lg'
            } ${
              state.highContrast 
                ? 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700' 
                : 'bg-gray-200 text-gray-800 border border-gray-300 hover:bg-gray-300'
            }`}
          >
            Go Back to Review
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              state.fontSize === 'small' ? 'text-base' : 
              state.fontSize === 'large' ? 'text-xl' : 'text-lg'
            } ${
              state.highContrast 
                ? 'bg-red-800 text-red-200 border border-red-600 hover:bg-red-700' 
                : 'bg-red-600 text-white hover:bg-red-700 border border-red-600'
            }`}
          >
            Submit Final Answers
          </button>
        </div>
      </div>
    </div>
  );
}