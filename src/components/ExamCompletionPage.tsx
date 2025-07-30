import React, { useEffect, useState } from 'react';
import { CheckCircle, Trophy, Sparkles, Star, AlertTriangle } from 'lucide-react';
import { useExam } from '../contexts/ExamContext';
import { STUDENTS_WITH_SLOTS, markExamAsCompleted } from '../data/examSets';
import { saveResults, checkServerHealth } from '../utils/api';
import { calculateScore } from '../data/examData';

interface ExamCompletionPageProps {
  studentId: string;
}

export function ExamCompletionPage({ studentId }: ExamCompletionPageProps) {
  const { state } = useExam();
  const [saveStatus, setSaveStatus] = useState<'saving' | 'success' | 'error' | 'duplicate'>('saving');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Mark exam as completed to prevent retakes
    markExamAsCompleted(studentId);
    
    // Save results to server if available
    if (state.session) {
      saveExamResults();
    }
  }, [studentId, state.session]);

  const saveExamResults = async () => {
    if (!state.session) return;

    const student = STUDENTS_WITH_SLOTS.find(s => s.id === studentId);
    const studentName = student?.name || 'Unknown Student';

    // Calculate score using new scoring system
    const scoreData = calculateScore(state.session.answers, state.questions);
    
    const grade = scoreData.percentage >= 90 ? 'A+' : 
                  scoreData.percentage >= 80 ? 'A' : 
                  scoreData.percentage >= 70 ? 'B' : 
                  scoreData.percentage >= 60 ? 'C' : 
                  scoreData.percentage >= 50 ? 'D' : 'F';

    const detailedResults = state.questions.map(question => {
      const answer = state.session!.answers[question.id];
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

    // Calculate section breakdown with proper scoring
    const sectionBreakdown = ['networking', 'wifi-quant'].map(section => {
      const sectionQuestions = detailedResults.filter(q => q.section === section);
      const sectionScore = calculateScore(
        state.session!.answers, 
        sectionQuestions
      );
      
      return {
        section,
        totalQuestions: sectionQuestions.length,
        correctAnswers: sectionScore.correctAnswers,
        wrongAnswers: sectionScore.wrongAnswers,
        unanswered: sectionScore.unanswered,
        totalScore: sectionScore.totalScore,
        maxScore: sectionQuestions.length, // Max possible score for this section
        percentage: sectionScore.percentage
      };
    });

    const results = {
      studentId,
      studentName,
      completionTime: new Date().toISOString(),
      totalQuestions: state.questions.length,
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

    try {
      const serverOnline = await checkServerHealth();
      if (serverOnline) {
        const response = await saveResults({
          studentId,
          studentName,
          results
        });
        
        if (response.success) {
          setSaveStatus('success');
          console.log('Results saved to server successfully');
        } else if (response.code === 'EXAM_ALREADY_COMPLETED') {
          setSaveStatus('duplicate');
          setErrorMessage('This exam has already been completed. Retakes are not allowed.');
        } else {
          setSaveStatus('error');
          setErrorMessage(response.message || 'Failed to save results');
        }
      } else {
        setSaveStatus('error');
        setErrorMessage('Server is offline. Results could not be saved.');
      }
    } catch (error) {
      setSaveStatus('error');
      setErrorMessage('Failed to save results: ' + (error instanceof Error ? error.message : 'Unknown error'));
      console.error('Failed to save results:', error);
    }
  };

  const student = STUDENTS_WITH_SLOTS.find(s => s.id === studentId);
  const studentName = student?.name || 'Unknown Student';

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 particles-bg ${
      state.highContrast 
        ? 'bg-black text-white' 
        : 'bg-gradient-to-br from-green-50 via-white to-blue-50'
    }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-blue-300 rounded-full opacity-15 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-green-100 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-blue-200 rounded-full opacity-15 animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Floating stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <Star
            key={i}
            className="absolute text-green-400 opacity-30 animate-pulse"
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

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className={`w-full max-w-2xl transition-all duration-1000 transform animate-bounce-in ${
          state.highContrast 
            ? 'bg-gray-900 border border-gray-700 shadow-2xl glass-dark' 
            : 'bg-white/95 border border-green-200/50 shadow-2xl glass backdrop-blur-xl'
        } rounded-3xl p-8 relative overflow-hidden hover-lift`}>
          
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-300 via-blue-400 to-green-300 opacity-20 animate-pulse-glow"></div>
          
          <div className="relative z-10 text-center">
            {/* Logo Section */}
            <div className="mb-8">
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
                  <Sparkles className="w-8 h-8 text-green-500" />
                </div>
                <div className="absolute -bottom-4 -left-4 animate-pulse" style={{ animationDelay: '0.5s' }}>
                  <Sparkles className="w-6 h-6 text-blue-500" />
                </div>
              </div>

              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 animate-bounce-in ${
                saveStatus === 'success' 
                  ? state.highContrast ? 'bg-green-400 text-black' : 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg'
                  : saveStatus === 'duplicate'
                    ? state.highContrast ? 'bg-yellow-400 text-black' : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg'
                    : saveStatus === 'error'
                      ? state.highContrast ? 'bg-red-400 text-black' : 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg'
                      : state.highContrast ? 'bg-blue-400 text-black' : 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg'
              }`}>
                {saveStatus === 'success' ? (
                  <CheckCircle size={40} className="animate-pulse" />
                ) : saveStatus === 'duplicate' || saveStatus === 'error' ? (
                  <AlertTriangle size={40} className="animate-pulse" />
                ) : (
                  <div className="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
            </div>

            {/* Main Message */}
            <h1 className={`font-bold mb-4 animate-slide-in-up ${
              state.fontSize === 'small' ? 'text-3xl' : 
              state.fontSize === 'large' ? 'text-5xl' : 'text-4xl'
            } ${state.highContrast ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-green-900 to-blue-900 bg-clip-text text-transparent'}`}>
              {saveStatus === 'duplicate' ? 'Already Completed!' : 'Assessment Complete!'}
            </h1>

            <div className={`mb-8 animate-slide-in-up stagger-1 ${
              state.fontSize === 'small' ? 'text-lg' : 
              state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
            } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
              <p className="mb-4">
                Thank you <strong className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">{studentName}</strong>!
              </p>
              <p className={`${
                state.fontSize === 'small' ? 'text-base' : 
                state.fontSize === 'large' ? 'text-xl' : 'text-lg'
              }`}>
                Candidate ID: <strong>{studentId}</strong>
              </p>
            </div>

            {/* Status Message */}
            <div className={`p-6 rounded-xl mb-8 animate-slide-in-up stagger-2 ${
              saveStatus === 'success' 
                ? state.highContrast ? 'bg-green-900 border border-green-600' : 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200'
                : saveStatus === 'duplicate'
                  ? state.highContrast ? 'bg-yellow-900 border border-yellow-600' : 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200'
                  : saveStatus === 'error'
                    ? state.highContrast ? 'bg-red-900 border border-red-600' : 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200'
                    : state.highContrast ? 'bg-blue-900 border border-blue-600' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'
            }`}>
              <div className="flex items-center justify-center mb-4">
                {saveStatus === 'success' ? (
                  <>
                    <Trophy className={`mr-3 ${state.highContrast ? 'text-green-300' : 'text-green-600'}`} size={32} />
                    <h2 className={`font-bold ${
                      state.fontSize === 'small' ? 'text-xl' : 
                      state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
                    } ${state.highContrast ? 'text-green-200' : 'text-green-800'}`}>
                      Submission Successful
                    </h2>
                  </>
                ) : saveStatus === 'duplicate' ? (
                  <>
                    <AlertTriangle className={`mr-3 ${state.highContrast ? 'text-yellow-300' : 'text-yellow-600'}`} size={32} />
                    <h2 className={`font-bold ${
                      state.fontSize === 'small' ? 'text-xl' : 
                      state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
                    } ${state.highContrast ? 'text-yellow-200' : 'text-yellow-800'}`}>
                      Already Submitted
                    </h2>
                  </>
                ) : saveStatus === 'error' ? (
                  <>
                    <AlertTriangle className={`mr-3 ${state.highContrast ? 'text-red-300' : 'text-red-600'}`} size={32} />
                    <h2 className={`font-bold ${
                      state.fontSize === 'small' ? 'text-xl' : 
                      state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
                    } ${state.highContrast ? 'text-red-200' : 'text-red-800'}`}>
                      Submission Error
                    </h2>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin mr-3"></div>
                    <h2 className={`font-bold ${
                      state.fontSize === 'small' ? 'text-xl' : 
                      state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
                    } ${state.highContrast ? 'text-blue-200' : 'text-blue-800'}`}>
                      Saving Results...
                    </h2>
                  </>
                )}
              </div>
              
              <p className={`${
                state.fontSize === 'small' ? 'text-base' : 
                state.fontSize === 'large' ? 'text-xl' : 'text-lg'
              } ${
                saveStatus === 'success' 
                  ? state.highContrast ? 'text-green-200' : 'text-green-700'
                  : saveStatus === 'duplicate'
                    ? state.highContrast ? 'text-yellow-200' : 'text-yellow-700'
                    : saveStatus === 'error'
                      ? state.highContrast ? 'text-red-200' : 'text-red-700'
                      : state.highContrast ? 'text-blue-200' : 'text-blue-700'
              } leading-relaxed`}>
                {saveStatus === 'success' 
                  ? 'You have successfully completed your Candela Technologies technical interview assessment. Your responses have been recorded and will be reviewed by our technical team.'
                  : saveStatus === 'duplicate'
                    ? errorMessage || 'This exam has already been completed. You cannot retake the assessment.'
                    : saveStatus === 'error'
                      ? errorMessage || 'There was an issue saving your results. Please contact the exam administrator.'
                      : 'Please wait while we save your exam results...'
                }
              </p>
            </div>

            {/* Important Notice */}
            <div className={`p-6 rounded-xl mb-8 animate-slide-in-up stagger-3 ${
              state.highContrast ? 'bg-blue-900 border border-blue-600' : 'bg-blue-50 border border-blue-200'
            }`}>
              <h3 className={`font-semibold mb-3 ${
                state.fontSize === 'small' ? 'text-lg' : 
                state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
              } ${state.highContrast ? 'text-blue-200' : 'text-blue-800'}`}>
                What Happens Next?
              </h3>
              
              <ul className={`text-left space-y-2 ${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              } ${state.highContrast ? 'text-blue-200' : 'text-blue-700'}`}>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-current mt-2 mr-3 flex-shrink-0"></span>
                  Our technical team will review your assessment
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-current mt-2 mr-3 flex-shrink-0"></span>
                  You will be contacted within 3-5 business days
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-current mt-2 mr-3 flex-shrink-0"></span>
                  Please check your email for further communication
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-current mt-2 mr-3 flex-shrink-0"></span>
                  You cannot retake this assessment
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className={`p-4 rounded-lg animate-slide-in-up stagger-4 ${
              state.highContrast ? 'bg-gray-800 border border-gray-600' : 'bg-gray-50 border border-gray-200'
            }`}>
              <p className={`${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                If you have any questions about your assessment, please contact our HR team.
              </p>
            </div>

            {/* Close Button */}
            <div className="mt-8 animate-slide-in-up stagger-5">
              <button
                onClick={() => window.close()}
                className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 focus:scale-105 hover-lift ${
                  state.fontSize === 'small' ? 'text-base' : 
                  state.fontSize === 'large' ? 'text-xl' : 'text-lg'
                } ${
                  state.highContrast 
                    ? 'bg-white text-black hover:bg-gray-200' 
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                } shadow-lg hover:shadow-xl`}
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Branding */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-fade-in" style={{ animationDelay: '1s' }}>
        <p className={`text-center ${
          state.fontSize === 'small' ? 'text-xs' : 
          state.fontSize === 'large' ? 'text-base' : 'text-sm'
        } ${state.highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
          Powered by <span className={`font-semibold bg-gradient-to-r from-green-600 to-blue-700 bg-clip-text text-transparent ${state.highContrast ? 'text-white' : ''}`}>Candela Technologies</span>
        </p>
      </div>
    </div>
  );
}