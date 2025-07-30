export interface Student {
  id: string;
  name: string;
  isActive: boolean;
  examSet?: string; // Which exam set they're assigned to
  slotTime?: string; // Their assigned time slot
  hasCompletedExam?: boolean; // Track if they've completed the exam
}

export interface Question {
  id: string;
  section: ExamSection;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  examSet: string; // Which exam set this question belongs to
}

export interface Answer {
  questionId: string;
  selectedOption: number | null;
  isMarkedForReview: boolean;
  timeSpent: number;
}

export interface ExamSession {
  studentId: string;
  startTime: Date;
  currentSection: ExamSection;
  currentQuestionIndex: number;
  answers: Record<string, Answer>;
  tabSwitchCount: number;
  isWarned: boolean;
  isTerminated: boolean;
  sectionStartTimes: Record<ExamSection, Date | null>;
  examSet: string; // Which exam set they're taking
  slotId: string; // Which time slot they're in
}

export interface ExamSlot {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  examSet: string;
  isActive: boolean;
  maxStudents: number;
  currentStudents: number;
}

export interface ExamSet {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  isActive: boolean;
}

export type ExamSection = 'networking' | 'wifi-quant';

export interface SectionConfig {
  name: string;
  duration: number; // in minutes
  description: string;
}

export interface ExamConfig {
  sections: Record<ExamSection, SectionConfig>;
  totalQuestions: number;
  warningThreshold: number; // minutes before section ends
  longQuestionThreshold: number; // minutes on single question
  inactivityTimeout: number; // minutes of inactivity
  scoring: {
    correctAnswer: number; // +1 for correct
    wrongAnswer: number; // -0.25 for wrong
    unanswered: number; // 0 for unanswered
  };
}

export type QuestionStatus = 'not-answered' | 'answered' | 'marked-for-review' | 'answered-and-marked';

export interface TimerState {
  remainingTime: number;
  isActive: boolean;
  showWarning: boolean;
}

export interface SlotAccess {
  slotId: string;
  studentId: string;
  accessToken: string;
  expiresAt: Date;
  isUsed: boolean;
}