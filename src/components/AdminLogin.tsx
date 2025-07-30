import React, { useState } from 'react';
import { Shield, Eye, EyeOff, AlertTriangle, User, Lock } from 'lucide-react';
import { useExam } from '../contexts/ExamContext';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useExam();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials
    if (credentials.username === 'admin' && credentials.password === 'lanforge') {
      // Store authentication in sessionStorage (expires when browser closes)
      sessionStorage.setItem('candela_admin_auth', 'true');
      sessionStorage.setItem('candela_admin_timestamp', Date.now().toString());
      onLoginSuccess();
    } else {
      setError('Invalid username or password. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (field: 'username' | 'password', value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${
      state.highContrast 
        ? 'bg-black text-white' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-100'
    }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-indigo-300 rounded-full opacity-15 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-blue-100 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-indigo-200 rounded-full opacity-15 animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className={`transition-all duration-1000 transform animate-bounce-in ${
          state.highContrast 
            ? 'bg-gray-900 border border-gray-700 shadow-2xl glass-dark' 
            : 'bg-white/95 border border-blue-200/50 shadow-2xl glass backdrop-blur-xl'
        } rounded-3xl p-8 relative overflow-hidden hover-lift`}>
          
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-300 via-indigo-400 to-blue-300 opacity-20 animate-pulse-glow"></div>
          
          <div className="relative z-10">
            {/* Logo Section */}
            <div className="text-center mb-8">
              <div className="w-40 h-24 mx-auto mb-4 flex items-center justify-center animate-float">
                <img 
                  src="/CandelaLogo2.png" 
                  alt="Candela Technologies" 
                  className="w-full h-full object-contain filter drop-shadow-lg"
                />
              </div>

              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 animate-bounce-in ${
                state.highContrast ? 'bg-blue-400 text-black' : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
              }`}>
                <Shield size={32} className="animate-pulse" />
              </div>

              <h1 className={`font-bold mb-2 animate-slide-in-up ${
                state.fontSize === 'small' ? 'text-2xl' : 
                state.fontSize === 'large' ? 'text-4xl' : 'text-3xl'
              } ${state.highContrast ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>
                Admin Access
              </h1>
              
              <p className={`animate-slide-in-up stagger-1 ${
                state.highContrast ? 'text-gray-300' : 'text-gray-600'
              } ${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              }`}>
                Enter your credentials to access the admin dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="animate-slide-in-up stagger-2">
                <label 
                  htmlFor="username" 
                  className={`block font-semibold mb-3 ${
                    state.fontSize === 'small' ? 'text-sm' : 
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  } ${state.highContrast ? 'text-white' : 'text-gray-900'}`}
                >
                  Username
                </label>
                <div className="relative group">
                  <User 
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                      state.highContrast ? 'text-gray-400' : 'text-gray-400 group-focus-within:text-blue-600 group-focus-within:scale-110'
                    }`} 
                    size={20} 
                  />
                  <input
                    type="text"
                    id="username"
                    value={credentials.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover-glow ${
                      state.fontSize === 'small' ? 'text-sm' : 
                      state.fontSize === 'large' ? 'text-lg' : 'text-base'
                    } ${
                      state.highContrast 
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-700 focus:border-gray-400' 
                        : 'bg-white/70 border-blue-200 text-gray-900 placeholder-gray-500 focus:bg-white backdrop-blur-sm'
                    }`}
                    placeholder="Enter username"
                    required
                    autoComplete="username"
                    disabled={isLoading}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-focus-within:opacity-100 animate-shimmer pointer-events-none"></div>
                </div>
              </div>

              {/* Password Field */}
              <div className="animate-slide-in-up stagger-3">
                <label 
                  htmlFor="password" 
                  className={`block font-semibold mb-3 ${
                    state.fontSize === 'small' ? 'text-sm' : 
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  } ${state.highContrast ? 'text-white' : 'text-gray-900'}`}
                >
                  Password
                </label>
                <div className="relative group">
                  <Lock 
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                      state.highContrast ? 'text-gray-400' : 'text-gray-400 group-focus-within:text-blue-600 group-focus-within:scale-110'
                    }`} 
                    size={20} 
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={credentials.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover-glow ${
                      state.fontSize === 'small' ? 'text-sm' : 
                      state.fontSize === 'large' ? 'text-lg' : 'text-base'
                    } ${
                      state.highContrast 
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-700 focus:border-gray-400' 
                        : 'bg-white/70 border-blue-200 text-gray-900 placeholder-gray-500 focus:bg-white backdrop-blur-sm'
                    }`}
                    placeholder="Enter password"
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                      state.highContrast ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-blue-600'
                    }`}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-focus-within:opacity-100 animate-shimmer pointer-events-none"></div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className={`flex items-center space-x-3 p-4 rounded-xl border-l-4 animate-slide-in-left ${
                  state.highContrast ? 'bg-red-900/50 border-red-400 text-red-200' : 'bg-red-50 border-red-400 text-red-700'
                } hover-lift`}>
                  <AlertTriangle size={20} className="flex-shrink-0 animate-pulse" />
                  <span className={`${
                    state.fontSize === 'small' ? 'text-sm' : 
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  }`}>
                    {error}
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <div className="animate-slide-in-up stagger-4">
                <button
                  type="submit"
                  disabled={isLoading || !credentials.username.trim() || !credentials.password.trim()}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:scale-105 hover-lift relative overflow-hidden group ${
                    state.fontSize === 'small' ? 'text-sm' : 
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  } ${
                    isLoading || !credentials.username.trim() || !credentials.password.trim()
                      ? state.highContrast 
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : state.highContrast
                        ? 'bg-white text-black hover:bg-gray-200 focus:ring-4 focus:ring-white/30 shadow-lg'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500/30 shadow-lg hover:shadow-2xl'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></div>
                  
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        <span className="loading-dots">Authenticating</span>
                      </>
                    ) : (
                      <>
                        <Shield size={20} className="group-hover:scale-110 transition-transform duration-300" />
                        <span>Access Admin Dashboard</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>

            {/* Security Notice */}
            <div className={`mt-6 p-4 rounded-lg animate-slide-in-up stagger-5 ${
              state.highContrast ? 'bg-gray-800 border border-gray-600' : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className="flex items-start space-x-3">
                <Shield size={16} className={`mt-1 flex-shrink-0 ${
                  state.highContrast ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <div>
                  <p className={`font-medium mb-1 ${
                    state.fontSize === 'small' ? 'text-sm' : 
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  } ${state.highContrast ? 'text-blue-200' : 'text-blue-800'}`}>
                    Secure Access
                  </p>
                  <p className={`${
                    state.fontSize === 'small' ? 'text-xs' : 
                    state.fontSize === 'large' ? 'text-base' : 'text-sm'
                  } ${state.highContrast ? 'text-blue-300' : 'text-blue-700'}`}>
                    Your session will expire when you close the browser for security.
                  </p>
                </div>
              </div>
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
          Powered by <span className={`font-semibold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent ${state.highContrast ? 'text-white' : ''}`}>Candela Technologies</span>
        </p>
      </div>
    </div>
  );
}