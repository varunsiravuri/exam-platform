import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, AlertTriangle, RefreshCw, Settings, Eye, EyeOff, Copy, ExternalLink } from 'lucide-react';
import { useExam } from '../contexts/ExamContext';

interface ConnectionConfig {
  supabaseUrl: string;
  supabaseKey: string;
}

interface ConnectionTest {
  status: 'idle' | 'testing' | 'success' | 'error';
  message: string;
  details?: {
    functionsWorking: boolean;
    databaseConnected: boolean;
    resultCount: number;
    latency?: number;
  };
}

export function DatabaseConnectionPanel() {
  const [config, setConfig] = useState<ConnectionConfig>({
    supabaseUrl: '',
    supabaseKey: ''
  });
  const [showKey, setShowKey] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTest>({
    status: 'idle',
    message: ''
  });
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  const { state } = useExam();

  // Load saved config from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('candela_db_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(parsed);
      } catch (error) {
        console.error('Failed to load saved config:', error);
      }
    }
  }, []);

  const saveConfig = () => {
    localStorage.setItem('candela_db_config', JSON.stringify(config));
  };

  const testConnection = async () => {
    setTestResult({ status: 'testing', message: 'Testing database connection...' });
    const startTime = Date.now();

    try {
      // Test 1: Health check
      const healthResponse = await fetch('/.netlify/functions/health-check');
      if (!healthResponse.ok) {
        throw new Error('Netlify Functions not responding');
      }

      // Test 2: Database connection
      const dbResponse = await fetch('/.netlify/functions/get-results');
      const dbData = await dbResponse.json();
      const latency = Date.now() - startTime;

      if (dbResponse.ok && dbData.success) {
        setTestResult({
          status: 'success',
          message: `Database connected successfully! Response time: ${latency}ms`,
          details: {
            functionsWorking: true,
            databaseConnected: true,
            resultCount: dbData.results?.length || 0,
            latency
          }
        });
      } else {
        setTestResult({
          status: 'error',
          message: `Database connection failed: ${dbData.message || 'Unknown error'}`,
          details: {
            functionsWorking: true,
            databaseConnected: false,
            resultCount: 0,
            latency
          }
        });
      }
    } catch (error) {
      const latency = Date.now() - startTime;
      setTestResult({
        status: 'error',
        message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: {
          functionsWorking: false,
          databaseConnected: false,
          resultCount: 0,
          latency
        }
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusIcon = () => {
    switch (testResult.status) {
      case 'testing':
        return <RefreshCw size={20} className="animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'error':
        return <AlertTriangle size={20} className="text-red-600" />;
      default:
        return <Database size={20} className={state.highContrast ? 'text-gray-400' : 'text-gray-600'} />;
    }
  };

  const getStatusColor = () => {
    switch (testResult.status) {
      case 'success':
        return state.highContrast ? 'bg-green-900 border-green-600 text-green-200' : 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return state.highContrast ? 'bg-red-900 border-red-600 text-red-200' : 'bg-red-50 border-red-200 text-red-800';
      case 'testing':
        return state.highContrast ? 'bg-blue-900 border-blue-600 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return state.highContrast ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className={`${
      state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
    } rounded-2xl p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Database size={24} className={state.highContrast ? 'text-blue-400' : 'text-blue-600'} />
          <h2 className={`font-bold ${
            state.fontSize === 'small' ? 'text-xl' : 
            state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
          }`}>
            Database Connection Manager
          </h2>
        </div>
        
        <button
          onClick={() => setIsConfigExpanded(!isConfigExpanded)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            state.highContrast 
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Settings size={16} />
          <span>Configure</span>
        </button>
      </div>

      {/* Configuration Panel */}
      {isConfigExpanded && (
        <div className={`mb-6 p-4 rounded-lg border ${
          state.highContrast ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <h3 className={`font-medium mb-4 ${
            state.fontSize === 'small' ? 'text-lg' : 
            state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
          }`}>
            Database Configuration
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className={`block font-medium mb-2 ${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              }`}>
                Supabase URL
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={config.supabaseUrl}
                  onChange={(e) => setConfig(prev => ({ ...prev, supabaseUrl: e.target.value }))}
                  placeholder="https://your-project-id.supabase.co"
                  className={`flex-1 px-3 py-2 border rounded-lg ${
                    state.highContrast 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <button
                  onClick={() => copyToClipboard(config.supabaseUrl)}
                  className={`p-2 rounded-lg transition-colors ${
                    state.highContrast ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                  title="Copy URL"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <div>
              <label className={`block font-medium mb-2 ${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              }`}>
                Supabase Anon Key
              </label>
              <div className="flex space-x-2">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={config.supabaseKey}
                  onChange={(e) => setConfig(prev => ({ ...prev, supabaseKey: e.target.value }))}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className={`flex-1 px-3 py-2 border rounded-lg ${
                    state.highContrast 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className={`p-2 rounded-lg transition-colors ${
                    state.highContrast ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  onClick={() => copyToClipboard(config.supabaseKey)}
                  className={`p-2 rounded-lg transition-colors ${
                    state.highContrast ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                  title="Copy key"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={saveConfig}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  state.highContrast 
                    ? 'bg-green-800 text-green-200 hover:bg-green-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                Save Configuration
              </button>
              
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  state.highContrast 
                    ? 'bg-blue-800 text-blue-200 hover:bg-blue-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <ExternalLink size={16} />
                <span>Open Supabase</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Connection Test */}
      <div className={`p-4 rounded-lg border ${getStatusColor()}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <h3 className={`font-medium ${
              state.fontSize === 'small' ? 'text-lg' : 
              state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
            }`}>
              Connection Status
            </h3>
          </div>
          
          <button
            onClick={testConnection}
            disabled={testResult.status === 'testing'}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              testResult.status === 'testing'
                ? 'opacity-50 cursor-not-allowed'
                : state.highContrast 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {testResult.status === 'testing' ? 'Testing...' : 'Test Connection'}
          </button>
        </div>

        {testResult.message && (
          <div className={`mb-4 ${
            state.fontSize === 'small' ? 'text-sm' : 
            state.fontSize === 'large' ? 'text-lg' : 'text-base'
          }`}>
            {testResult.message}
          </div>
        )}

        {testResult.details && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {testResult.details.functionsWorking ? (
                  <CheckCircle size={16} className="text-green-600" />
                ) : (
                  <AlertTriangle size={16} className="text-red-600" />
                )}
                <span className={`${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                }`}>
                  Netlify Functions: {testResult.details.functionsWorking ? 'Working' : 'Failed'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {testResult.details.databaseConnected ? (
                  <CheckCircle size={16} className="text-green-600" />
                ) : (
                  <AlertTriangle size={16} className="text-red-600" />
                )}
                <span className={`${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                }`}>
                  Database: {testResult.details.databaseConnected ? 'Connected' : 'Failed'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Database size={16} />
                <span className={`${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                }`}>
                  Stored Results: {testResult.details.resultCount}
                </span>
              </div>
              
              {testResult.details.latency && (
                <div className="flex items-center space-x-2">
                  <RefreshCw size={16} />
                  <span className={`${
                    state.fontSize === 'small' ? 'text-sm' : 
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  }`}>
                    Response Time: {testResult.details.latency}ms
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Environment Variables Guide */}
      <div className={`mt-6 p-4 rounded-lg ${
        state.highContrast ? 'bg-yellow-900 border border-yellow-600' : 'bg-yellow-50 border border-yellow-200'
      }`}>
        <h4 className={`font-medium mb-2 ${
          state.fontSize === 'small' ? 'text-base' : 
          state.fontSize === 'large' ? 'text-xl' : 'text-lg'
        } ${state.highContrast ? 'text-yellow-200' : 'text-yellow-800'}`}>
          Environment Variables Required
        </h4>
        <p className={`mb-3 ${
          state.fontSize === 'small' ? 'text-sm' : 
          state.fontSize === 'large' ? 'text-lg' : 'text-base'
        } ${state.highContrast ? 'text-yellow-200' : 'text-yellow-700'}`}>
          For the database to work, these environment variables must be set in your Netlify site settings:
        </p>
        <div className={`space-y-1 font-mono text-xs ${
          state.highContrast ? 'text-yellow-300' : 'text-yellow-800'
        }`}>
          <div>SUPABASE_URL = {config.supabaseUrl || 'https://your-project-id.supabase.co'}</div>
          <div>SUPABASE_ANON_KEY = {config.supabaseKey ? '***' + config.supabaseKey.slice(-8) : 'your-anon-key-here'}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="?admin=true"
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            state.highContrast 
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Database size={16} />
          <span>View Results Dashboard</span>
        </a>
        
        <a
          href="?automated-testing=true"
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            state.highContrast 
              ? 'bg-blue-800 text-blue-200 hover:bg-blue-700' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <RefreshCw size={16} />
          <span>Run Automated Tests</span>
        </a>
      </div>
    </div>
  );
}