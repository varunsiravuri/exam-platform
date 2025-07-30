import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client (only if credentials are available)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && supabase);
};

// Database schema types
export interface ExamResultRow {
  id: string;
  student_id: string;
  student_name: string;
  filename: string;
  completion_time: string;
  total_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  unanswered: number;
  total_score: number;
  max_score: number;
  percentage: number;
  grade: string;
  networking_score: number;
  networking_percentage: number;
  wifi_quant_score: number;
  wifi_quant_percentage: number;
  detailed_results: any;
  created_at: string;
}

// Save exam result to database
export async function saveExamResult(resultData: Omit<ExamResultRow, 'id' | 'created_at'>): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    const { error } = await supabase
      .from('exam_results')
      .insert([resultData]);

    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving to database:', error);
    return { success: false, error: 'Failed to save to database' };
  }
}

// Get all exam results
export async function getAllExamResults(): Promise<{ success: boolean; data?: ExamResultRow[]; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('exam_results')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching from database:', error);
    return { success: false, error: 'Failed to fetch from database' };
  }
}

// Get specific exam result
export async function getExamResult(filename: string): Promise<{ success: boolean; data?: ExamResultRow; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('exam_results')
      .select('*')
      .eq('filename', filename)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching from database:', error);
    return { success: false, error: 'Failed to fetch from database' };
  }
}

// Delete exam result
export async function deleteExamResult(filename: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    const { error } = await supabase
      .from('exam_results')
      .delete()
      .eq('filename', filename);

    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting from database:', error);
    return { success: false, error: 'Failed to delete from database' };
  }
}

// Check if student has completed exam (prevent retakes)
export async function hasStudentCompletedExam(studentId: string): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('exam_results')
      .select('id')
      .eq('student_id', studentId)
      .limit(1);

    if (error) {
      console.error('Supabase error:', error);
      return false;
    }

    return (data && data.length > 0);
  } catch (error) {
    console.error('Error checking completion status:', error);
    return false;
  }
}