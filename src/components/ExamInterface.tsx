import React, { useState, useEffect } from 'react';
import { QuestionDisplay } from './QuestionDisplay';
import { QuestionNavigation } from './QuestionNavigation';
import { Timer } from './Timer';
import { SubmissionConfirmation } from './SubmissionConfirmation';
import { useExam } from '../contexts/ExamContext';
import { getQuestionsByExamSet } from '../data/examQuestions';
import { STUDENTS_WITH_SLOTS } from '../data/examSets';
import { Sparkles, Zap } from 'lucide-react';

interface ExamInterfaceProps {
  onSectionComplete: () => void;
  onExamComplete: () => void;
}

export function ExamInterface({ onSectionComplete, onExamComplete }: ExamInterfaceProps) {
  const { state, dispatch } = useExam();
  const [showSubmissionConfirm, setShowSubmissionConfirm] = useState(false);
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [examStartTime] = useState(new Date()); // Single timer for entire exam

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const currentQuestion = state.questions[state.session?.currentQuestionIndex || 0];
  const currentAnswer = state.session?.answers[currentQuestion?.id];

  // Get student information
  const student = state.session ? 
    STUDENTS_WITH_SLOTS.find(s => s.id === state.session!.studentId) 
    : null;
  
  const studentName = student?.name || 'Unknown Candidate';

  // Handle inactivity monitoring
  const resetInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    
    const timer = setTimeout(() => {
      // Auto-logout after inactivity
      dispatch({ type: 'TERMINATE_SESSION' });
    }, 10 * 60 * 1000); // 10 minutes
    
    setInactivityTimer(timer);
  };

  // Reset inactivity timer on user activity
  useEffect(() => {
    const handleActivity = () => resetInactivityTimer();
    
    document.addEventListener('mousedown', handleActivity);
    document.addEventListener('keydown', handleActivity);
    document.addEventListener('scroll', handleActivity);
    
    resetInactivityTimer();
    
    return () => {
      document.removeEventListener('mousedown', handleActivity);
      document.removeEventListener('keydown', handleActivity);
      document.removeEventListener('scroll', handleActivity);
      if (inactivityTimer) clearTimeout(inactivityTimer);
    };
  }, []);

  // Load questions for the exam set
  useEffect(() => {
    if (state.session?.examSet) {
      const questions = getQuestionsByExamSet(state.session.examSet);
      dispatch({ type: 'SET_QUESTIONS', payload: questions });
    }
  }, [state.session?.examSet]);

  const handleAnswer = (answer: number | null) => {
    if (!currentQuestion) return;
    dispatch({
      type: 'ANSWER_QUESTION',
      payload: { questionId: currentQuestion.id, answer }
    });
  };

  const handleMarkForReview = (marked: boolean) => {
    if (!currentQuestion) return;
    dispatch({
      type: 'MARK_FOR_REVIEW',
      payload: { questionId: currentQuestion.id, marked }
    });
  };

  const handleNavigation = (index: number) => {
    dispatch({ type: 'NAVIGATE_TO_QUESTION', payload: index });
  };

  const handlePrevious = () => {
    const currentIndex = state.session?.currentQuestionIndex || 0;
    if (currentIndex > 0) {
      handleNavigation(currentIndex - 1);
    }
  };

  const handleNext = () => {
    const currentIndex = state.session?.currentQuestionIndex || 0;
    if (currentIndex < state.questions.length - 1) {
      handleNavigation(currentIndex + 1);
    }
  };

  const handleTimeUp = () => {
    // When time is up, automatically complete the exam
    onExamComplete();
  };

  const handleSubmit = () => {
    setShowSubmissionConfirm(true);
  };

  const confirmSubmission = () => {
    onExamComplete();
  };

  if (!state.session || !currentQuestion) {
    return (
      <div className={`min-h-screen flex items-center justify-center particles-bg ${
        state.highContrast ? 'bg-black' : 'bg-gradient-to-br from-yellow-50 via-white to-green-50'
      }`}>
        <div className="text-center">
          <div className="w-48 h-28 mx-auto mb-6 flex items-center justify-center animate-float">
            <img 
              src="/CandelaLogo2.png" 
              alt="Candela Technologies" 
              className="w-full h-full object-contain animate-pulse filter drop-shadow-lg"
            />
          </div>
          
          {/* Sparkle effects */}
          <div className="relative mb-6">
            <div className="absolute -top-4 -right-4 animate-pulse">
              <Sparkles className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="absolute -bottom-4 -left-4 animate-pulse" style={{ animationDelay: '0.5s' }}>
              <Zap className="w-6 h-6 text-green-500" />
            </div>
          </div>
          
          <div className={`animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mx-auto mb-6 ${
            state.highContrast ? 'border-white' : 'border-green-500'
          }`}></div>
          
          <p className={`text-2xl font-medium mb-2 ${state.highContrast ? 'text-white' : 'text-gray-900'}`}>
            Loading assessment...
          </p>
          <p className={`text-base ${state.highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
            Powered by Candela Technologies
          </p>
        </div>
      </div>
    );
  }

  if (showSubmissionConfirm) {
    return (
      <SubmissionConfirmation
        questions={state.questions}
        answers={state.session.answers}
        onConfirm={confirmSubmission}
        onCancel={() => setShowSubmissionConfirm(false)}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      state.highContrast ? 'bg-black' : 'bg-gradient-to-br from-yellow-50 via-white to-green-50'
    } ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
      {/* Header with Timer and Controls */}
      <div className={`${
        state.highContrast ? 'bg-gray-900 border-b border-gray-700' : 'bg-white/90 border-b border-yellow-200 shadow-lg backdrop-blur-xl'
      } p-4 transition-all duration-500 animate-slide-in-up`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4 animate-slide-in-left">
              <div className="w-20 h-12 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                <img 
                  src="/CandelaLogo2.png" 
                  alt="Candela Technologies" 
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              </div>
              <h1 className={`font-bold ${
                state.fontSize === 'small' ? 'text-xl' : 
                state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
              } ${state.highContrast ? 'text-white' : 'bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent'}`}>
                Candela Written Test
              </h1>
            </div>
            
            {/* Student Information */}
            <div className="flex flex-col space-y-2 animate-slide-in-left stagger-1">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                state.highContrast ? 'bg-green-900 text-green-200' : 'bg-gradient-to-r from-green-100 to-green-200 text-green-800'
              }`}>
                <span className={`font-medium ${
                  state.fontSize === 'small' ? 'text-xs' : 
                  state.fontSize === 'large' ? 'text-base' : 'text-sm'
                }`}>
                  Candidate ID:
                </span>
                <span className={`font-bold ${
                  state.fontSize === 'small' ? 'text-xs' : 
                  state.fontSize === 'large' ? 'text-base' : 'text-sm'
                }`}>
                  {state.session.studentId}
                </span>
              </div>
              
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                state.highContrast ? 'bg-yellow-900 text-yellow-200' : 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800'
              }`}>
                <span className={`font-medium ${
                  state.fontSize === 'small' ? 'text-xs' : 
                  state.fontSize === 'large' ? 'text-base' : 'text-sm'
                }`}>
                  Name:
                </span>
                <span className={`font-bold ${
                  state.fontSize === 'small' ? 'text-xs' : 
                  state.fontSize === 'large' ? 'text-base' : 'text-sm'
                }`}>
                  {studentName}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 animate-slide-in-right">
            {/* Single Timer for Entire Exam */}
            <Timer
              startTime={examStartTime}
              onTimeUp={handleTimeUp}
              onWarning={() => {}}
            />
            
            <button
              onClick={handleSubmit}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 focus:scale-105 hover-lift relative overflow-hidden group ${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              } ${
                state.highContrast 
                  ? 'bg-red-800 text-red-200 border border-red-600 hover:bg-red-700'
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 border border-red-500 shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Button shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></div>
              <span className="relative z-10">Submit Assessment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Question Navigation Sidebar */}
        <div className="w-80 flex-shrink-0 animate-slide-in-left stagger-2">
          <QuestionNavigation
            questions={state.questions}
            answers={state.session.answers}
            currentIndex={state.session.currentQuestionIndex}
            onNavigate={handleNavigation}
          />
        </div>

        {/* Question Display */}
        <div className="animate-slide-in-right stagger-2">
          <QuestionDisplay
            question={currentQuestion}
            questionNumber={state.session.currentQuestionIndex + 1}
            totalQuestions={state.questions.length}
            answer={currentAnswer}
            onAnswer={handleAnswer}
            onMarkForReview={handleMarkForReview}
            onPrevious={handlePrevious}
            onNext={handleNext}
            canGoPrevious={state.session.currentQuestionIndex > 0}
            canGoNext={state.session.currentQuestionIndex < state.questions.length - 1}
          />
        </div>
      </div>
    </div>
  );
}