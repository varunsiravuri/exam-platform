import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, Users, Calendar } from 'lucide-react';
import { validateStudentAccess, getStudentSlot, EXAM_SLOTS } from '../data/examSets';
import { useExam } from '../contexts/ExamContext';

interface SlotValidationProps {
  studentId: string;
  onValidationSuccess: (examSet: string, slotId: string) => void;
  onValidationFailure: (message: string) => void;
}

export function SlotValidation({ studentId, onValidationSuccess, onValidationFailure }: SlotValidationProps) {
  const [validationStatus, setValidationStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');
  const [message, setMessage] = useState('');
  const { state } = useExam();

  useEffect(() => {
    const validateAccess = async () => {
      try {
        // Wait for the promise to resolve
        const validation = await validateStudentAccess(studentId);

        if (validation.isValid && validation.slot && validation.examSet) {
          setValidationStatus('valid');
          setMessage(validation.message);
          onValidationSuccess(validation.examSet, validation.slot.id);
        } else {
          setValidationStatus('invalid');
          setMessage(validation.message);
          onValidationFailure(validation.message);
        }
      } catch (error) {
        // Handle any errors that might occur while awaiting the promise
        console.error('Error during validation:', error);
        setValidationStatus('error');
        setMessage('There was an error during validation.');
      }
    };

    // Small delay to show loading state
    setTimeout(validateAccess, 1000);
  }, [studentId, onValidationSuccess, onValidationFailure]);


  const studentSlot = getStudentSlot(studentId);

  if (validationStatus === 'checking') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${state.highContrast ? 'bg-black text-white' : 'bg-gray-50'
        }`}>
        <div className={`max-w-md w-full rounded-2xl p-8 text-center ${state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-2xl border border-gray-100'
          }`}>
          <div className="w-16 h-16 mx-auto mb-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <h2 className={`font-bold mb-2 ${state.fontSize === 'small' ? 'text-xl' :
            state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
            }`}>
            Validating Access
          </h2>
          <p className={`${state.fontSize === 'small' ? 'text-base' :
            state.fontSize === 'large' ? 'text-xl' : 'text-lg'
            } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
            Checking your exam credentials...
          </p>
        </div>
      </div>
    );
  }

  if (validationStatus === 'invalid') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${state.highContrast ? 'bg-black text-white' : 'bg-gray-50'
        }`}>
        <div className={`max-w-lg w-full rounded-2xl p-8 text-center ${state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-2xl border border-gray-100'
          }`}>
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${state.highContrast ? 'bg-red-400 text-black' : 'bg-red-100 text-red-600'
            }`}>
            <AlertTriangle size={32} />
          </div>

          <h2 className={`font-bold mb-4 ${state.fontSize === 'small' ? 'text-xl' :
            state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
            } text-red-600`}>
            Access Denied
          </h2>

          <p className={`mb-6 ${state.fontSize === 'small' ? 'text-base' :
            state.fontSize === 'large' ? 'text-xl' : 'text-lg'
            } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
            {message}
          </p>

          <button
            onClick={() => window.location.reload()}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${state.fontSize === 'small' ? 'text-base' :
              state.fontSize === 'large' ? 'text-xl' : 'text-lg'
              } ${state.highContrast
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Valid access - show success message briefly before proceeding
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${state.highContrast ? 'bg-black text-white' : 'bg-gray-50'
      }`}>
      <div className={`max-w-md w-full rounded-2xl p-8 text-center ${state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-2xl border border-gray-100'
        }`}>
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${state.highContrast ? 'bg-green-400 text-black' : 'bg-green-100 text-green-600'
          }`}>
          <CheckCircle size={32} />
        </div>

        <h2 className={`font-bold mb-4 ${state.fontSize === 'small' ? 'text-xl' :
          state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
          } text-green-600`}>
          Access Granted
        </h2>

        <p className={`mb-6 ${state.fontSize === 'small' ? 'text-base' :
          state.fontSize === 'large' ? 'text-xl' : 'text-lg'
          } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
          Welcome! Loading your exam...
        </p>

        {studentSlot && (
          <div className={`p-4 rounded-lg ${state.highContrast ? 'bg-green-900 border border-green-600' : 'bg-green-50 border border-green-200'
            }`}>
            <p className={`font-medium ${state.fontSize === 'small' ? 'text-sm' :
              state.fontSize === 'large' ? 'text-lg' : 'text-base'
              } ${state.highContrast ? 'text-green-200' : 'text-green-700'}`}>
              Exam Set {studentSlot.examSet.replace('SET_', '')}
            </p>
          </div>
        )}

        <div className="mt-6">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className={`mt-2 ${state.fontSize === 'small' ? 'text-sm' :
            state.fontSize === 'large' ? 'text-lg' : 'text-base'
            } ${state.highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
            Preparing your assessment...
          </p>
        </div>
      </div>
    </div>
  );
}