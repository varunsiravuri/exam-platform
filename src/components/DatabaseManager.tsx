import React, { useState, useEffect } from 'react';
import { Database, Settings, BarChart3, TestTube, AlertTriangle, CheckCircle, ExternalLink, Copy, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useExam } from '../contexts/ExamContext';

export function DatabaseManager() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'online' | 'offline' | 'error'>('checking');
  const [testResults, setTestResults] = useState<any>(null);
  const [showEnvVars, setShowEnvVars] = useState(false);
  const [envVarTest, setEnvVarTest] = useState<any>(null);
  const { state } = useExam();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setConnectionStatus('checking');
    try {
      // Test 1: Check if Netlify Functions are working
      const healthResponse = await fetch('/.netlify/functions/health-check');
      
      if (!healthResponse.ok) {
        setConnectionStatus('error');
        setTestResults({
          error: 'Netlify Functions not responding',
          details: 'Functions may not be deployed or there\'s a configuration issue'
        });
        return;
      }

      // Test 2: Check database connection
      const dbResponse = await fetch('/.netlify/functions/get-results');
      const dbData = await dbResponse.json();

      if (dbResponse.ok && dbData.success) {
        setConnectionStatus('online');
        setTestResults({
          success: true,
          resultCount: dbData.results?.length || 0,
          message: 'Database connected successfully!'
        });
      } else {
        setConnectionStatus('offline');
        setTestResults({
          error: 'Database connection failed',
          details: dbData.message || 'Environment variables may not be configured'
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      setTestResults({
        error: 'Connection test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const testEnvironmentVariables = async () => {
    try {
      // This will help us understand what's happening with the environment variables
      const response = await fetch('/.netlify/functions/health-check');
      const data = await response.json();
      
      setEnvVarTest({
        functionsWorking: response.ok,
        timestamp: data.timestamp,
        status: response.status
      });
    } catch (error) {
      setEnvVarTest({
        functionsWorking: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'checking':
        return <RefreshCw size={24} className="animate-spin text-blue-600" />;
      case 'online':
        return <CheckCircle size={24} className="text-green-600" />;
      case 'offline':
      case 'error':
        return <AlertTriangle size={24} className="text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'online':
        return state.highContrast ? 'bg-green-900 border-green-600 text-green-200' : 'bg-green-50 border-green-200 text-green-800';
      case 'offline':
      case 'error':
        return state.highContrast ? 'bg-red-900 border-red-600 text-red-200' : 'bg-red-50 border-red-200 text-red-800';
      case 'checking':
        return state.highContrast ? 'bg-blue-900 border-blue-600 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-800';
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
          <div className="flex items-center space-x-4">
            <Database size={32} className={state.highContrast ? 'text-blue-400' : 'text-blue-600'} />
            <div>
              <h1 className={`font-bold ${
                state.fontSize === 'small' ? 'text-2xl' : 
                state.fontSize === 'large' ? 'text-4xl' : 'text-3xl'
              }`}>
                Database Connection Manager
              </h1>
              <p className={`${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                Diagnose and fix database connection issues
              </p>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className={`p-6 rounded-lg border mb-8 ${getStatusColor()}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <h2 className={`font-bold ${
                state.fontSize === 'small' ? 'text-xl' : 
                state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
              }`}>
                Connection Status: {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
              </h2>
            </div>
            
            <button
              onClick={checkConnection}
              disabled={connectionStatus === 'checking'}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                connectionStatus === 'checking'
                  ? 'opacity-50 cursor-not-allowed'
                  : state.highContrast 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {connectionStatus === 'checking' ? 'Testing...' : 'Test Connection'}
            </button>
          </div>

          {testResults && (
            <div className={`${
              state.fontSize === 'small' ? 'text-sm' : 
              state.fontSize === 'large' ? 'text-lg' : 'text-base'
            }`}>
              {testResults.success ? (
                <div>
                  <p className="font-medium">{testResults.message}</p>
                  <p>Found {testResults.resultCount} exam results in database</p>
                </div>
              ) : (
                <div>
                  <p className="font-medium mb-2">❌ {testResults.error}</p>
                  <p className="mb-4">{testResults.details}</p>
                  
                  {connectionStatus === 'error' && (
                    <div className={`p-4 rounded-lg ${
                      state.highContrast ? 'bg-gray-800' : 'bg-white'
                    }`}>
                      <h4 className="font-medium mb-2">Possible Solutions:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Check if Netlify Functions are deployed</li>
                        <li>Verify environment variables are set</li>
                        <li>Redeploy your Netlify site</li>
                        <li>Check Netlify function logs for errors</li>
                      </ul>
                    </div>
                  )}
                  
                  {connectionStatus === 'offline' && (
                    <div className={`p-4 rounded-lg ${
                      state.highContrast ? 'bg-gray-800' : 'bg-white'
                    }`}>
                      <h4 className="font-medium mb-2">Database Setup Required:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Create Supabase project</li>
                        <li>Set up database table</li>
                        <li>Configure environment variables in Netlify</li>
                        <li>Redeploy site after adding variables</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Environment Variables Check */}
        <div className={`${
          state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
        } rounded-2xl p-6 mb-8`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`font-bold ${
              state.fontSize === 'small' ? 'text-xl' : 
              state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
            }`}>
              Environment Variables Check
            </h2>
            
            <div className="flex space-x-3">
              <button
                onClick={testEnvironmentVariables}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  state.highContrast 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Test Functions
              </button>
              
              <button
                onClick={() => setShowEnvVars(!showEnvVars)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  state.highContrast 
                    ? 'bg-blue-800 text-blue-200 hover:bg-blue-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {showEnvVars ? <EyeOff size={16} /> : <Eye size={16} />}
                <span>{showEnvVars ? 'Hide' : 'Show'} Setup Guide</span>
              </button>
            </div>
          </div>

          {envVarTest && (
            <div className={`mb-4 p-4 rounded-lg ${
              envVarTest.functionsWorking 
                ? state.highContrast ? 'bg-green-900' : 'bg-green-50'
                : state.highContrast ? 'bg-red-900' : 'bg-red-50'
            }`}>
              <p className="font-medium">
                Netlify Functions: {envVarTest.functionsWorking ? '✅ Working' : '❌ Not Working'}
              </p>
              {envVarTest.timestamp && (
                <p className="text-sm">Last response: {envVarTest.timestamp}</p>
              )}
              {envVarTest.error && (
                <p className="text-sm text-red-600">Error: {envVarTest.error}</p>
              )}
            </div>
          )}

          <div className={`p-4 rounded-lg ${
            state.highContrast ? 'bg-yellow-900 border border-yellow-600' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <h3 className={`font-medium mb-2 ${
              state.fontSize === 'small' ? 'text-base' : 
              state.fontSize === 'large' ? 'text-xl' : 'text-lg'
            } ${state.highContrast ? 'text-yellow-200' : 'text-yellow-800'}`}>
              Required Environment Variables in Netlify
            </h3>
            <div className={`space-y-2 font-mono text-sm ${
              state.highContrast ? 'text-yellow-300' : 'text-yellow-800'
            }`}>
              <div className="flex items-center justify-between">
                <span>SUPABASE_URL = https://your-project-id.supabase.co</span>
                <button
                  onClick={() => copyToClipboard('SUPABASE_URL')}
                  className={`p-1 rounded transition-colors ${
                    state.highContrast ? 'hover:bg-yellow-800' : 'hover:bg-yellow-200'
                  }`}
                >
                  <Copy size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</span>
                <button
                  onClick={() => copyToClipboard('SUPABASE_ANON_KEY')}
                  className={`p-1 rounded transition-colors ${
                    state.highContrast ? 'hover:bg-yellow-800' : 'hover:bg-yellow-200'
                  }`}
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Guide */}
        {showEnvVars && (
          <div className={`${
            state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
          } rounded-2xl p-6 mb-8`}>
            <h2 className={`font-bold mb-6 ${
              state.fontSize === 'small' ? 'text-xl' : 
              state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
            }`}>
              Complete Setup Guide
            </h2>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className={`p-4 rounded-lg border ${
                state.highContrast ? 'bg-gray-800 border-gray-600' : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-2">Check Your Existing Supabase Project</h3>
                    <p className="mb-3">Since you mentioned you already set this up, let's verify:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Go to your Supabase project dashboard</li>
                      <li>Ensure the project is active (not paused)</li>
                      <li>Check that the `exam_results` table exists</li>
                      <li>Verify RLS policies are enabled</li>
                    </ul>
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center space-x-2 mt-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                        state.highContrast 
                          ? 'bg-blue-800 text-blue-200 hover:bg-blue-700' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <ExternalLink size={16} />
                      <span>Open Supabase Dashboard</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`p-4 rounded-lg border ${
                state.highContrast ? 'bg-gray-800 border-gray-600' : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-2">Verify Netlify Environment Variables</h3>
                    <p className="mb-3">Check your Netlify site settings:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm mb-3">
                      <li>Go to your Netlify dashboard</li>
                      <li>Open your site settings</li>
                      <li>Navigate to "Environment variables"</li>
                      <li>Verify both SUPABASE_URL and SUPABASE_ANON_KEY are present</li>
                      <li>Check for any typos in variable names (case-sensitive)</li>
                    </ol>
                    <div className={`p-3 rounded-lg ${
                      state.highContrast ? 'bg-gray-900' : 'bg-gray-100'
                    }`}>
                      <p className="font-medium mb-2">Common Issues:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Variable names have typos (must be exact)</li>
                        <li>Extra spaces in values</li>
                        <li>Using service role key instead of anon key</li>
                        <li>Forgot to redeploy after adding variables</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className={`p-4 rounded-lg border ${
                state.highContrast ? 'bg-gray-800 border-gray-600' : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-2">Redeploy Your Netlify Site</h3>
                    <p className="mb-3">This is crucial - environment variables only take effect after redeployment:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Go to your Netlify site's "Deploys" tab</li>
                      <li>Click "Trigger deploy" → "Deploy site"</li>
                      <li>Wait for deployment to complete</li>
                      <li>Test the connection again</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <a
            href="?admin=true"
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              state.highContrast 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 size={16} />
            <span>Admin Dashboard</span>
          </a>
          
          <a
            href="?automated-testing=true"
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              state.highContrast 
                ? 'bg-green-800 text-green-200 hover:bg-green-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <TestTube size={16} />
            <span>Run Automated Tests</span>
          </a>

          <button
            onClick={checkConnection}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              state.highContrast 
                ? 'bg-blue-800 text-blue-200 hover:bg-blue-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <RefreshCw size={16} />
            <span>Retest Connection</span>
          </button>
        </div>

        {/* Troubleshooting Tips */}
        <div className={`mt-8 p-6 rounded-lg ${
          state.highContrast ? 'bg-blue-900 border border-blue-600' : 'bg-blue-50 border border-blue-200'
        }`}>
          <h3 className={`font-bold mb-3 ${
            state.fontSize === 'small' ? 'text-lg' : 
            state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
          } ${state.highContrast ? 'text-blue-200' : 'text-blue-800'}`}>
            Quick Troubleshooting Checklist
          </h3>
          <div className={`grid md:grid-cols-2 gap-4 ${
            state.fontSize === 'small' ? 'text-sm' : 
            state.fontSize === 'large' ? 'text-lg' : 'text-base'
          } ${state.highContrast ? 'text-blue-200' : 'text-blue-700'}`}>
            <div>
              <h4 className="font-medium mb-2">✅ Check These First:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Supabase project is active</li>
                <li>Environment variables are set in Netlify</li>
                <li>Site was redeployed after adding variables</li>
                <li>No typos in variable names</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🔧 If Still Not Working:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Delete and recreate environment variables</li>
                <li>Check Netlify function logs for errors</li>
                <li>Verify Supabase API keys are correct</li>
                <li>Test with a fresh browser/incognito mode</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}