import React, { useState } from 'react';
import { Database, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useExam } from '../contexts/ExamContext';

export function DatabaseConnectionTest() {
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'testing' | 'success' | 'error';
    message: string;
    details?: any;
  }>({ status: 'idle', message: '' });
  
  const { state } = useExam();

  const testConnection = async () => {
    setTestResult({ status: 'testing', message: 'Testing connection...' });

    try {
      // Test health check endpoint
      const healthResponse = await fetch('/.netlify/functions/health-check');
      const healthData = await healthResponse.json();

      if (!healthResponse.ok) {
        throw new Error('Netlify Functions not responding');
      }

      // Test database connection
      const dbResponse = await fetch('/.netlify/functions/get-results');
      const dbData = await dbResponse.json();

      if (dbResponse.ok && dbData.success) {
        setTestResult({
          status: 'success',
          message: `Database connected successfully! Found ${dbData.results?.length || 0} exam results.`,
          details: {
            functionsWorking: true,
            databaseConnected: true,
            resultCount: dbData.results?.length || 0
          }
        });
      } else {
        setTestResult({
          status: 'error',
          message: `Database connection failed: ${dbData.message || 'Unknown error'}`,
          details: {
            functionsWorking: true,
            databaseConnected: false,
            error: dbData.message
          }
        });
      }
    } catch (error) {
      setTestResult({
        status: 'error',
        message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: {
          functionsWorking: false,
          databaseConnected: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  };

  const getStatusIcon = () => {
    switch (testResult.status) {
      case 'testing':
        return <RefreshCw size={20} className="animate-spin" />;
      case 'success':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'error':
        return <AlertTriangle size={20} className="text-red-600" />;
      default:
        return <Database size={20} />;
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
    <div className={`p-6 rounded-lg border ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <h3 className={`font-bold ${
            state.fontSize === 'small' ? 'text-lg' : 
            state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
          }`}>
            Database Connection Test
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
        <div className={`space-y-2 ${
          state.fontSize === 'small' ? 'text-sm' : 
          state.fontSize === 'large' ? 'text-lg' : 'text-base'
        }`}>
          <div className="flex items-center space-x-2">
            {testResult.details.functionsWorking ? (
              <CheckCircle size={16} className="text-green-600" />
            ) : (
              <AlertTriangle size={16} className="text-red-600" />
            )}
            <span>Netlify Functions: {testResult.details.functionsWorking ? 'Working' : 'Failed'}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {testResult.details.databaseConnected ? (
              <CheckCircle size={16} className="text-green-600" />
            ) : (
              <AlertTriangle size={16} className="text-red-600" />
            )}
            <span>Database Connection: {testResult.details.databaseConnected ? 'Connected' : 'Failed'}</span>
          </div>

          {testResult.details.resultCount !== undefined && (
            <div className="flex items-center space-x-2">
              <Database size={16} />
              <span>Stored Results: {testResult.details.resultCount}</span>
            </div>
          )}
        </div>
      )}

      {testResult.status === 'error' && (
        <div className={`mt-4 p-3 rounded-lg ${
          state.highContrast ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h4 className="font-medium mb-2">Troubleshooting Steps:</h4>
          <ul className={`space-y-1 ${
            state.fontSize === 'small' ? 'text-xs' : 
            state.fontSize === 'large' ? 'text-base' : 'text-sm'
          }`}>
            <li>1. Check Netlify environment variables (SUPABASE_URL, SUPABASE_ANON_KEY)</li>
            <li>2. Verify Supabase project is active</li>
            <li>3. Ensure database table exists</li>
            <li>4. Redeploy Netlify site after adding variables</li>
          </ul>
        </div>
      )}
    </div>
  );
}