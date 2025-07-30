import React, { useState, useEffect } from 'react';
import { ExamProvider, useExam } from './contexts/ExamContext';
import { LoginPage } from './components/LoginPage';
import { InstructionsPage } from './components/InstructionsPage';
import { ExamInterface } from './components/ExamInterface';
import { SectionBreak } from './components/SectionBreak';
import { ExamCompletionPage } from './components/ExamCompletionPage';
import { SecurityAlert } from './components/SecurityAlert';
import { AccessibilityControls } from './components/AccessibilityControls';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { AdminHeader } from './components/AdminHeader';
import { SlotManagement } from './components/SlotManagement';
import { SlotValidation } from './components/SlotValidation';
import { TestingPanel } from './components/TestingPanel';
import { QuestionImporter } from './components/QuestionImporter';
import { AutomatedTesting } from './components/AutomatedTesting';
import { DatabaseManager } from './components/DatabaseManager';
import { getQuestionsByExamSet } from './data/examQuestions';
import { checkAdminAuth } from './utils/auth';

type AppState = 'login' | 'slot-validation' | 'instructions' | 'exam' | 'break' | 'completion' | 'admin' | 'admin-login' | 'slot-management' | 'testing' | 'question-importer' | 'automated-testing' | 'database-manager';

function AppContent() {
  const [appState, setAppState] = useState<AppState>('login');
  const [currentStudentId, setCurrentStudentId] = useState<string>('');
  const [currentExamSet, setCurrentExamSet] = useState<string>('');
  const [currentSlotId, setCurrentSlotId] = useState<string>('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const { state, dispatch } = useExam();

  // Check for admin access or slot management via URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const studentParam = urlParams.get('student');
    const adminParam = urlParams.get('admin');
    const slotManagementParam = urlParams.get('slot-management');
    const testingParam = urlParams.get('testing');
    const questionImporterParam = urlParams.get('question-importer');
    const automatedTestingParam = urlParams.get('automated-testing');
    const databaseManagerParam = urlParams.get('database-manager');
    
    if (adminParam === 'true') {
      // Check if admin is already authenticated
      const authStatus = checkAdminAuth();
      if (authStatus.isAuthenticated) {
        setIsAdminAuthenticated(true);
        setAppState('admin');
      } else {
        setAppState('admin-login');
      }
    } else if (slotManagementParam === 'true') {
      // Check if admin is already authenticated
      const authStatus = checkAdminAuth();
      if (authStatus.isAuthenticated) {
        setIsAdminAuthenticated(true);
        setAppState('slot-management');
      } else {
        setAppState('admin-login');
      }
    } else if (testingParam === 'true') {
      // Check if admin is already authenticated
      const authStatus = checkAdminAuth();
      if (authStatus.isAuthenticated) {
        setIsAdminAuthenticated(true);
        setAppState('testing');
      } else {
        setAppState('admin-login');
      }
    } else if (questionImporterParam === 'true') {
      // Check if admin is already authenticated
      const authStatus = checkAdminAuth();
      if (authStatus.isAuthenticated) {
        setIsAdminAuthenticated(true);
        setAppState('question-importer');
      } else {
        setAppState('admin-login');
      }
    } else if (automatedTestingParam === 'true') {
      // Check if admin is already authenticated
      const authStatus = checkAdminAuth();
      if (authStatus.isAuthenticated) {
        setIsAdminAuthenticated(true);
        setAppState('automated-testing');
      } else {
        setAppState('admin-login');
      }
    } else if (databaseManagerParam === 'true') {
      // Check if admin is already authenticated
      const authStatus = checkAdminAuth();
      if (authStatus.isAuthenticated) {
        setIsAdminAuthenticated(true);
        setAppState('database-manager');
      } else {
        setAppState('admin-login');
      }
    } else if (studentParam) {
      // Direct student access via link
      setCurrentStudentId(studentParam);
      setAppState('slot-validation');
    }
  }, []);

  // Handle admin login success
  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    
    // Determine which admin page to show based on URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('slot-management') === 'true') {
      setAppState('slot-management');
    } else if (urlParams.get('testing') === 'true') {
      setAppState('testing');
    } else if (urlParams.get('question-importer') === 'true') {
      setAppState('question-importer');
    } else if (urlParams.get('automated-testing') === 'true') {
      setAppState('automated-testing');
    } else if (urlParams.get('database-manager') === 'true') {
      setAppState('database-manager');
    } else {
      setAppState('admin');
    }
  };

  // Handle admin logout
  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setAppState('login');
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  // Handle student login
  const handleLogin = (studentId: string) => {
    setCurrentStudentId(studentId);
    setAppState('slot-validation');
  };

  // Handle slot validation success
  const handleSlotValidationSuccess = (examSet: string, slotId: string) => {
    setCurrentExamSet(examSet);
    setCurrentSlotId(slotId);
    dispatch({ 
      type: 'INITIALIZE_SESSION', 
      payload: { 
        studentId: currentStudentId,
        examSet,
        slotId
      } 
    });
    setAppState('instructions');
  };

  // Handle slot validation failure
  const handleSlotValidationFailure = (message: string) => {
    // Stay on slot validation page with error message
    console.error('Slot validation failed:', message);
  };

  // Handle exam start
  const handleStartExam = () => {
    dispatch({ type: 'HIDE_INSTRUCTIONS' });
    const questions = getQuestionsByExamSet(currentExamSet);
    dispatch({ type: 'SET_QUESTIONS', payload: questions });
    dispatch({ type: 'START_QUESTION_TIMER' });
    setAppState('exam');
  };

  // Handle section completion
  const handleSectionComplete = () => {
    if (!state.session) return;
    
    const sections = ['networking', 'wifi-quant'];
    const currentIndex = sections.indexOf(state.session.currentSection);
    
    if (currentIndex < sections.length - 1) {
      setAppState('break');
    } else {
      setAppState('completion');
    }
  };

  // Handle break end
  const handleBreakEnd = () => {
    dispatch({ type: 'NEXT_SECTION' });
    setAppState('exam');
  };

  // Handle exam completion
  const handleExamComplete = () => {
    setAppState('completion');
  };

  // Render security alert if needed (warnings only, no termination)
  if (state.session?.isWarned) {
    return (
      <SecurityAlert 
        type="warning" 
        onContinue={() => {
          dispatch({ type: 'DISMISS_SECURITY_WARNING' });
        }}
      />
    );
  }

  // Main app routing
  switch (appState) {
    case 'admin-login':
      return (
        <>
          <AccessibilityControls />
          <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />
        </>
      );

    case 'admin':
      return (
        <>
          <AccessibilityControls />
          <AdminHeader onLogout={handleAdminLogout} />
          <AdminDashboard />
        </>
      );

    case 'slot-management':
      return (
        <>
          <AccessibilityControls />
          <AdminHeader onLogout={handleAdminLogout} />
          <SlotManagement />
        </>
      );

    case 'testing':
      return (
        <>
          <AccessibilityControls />
          <AdminHeader onLogout={handleAdminLogout} />
          <TestingPanel />
        </>
      );

    case 'question-importer':
      return (
        <>
          <AccessibilityControls />
          <AdminHeader onLogout={handleAdminLogout} />
          <QuestionImporter />
        </>
      );

    case 'automated-testing':
      return (
        <>
          <AccessibilityControls />
          <AdminHeader onLogout={handleAdminLogout} />
          <AutomatedTesting />
        </>
      );

    case 'database-manager':
      return (
        <>
          <AccessibilityControls />
          <AdminHeader onLogout={handleAdminLogout} />
          <DatabaseManager />
        </>
      );
    
    case 'login':
      return (
        <>
          <AccessibilityControls />
          <LoginPage onLogin={handleLogin} />
        </>
      );

    case 'slot-validation':
      return (
        <>
          <AccessibilityControls />
          <SlotValidation 
            studentId={currentStudentId}
            onValidationSuccess={handleSlotValidationSuccess}
            onValidationFailure={handleSlotValidationFailure}
          />
        </>
      );
    
    case 'instructions':
      return (
        <>
          <AccessibilityControls />
          <InstructionsPage onStartExam={handleStartExam} />
        </>
      );
    
    case 'exam':
      return (
        <>
          <AccessibilityControls />
          <ExamInterface 
            onSectionComplete={handleSectionComplete}
            onExamComplete={handleExamComplete}
          />
        </>
      );
    
    case 'break':
      return (
        <>
          <AccessibilityControls />
          <SectionBreak onBreakEnd={handleBreakEnd} />
        </>
      );
    
    case 'completion':
      return (
        <>
          <AccessibilityControls />
          <ExamCompletionPage studentId={currentStudentId} />
        </>
      );
    
    default:
      return null;
  }
}

function App() {
  return (
    <ExamProvider>
      <AppContent />
    </ExamProvider>
  );
}

export default App;