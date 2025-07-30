import React, { useState } from 'react';
import { Play, CheckCircle, AlertTriangle, Database, Users, FileText, RefreshCw } from 'lucide-react';
import { useExam } from '../contexts/ExamContext';
import { saveResults, getAllResults, checkServerHealth } from '../utils/api';
import { calculateScore } from '../data/examData';
import { getQuestionsByExamSet } from '../data/examQuestions';

interface TestResult {
  studentId: string;
  studentName: string;
  status: 'pending' | 'running' | 'success' | 'error';
  score?: number;
  percentage?: number;
  grade?: string;
  error?: string;
  timestamp?: string;
}

export function AutomatedTesting() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [serverStatus, setServerStatus] = useState<'unknown' | 'online' | 'offline'>('unknown');
  const { state } = useExam();

  // Test users as requested
  const testUsers = [
    { id: 'TEST100', name: 'Test User Alpha', examSet: 'SET_A' },
    { id: 'TEST101', name: 'Test User Beta', examSet: 'SET_B' },
    { id: 'TEST103', name: 'Test User Gamma', examSet: 'SET_C' }
  ];

  const checkServer = async () => {
    const isOnline = await checkServerHealth();
    setServerStatus(isOnline ? 'online' : 'offline');
    return isOnline;
  };

  const generateRandomAnswers = (questions: any[]) => {
    const answers: Record<string, any> = {};
    
    questions.forEach(question => {
      // Simulate realistic exam behavior
      const shouldAnswer = Math.random() > 0.1; // 90% chance to answer
      const isCorrect = Math.random() > 0.3; // 70% chance to get it right if answered
      
      if (shouldAnswer) {
        answers[question.id] = {
          questionId: question.id,
          selectedOption: isCorrect ? question.correctAnswer : Math.floor(Math.random() * 4),
          isMarkedForReview: Math.random() > 0.8, // 20% chance to mark for review
          timeSpent: Math.floor(Math.random() * 300) + 30 // 30-330 seconds
        };
      }
    });
    
    return answers;
  };

  const runSingleTest = async (testUser: typeof testUsers[0]): Promise<TestResult> => {
    const result: TestResult = {
      studentId: testUser.id,
      studentName: testUser.name,
      status: 'running'
    };

    try {
      // Get questions for the exam set
      const questions = getQuestionsByExamSet(testUser.examSet);
      
      // Generate random answers
      const answers = generateRandomAnswers(questions);
      
      // Calculate score
      const scoreData = calculateScore(answers, questions);
      
      // Determine grade
      const grade = scoreData.percentage >= 90 ? 'A+' : 
                    scoreData.percentage >= 80 ? 'A' : 
                    scoreData.percentage >= 70 ? 'B' : 
                    scoreData.percentage >= 60 ? 'C' : 
                    scoreData.percentage >= 50 ? 'D' : 'F';

      // Create detailed results
      const detailedResults = questions.map(question => {
        const answer = answers[question.id];
        let status: 'correct' | 'incorrect' | 'unanswered' = 'unanswered';
        
        if (answer?.selectedOption !== null && answer?.selectedOption !== undefined) {
          status = answer.selectedOption === question.correctAnswer ? 'correct' : 'incorrect';
        }

        return {
          ...question,
          userAnswer: answer?.selectedOption,
          isMarkedForReview: answer?.isMarkedForReview || false,
          status,
          timeSpent: answer?.timeSpent || 0
        };
      });

      // Calculate section breakdown
      const sectionBreakdown = ['networking', 'wifi-quant'].map(section => {
        const sectionQuestions = detailedResults.filter(q => q.section === section);
        const sectionScore = calculateScore(answers, sectionQuestions);
        
        return {
          section,
          totalQuestions: sectionQuestions.length,
          correctAnswers: sectionScore.correctAnswers,
          wrongAnswers: sectionScore.wrongAnswers,
          unanswered: sectionScore.unanswered,
          totalScore: sectionScore.totalScore,
          maxScore: sectionQuestions.length,
          percentage: sectionScore.percentage
        };
      });

      const examResults = {
        studentId: testUser.id,
        studentName: testUser.name,
        completionTime: new Date().toISOString(),
        totalQuestions: questions.length,
        correctAnswers: scoreData.correctAnswers,
        incorrectAnswers: scoreData.wrongAnswers,
        unanswered: scoreData.unanswered,
        totalScore: scoreData.totalScore,
        maxScore: scoreData.maxScore,
        percentage: scoreData.percentage,
        grade,
        detailedResults,
        sectionBreakdown
      };

      // Save to server
      const saveResponse = await saveResults({
        studentId: testUser.id,
        studentName: testUser.name,
        results: examResults
      });

      if (saveResponse.success) {
        result.status = 'success';
        result.score = scoreData.totalScore;
        result.percentage = scoreData.percentage;
        result.grade = grade;
        result.timestamp = new Date().toLocaleString();
      } else {
        result.status = 'error';
        result.error = saveResponse.message || 'Failed to save results';
      }

    } catch (error) {
      result.status = 'error';
      result.error = error instanceof Error ? error.message : 'Unknown error';
    }

    return result;
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Check server status first
    const isServerOnline = await checkServer();
    if (!isServerOnline) {
      setTestResults(testUsers.map(user => ({
        studentId: user.id,
        studentName: user.name,
        status: 'error' as const,
        error: 'Server is offline'
      })));
      setIsRunning(false);
      return;
    }

    // Initialize results
    const initialResults = testUsers.map(user => ({
      studentId: user.id,
      studentName: user.name,
      status: 'pending' as const
    }));
    setTestResults(initialResults);

    // Run tests sequentially
    for (let i = 0; i < testUsers.length; i++) {
      const testUser = testUsers[i];
      
      // Update status to running
      setTestResults(prev => prev.map(result => 
        result.studentId === testUser.id 
          ? { ...result, status: 'running' }
          : result
      ));

      // Run the test
      const result = await runSingleTest(testUser);
      
      // Update with result
      setTestResults(prev => prev.map(r => 
        r.studentId === testUser.id ? result : r
      ));

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsRunning(false);
  };

  const verifyResults = async () => {
    const response = await getAllResults();
    if (response.success && response.results) {
      const testUserResults = response.results.filter(result => 
        testUsers.some(user => user.id === result.studentId)
      );
      console.log('Test user results found in database:', testUserResults);
      return testUserResults;
    }
    return [];
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <div className="w-4 h-4 rounded-full bg-gray-400"></div>;
      case 'running':
        return <RefreshCw size={16} className="animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'error':
        return <AlertTriangle size={16} className="text-red-600" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return state.highContrast ? 'bg-green-900 border-green-600' : 'bg-green-50 border-green-200';
      case 'error':
        return state.highContrast ? 'bg-red-900 border-red-600' : 'bg-red-50 border-red-200';
      case 'running':
        return state.highContrast ? 'bg-blue-900 border-blue-600' : 'bg-blue-50 border-blue-200';
      default:
        return state.highContrast ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`min-h-screen p-6 ${
      state.highContrast ? 'bg-black text-white' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`${
          state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
        } rounded-2xl p-6 mb-8`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileText size={32} className={state.highContrast ? 'text-green-400' : 'text-green-600'} />
              <div>
                <h1 className={`font-bold ${
                  state.fontSize === 'small' ? 'text-2xl' : 
                  state.fontSize === 'large' ? 'text-4xl' : 'text-3xl'
                }`}>
                  Automated Testing System
                </h1>
                <p className={`${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                  Test database connectivity and exam submission process
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Server Status */}
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                serverStatus === 'online' 
                  ? state.highContrast ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                  : serverStatus === 'offline'
                    ? state.highContrast ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                    : state.highContrast ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                <Database size={16} />
                <span className="text-sm font-medium">
                  {serverStatus === 'online' ? 'Server Online' : 
                   serverStatus === 'offline' ? 'Server Offline' : 'Unknown'}
                </span>
              </div>

              <button
                onClick={checkServer}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  state.highContrast 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Check Server
              </button>
            </div>
          </div>
        </div>

        {/* Test Configuration */}
        <div className={`${
          state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
        } rounded-2xl p-6 mb-8`}>
          <h2 className={`font-bold mb-4 ${
            state.fontSize === 'small' ? 'text-xl' : 
            state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
          }`}>
            Test Configuration
          </h2>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {testUsers.map(user => (
              <div key={user.id} className={`p-4 rounded-lg border ${
                state.highContrast ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Users size={16} />
                  <span className="font-medium">{user.id}</span>
                </div>
                <p className={`text-sm ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                  {user.name}
                </p>
                <p className={`text-xs ${state.highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                  Exam Set: {user.examSet}
                </p>
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                isRunning
                  ? 'opacity-50 cursor-not-allowed'
                  : state.highContrast 
                    ? 'bg-green-800 text-green-200 hover:bg-green-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Running Tests...</span>
                </>
              ) : (
                <>
                  <Play size={16} />
                  <span>Run All Tests</span>
                </>
              )}
            </button>

            <button
              onClick={verifyResults}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                state.highContrast 
                  ? 'bg-blue-800 text-blue-200 hover:bg-blue-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Database size={16} />
              <span>Verify in Database</span>
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className={`${
            state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
          } rounded-2xl p-6`}>
            <h2 className={`font-bold mb-4 ${
              state.fontSize === 'small' ? 'text-xl' : 
              state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
            }`}>
              Test Results
            </h2>

            <div className="space-y-4">
              {testResults.map(result => (
                <div key={result.studentId} className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <h3 className="font-medium">{result.studentId} - {result.studentName}</h3>
                        {result.status === 'success' && (
                          <p className="text-sm">
                            Score: {result.score}/{60} ({result.percentage}%) - Grade: {result.grade}
                          </p>
                        )}
                        {result.status === 'error' && (
                          <p className="text-sm text-red-600">{result.error}</p>
                        )}
                        {result.timestamp && (
                          <p className="text-xs opacity-75">{result.timestamp}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        result.status === 'success' ? 'bg-green-100 text-green-800' :
                        result.status === 'error' ? 'bg-red-100 text-red-800' :
                        result.status === 'running' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {result.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className={`mt-6 p-4 rounded-lg ${
              state.highContrast ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <h3 className="font-medium mb-2">Test Summary</h3>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Total:</span>
                  <span className="ml-2 font-medium">{testResults.length}</span>
                </div>
                <div>
                  <span className="text-green-600">Success:</span>
                  <span className="ml-2 font-medium">{testResults.filter(r => r.status === 'success').length}</span>
                </div>
                <div>
                  <span className="text-red-600">Failed:</span>
                  <span className="ml-2 font-medium">{testResults.filter(r => r.status === 'error').length}</span>
                </div>
                <div>
                  <span className="text-blue-600">Running:</span>
                  <span className="ml-2 font-medium">{testResults.filter(r => r.status === 'running').length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className={`mt-8 p-6 rounded-lg ${
          state.highContrast ? 'bg-blue-900 border border-blue-600' : 'bg-blue-50 border border-blue-200'
        }`}>
          <h3 className={`font-bold mb-2 ${
            state.fontSize === 'small' ? 'text-lg' : 
            state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
          } ${state.highContrast ? 'text-blue-200' : 'text-blue-800'}`}>
            Testing Instructions
          </h3>
          <div className={`space-y-2 ${
            state.fontSize === 'small' ? 'text-sm' : 
            state.fontSize === 'large' ? 'text-lg' : 'text-base'
          } ${state.highContrast ? 'text-blue-200' : 'text-blue-700'}`}>
            <p>1. <strong>Check Server Status:</strong> Ensure the server is online before running tests</p>
            <p>2. <strong>Run Tests:</strong> Click "Run All Tests" to simulate exam submissions for all test users</p>
            <p>3. <strong>Verify Results:</strong> Check that results are stored in the database and visible in admin dashboard</p>
            <p>4. <strong>Test Users:</strong> TEST100, TEST101, and TEST103 with different exam sets</p>
            <p>5. <strong>Random Answers:</strong> Each test generates realistic random answers with ~70% accuracy</p>
          </div>
        </div>
      </div>
    </div>
  );
}