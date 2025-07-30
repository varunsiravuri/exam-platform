import React, { useState, useEffect } from 'react';
import { Trophy, CheckCircle, XCircle, Flag, Clock, Download, Home, Sparkles, Star, Save, AlertCircle } from 'lucide-react';
import { useExam } from '../contexts/ExamContext';
import { QUESTIONS, STUDENTS } from '../data/examData';
import { saveResults, checkServerHealth } from '../utils/api';

interface ResultsSummaryProps {
  studentId: string;
}

export function ResultsSummary({ studentId }: ResultsSummaryProps) {
  const { state } = useExam();
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [serverOnline, setServerOnline] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Show confetti for good grades
    const timer = setTimeout(() => setShowConfetti(true), 1000);
    
    // Check server status
    checkServerHealth().then(setServerOnline);
    
    return () => clearTimeout(timer);
  }, []);

  if (!state.session) {
    return null;
  }

  // Get student name
  const studentName = STUDENTS.find(student => student.id === studentId)?.name || 'Unknown Student';

  // Calculate results
  const totalQuestions = Object.keys(state.session.answers).length;
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let markedForReview = 0;
  let unanswered = 0;

  const detailedResults = QUESTIONS.map(question => {
    const answer = state.session!.answers[question.id];
    let status: 'correct' | 'incorrect' | 'unanswered' = 'unanswered';
    
    if (answer?.selectedOption !== null && answer?.selectedOption !== undefined) {
      status = answer.selectedOption === question.correctAnswer ? 'correct' : 'incorrect';
      if (status === 'correct') correctAnswers++;
      else incorrectAnswers++;
    } else {
      unanswered++;
    }

    if (answer?.isMarkedForReview) {
      markedForReview++;
    }

    return {
      ...question,
      userAnswer: answer?.selectedOption,
      isMarkedForReview: answer?.isMarkedForReview || false,
      status,
      timeSpent: answer?.timeSpent || 0
    };
  });

  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / QUESTIONS.length) * 100) : 0;
  const grade = percentage >= 90 ? 'A+' : 
                percentage >= 80 ? 'A' : 
                percentage >= 70 ? 'B' : 
                percentage >= 60 ? 'C' : 
                percentage >= 50 ? 'D' : 'F';

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return state.highContrast ? 'text-green-300' : 'text-green-600';
      case 'B':
        return state.highContrast ? 'text-blue-300' : 'text-blue-600';
      case 'C':
        return state.highContrast ? 'text-yellow-300' : 'text-yellow-600';
      case 'D':
        return state.highContrast ? 'text-orange-300' : 'text-orange-600';
      default:
        return state.highContrast ? 'text-red-300' : 'text-red-600';
    }
  };

  const saveToServer = async () => {
    if (!serverOnline) {
      setSaveStatus('error');
      return;
    }

    setIsSaving(true);
    setSaveStatus('idle');

    const results = {
      studentId,
      studentName,
      completionTime: new Date().toISOString(),
      totalQuestions: QUESTIONS.length,
      correctAnswers,
      incorrectAnswers,
      unanswered,
      percentage,
      grade,
      detailedResults,
      sectionBreakdown: ['networking', 'wifi-quant'].map(section => {
        const sectionQuestions = detailedResults.filter(q => q.section === section);
        const sectionCorrect = sectionQuestions.filter(q => q.status === 'correct').length;
        const sectionPercentage = sectionQuestions.length > 0 
          ? Math.round((sectionCorrect / sectionQuestions.length) * 100) 
          : 0;
        
        return {
          section,
          totalQuestions: sectionQuestions.length,
          correctAnswers: sectionCorrect,
          percentage: sectionPercentage
        };
      })
    };

    try {
      const response = await saveResults({
        studentId,
        studentName,
        results
      });

      if (response.success) {
        setSaveStatus('success');
        console.log('Results saved to:', response.filepath);
      } else {
        setSaveStatus('error');
        console.error('Failed to save results:', response.message);
      }
    } catch (error) {
      setSaveStatus('error');
      console.error('Error saving results:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const exportResults = () => {
    const results = {
      studentId,
      studentName,
      completionTime: new Date().toISOString(),
      totalQuestions: QUESTIONS.length,
      correctAnswers,
      incorrectAnswers,
      unanswered,
      percentage,
      grade,
      detailedResults
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candela_test_results_${studentId}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen p-6 transition-all duration-500 particles-bg relative overflow-hidden ${
      state.highContrast ? 'bg-black text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      {/* Confetti effect for good grades */}
      {showConfetti && (grade === 'A+' || grade === 'A') && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-float opacity-80"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Floating stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Star
            key={i}
            className="absolute text-yellow-400 opacity-20 animate-pulse"
            size={Math.random() * 15 + 10}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className={`${
          state.highContrast ? 'bg-gray-900 border border-gray-700 glass-dark' : 'bg-white/80 shadow-2xl border border-white/20 glass backdrop-blur-xl'
        } rounded-3xl p-8 mb-8 text-center transition-all duration-1000 transform ${
          isVisible ? 'animate-bounce-in' : 'opacity-0 scale-75'
        } relative overflow-hidden hover-lift`}>
          
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 opacity-20 animate-pulse-glow"></div>
          
          <div className="relative z-10">
            <div className="w-48 h-28 mx-auto mb-6 flex items-center justify-center animate-float">
              <img 
                src="/CandelaLogo2.png" 
                alt="Candela Technologies" 
                className="w-full h-full object-contain filter drop-shadow-lg"
              />
            </div>

            {/* Sparkle effects */}
            <div className="relative mb-6">
              <div className="absolute -top-4 -right-4 animate-pulse">
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="absolute -bottom-4 -left-4 animate-pulse" style={{ animationDelay: '0.5s' }}>
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
            </div>

            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 animate-bounce-in ${
              grade === 'A+' || grade === 'A' 
                ? state.highContrast ? 'bg-green-400 text-black' : 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg'
                : grade === 'B' 
                  ? state.highContrast ? 'bg-blue-400 text-black' : 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg'
                  : state.highContrast ? 'bg-yellow-400 text-black' : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg'
            }`}>
              <Trophy size={40} className="animate-pulse" />
            </div>

            <h1 className={`font-bold mb-2 animate-slide-in-up ${
              state.fontSize === 'small' ? 'text-3xl' : 
              state.fontSize === 'large' ? 'text-5xl' : 'text-4xl'
            } ${state.highContrast ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent'}`}>
              Assessment Complete!
            </h1>

            <div className={`mb-6 animate-slide-in-up stagger-1 ${
              state.fontSize === 'small' ? 'text-lg' : 
              state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
            } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
              <p className="mb-2">
                Congratulations <strong className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{studentName}</strong>!
              </p>
              <p className={`${
                state.fontSize === 'small' ? 'text-base' : 
                state.fontSize === 'large' ? 'text-xl' : 'text-lg'
              }`}>
                Candidate ID: <strong>{studentId}</strong>
              </p>
              <p className="mt-2">
                You have successfully completed your Candela Technologies written test.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-8 animate-bounce-in stagger-2">
              <div className="text-center">
                <div className={`font-bold mb-1 ${getGradeColor(grade)} animate-pulse-glow ${
                  state.fontSize === 'small' ? 'text-4xl' : 
                  state.fontSize === 'large' ? 'text-6xl' : 'text-5xl'
                }`}>
                  {percentage}%
                </div>
                <div className={`font-semibold ${getGradeColor(grade)} ${
                  state.fontSize === 'small' ? 'text-xl' : 
                  state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
                }`}>
                  Grade: {grade}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Server Status */}
        {!serverOnline && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 ${
            state.highContrast ? 'bg-yellow-900 border-yellow-400 text-yellow-200' : 'bg-yellow-50 border-yellow-400 text-yellow-700'
          }`}>
            <div className="flex items-center">
              <AlertCircle size={20} className="mr-2" />
              <span className={`${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              }`}>
                Local server is not running. Results will only be available for download.
              </span>
            </div>
          </div>
        )}

        {/* Save Status */}
        {saveStatus === 'success' && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 ${
            state.highContrast ? 'bg-green-900 border-green-400 text-green-200' : 'bg-green-50 border-green-400 text-green-700'
          }`}>
            <div className="flex items-center">
              <CheckCircle size={20} className="mr-2" />
              <span className={`${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              }`}>
                Results saved successfully to server!
              </span>
            </div>
          </div>
        )}

        {saveStatus === 'error' && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 ${
            state.highContrast ? 'bg-red-900 border-red-400 text-red-200' : 'bg-red-50 border-red-400 text-red-700'
          }`}>
            <div className="flex items-center">
              <XCircle size={20} className="mr-2" />
              <span className={`${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              }`}>
                Failed to save results to server. Please try downloading instead.
              </span>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: CheckCircle, value: correctAnswers, label: 'Correct', color: 'green', delay: '0.1s' },
            { icon: XCircle, value: incorrectAnswers, label: 'Incorrect', color: 'red', delay: '0.2s' },
            { icon: Flag, value: markedForReview, label: 'Reviewed', color: 'yellow', delay: '0.3s' },
            { icon: Clock, value: unanswered, label: 'Skipped', color: 'gray', delay: '0.4s' }
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index}
                className={`p-6 rounded-xl text-center transition-all duration-500 hover:scale-105 hover-lift animate-slide-in-up ${
                  stat.color === 'green' ? (state.highContrast ? 'bg-green-900 border border-green-600' : 'bg-gradient-to-br from-green-50 to-green-100 border border-green-200') :
                  stat.color === 'red' ? (state.highContrast ? 'bg-red-900 border border-red-600' : 'bg-gradient-to-br from-red-50 to-red-100 border border-red-200') :
                  stat.color === 'yellow' ? (state.highContrast ? 'bg-yellow-900 border border-yellow-600' : 'bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200') :
                  (state.highContrast ? 'bg-gray-800 border border-gray-600' : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200')
                }`}
                style={{ animationDelay: stat.delay }}
              >
                <IconComponent className={`mx-auto mb-3 animate-pulse ${
                  stat.color === 'green' ? (state.highContrast ? 'text-green-300' : 'text-green-600') :
                  stat.color === 'red' ? (state.highContrast ? 'text-red-300' : 'text-red-600') :
                  stat.color === 'yellow' ? (state.highContrast ? 'text-yellow-300' : 'text-yellow-600') :
                  (state.highContrast ? 'text-gray-400' : 'text-gray-500')
                }`} size={32} />
                <div className={`font-bold mb-1 ${
                  state.fontSize === 'small' ? 'text-2xl' : 
                  state.fontSize === 'large' ? 'text-4xl' : 'text-3xl'
                } ${
                  stat.color === 'green' ? (state.highContrast ? 'text-green-300' : 'text-green-600') :
                  stat.color === 'red' ? (state.highContrast ? 'text-red-300' : 'text-red-600') :
                  stat.color === 'yellow' ? (state.highContrast ? 'text-yellow-300' : 'text-yellow-600') :
                  (state.highContrast ? 'text-gray-400' : 'text-gray-500')
                }`}>
                  {stat.value}
                </div>
                <div className={`${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                } ${
                  stat.color === 'green' ? (state.highContrast ? 'text-green-200' : 'text-green-700') :
                  stat.color === 'red' ? (state.highContrast ? 'text-red-200' : 'text-red-700') :
                  stat.color === 'yellow' ? (state.highContrast ? 'text-yellow-200' : 'text-yellow-700') :
                  (state.highContrast ? 'text-gray-300' : 'text-gray-600')
                }`}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Breakdown */}
        <div className={`${
          state.highContrast ? 'bg-gray-900 border border-gray-700 glass-dark' : 'bg-white/80 shadow-lg border border-white/20 glass backdrop-blur-xl'
        } rounded-2xl p-6 mb-8 transition-all duration-500 animate-slide-in-up hover-lift`} style={{ animationDelay: '0.6s' }}>
          <h2 className={`font-bold mb-4 ${
            state.fontSize === 'small' ? 'text-xl' : 
            state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
          }`}>
            Section Performance
          </h2>
          
          {['networking', 'wifi-quant'].map((section, index) => {
            const sectionQuestions = detailedResults.filter(q => q.section === section);
            const sectionCorrect = sectionQuestions.filter(q => q.status === 'correct').length;
            const sectionPercentage = sectionQuestions.length > 0 
              ? Math.round((sectionCorrect / sectionQuestions.length) * 100) 
              : 0;
            
            const sectionName = section === 'networking' ? 'Networking and Wi-Fi Fundamentals' : 'Wi-Fi Quantitative Assessment';
            
            return (
              <div 
                key={section} 
                className={`p-4 mb-4 rounded-lg transition-all duration-300 hover:scale-105 animate-fade-in ${
                  state.highContrast ? 'bg-gray-800 border border-gray-600' : 'bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200'
                }`}
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
              >
                <div className="flex justify-between items-center">
                  <h3 className={`font-medium ${
                    state.fontSize === 'small' ? 'text-lg' : 
                    state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
                  }`}>
                    {sectionName}
                  </h3>
                  <div className="text-right">
                    <div className={`font-bold ${
                      state.fontSize === 'small' ? 'text-lg' : 
                      state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
                    }`}>
                      {sectionCorrect}/{sectionQuestions.length}
                    </div>
                    <div className={`${
                      state.fontSize === 'small' ? 'text-sm' : 
                      state.fontSize === 'large' ? 'text-lg' : 'text-base'
                    } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                      {sectionPercentage}%
                    </div>
                  </div>
                </div>
                <div className={`w-full rounded-full h-3 mt-2 overflow-hidden ${
                  state.highContrast ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      sectionPercentage >= 80 
                        ? 'bg-gradient-to-r from-green-400 to-green-500' 
                        : sectionPercentage >= 60 
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                          : 'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                    style={{ 
                      width: `${sectionPercentage}%`,
                      animationDelay: `${1 + index * 0.2}s`
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-up" style={{ animationDelay: '1.2s' }}>
          {serverOnline && (
            <button
              onClick={saveToServer}
              disabled={isSaving || saveStatus === 'success'}
              className={`flex items-center justify-center space-x-2 px-10 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 focus:scale-105 hover-lift relative overflow-hidden group ${
                state.fontSize === 'small' ? 'text-base' : 
                state.fontSize === 'large' ? 'text-xl' : 'text-lg'
              } ${
                isSaving || saveStatus === 'success'
                  ? state.highContrast 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : state.highContrast 
                    ? 'bg-green-800 text-green-200 hover:bg-green-700' 
                    : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
              } shadow-2xl hover:shadow-3xl`}
            >
              {/* Button shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></div>
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span className="relative z-10">Saving...</span>
                </>
              ) : saveStatus === 'success' ? (
                <>
                  <CheckCircle size={20} className="relative z-10" />
                  <span className="relative z-10">Saved to Server</span>
                </>
              ) : (
                <>
                  <Save size={20} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  <span className="relative z-10">Save to Server</span>
                </>
              )}
            </button>
          )}
          
          <button
            onClick={exportResults}
            className={`flex items-center justify-center space-x-2 px-10 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 focus:scale-105 hover-lift relative overflow-hidden group ${
              state.fontSize === 'small' ? 'text-base' : 
              state.fontSize === 'large' ? 'text-xl' : 'text-lg'
            } ${
              state.highContrast 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
            } shadow-2xl hover:shadow-3xl`}
          >
            {/* Button shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></div>
            <Download size={20} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <span className="relative z-10">Download Results</span>
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className={`flex items-center justify-center space-x-2 px-10 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 focus:scale-105 hover-lift ${
              state.fontSize === 'small' ? 'text-base' : 
              state.fontSize === 'large' ? 'text-xl' : 'text-lg'
            } ${
              state.highContrast 
                ? 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700' 
                : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 shadow-lg hover:shadow-xl'
            }`}
          >
            <Home size={20} className="hover:scale-110 transition-transform duration-300" />
            <span>Return to Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}