import { Question, ExamSet, ExamSlot, Student } from '../types/exam';

// Generate 6 different exam sets with unique questions
export const EXAM_SETS: ExamSet[] = [
  {
    id: 'SET_A',
    name: 'Exam Set A - Production',
    description: 'First examination set focusing on core networking concepts',
    isActive: true,
    questions: [] // Will be populated with unique questions
  },
  {
    id: 'SET_B',
    name: 'Exam Set B - Production',
    description: 'Second examination set with advanced Wi-Fi technologies',
    isActive: true,
    questions: []
  },
  {
    id: 'SET_C',
    name: 'Exam Set C - Production',
    description: 'Third examination set emphasizing practical applications',
    isActive: true,
    questions: []
  },
  {
    id: 'SET_D',
    name: 'Exam Set D - Production',
    description: 'Fourth examination set with comprehensive coverage',
    isActive: true,
    questions: []
  },
  {
    id: 'SET_E',
    name: 'Exam Set E - Production',
    description: 'Fifth examination set for advanced assessment',
    isActive: true,
    questions: []
  },
  {
    id: 'SET_F',
    name: 'Exam Set F - Production',
    description: 'Sixth examination set for final assessment',
    isActive: true,
    questions: []
  }
];

// Helper function to get current date with specific time
const getTodayWithTime = (hours: number, minutes: number = 0) => {
  const today = new Date();
  today.setHours(hours, minutes, 0, 0);
  return today;
};

// Define 6 exam slots for production - Updated to use current date
export const EXAM_SLOTS: ExamSlot[] = [
  {
    id: 'SLOT_1',
    name: 'Slot 1 (9:00-9:45 AM)',
    startTime: getTodayWithTime(9, 0),
    endTime: getTodayWithTime(9, 45),
    examSet: 'SET_A',
    isActive: true,
    maxStudents: 100,
    currentStudents: 0
  },
  {
    id: 'SLOT_2',
    name: 'Slot 2 (10:00-10:45 AM)',
    startTime: getTodayWithTime(10, 0),
    endTime: getTodayWithTime(10, 45),
    examSet: 'SET_B',
    isActive: true,
    maxStudents: 100,
    currentStudents: 0
  },
  {
    id: 'SLOT_3',
    name: 'Slot 3 (11:00-11:45 AM)',
    startTime: getTodayWithTime(11, 0),
    endTime: getTodayWithTime(11, 45),
    examSet: 'SET_C',
    isActive: true,
    maxStudents: 100,
    currentStudents: 0
  },
  {
    id: 'SLOT_4',
    name: 'Slot 4 (1:00-1:45 PM)',
    startTime: getTodayWithTime(13, 0),
    endTime: getTodayWithTime(13, 45),
    examSet: 'SET_D',
    isActive: true,
    maxStudents: 100,
    currentStudents: 0
  },
  {
    id: 'SLOT_5',
    name: 'Slot 5 (2:00-2:45 PM)',
    startTime: getTodayWithTime(14, 0),
    endTime: getTodayWithTime(14, 45),
    examSet: 'SET_E',
    isActive: true,
    maxStudents: 100,
    currentStudents: 0
  },
  {
    id: 'SLOT_6',
    name: 'Slot 6 (3:00-3:45 PM)',
    startTime: getTodayWithTime(15, 0),
    endTime: getTodayWithTime(15, 45),
    examSet: 'SET_F',
    isActive: true,
    maxStudents: 100,
    currentStudents: 0
  }
];

// Production student database (600 students total)
export const PRODUCTION_STUDENTS: Student[] = [
  // Slot 1 Students (SET_A) - 9:00-9:45 AM
  ...Array.from({ length: 100 }, (_, i) => ({
    id: `A${String(i + 1).padStart(3, '0')}`,
    name: `Student A${i + 1}`,
    isActive: true,
    examSet: 'SET_A',
    slotTime: 'SLOT_1',
    hasCompletedExam: false
  })),

  // Slot 2 Students (SET_B) - 10:00-10:45 AM
  ...Array.from({ length: 100 }, (_, i) => ({
    id: `B${String(i + 1).padStart(3, '0')}`,
    name: `Student B${i + 1}`,
    isActive: true,
    examSet: 'SET_B',
    slotTime: 'SLOT_2',
    hasCompletedExam: false
  })),

  // Slot 3 Students (SET_C) - 11:00-11:45 AM
  ...Array.from({ length: 100 }, (_, i) => ({
    id: `C${String(i + 1).padStart(3, '0')}`,
    name: `Student C${i + 1}`,
    isActive: true,
    examSet: 'SET_C',
    slotTime: 'SLOT_3',
    hasCompletedExam: false
  })),

  // Slot 4 Students (SET_D) - 1:00-1:45 PM
  ...Array.from({ length: 100 }, (_, i) => ({
    id: `D${String(i + 1).padStart(3, '0')}`,
    name: `Student D${i + 1}`,
    isActive: true,
    examSet: 'SET_D',
    slotTime: 'SLOT_4',
    hasCompletedExam: false
  })),

  // Slot 5 Students (SET_E) - 2:00-2:45 PM
  ...Array.from({ length: 100 }, (_, i) => ({
    id: `E${String(i + 1).padStart(3, '0')}`,
    name: `Student E${i + 1}`,
    isActive: true,
    examSet: 'SET_E',
    slotTime: 'SLOT_5',
    hasCompletedExam: false
  })),

  // Slot 6 Students (SET_F) - 3:00-3:45 PM
  ...Array.from({ length: 100 }, (_, i) => ({
    id: `F${String(i + 1).padStart(3, '0')}`,
    name: `Student F${i + 1}`,
    isActive: true,
    examSet: 'SET_F',
    slotTime: 'SLOT_6',
    hasCompletedExam: false
  }))
];

