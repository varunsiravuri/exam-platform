import React, { useState } from 'react';
import { Play, Users, Download, Settings, CheckCircle, ExternalLink, Database } from 'lucide-react';
import { useExam } from '../contexts/ExamContext';

export function TestingPanel() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const { state } = useExam();

  const runQuickTest = async () => {
    setIsRunningTest(true);
    
    // Simulate a quick test exam completion
    const mockResult = {
      studentId: 'TEST100',
      studentName: 'Test User Alpha',
      completionTime: new Date().toISOString(),
      totalQuestions: 60,
      correctAnswers: 45,
      incorrectAnswers: 10,
      unanswered: 5,
      percentage: 75,
      grade: 'B',
      examSet: 'SET_A',
      slotId: 'SLOT_1'
    };

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setTestResults(prev => [...prev, mockResult]);
    setIsRunningTest(false);
  };

  const generateDemoLinks = () => {
    const demoLinks = [
      `${window.location.origin}?student=TEST100`,
      `${window.location.origin}?student=TEST101`,
      `${window.location.origin}?student=TEST102`,
      `${window.location.origin}?student=TEST150`,
      `${window.location.origin}?student=TEST200`,
    ];

    const csvContent = [
      'Student ID,Demo Link,Exam Set',
      ...demoLinks.map((link, index) => {
        const studentIds = ['TEST100', 'TEST101', 'TEST102', 'TEST150', 'TEST200'];
        const examSets = ['SET_A', 'SET_B', 'SET_C', 'SET_D', 'SET_E'];
        return `${studentIds[index]},"${link}",${examSets[index]}`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test_links_TEST100-200_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          <div className="flex items-center space-x-4">
            <Settings size={32} className={state.highContrast ? 'text-green-400' : 'text-green-600'} />
            <div>
              <h1 className={`font-bold ${
                state.fontSize === 'small' ? 'text-2xl' : 
                state.fontSize === 'large' ? 'text-4xl' : 'text-3xl'
              }`}>
                Testing & Demo Panel
              </h1>
              <p className={`${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                Run demo tests and generate sample data
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className={`p-6 rounded-xl ${
            state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
          }`}>
            <h3 className={`font-bold mb-4 ${
              state.fontSize === 'small' ? 'text-lg' : 
              state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
            }`}>
              Quick Demo Test
            </h3>
            <p className={`mb-4 ${
              state.fontSize === 'small' ? 'text-sm' : 
              state.fontSize === 'large' ? 'text-lg' : 'text-base'
            } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
              Simulate a complete exam submission to test the results system
            </p>
            <button
              onClick={runQuickTest}
              disabled={isRunningTest}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              } ${
                isRunningTest
                  ? state.highContrast ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                  : state.highContrast ? 'bg-green-800 text-green-200 hover:bg-green-700' : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isRunningTest ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Running Test...</span>
                </>
              ) : (
                <>
                  <Play size={16} />
                  <span>Run Demo Test</span>
                </>
              )}
            </button>
          </div>

          <div className={`p-6 rounded-xl ${
            state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
          }`}>
            <h3 className={`font-bold mb-4 ${
              state.fontSize === 'small' ? 'text-lg' : 
              state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
            }`}>
              Automated Testing
            </h3>
            <p className={`mb-4 ${
              state.fontSize === 'small' ? 'text-sm' : 
              state.fontSize === 'large' ? 'text-lg' : 'text-base'
            } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
              Run comprehensive tests with TEST100-TEST200 users
            </p>
            <a
              href="?automated-testing=true"
              className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              } ${
                state.highContrast ? 'bg-blue-800 text-blue-200 hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <ExternalLink size={16} />
              <span>Open Automated Testing</span>
            </a>
          </div>
        </div>

        {/* Dashboard Access */}
        <div className={`${
          state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
        } rounded-2xl p-6 mb-8`}>
          <h3 className={`font-bold mb-4 ${
            state.fontSize === 'small' ? 'text-lg' : 
            state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
          }`}>
            Dashboard Access Links
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${
              state.highContrast ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <h4 className={`font-medium mb-2 ${
                state.fontSize === 'small' ? 'text-base' : 
                state.fontSize === 'large' ? 'text-xl' : 'text-lg'
              }`}>
                Admin Dashboard
              </h4>
              <p className={`text-sm mb-3 ${
                state.highContrast ? 'text-gray-400' : 'text-gray-600'
              }`}>
                View results, analytics, and export data
              </p>
              <a
                href="?admin=true"
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                } ${
                  state.highContrast ? 'bg-green-800 text-green-200 hover:bg-green-700' : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <Users size={16} />
                <span>Open Admin Dashboard</span>
              </a>
            </div>

            <div className={`p-4 rounded-lg ${
              state.highContrast ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <h4 className={`font-medium mb-2 ${
                state.fontSize === 'small' ? 'text-base' : 
                state.fontSize === 'large' ? 'text-xl' : 'text-lg'
              }`}>
                Database Manager
              </h4>
              <p className={`text-sm mb-3 ${
                state.highContrast ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Check database connection and troubleshoot issues
              </p>
              <a
                href="?database-manager=true"
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                } ${
                  state.highContrast ? 'bg-blue-800 text-blue-200 hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Database size={16} />
                <span>Open Database Manager</span>
              </a>
            </div>
          </div>
        </div>

        {/* Test Users Information */}
        <div className={`${
          state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
        } rounded-2xl p-6 mb-8`}>
          <h3 className={`font-bold mb-4 ${
            state.fontSize === 'small' ? 'text-lg' : 
            state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
          }`}>
            Available Test Users (TEST100-TEST200)
          </h3>
          
          <div className="mb-4">
            <p className={`${
              state.fontSize === 'small' ? 'text-sm' : 
              state.fontSize === 'large' ? 'text-lg' : 'text-base'
            } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
              101 test users are available from TEST100 to TEST200. Each user is assigned to one of the six exam sets in rotation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className={`p-4 rounded-lg border ${
              state.highContrast ? 'bg-gray-800 border-gray-600' : 'bg-green-50 border-green-200'
            }`}>
              <h4 className="font-medium text-green-600">TEST100</h4>
              <p className="text-sm">Test User 100</p>
              <p className="text-xs opacity-75">Exam Set: SET_A</p>
            </div>
            
            <div className={`p-4 rounded-lg border ${
              state.highContrast ? 'bg-gray-800 border-gray-600' : 'bg-blue-50 border-blue-200'
            }`}>
              <h4 className="font-medium text-blue-600">TEST150</h4>
              <p className="text-sm">Test User 150</p>
              <p className="text-xs opacity-75">Exam Set: SET_D</p>
            </div>
            
            <div className={`p-4 rounded-lg border ${
              state.highContrast ? 'bg-gray-800 border-gray-600' : 'bg-purple-50 border-purple-200'
            }`}>
              <h4 className="font-medium text-purple-600">TEST200</h4>
              <p className="text-sm">Test User 200</p>
              <p className="text-xs opacity-75">Exam Set: SET_E</p>
            </div>
          </div>
          
          <button
            onClick={generateDemoLinks}
            className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              state.fontSize === 'small' ? 'text-sm' : 
              state.fontSize === 'large' ? 'text-lg' : 'text-base'
            } ${
              state.highContrast ? 'bg-yellow-800 text-yellow-200 hover:bg-yellow-700' : 'bg-yellow-600 text-white hover:bg-yellow-700'
            }`}
          >
            <Download size={16} />
            <span>Export Test User Links (CSV)</span>
          </button>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className={`${
            state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
          } rounded-2xl p-6`}>
            <h3 className={`font-bold mb-4 ${
              state.fontSize === 'small' ? 'text-lg' : 
              state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
            }`}>
              Demo Test Results
            </h3>
            
            {testResults.map((result, index) => (
              <div key={index} className={`p-4 rounded-lg mb-4 ${
                state.highContrast ? 'bg-gray-800' : 'bg-green-50'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className={`font-medium ${
                    state.fontSize === 'small' ? 'text-base' : 
                    state.fontSize === 'large' ? 'text-xl' : 'text-lg'
                  }`}>
                    Test Completed Successfully
                  </span>
                </div>
                <div className={`grid md:grid-cols-4 gap-4 text-sm ${
                  state.highContrast ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <div>Student: {result.studentId}</div>
                  <div>Score: {result.percentage}%</div>
                  <div>Grade: {result.grade}</div>
                  <div>Set: {result.examSet}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}