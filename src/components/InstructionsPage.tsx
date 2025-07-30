import React from 'react';
import { Clock, Shield, AlertTriangle, CheckCircle, UserCheck, BookOpen } from 'lucide-react';
import { useExam } from '../contexts/ExamContext';
import { STUDENTS_WITH_SLOTS } from '../data/examSets';

interface InstructionsPageProps {
  onStartExam: () => void;
}

export function InstructionsPage({ onStartExam }: InstructionsPageProps) {
  const { state } = useExam();

  // Get student information
  const student = state.session ? 
    STUDENTS_WITH_SLOTS.find(s => s.id === state.session!.studentId) 
    : null;
  
  const studentName = student?.name || 'Unknown Candidate';

  const instructions = [
    {
      icon: Clock,
      title: 'Time Management',
      color: 'blue',
      items: [
        'Total assessment duration: 45 minutes',
        'Section 1: Networking and Wi-Fi Fundamentals (40 questions)',
        'Section 2: Wi-Fi Quantitative Assessment (20 questions)', 
        'No separate time limits per section - use the full 45 minutes as needed',
        'Navigate freely between all questions during the exam'
      ]
    },
    {
      icon: Shield,
      title: 'Security Rules',
      color: 'red',
      items: [
        'Do NOT switch tabs or navigate away from this page',
        'You will receive warnings for leaving the tab',
        'Multiple warnings may affect your assessment',
        'Keep this browser window active at all times',
        'Close all other applications and browser tabs'
      ]
    },
    {
      icon: UserCheck,
      title: 'Navigation & Answering',
      color: 'green',
      items: [
        'Use the question panel to jump to any question',
        'Mark questions for review using the flag button',
        'You can change answers until you submit the exam',
        'Questions are randomized for each candidate',
        'All questions are multiple choice with single correct answers'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Important Warnings',
      color: 'orange',
      items: [
        'Warning if you spend more than 5 minutes on one question',
        'Exam ending warnings at 5 minutes remaining',
        'Session timeout after 10 minutes of inactivity',
        'Confirm before submitting your final answers',
        'No changes allowed after submission'
      ]
    }
  ];

  const scoringInfo = [
    {
      icon: CheckCircle,
      title: 'Scoring System',
      color: 'green',
      items: [
        'Correct Answer: +1 point',
        'Wrong Answer: -0.25 points (negative marking)',
        'Unanswered Question: 0 points',
        'Total Questions: 60',
        'Maximum Possible Score: 60 points',
        'Think carefully before answering to avoid negative marking'
      ]
    },
    {
      icon: BookOpen,
      title: 'Exam Content',
      color: 'purple',
      items: [
        'Networking Fundamentals: OSI model, TCP/IP, routing protocols',
        'Wi-Fi Technologies: 802.11 standards, security protocols, MIMO',
        'Network Security: Firewalls, VPNs, authentication methods',
        'Wireless Infrastructure: Access points, controllers, mesh networks',
        'Quantitative Problems: Network calculations, signal strength, capacity planning',
        'Logical Reasoning: Pattern recognition, analogies, problem solving'
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    if (state.highContrast) {
      switch (color) {
        case 'blue':
          return {
            bg: 'bg-blue-900 border-blue-600',
            icon: 'bg-blue-400 text-black',
            text: 'text-blue-200'
          };
        case 'red':
          return {
            bg: 'bg-red-900 border-red-600',
            icon: 'bg-red-400 text-black',
            text: 'text-red-200'
          };
        case 'green':
          return {
            bg: 'bg-green-900 border-green-600',
            icon: 'bg-green-400 text-black',
            text: 'text-green-200'
          };
        case 'orange':
          return {
            bg: 'bg-orange-900 border-orange-600',
            icon: 'bg-orange-400 text-black',
            text: 'text-orange-200'
          };
        case 'purple':
          return {
            bg: 'bg-purple-900 border-purple-600',
            icon: 'bg-purple-400 text-black',
            text: 'text-purple-200'
          };
        default:
          return {
            bg: 'bg-gray-800 border-gray-600',
            icon: 'bg-white text-black',
            text: 'text-gray-300'
          };
      }
    } else {
      switch (color) {
        case 'blue':
          return {
            bg: 'bg-blue-50 border-blue-100',
            icon: 'bg-blue-100 text-blue-700',
            text: 'text-blue-700'
          };
        case 'red':
          return {
            bg: 'bg-red-50 border-red-100',
            icon: 'bg-red-100 text-red-700',
            text: 'text-red-700'
          };
        case 'green':
          return {
            bg: 'bg-green-50 border-green-100',
            icon: 'bg-green-100 text-green-700',
            text: 'text-green-700'
          };
        case 'orange':
          return {
            bg: 'bg-orange-50 border-orange-100',
            icon: 'bg-orange-100 text-orange-700',
            text: 'text-orange-700'
          };
        case 'purple':
          return {
            bg: 'bg-purple-50 border-purple-100',
            icon: 'bg-purple-100 text-purple-700',
            text: 'text-purple-700'
          };
        default:
          return {
            bg: 'bg-gray-50 border-gray-200',
            icon: 'bg-white text-gray-700',
            text: 'text-gray-700'
          };
      }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      state.highContrast ? 'bg-black text-white' : 'bg-white'
    } p-6`}>
      <div className="max-w-6xl mx-auto">
        <div className={`${
          state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-sm border border-gray-100'
        } rounded-lg p-8 mb-8 transition-colors duration-300`}>
          
          {/* Header with Logo */}
          <div className="text-center mb-8">
            <div className="w-48 h-28 mx-auto mb-6 flex items-center justify-center">
              <img 
                src="/CandelaLogo2.png" 
                alt="Candela Technologies" 
                className="w-full h-full object-contain"
              />
            </div>

            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              state.highContrast ? 'bg-green-400 text-black' : 'bg-gray-100 text-gray-700'
            }`}>
              <CheckCircle size={32} />
            </div>
            
            <h1 className={`font-bold mb-2 ${
              state.fontSize === 'small' ? 'text-2xl' : 
              state.fontSize === 'large' ? 'text-4xl' : 'text-3xl'
            } ${state.highContrast ? 'text-white' : 'text-gray-900'}`}>
              Interview Assessment Instructions
            </h1>
            
            {/* Student Information */}
            <div className={`inline-flex flex-col items-center space-y-2 px-6 py-4 rounded-lg mb-4 ${
              state.highContrast ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-600'
            }`}>
              <div className="flex items-center space-x-2">
                <UserCheck size={16} />
                <span className={`font-medium ${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                }`}>
                  Candidate Information
                </span>
              </div>
              <div className="text-center">
                <div className={`font-bold ${
                  state.fontSize === 'small' ? 'text-base' : 
                  state.fontSize === 'large' ? 'text-xl' : 'text-lg'
                }`}>
                  {studentName}
                </div>
                <div className={`${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                }`}>
                  ID: {state.session?.studentId}
                </div>
              </div>
            </div>
            
            <p className={`${
              state.highContrast ? 'text-gray-300' : 'text-gray-600'
            } ${
              state.fontSize === 'small' ? 'text-base' : 
              state.fontSize === 'large' ? 'text-xl' : 'text-lg'
            } max-w-4xl mx-auto leading-relaxed`}>
              Please read all instructions carefully before starting your technical interview assessment. 
              Your understanding of these guidelines is crucial for a successful evaluation experience.
            </p>
          </div>

          {/* Main Instructions Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {instructions.map((section, index) => {
              const IconComponent = section.icon;
              const colorClasses = getColorClasses(section.color);
              
              return (
                <div key={index} className={`p-6 rounded-lg border ${colorClasses.bg}`}>
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg mr-4 ${colorClasses.icon}`}>
                      <IconComponent size={24} />
                    </div>
                    <h3 className={`font-semibold ${
                      state.fontSize === 'small' ? 'text-lg' : 
                      state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
                    } ${state.highContrast ? 'text-white' : 'text-gray-900'}`}>
                      {section.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className={`flex items-start ${
                        state.fontSize === 'small' ? 'text-sm' : 
                        state.fontSize === 'large' ? 'text-lg' : 'text-base'
                      } ${state.highContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className={`inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
                          state.highContrast ? 'bg-white' : 'bg-gray-400'
                        }`}></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Scoring and Content Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {scoringInfo.map((section, index) => {
              const IconComponent = section.icon;
              const colorClasses = getColorClasses(section.color);
              
              return (
                <div key={index} className={`p-6 rounded-lg border ${colorClasses.bg}`}>
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg mr-4 ${colorClasses.icon}`}>
                      <IconComponent size={24} />
                    </div>
                    <h3 className={`font-semibold ${
                      state.fontSize === 'small' ? 'text-lg' : 
                      state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
                    } ${state.highContrast ? 'text-white' : 'text-gray-900'}`}>
                      {section.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className={`flex items-start ${
                        state.fontSize === 'small' ? 'text-sm' : 
                        state.fontSize === 'large' ? 'text-lg' : 'text-base'
                      } ${state.highContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className={`inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
                          state.highContrast ? 'bg-white' : 'bg-gray-400'
                        }`}></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Exam Format Description */}
          <div className={`p-6 rounded-lg mb-8 ${
            state.highContrast ? 'bg-blue-900 border border-blue-600' : 'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex items-start">
              <UserCheck className={`mt-1 mr-4 flex-shrink-0 ${
                state.highContrast ? 'text-blue-300' : 'text-blue-600'
              }`} size={28} />
              <div>
                <h3 className={`font-semibold mb-3 ${
                  state.fontSize === 'small' ? 'text-lg' : 
                  state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
                } ${state.highContrast ? 'text-blue-200' : 'text-blue-800'}`}>
                  Exam Format: 45-Minute Assessment with Negative Marking
                </h3>
                <p className={`${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                } ${state.highContrast ? 'text-blue-200' : 'text-blue-700'} leading-relaxed`}>
                  This is a comprehensive 45-minute assessment with 60 questions total. You have complete freedom to navigate 
                  between all questions throughout the exam. <strong>Important:</strong> There is negative marking - you get +1 for correct answers, 
                  -0.25 for wrong answers, and 0 for unanswered questions. Answer only when you are confident to maximize your score.
                </p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg mb-8 ${
            state.highContrast ? 'bg-yellow-900 border border-yellow-600' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-start">
              <AlertTriangle className={`mt-1 mr-4 flex-shrink-0 ${
                state.highContrast ? 'text-yellow-300' : 'text-yellow-600'
              }`} size={28} />
              <div>
                <h3 className={`font-semibold mb-3 ${
                  state.fontSize === 'small' ? 'text-lg' : 
                  state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
                } ${state.highContrast ? 'text-yellow-200' : 'text-yellow-800'}`}>
                  Critical Security Notice
                </h3>
                <p className={`${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                } ${state.highContrast ? 'text-yellow-200' : 'text-yellow-700'} leading-relaxed`}>
                  Your interview session is being monitored for security violations. Any attempt to leave this page or 
                  switch tabs will result in warnings. Ensure you have a stable internet connection and close all other 
                  applications before starting. <strong>Note:</strong> You cannot retake this exam once completed.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className={`inline-flex items-center space-x-4 p-6 rounded-lg mb-8 ${
              state.highContrast ? 'bg-gray-800 border border-gray-600' : 'bg-gray-50 border border-gray-200'
            }`}>
              <Clock className={state.highContrast ? 'text-gray-300' : 'text-gray-600'} size={32} />
              <div className="text-left">
                <p className={`font-semibold ${
                  state.fontSize === 'small' ? 'text-base' : 
                  state.fontSize === 'large' ? 'text-xl' : 'text-lg'
                } ${state.highContrast ? 'text-white' : 'text-gray-900'}`}>
                  Total Assessment Time: 45 minutes
                </p>
                <p className={`${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                  Once started, the timer cannot be paused
                </p>
              </div>
            </div>

            <button
              onClick={onStartExam}
              className={`px-10 py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 focus:scale-105 ${
                state.fontSize === 'small' ? 'text-base' : 
                state.fontSize === 'large' ? 'text-xl' : 'text-lg'
              } ${
                state.highContrast
                  ? 'bg-white text-black hover:bg-gray-100 focus:ring-4 focus:ring-white/30'
                  : 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-4 focus:ring-gray-900/30'
              } shadow-lg hover:shadow-xl`}
            >
              <span className="flex items-center space-x-3">
                <CheckCircle size={24} />
                <span>I Understand - Begin Assessment</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Branding */}
      <div className="text-center mt-8">
        <p className={`${
          state.fontSize === 'small' ? 'text-xs' : 
          state.fontSize === 'large' ? 'text-base' : 'text-sm'
        } ${state.highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
          Technical Interview Assessment Platform by <span className={`font-semibold ${state.highContrast ? 'text-white' : 'text-gray-900'}`}>Candela Technologies</span>
        </p>
      </div>
    </div>
  );
}