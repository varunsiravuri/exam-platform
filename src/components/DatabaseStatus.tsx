import React, { useState, useEffect } from 'react';
import { Database, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { isSupabaseConfigured, getAllExamResults } from '../utils/supabase';
import { useExam } from '../contexts/ExamContext';

export function DatabaseStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [resultCount, setResultCount] = useState(0);
  const { state } = useExam();

  const checkDatabaseConnection = async () => {
    setIsChecking(true);
    
    if (!isSupabaseConfigured()) {
      setIsConnected(false);
      setIsChecking(false);
      return;
    }

    try {
      const result = await getAllExamResults();
      setIsConnected(result.success);
      setResultCount(result.data?.length || 0);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  return (
    <div className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 ${
      isConnected 
        ? state.highContrast ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
        : state.highContrast ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
    }`}>
      {isChecking ? (
        <RefreshCw size={16} className="animate-spin" />
      ) : isConnected ? (
        <CheckCircle size={16} />
      ) : (
        <AlertTriangle size={16} />
      )}
      
      <div className="flex items-center space-x-2">
        <Database size={16} />
        <span className={`font-medium ${
          state.fontSize === 'small' ? 'text-xs' : 
          state.fontSize === 'large' ? 'text-base' : 'text-sm'
        }`}>
          {isChecking ? 'Checking...' : 
           isConnected ? `Database Connected (${resultCount} results)` : 
           'Database Offline'}
        </span>
      </div>

      {!isChecking && (
        <button
          onClick={checkDatabaseConnection}
          className={`p-1 rounded-full transition-colors ${
            state.highContrast ? 'hover:bg-gray-700' : 'hover:bg-white/50'
          }`}
          title="Refresh connection status"
        >
          <RefreshCw size={12} />
        </button>
      )}
    </div>
  );
}