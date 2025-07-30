import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, Download, Trash2, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { getAllResults, deleteResult, exportToExcel, ResultSummary } from '../utils/api';
import { useExam } from '../contexts/ExamContext';

export function DatabaseDashboard() {
  const [results, setResults] = useState<ResultSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState<ResultSummary | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { state } = useExam();

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllResults();
      if (response.success && response.results) {
        setResults(response.results);
      } else {
        setError(response.message || 'Failed to fetch results');
      }
    } catch (err) {
      setError('Failed to connect to database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleDelete = async (filename: string) => {
    if (!confirm('Are you sure you want to delete this result?')) return;
    
    try {
      const response = await deleteResult(filename);
      if (response.success) {
        setResults(prev => prev.filter(r => r.filename !== filename));
      } else {
        setError(response.message || 'Failed to delete result');
      }
    } catch (err) {
      setError('Failed to delete result');
    }
  };

  const handleExport = async () => {
    try {
      await exportToExcel();
    } catch (err) {
      setError('Failed to export results');
    }
  };

  const viewDetails = (result: ResultSummary) => {
    setSelectedResult(result);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw size={24} className="animate-spin mr-2" />
        <span>Loading database results...</span>
      </div>
    );
  }

  return (
    <div className={`${
      state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
    } rounded-2xl p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Database size={24} className={state.highContrast ? 'text-green-400' : 'text-green-600'} />
          <h2 className={`font-bold ${
            state.fontSize === 'small' ? 'text-xl' : 
            state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
          }`}>
            Database Results ({results.length})
          </h2>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={fetchResults}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              state.highContrast 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          
          <button
            onClick={handleExport}
            disabled={results.length === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              results.length === 0
                ? 'opacity-50 cursor-not-allowed'
                : state.highContrast 
                  ? 'bg-green-800 text-green-200 hover:bg-green-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={`mb-6 p-4 rounded-lg border-l-4 ${
          state.highContrast ? 'bg-red-900 border-red-400 text-red-200' : 'bg-red-50 border-red-400 text-red-700'
        }`}>
          <div className="flex items-center">
            <AlertTriangle size={20} className="mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Results Table */}
      {results.length === 0 ? (
        <div className="text-center py-8">
          <Database size={48} className={`mx-auto mb-4 ${state.highContrast ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`${
            state.fontSize === 'small' ? 'text-base' : 
            state.fontSize === 'large' ? 'text-xl' : 'text-lg'
          } ${state.highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
            No exam results found in database
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${
              state.highContrast ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <tr>
                <th className={`px-4 py-3 text-left font-medium ${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                }`}>Student</th>
                <th className={`px-4 py-3 text-left font-medium ${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                }`}>Score</th>
                <th className={`px-4 py-3 text-left font-medium ${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                }`}>Grade</th>
                <th className={`px-4 py-3 text-left font-medium ${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                }`}>Date</th>
                <th className={`px-4 py-3 text-left font-medium ${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                }`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={result.filename} className={`border-t ${
                  state.highContrast ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <td className={`px-4 py-3 ${
                    state.fontSize === 'small' ? 'text-sm' : 
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  }`}>
                    <div>
                      <div className="font-medium">{result.studentId}</div>
                      <div className={`text-sm ${state.highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                        {result.studentName}
                      </div>
                    </div>
                  </td>
                  <td className={`px-4 py-3 font-bold ${
                    state.fontSize === 'small' ? 'text-sm' : 
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  }`}>
                    {result.percentage}%
                  </td>
                  <td className={`px-4 py-3 font-bold ${
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
                  <td className={`px-4 py-3 ${
                    state.fontSize === 'small' ? 'text-sm' : 
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                    {new Date(result.completionTime).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewDetails(result)}
                        className={`p-2 rounded-lg transition-colors ${
                          state.highContrast ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(result.filename)}
                        className={`p-2 rounded-lg transition-colors ${
                          state.highContrast ? 'hover:bg-red-900 text-red-400' : 'hover:bg-red-100 text-red-600'
                        }`}
                        title="Delete result"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-2xl w-full rounded-lg p-6 max-h-[80vh] overflow-y-auto ${
            state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold ${
                state.fontSize === 'small' ? 'text-xl' : 
                state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
              }`}>
                Exam Result Details
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className={`p-2 rounded-lg transition-colors ${
                  state.highContrast ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium">Student ID:</label>
                  <p>{selectedResult.studentId}</p>
                </div>
                <div>
                  <label className="font-medium">Name:</label>
                  <p>{selectedResult.studentName}</p>
                </div>
                <div>
                  <label className="font-medium">Score:</label>
                  <p>{selectedResult.totalScore || 0}/{selectedResult.maxScore || 60}</p>
                </div>
                <div>
                  <label className="font-medium">Percentage:</label>
                  <p>{selectedResult.percentage}%</p>
                </div>
                <div>
                  <label className="font-medium">Grade:</label>
                  <p className={`font-bold ${
                    selectedResult.grade === 'A+' || selectedResult.grade === 'A' ? 'text-green-600' :
                    selectedResult.grade === 'B' ? 'text-blue-600' :
                    selectedResult.grade === 'C' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {selectedResult.grade}
                  </p>
                </div>
                <div>
                  <label className="font-medium">Completion Date:</label>
                  <p>{new Date(selectedResult.completionTime).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium">Networking Score:</label>
                  <p>{selectedResult.networkingPercentage || 0}%</p>
                </div>
                <div>
                  <label className="font-medium">Wi-Fi Quant Score:</label>
                  <p>{selectedResult.wifiQuantPercentage || 0}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}