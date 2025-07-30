// API utility functions for communicating with Netlify Functions

// Use Netlify Functions for serverless backend
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/.netlify/functions`;
  }
  return '/.netlify/functions';
};

const API_BASE_URL = getApiBaseUrl();

export interface SaveResultsRequest {
  studentId: string;
  studentName: string;
  results: any;
}

export interface SaveResultsResponse {
  success: boolean;
  message: string;
  filename?: string;
  filepath?: string;
  error?: string;
  code?: string; // For specific error codes like EXAM_ALREADY_COMPLETED
}

export interface ResultSummary {
  filename: string;
  studentId: string;
  studentName: string;
  percentage: number;
  grade: string;
  completionTime: string;
  createdAt: string;
  size: number;
  totalScore: number;
  maxScore: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  networkingScore: number;
  wifiQuantScore: number;
  networkingPercentage: number;
  wifiQuantPercentage: number;
}

export interface GetResultsResponse {
  success: boolean;
  results?: ResultSummary[];
  message?: string;
  error?: string;
}

export interface GetResultResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

// Track completed exams to prevent retakes (client-side backup)
const COMPLETED_EXAMS_KEY = 'candela_completed_exams';

export function markExamAsCompleted(studentId: string): void {
  try {
    const completed = JSON.parse(localStorage.getItem(COMPLETED_EXAMS_KEY) || '[]');
    if (!completed.includes(studentId)) {
      completed.push(studentId);
      localStorage.setItem(COMPLETED_EXAMS_KEY, JSON.stringify(completed));
    }
  } catch (error) {
    console.error('Error marking exam as completed:', error);
  }
}

export function hasCompletedExam(studentId: string): boolean {
  try {
    const completed = JSON.parse(localStorage.getItem(COMPLETED_EXAMS_KEY) || '[]');
    return completed.includes(studentId);
  } catch {
    return false;
  }
}

// Check if student has completed exam on server
export async function checkExamCompletion(studentId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/check-completion?studentId=${encodeURIComponent(studentId)}`);
    if (response.ok) {
      const data = await response.json();
      return data.hasCompleted || false;
    }
  } catch (error) {
    console.error('Error checking exam completion:', error);
  }
  
  // Fallback to local storage
  return hasCompletedExam(studentId);
}

// Save exam results to Netlify Functions
export async function saveResults(data: SaveResultsRequest): Promise<SaveResultsResponse> {
  try {
    // Check if already completed before attempting to save
    const alreadyCompleted = await checkExamCompletion(data.studentId);
    if (alreadyCompleted) {
      return {
        success: false,
        message: 'You have already completed this exam. Retakes are not allowed.',
        code: 'EXAM_ALREADY_COMPLETED'
      };
    }

    const response = await fetch(`${API_BASE_URL}/save-results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    // Mark exam as completed locally if successful
    if (result.success) {
      markExamAsCompleted(data.studentId);
    }
    
    return result;
  } catch (error) {
    console.error('Error saving results:', error);
    return {
      success: false,
      message: 'Failed to save results to server',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Get all results from Netlify Functions
export async function getAllResults(): Promise<GetResultsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/get-results`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching results:', error);
    return {
      success: false,
      message: 'Failed to fetch results from server',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Get specific result from Netlify Functions
export async function getResult(filename: string): Promise<GetResultResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/get-result?filename=${encodeURIComponent(filename)}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching result:', error);
    return {
      success: false,
      message: 'Failed to fetch result from server',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Export results to Excel via Netlify Functions
export async function exportToExcel(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/export-excel`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the filename from the response headers or create a default one
    const contentDisposition = response.headers.get('content-disposition');
    let filename = 'Candela_Exam_Results.csv';
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Create blob and download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
}

// Delete result from Netlify Functions
export async function deleteResult(filename: string): Promise<SaveResultsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/delete-result`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting result:', error);
    return {
      success: false,
      message: 'Failed to delete result from server',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Check if server is running
export async function checkServerHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health-check`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Clear all data (for testing purposes only)
export function clearAllData(): void {
  localStorage.removeItem(COMPLETED_EXAMS_KEY);
}

// Clear specific student data (for testing)
export function clearStudentData(studentId: string): void {
  try {
    const completed = JSON.parse(localStorage.getItem(COMPLETED_EXAMS_KEY) || '[]');
    const filtered = completed.filter((id: string) => id !== studentId);
    localStorage.setItem(COMPLETED_EXAMS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error clearing student data:', error);
  }
}