// Testing student database - Updated with TEST100-TEST200 range
export const TESTING_STUDENTS: Student[] = [
  // Original test students (TEST001-TEST050)
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `TEST${String(i + 1).padStart(3, '0')}`,
    name: `Test Student ${i + 1}`,
    isActive: true,
    examSet: 'SET_A',
    slotTime: 'SLOT_1',
    hasCompletedExam: false
  })),

  // New test users TEST100-TEST200 (101 students total)
  ...Array.from({ length: 101 }, (_, i) => {
    const testNumber = i + 100; // This gives us 100, 101, 102, ..., 200
    const examSets = ['SET_A', 'SET_B', 'SET_C', 'SET_D', 'SET_E', 'SET_F'];
    const slots = ['SLOT_1', 'SLOT_2', 'SLOT_3', 'SLOT_4', 'SLOT_5', 'SLOT_6'];
    const setIndex = i % 6; // Cycle through exam sets

    return {
      id: `TEST${testNumber}`,
      name: `Test User ${testNumber}`,
      isActive: true,
      examSet: examSets[setIndex],
      slotTime: slots[setIndex],
      hasCompletedExam: false
    };
  })
];

// Combined students list
export const STUDENTS_WITH_SLOTS: Student[] = [...PRODUCTION_STUDENTS, ...TESTING_STUDENTS];

// Import completion tracking from API utils
import { hasCompletedExam as checkCompletedExam, markExamAsCompleted as markCompleted, checkExamCompletion } from '../utils/api';

export function markExamAsCompleted(studentId: string) {
  markCompleted(studentId);
}

export async function hasCompletedExam(studentId: string): Promise<boolean> {
  // Check server first, then fallback to local storage
  return await checkExamCompletion(studentId);
}

// Utility functions
export function getSlotByTime(currentTime: Date): ExamSlot | null {
  return EXAM_SLOTS.find(slot =>
    currentTime >= slot.startTime &&
    currentTime <= slot.endTime &&
    slot.isActive
  ) || null;
}

export function getActiveSlot(): ExamSlot | null {
  const now = new Date();
  return getSlotByTime(now);
}

export function getStudentSlot(studentId: string): ExamSlot | null {
  const student = STUDENTS_WITH_SLOTS.find(s => s.id === studentId);
  if (!student || !student.slotTime) return null;

  return EXAM_SLOTS.find(slot => slot.id === student.slotTime) || null;
}

export async function validateStudentAccess(studentId: string): Promise<{
  isValid: boolean;
  message: string;
  slot?: ExamSlot;
  examSet?: string;
}> {
  const student = STUDENTS_WITH_SLOTS.find(s => s.id === studentId && s.isActive);

  if (!student) {
    return {
      isValid: false,
      message: 'Invalid student ID or student not found'
    };
  }

  // For testing students (TEST001-TEST050 and TEST100-TEST200), always allow access
  if (studentId.startsWith('TEST')) {
    const studentSlot = getStudentSlot(studentId);
    if (!studentSlot) {
      return {
        isValid: false,
        message: 'No exam slot assigned to this student'
      };
    }

    return {
      isValid: true,
      message: 'Access granted - Testing Mode',
      slot: studentSlot,
      examSet: student.examSet
    };
  }

  // Check if student has already completed the exam (server check)
  const hasCompleted = await checkExamCompletion(studentId);
  if (hasCompleted) {
    return {
      isValid: false,
      message: 'You have already participated in the exam and cannot retake it. If you believe this is an error, please contact the exam administrator.'
    };
  }

  const studentSlot = getStudentSlot(studentId);
  if (!studentSlot) {
    return {
      isValid: false,
      message: 'No exam slot assigned to this student'
    };
  }

  const now = new Date();

  // Check if exam slot has started
  if (now < studentSlot.startTime) {
    const timeUntilStart = Math.ceil((studentSlot.startTime.getTime() - now.getTime()) / (1000 * 60));
    return {
      isValid: false,
      message: `Exam has not started yet. Please wait ${timeUntilStart} minutes until ${studentSlot.startTime.toLocaleTimeString()}`
    };
  }

  // Check if exam slot has ended
  if (now > studentSlot.endTime) {
    return {
      isValid: false,
      message: 'Exam time has expired. This exam slot has ended.'
    };
  }

  // Check if slot is at capacity
  if (studentSlot.currentStudents >= studentSlot.maxStudents) {
    return {
      isValid: false,
      message: 'This exam slot is at full capacity'
    };
  }

  return {
    isValid: true,
    message: 'Access granted',
    slot: studentSlot,
    examSet: student.examSet
  };
}

export function generateUniqueLink(studentId: string): string {
  const student = STUDENTS_WITH_SLOTS.find(s => s.id === studentId);
  if (!student) return '';

  // Generate a unique token based on student ID and slot
  const token = btoa(`${studentId}-${student.slotTime}-${Date.now()}`);
  return `${window.location.origin}?student=${studentId}&token=${token}&slot=${student.slotTime}`;
}