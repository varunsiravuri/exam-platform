import React, { useState, useEffect } from 'react';
import { UserCheck, AlertCircle, Sparkles, Zap } from 'lucide-react';
import { validateStudentAccess } from '../data/examSets';
import { useExam } from '../contexts/ExamContext';

interface LoginPageProps {
  onLogin: (studentId: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { state } = useExam();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay with loading animation
    await new Promise(resolve => setTimeout(resolve, 1500));

    const validationResult = await validateStudentAccess(studentId.trim());

    if (validationResult.isValid) {
      onLogin(studentId.trim());
    } else {
      setError(validationResult.message);
      console.log('Validation failed:', validationResult.message);
    }

    setIsLoading(false);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 particles-bg ${state.highContrast
      ? 'bg-black text-white'
      : 'bg-gradient-to-br from-yellow-50 via-white to-yellow-100'
      }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-yellow-300 rounded-full opacity-15 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-yellow-100 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-yellow-200 rounded-full opacity-15 animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className={`w-full max-w-md transition-all duration-1000 transform ${isVisible ? 'animate-bounce-in' : 'opacity-0 scale-75'
          } ${state.highContrast
            ? 'bg-gray-900 border border-gray-700 shadow-2xl glass-dark'
            : 'bg-white/95 border border-yellow-200/50 shadow-2xl glass backdrop-blur-xl'
          } rounded-3xl p-8 relative overflow-hidden hover-lift`}>

          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 opacity-20 animate-pulse-glow"></div>

          <div className="relative z-10">
            {/* Logo Section with enhanced animations */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                {/* Candela Technologies Logo with floating animation */}
                <div className="w-40 h-24 mx-auto mb-4 flex items-center justify-center animate-float">
                  <img
                    src="/CandelaLogo2.png"
                    alt="Candela Technologies"
                    className="w-full h-full object-contain filter drop-shadow-lg hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Sparkle effects around logo */}
                <div className="absolute -top-2 -right-2 animate-pulse">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="absolute -bottom-2 -left-2 animate-pulse" style={{ animationDelay: '0.5s' }}>
                  <Zap className="w-5 h-5 text-yellow-600" />
                </div>
              </div>

              <h1 className={`font-bold mb-2 animate-slide-in-up stagger-1 ${state.fontSize === 'small' ? 'text-2xl' :
                state.fontSize === 'large' ? 'text-4xl' : 'text-3xl'
                } ${state.highContrast ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-yellow-800 to-gray-900 bg-clip-text text-transparent'}`}>
                Candela Written Test
              </h1>

              <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full mb-4 animate-slide-in-up stagger-2 hover-glow transition-all duration-300 ${state.highContrast ? 'bg-gray-800 text-gray-300' : 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-gray-700'
                }`}>
                <UserCheck size={16} className="animate-pulse" />
                <span className={`font-medium ${state.fontSize === 'small' ? 'text-sm' :
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  }`}>
                  Technical Interview Portal
                </span>
              </div>

              <p className={`animate-slide-in-up stagger-3 ${state.highContrast ? 'text-gray-300' : 'text-gray-600'
                } ${state.fontSize === 'small' ? 'text-sm' :
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                } leading-relaxed`}>
                Welcome to your technical interview assessment. Please enter your candidate credentials to begin.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="animate-slide-in-up stagger-4">
                <label
                  htmlFor="studentId"
                  className={`block font-semibold mb-3 ${state.fontSize === 'small' ? 'text-sm' :
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                    } ${state.highContrast ? 'text-white' : 'text-gray-900'}`}
                >
                  Candidate ID
                </label>
                <div className="relative group">
                  <UserCheck
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${state.highContrast ? 'text-gray-400' : 'text-gray-400 group-focus-within:text-yellow-600 group-focus-within:scale-110'
                      }`}
                    size={20}
                  />
                  <input
                    type="text"
                    id="studentId"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-300 hover-glow ${state.fontSize === 'small' ? 'text-sm' :
                      state.fontSize === 'large' ? 'text-lg' : 'text-base'
                      } ${state.highContrast
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-700 focus:border-gray-400'
                        : 'bg-white/70 border-yellow-200 text-gray-900 placeholder-gray-500 focus:bg-white backdrop-blur-sm'
                      }`}
                    placeholder="Enter your Candidate ID"
                    required
                    autoComplete="username"
                    disabled={isLoading}
                  />
                  {/* Input shimmer effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-focus-within:opacity-100 animate-shimmer pointer-events-none"></div>
                </div>

                {/* Helper text with available test IDs */}
                <div className={`mt-3 p-3 rounded-lg ${state.highContrast ? 'bg-gray-800' : 'bg-yellow-50'
                  }`}>
                  <p className={`text-xs font-medium mb-2 ${state.highContrast ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    Available Test IDs:
                  </p>
                  <div className={`text-xs ${state.highContrast ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    <div className="mb-1">
                      <strong>Production:</strong> A001-A100, B001-B100, C001-C100, D001-D100, E001-E100, F001-F100
                    </div>
                    <div className="mb-1">
                      <strong>Testing (Original):</strong> TEST001-TEST050
                    </div>
                    <div>
                      <strong>Testing (New):</strong> TEST100-TEST200
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className={`flex items-center space-x-3 p-4 rounded-xl border-l-4 animate-slide-in-left ${state.highContrast ? 'bg-red-900/50 border-red-400 text-red-200' : 'bg-red-50 border-red-400 text-red-700'
                  } hover-lift`}>
                  <AlertCircle size={20} className="flex-shrink-0 animate-pulse" />
                  <span className={`${state.fontSize === 'small' ? 'text-sm' :
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                    }`}>
                    {error}
                  </span>
                </div>
              )}

              {studentId.trim().startsWith('TEST') && (
                <div className={`mt-4 p-3 rounded-lg ${state.highContrast ? 'bg-gray-800' : 'bg-blue-50'
                  }`}>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to reset the completion status for this test ID? This will allow you to retake the exam.')) {
                        import('../utils/api').then(api => {
                          api.clearStudentData(studentId.trim());
                          setError('Completion status reset. You can now retry with this test ID.');
                        });
                      }
                    }}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${state.highContrast
                      ? 'bg-blue-700 text-white hover:bg-blue-600'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                  >
                    Reset Test ID Completion Status
                  </button>
                  <p className={`text-xs mt-2 ${state.highContrast ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                    Use this option to reset the completion status for testing purposes.
                  </p>
                </div>
              )}

              <div className="animate-slide-in-up stagger-5">
                <button
                  type="submit"
                  disabled={isLoading || !studentId.trim()}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:scale-105 hover-lift relative overflow-hidden group ${state.fontSize === 'small' ? 'text-sm' :
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                    } ${isLoading || !studentId.trim()
                      ? state.highContrast
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : state.highContrast
                        ? 'bg-white text-black hover:bg-gray-100 focus:ring-4 focus:ring-white/30 shadow-lg'
                        : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 focus:ring-4 focus:ring-yellow-500/30 shadow-lg hover:shadow-2xl'
                    }`}
                >
                  {/* Button shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></div>

                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        <span className="loading-dots">Authenticating</span>
                      </>
                    ) : (
                      <>
                        <UserCheck size={20} className="group-hover:scale-110 transition-transform duration-300" />
                        <span>Begin Interview Assessment</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Branding with animation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-fade-in" style={{ animationDelay: '1s' }}>
        <p className={`text-center ${state.fontSize === 'small' ? 'text-xs' :
          state.fontSize === 'large' ? 'text-base' : 'text-sm'
          } ${state.highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
          Powered by <span className={`font-semibold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent ${state.highContrast ? 'text-white' : ''}`}>Candela Technologies</span>
        </p>
      </div>
    </div>
  );
}
