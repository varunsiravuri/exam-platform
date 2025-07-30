import React, { useState, useEffect } from 'react';
import { Download, FileSpreadsheet, Users, TrendingUp, Calendar, RefreshCw, AlertTriangle, CheckCircle, Server, Database, Settings, Trash2 } from 'lucide-react';
import { getAllResults, exportToExcel, ResultSummary, checkServerHealth, deleteResult, clearAllData } from '../utils/api';
import { useExam } from '../contexts/ExamContext';

export function AdminDashboard() {
  const [results, setResults] = useState<ResultSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [serverOnline, setServerOnline] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [cleaningDuplicates, setCleaningDuplicates] = useState(false);
  const { state } = useExam();

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      // Check server status
      const isServerOnline = await checkServerHealth();
      setServerOnline(isServerOnline);
      
      const response = await getAllResults();
      if (response.success && response.results) {
        // Remove duplicates based on student ID (keep the latest one)
        const uniqueResults = response.results.reduce((acc: ResultSummary[], current) => {
          const existingIndex = acc.findIndex(item => item.studentId === current.studentId);
          if (existingIndex >= 0) {
            // Keep the one with the latest completion time
            if (new Date(current.completionTime) > new Date(acc[existingIndex].completionTime)) {
              acc[existingIndex] = current;
            }
          } else {
            acc.push(current);
          }
          return acc;
        }, []);
        
        setResults(uniqueResults);
        setLastRefresh(new Date());
        setError(null);
      } else {
        setError(response.message || 'Failed to fetch results');
        setServerOnline(false);
      }
    } catch (err) {
      setError('Failed to connect to server');
      setServerOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchResults, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleExportExcel = async () => {
    if (results.length === 0) {
      setError('No results available to export');
      return;
    }

    setExporting(true);
    setError(null);
    try {
      await exportToExcel();
      setError(null);
    } catch (err) {
      setError('Failed to export results');
    } finally {
      setExporting(false);
    }
  };

  const handleCleanDuplicates = async () => {
    if (!showClearConfirm) {
      setShowClearConfirm(true);
      return;
    }

    setShowClearConfirm(false);
    setCleaningDuplicates(true);
    
    try {
      // Get all results to identify duplicates
      const response = await getAllResults();
      if (!response.success || !response.results) {
        throw new Error('Failed to fetch results for cleanup');
      }

      // Group results by student ID
      const studentGroups = response.results.reduce((acc: Record<string, ResultSummary[]>, result) => {
        if (!acc[result.studentId]) {
          acc[result.studentId] = [];
        }
        acc[result.studentId].push(result);
        return acc;
      }, {});

      let deletedCount = 0;

      // For each student with multiple results, delete all but the latest
      for (const [studentId, studentResults] of Object.entries(studentGroups)) {
        if (studentResults.length > 1) {
          // Sort by completion time, keep the latest
          const sorted = studentResults.sort((a, b) => 
            new Date(b.completionTime).getTime() - new Date(a.completionTime).getTime()
          );
          
          // Delete all but the first (latest) one
          for (let i = 1; i < sorted.length; i++) {
            try {
              await deleteResult(sorted[i].filename);
              deletedCount++;
            } catch (deleteError) {
              console.error(`Failed to delete duplicate for ${studentId}:`, deleteError);
            }
          }
        }
      }

      // Refresh the results
      await fetchResults();
      setError(`Successfully cleaned up ${deletedCount} duplicate results`);
    } catch (err) {
      setError('Failed to clean up duplicates: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setCleaningDuplicates(false);
    }
  };

  const handleClearTestData = () => {
    clearAllData();
    setError('Local test data cleared. Refresh to see updated results.');
  };

  const calculateStats = () => {
    if (results.length === 0) return null;

    const totalStudents = results.length;
    const averageScore = results.reduce((sum, r) => sum + r.percentage, 0) / totalStudents;
    const highestScore = Math.max(...results.map(r => r.percentage));
    const lowestScore = Math.min(...results.map(r => r.percentage));
    
    const gradeDistribution = results.reduce((acc, r) => {
      acc[r.grade] = (acc[r.grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate section averages
    const networkingAverage = results.reduce((sum, r) => sum + (r.networkingPercentage || 0), 0) / totalStudents;
    const wifiQuantAverage = results.reduce((sum, r) => sum + (r.wifiQuantPercentage || 0), 0) / totalStudents;

    return {
      totalStudents,
      averageScore: Math.round(averageScore * 100) / 100,
      highestScore,
      lowestScore,
      gradeDistribution,
      networkingAverage: Math.round(networkingAverage * 100) / 100,
      wifiQuantAverage: Math.round(wifiQuantAverage * 100) / 100
    };
  };

  const stats = calculateStats();

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${
      state.highContrast ? 'bg-black text-white' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`${
          state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
        } rounded-2xl p-6 mb-8`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-10 flex items-center justify-center">
                <img 
                  src="/CandelaLogo2.png" 
                  alt="Candela Technologies" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className={`font-bold ${
                  state.fontSize === 'small' ? 'text-2xl' : 
                  state.fontSize === 'large' ? 'text-4xl' : 'text-3xl'
                }`}>
                  Exam Results Dashboard
                </h1>
                <p className={`${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                  Candela Technologies Written Test Results
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Server Status Indicator */}
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                serverOnline 
                  ? state.highContrast ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                  : state.highContrast ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
              }`}>
                {serverOnline ? <Database size={16} /> : <Server size={16} />}
                <span className={`text-xs font-medium`}>
                  {serverOnline ? 'Database Connected' : 'Database Offline'}
                </span>
              </div>

              {/* Database Manager Button */}
              <a
                href="?database-manager=true"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                } ${
                  state.highContrast 
                    ? 'bg-blue-800 text-blue-200 border border-blue-600 hover:bg-blue-700' 
                    : 'bg-blue-600 text-white border border-blue-600 hover:bg-blue-700'
                }`}
              >
                <Settings size={16} />
                <span>Database Manager</span>
              </a>

              <button
                onClick={fetchResults}
                disabled={loading}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                } ${
                  state.highContrast 
                    ? 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700' 
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>

              <button
                onClick={handleExportExcel}
                disabled={exporting || results.length === 0}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                } ${
                  exporting || results.length === 0
                    ? state.highContrast 
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : state.highContrast 
                      ? 'bg-green-800 text-green-200 hover:bg-green-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                } shadow-lg hover:shadow-xl`}
              >
                {exporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet size={16} />
                    <span>Export CSV</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Storage Info */}
          <div className={`mt-4 flex items-center justify-between text-sm ${
            state.highContrast ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <span>
              Last updated: {lastRefresh.toLocaleString()} | 
              Storage: {serverOnline ? 'Supabase Database' : 'Server Offline'} |
              Status: {serverOnline ? 'Online' : 'Offline'}
            </span>
            <div className="flex items-center space-x-4">
              <span>{results.length} unique results</span>
              <button
                onClick={handleCleanDuplicates}
                disabled={cleaningDuplicates}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  cleaningDuplicates
                    ? 'opacity-50 cursor-not-allowed'
                    : showClearConfirm
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : state.highContrast 
                        ? 'bg-yellow-800 text-yellow-200 hover:bg-yellow-700' 
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                }`}
              >
                {cleaningDuplicates ? (
                  <>
                    <RefreshCw size={12} className="inline animate-spin mr-1" />
                    Cleaning...
                  </>
                ) : showClearConfirm ? (
                  'Confirm Clean Duplicates'
                ) : (
                  'Clean Duplicates'
                )}
              </button>
              <button
                onClick={handleClearTestData}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  state.highContrast 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Clear Local Data
              </button>
            </div>
          </div>
        </div>

        {/* Server Status Notice */}
        {!serverOnline && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 ${
            state.highContrast ? 'bg-red-900 border-red-400 text-red-200' : 'bg-red-50 border-red-400 text-red-700'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle size={20} className="mr-2" />
                <div>
                  <span className="font-medium">Database Offline:</span>
                  <span className="ml-2">Unable to connect to the database. No results can be displayed.</span>
                </div>
              </div>
              <a
                href="?database-manager=true"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  state.highContrast 
                    ? 'bg-blue-800 text-blue-200 hover:bg-blue-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Fix Connection
              </a>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 ${
            error.includes('successfully') || error.includes('cleared')
              ? state.highContrast ? 'bg-green-900 border-green-400 text-green-200' : 'bg-green-50 border-green-400 text-green-700'
              : state.highContrast ? 'bg-red-900 border-red-400 text-red-200' : 'bg-red-50 border-red-400 text-red-700'
          }`}>
            <div className="flex items-center">
              {error.includes('successfully') || error.includes('cleared') ? (
                <CheckCircle size={20} className="mr-2" />
              ) : (
                <AlertTriangle size={20} className="mr-2" />
              )}
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className={`p-6 rounded-xl ${
              state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${
                    state.fontSize === 'small' ? 'text-sm' : 
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                    Total Students
                  </p>
                  <p className={`font-bold ${
                    state.fontSize === 'small' ? 'text-2xl' : 
                    state.fontSize === 'large' ? 'text-4xl' : 'text-3xl'
                  }`}>
                    {stats.totalStudents}
                  </p>
                </div>
                <Users className={`${state.highContrast ? 'text-blue-400' : 'text-blue-600'}`} size={32} />
              </div>
            </div>

            <div className={`p-6 rounded-xl ${
              state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${
                    state.fontSize === 'small' ? 'text-sm' : 
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                    Average Score
                  </p>
                  <p className={`font-bold ${
                    state.fontSize === 'small' ? 'text-2xl' : 
                    state.fontSize === 'large' ? 'text-4xl' : 'text-3xl'
                  }`}>
                    {stats.averageScore}%
                  </p>
                </div>
                <TrendingUp className={`${state.highContrast ? 'text-green-400' : 'text-green-600'}`} size={32} />
              </div>
            </div>

            <div className={`p-6 rounded-xl ${
              state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${
                    state.fontSize === 'small' ? 'text-sm' : 
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                    Highest Score
                  </p>
                  <p className={`font-bold ${
                    state.fontSize === 'small' ? 'text-2xl' : 
                    state.fontSize === 'large' ? 'text-4xl' : 'text-3xl'
                  }`}>
                    {stats.highestScore}%
                  </p>
                </div>
                <CheckCircle className={`${state.highContrast ? 'text-yellow-400' : 'text-yellow-600'}`} size={32} />
              </div>
            </div>

            <div className={`p-6 rounded-xl ${
              state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${
                    state.fontSize === 'small' ? 'text-sm' : 
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                    Lowest Score
                  </p>
                  <p className={`font-bold ${
                    state.fontSize === 'small' ? 'text-2xl' : 
                    state.fontSize === 'large' ? 'text-4xl' : 'text-3xl'
                  }`}>
                    {stats.lowestScore}%
                  </p>
                </div>
                <Calendar className={`${state.highContrast ? 'text-red-400' : 'text-red-600'}`} size={32} />
              </div>
            </div>
          </div>
        )}

        {/* Section Performance */}
        {stats && (
          <div className={`${
            state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
          } rounded-2xl p-6 mb-8`}>
            <h2 className={`font-bold mb-4 ${
              state.fontSize === 'small' ? 'text-xl' : 
              state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
            }`}>
              Section Performance Averages
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`p-4 rounded-lg ${
                state.highContrast ? 'bg-gray-800' : 'bg-blue-50'
              }`}>
                <h3 className={`font-medium mb-2 ${
                  state.fontSize === 'small' ? 'text-lg' : 
                  state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
                }`}>
                  Networking & Wi-Fi Fundamentals
                </h3>
                <p className={`font-bold ${
                  state.fontSize === 'small' ? 'text-2xl' : 
                  state.fontSize === 'large' ? 'text-4xl' : 'text-3xl'
                } text-blue-600`}>
                  {stats.networkingAverage}%
                </p>
                <p className={`text-sm ${state.highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                  40 questions • Core networking concepts
                </p>
              </div>

              <div className={`p-4 rounded-lg ${
                state.highContrast ? 'bg-gray-800' : 'bg-green-50'
              }`}>
                <h3 className={`font-medium mb-2 ${
                  state.fontSize === 'small' ? 'text-lg' : 
                  state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
                }`}>
                  Wi-Fi Quantitative Assessment
                </h3>
                <p className={`font-bold ${
                  state.fontSize === 'small' ? 'text-2xl' : 
                  state.fontSize === 'large' ? 'text-4xl' : 'text-3xl'
                } text-green-600`}>
                  {stats.wifiQuantAverage}%
                </p>
                <p className={`text-sm ${state.highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                  20 questions • Quantitative & logical reasoning
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Grade Distribution */}
        {stats && (
          <div className={`${
            state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
          } rounded-2xl p-6 mb-8`}>
            <h2 className={`font-bold mb-4 ${
              state.fontSize === 'small' ? 'text-xl' : 
              state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
            }`}>
              Grade Distribution
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(stats.gradeDistribution).map(([grade, count]) => (
                <div key={grade} className={`text-center p-4 rounded-lg ${
                  state.highContrast ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <div className={`font-bold ${
                    state.fontSize === 'small' ? 'text-2xl' : 
                    state.fontSize === 'large' ? 'text-4xl' : 'text-3xl'
                  } ${
                    grade === 'A+' || grade === 'A' ? 'text-green-600' :
                    grade === 'B' ? 'text-blue-600' :
                    grade === 'C' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {count}
                  </div>
                  <div className={`${
                    state.fontSize === 'small' ? 'text-sm' : 
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                    Grade {grade}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Table */}
        <div className={`${
          state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
        } rounded-2xl overflow-hidden`}>
          <div className="p-6 border-b border-gray-200">
            <h2 className={`font-bold ${
              state.fontSize === 'small' ? 'text-xl' : 
              state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
            }`}>
              Individual Results (Unique Students Only)
            </h2>
            <p className={`text-sm mt-2 ${state.highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
              Duplicates are automatically filtered - only the latest submission per student is shown
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading results...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center">
              <p className={`${
                state.fontSize === 'small' ? 'text-base' : 
                state.fontSize === 'large' ? 'text-xl' : 'text-lg'
              } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                No exam results found. Results will appear here after students complete their exams.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${
                  state.highContrast ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <tr>
                    <th className={`px-6 py-3 text-left font-medium ${
                      state.fontSize === 'small' ? 'text-sm' : 
                      state.fontSize === 'large' ? 'text-lg' : 'text-base'
                    }`}>Student ID</th>
                    <th className={`px-6 py-3 text-left font-medium ${
                      state.fontSize === 'small' ? 'text-sm' : 
                      state.fontSize === 'large' ? 'text-lg' : 'text-base'
                    }`}>Name</th>
                    <th className={`px-6 py-3 text-left font-medium ${
                      state.fontSize === 'small' ? 'text-sm' : 
                      state.fontSize === 'large' ? 'text-lg' : 'text-base'
                    }`}>Total Score</th>
                    <th className={`px-6 py-3 text-left font-medium ${
                      state.fontSize === 'small' ? 'text-sm' : 
                      state.fontSize === 'large' ? 'text-lg' : 'text-base'
                    }`}>Percentage</th>
                    <th className={`px-6 py-3 text-left font-medium ${
                      state.fontSize === 'small' ? 'text-sm' : 
                      state.fontSize === 'large' ? 'text-lg' : 'text-base'
                    }`}>Grade</th>
                    <th className={`px-6 py-3 text-left font-medium ${
                      state.fontSize === 'small' ? 'text-sm' : 
                      state.fontSize === 'large' ? 'text-lg' : 'text-base'
                    }`}>Networking</th>
                    <th className={`px-6 py-3 text-left font-medium ${
                      state.fontSize === 'small' ? 'text-sm' : 
                      state.fontSize === 'large' ? 'text-lg' : 'text-base'
                    }`}>Wi-Fi Quant</th>
                    <th className={`px-6 py-3 text-left font-medium ${
                      state.fontSize === 'small' ? 'text-sm' : 
                      state.fontSize === 'large' ? 'text-lg' : 'text-base'
                    }`}>Completion Date</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={result.filename} className={`border-t ${
                      state.highContrast ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <td className={`px-6 py-4 font-medium ${
                        state.fontSize === 'small' ? 'text-sm' : 
                        state.fontSize === 'large' ? 'text-lg' : 'text-base'
                      }`}>
                        {result.studentId}
                      </td>
                      <td className={`px-6 py-4 ${
                        state.fontSize === 'small' ? 'text-sm' : 
                        state.fontSize === 'large' ? 'text-lg' : 'text-base'
                      }`}>
                        {result.studentName}
                      </td>
                      <td className={`px-6 py-4 font-medium ${
                        state.fontSize === 'small' ? 'text-sm' : 
                        state.fontSize === 'large' ? 'text-lg' : 'text-base'
                      }`}>
                        {result.totalScore || 0}/{result.maxScore || 60}
                      </td>
                      <td className={`px-6 py-4 font-bold ${
                        state.fontSize === 'small' ? 'text-sm' : 
                        state.fontSize === 'large' ? 'text-lg' : 'text-base'
                      }`}>
                        {result.percentage}%
                      </td>
                      <td className={`px-6 py-4 font-bold ${
                        state.fontSize === 'small' ? 'text-sm' : 
                        state.fontSize === 'large' ? 'text-lg' : 'text-base'
                      } ${
                        result.grade === 'A+' || result.grade === 'A' ? 'text-green-600' :
                        result.grade === 'B' ? 'text-blue-600' :
                        result.grade === 'C' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {result.grade}
                      </td>
                      <td className={`px-6 py-4 ${
                        state.fontSize === 'small' ? 'text-sm' : 
                        state.fontSize === 'large' ? 'text-lg' : 'text-base'
                      }`}>
                        {result.networkingPercentage || 0}%
                      </td>
                      <td className={`px-6 py-4 ${
                        state.fontSize === 'small' ? 'text-sm' : 
                        state.fontSize === 'large' ? 'text-lg' : 'text-base'
                      }`}>
                        {result.wifiQuantPercentage || 0}%
                      </td>
                      <td className={`px-6 py-4 ${
                        state.fontSize === 'small' ? 'text-sm' : 
                        state.fontSize === 'large' ? 'text-lg' : 'text-base'
                      } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                        {new Date(result.completionTime).toLocaleDateString()} {new Date(result.completionTime).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}