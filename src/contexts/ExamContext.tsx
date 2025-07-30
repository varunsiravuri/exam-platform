import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { ExamSession, Answer, ExamSection, Question } from '../types/exam';
import { getQuestionsByExamSet } from '../data/examQuestions';

interface ExamState {
  session: ExamSession | null;
  questions: Question[];
  currentQuestion: Question | null;
  isSecurityViolated: boolean;
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  showInstructions: boolean;
  currentQuestionStartTime: Date | null;
  securityWarningCount: number;
}

type ExamAction = 
  | { type: 'INITIALIZE_SESSION'; payload: { studentId: string; examSet?: string; slotId?: string } }
  | { type: 'SET_QUESTIONS'; payload: Question[] }
  | { type: 'ANSWER_QUESTION'; payload: { questionId: string; answer: number | null } }
  | { type: 'MARK_FOR_REVIEW'; payload: { questionId: string; marked: boolean } }
  | { type: 'NAVIGATE_TO_QUESTION'; payload: number }
  | { type: 'NEXT_SECTION' }
  | { type: 'TAB_SWITCH_DETECTED' }
  | { type: 'DISMISS_SECURITY_WARNING' }
  | { type: 'SET_FONT_SIZE'; payload: 'small' | 'medium' | 'large' }
  | { type: 'TOGGLE_HIGH_CONTRAST' }
  | { type: 'HIDE_INSTRUCTIONS' }
  | { type: 'START_QUESTION_TIMER' }
  | { type: 'UPDATE_TIME_SPENT'; payload: { questionId: string; timeSpent: number } };

const initialState: ExamState = {
  session: null,
  questions: [],
  currentQuestion: null,
  isSecurityViolated: false,
  fontSize: 'medium',
  highContrast: false,
  showInstructions: true,
  currentQuestionStartTime: null,
  securityWarningCount: 0,
};

function examReducer(state: ExamState, action: ExamAction): ExamState {
  switch (action.type) {
    case 'INITIALIZE_SESSION':
      const newSession: ExamSession = {
        studentId: action.payload.studentId,
        startTime: new Date(),
        currentSection: 'networking',
        currentQuestionIndex: 0,
        answers: {},
        tabSwitchCount: 0,
        isWarned: false,
        isTerminated: false,
        sectionStartTimes: {
          networking: new Date(),
          'wifi-quant': null
        },
        examSet: action.payload.examSet || 'SET_A',
        slotId: action.payload.slotId || 'SLOT_1'
      };
      return { ...state, session: newSession };

    case 'SET_QUESTIONS':
      return { 
        ...state, 
        questions: action.payload, 
        currentQuestion: action.payload[0] || null 
      };

    case 'ANSWER_QUESTION':
      if (!state.session) return state;
      const updatedAnswers = {
        ...state.session.answers,
        [action.payload.questionId]: {
          ...state.session.answers[action.payload.questionId],
          questionId: action.payload.questionId,
          selectedOption: action.payload.answer,
          isMarkedForReview: state.session.answers[action.payload.questionId]?.isMarkedForReview || false,
          timeSpent: state.session.answers[action.payload.questionId]?.timeSpent || 0
        }
      };
      return {
        ...state,
        session: { ...state.session, answers: updatedAnswers }
      };

    case 'MARK_FOR_REVIEW':
      if (!state.session) return state;
      const reviewAnswers = {
        ...state.session.answers,
        [action.payload.questionId]: {
          ...state.session.answers[action.payload.questionId],
          questionId: action.payload.questionId,
          selectedOption: state.session.answers[action.payload.questionId]?.selectedOption || null,
          isMarkedForReview: action.payload.marked,
          timeSpent: state.session.answers[action.payload.questionId]?.timeSpent || 0
        }
      };
      return {
        ...state,
        session: { ...state.session, answers: reviewAnswers }
      };

    case 'NAVIGATE_TO_QUESTION':
      if (!state.session) return state;
      return {
        ...state,
        session: { ...state.session, currentQuestionIndex: action.payload },
        currentQuestion: state.questions[action.payload] || null,
        currentQuestionStartTime: new Date()
      };

    case 'NEXT_SECTION':
      if (!state.session) return state;
      const sections: ExamSection[] = ['networking', 'wifi-quant'];
      const currentIndex = sections.indexOf(state.session.currentSection);
      const nextSection = sections[currentIndex + 1];
      
      if (!nextSection) return state;
      
      const nextQuestions = getQuestionsByExamSet(state.session.examSet).filter(q => q.section === nextSection);
      return {
        ...state,
        session: {
          ...state.session,
          currentSection: nextSection,
          currentQuestionIndex: 0,
          sectionStartTimes: {
            ...state.session.sectionStartTimes,
            [nextSection]: new Date()
          }
        },
        questions: nextQuestions,
        currentQuestion: nextQuestions[0] || null,
        currentQuestionStartTime: new Date()
      };

    case 'TAB_SWITCH_DETECTED':
      if (!state.session) return state;
      const newTabSwitchCount = state.session.tabSwitchCount + 1;
      const newWarningCount = state.securityWarningCount + 1;
      
      // Show warning but don't terminate exam
      return {
        ...state,
        session: {
          ...state.session,
          tabSwitchCount: newTabSwitchCount,
          isWarned: true,
          isTerminated: false // Never terminate
        },
        securityWarningCount: newWarningCount
      };

    case 'DISMISS_SECURITY_WARNING':
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          isWarned: false
        }
      };

    case 'SET_FONT_SIZE':
      return { ...state, fontSize: action.payload };

    case 'TOGGLE_HIGH_CONTRAST':
      return { ...state, highContrast: !state.highContrast };

    case 'HIDE_INSTRUCTIONS':
      return { ...state, showInstructions: false };

    case 'START_QUESTION_TIMER':
      return { ...state, currentQuestionStartTime: new Date() };

    case 'UPDATE_TIME_SPENT':
      if (!state.session) return state;
      const timeUpdatedAnswers = {
        ...state.session.answers,
        [action.payload.questionId]: {
          ...state.session.answers[action.payload.questionId],
          questionId: action.payload.questionId,
          selectedOption: state.session.answers[action.payload.questionId]?.selectedOption || null,
          isMarkedForReview: state.session.answers[action.payload.questionId]?.isMarkedForReview || false,
          timeSpent: action.payload.timeSpent
        }
      };
      return {
        ...state,
        session: { ...state.session, answers: timeUpdatedAnswers }
      };

    default:
      return state;
  }
}

const ExamContext = createContext<{
  state: ExamState;
  dispatch: React.Dispatch<ExamAction>;
} | null>(null);

export function ExamProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(examReducer, initialState);

  // Tab switch detection (warnings only, no termination)
  useEffect(() => {
    if (!state.session) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        dispatch({ type: 'TAB_SWITCH_DETECTED' });
      }
    };

    const handleBlur = () => {
      dispatch({ type: 'TAB_SWITCH_DETECTED' });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [state.session]);

  // Question time tracking
  useEffect(() => {
    if (!state.currentQuestion || !state.currentQuestionStartTime) return;

    const interval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - state.currentQuestionStartTime!.getTime()) / 1000 / 60);
      dispatch({
        type: 'UPDATE_TIME_SPENT',
        payload: {
          questionId: state.currentQuestion!.id,
          timeSpent
        }
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [state.currentQuestion, state.currentQuestionStartTime]);

  return (
    <ExamContext.Provider value={{ state, dispatch }}>
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
}