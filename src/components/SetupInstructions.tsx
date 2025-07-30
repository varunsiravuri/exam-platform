import React from 'react';
import { Database, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { useExam } from '../contexts/ExamContext';

export function SetupInstructions() {
  const { state } = useExam();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const migrationSQL = `/*
  # Create exam results table

  1. New Tables
    - \`exam_results\`
      - \`id\` (uuid, primary key)
      - \`student_id\` (text)
      - \`student_name\` (text)
      - \`filename\` (text, unique)
      - \`completion_time\` (timestamptz)
      - \`total_questions\` (integer)
      - \`correct_answers\` (integer)
      - \`incorrect_answers\` (integer)
      - \`unanswered\` (integer)
      - \`total_score\` (numeric)
      - \`max_score\` (integer)
      - \`percentage\` (numeric)
      - \`grade\` (text)
      - \`networking_score\` (numeric)
      - \`networking_percentage\` (numeric)
      - \`wifi_quant_score\` (numeric)
      - \`wifi_quant_percentage\` (numeric)
      - \`detailed_results\` (jsonb)
      - \`created_at\` (timestamptz)

  2. Security
    - Enable RLS on \`exam_results\` table
    - Add policy for public read access (for admin dashboard)
    - Add policy for public insert access (for exam submissions)
*/

CREATE TABLE IF NOT EXISTS exam_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL,
  student_name text NOT NULL,
  filename text UNIQUE NOT NULL,
  completion_time timestamptz NOT NULL,
  total_questions integer NOT NULL DEFAULT 60,
  correct_answers integer NOT NULL DEFAULT 0,
  incorrect_answers integer NOT NULL DEFAULT 0,
  unanswered integer NOT NULL DEFAULT 0,
  total_score numeric NOT NULL DEFAULT 0,
  max_score integer NOT NULL DEFAULT 60,
  percentage numeric NOT NULL DEFAULT 0,
  grade text NOT NULL DEFAULT 'F',
  networking_score numeric NOT NULL DEFAULT 0,
  networking_percentage numeric NOT NULL DEFAULT 0,
  wifi_quant_score numeric NOT NULL DEFAULT 0,
  wifi_quant_percentage numeric NOT NULL DEFAULT 0,
  detailed_results jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (admin dashboard)
CREATE POLICY "Allow public read access"
  ON exam_results
  FOR SELECT
  TO public
  USING (true);

-- Create policy for public insert access (exam submissions)
CREATE POLICY "Allow public insert access"
  ON exam_results
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_exam_results_student_id ON exam_results(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_completion_time ON exam_results(completion_time);
CREATE INDEX IF NOT EXISTS idx_exam_results_created_at ON exam_results(created_at);`;

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
                Database Setup Required
              </h1>
              <p className={`${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                Set up Supabase database to store exam results permanently
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-step instructions */}
        <div className="space-y-6">
          {/* Step 1 */}
          <div className={`${
            state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
          } rounded-2xl p-6`}>
            <div className="flex items-start space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                state.highContrast ? 'bg-blue-400 text-black' : 'bg-blue-600 text-white'
              }`}>
                1
              </div>
              <div className="flex-1">
                <h3 className={`font-bold mb-2 ${
                  state.fontSize === 'small' ? 'text-lg' : 
                  state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
                }`}>
                  Create Supabase Project
                </h3>
                <p className={`mb-4 ${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                  Go to Supabase and create a new project for your exam system.
                </p>
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    state.highContrast ? 'bg-blue-800 text-blue-200 hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <ExternalLink size={16} />
                  <span>Open Supabase</span>
                </a>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className={`${
            state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
          } rounded-2xl p-6`}>
            <div className="flex items-start space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                state.highContrast ? 'bg-green-400 text-black' : 'bg-green-600 text-white'
              }`}>
                2
              </div>
              <div className="flex-1">
                <h3 className={`font-bold mb-2 ${
                  state.fontSize === 'small' ? 'text-lg' : 
                  state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
                }`}>
                  Run Database Migration
                </h3>
                <p className={`mb-4 ${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                  In your Supabase project, go to SQL Editor and run this migration:
                </p>
                <div className={`relative p-4 rounded-lg ${
                  state.highContrast ? 'bg-gray-800' : 'bg-gray-100'
                } max-h-64 overflow-y-auto`}>
                  <button
                    onClick={() => copyToClipboard(migrationSQL)}
                    className={`absolute top-2 right-2 p-2 rounded-lg transition-colors ${
                      state.highContrast ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-200'
                    }`}
                    title="Copy SQL"
                  >
                    <Copy size={16} />
                  </button>
                  <pre className={`text-xs font-mono ${
                    state.highContrast ? 'text-gray-300' : 'text-gray-800'
                  }`}>
                    {migrationSQL}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className={`${
            state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
          } rounded-2xl p-6`}>
            <div className="flex items-start space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                state.highContrast ? 'bg-yellow-400 text-black' : 'bg-yellow-600 text-white'
              }`}>
                3
              </div>
              <div className="flex-1">
                <h3 className={`font-bold mb-2 ${
                  state.fontSize === 'small' ? 'text-lg' : 
                  state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
                }`}>
                  Configure Environment Variables
                </h3>
                <p className={`mb-4 ${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                  In your Netlify site settings, add these environment variables:
                </p>
                <div className={`space-y-2 p-4 rounded-lg ${
                  state.highContrast ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <code className={`font-mono ${
                      state.fontSize === 'small' ? 'text-xs' : 
                      state.fontSize === 'large' ? 'text-base' : 'text-sm'
                    }`}>
                      SUPABASE_URL = https://your-project-id.supabase.co
                    </code>
                    <button
                      onClick={() => copyToClipboard('SUPABASE_URL')}
                      className={`p-1 rounded transition-colors ${
                        state.highContrast ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                      }`}
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <code className={`font-mono ${
                      state.fontSize === 'small' ? 'text-xs' : 
                      state.fontSize === 'large' ? 'text-base' : 'text-sm'
                    }`}>
                      SUPABASE_ANON_KEY = your-anon-key-here
                    </code>
                    <button
                      onClick={() => copyToClipboard('SUPABASE_ANON_KEY')}
                      className={`p-1 rounded transition-colors ${
                        state.highContrast ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                      }`}
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className={`${
            state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
          } rounded-2xl p-6`}>
            <div className="flex items-start space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                state.highContrast ? 'bg-purple-400 text-black' : 'bg-purple-600 text-white'
              }`}>
                4
              </div>
              <div className="flex-1">
                <h3 className={`font-bold mb-2 ${
                  state.fontSize === 'small' ? 'text-lg' : 
                  state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
                }`}>
                  Test the Setup
                </h3>
                <p className={`mb-4 ${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                  After setting up the database and environment variables:
                </p>
                <ul className={`space-y-2 ${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span>Redeploy your Netlify site</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span>Take a test exam with student ID TEST001</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span>Check admin dashboard for results</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span>Verify data in Supabase Table Editor</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className={`mt-8 p-6 rounded-lg ${
          state.highContrast ? 'bg-blue-900 border border-blue-600' : 'bg-blue-50 border border-blue-200'
        }`}>
          <h3 className={`font-bold mb-2 ${
            state.fontSize === 'small' ? 'text-lg' : 
            state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
          } ${state.highContrast ? 'text-blue-200' : 'text-blue-800'}`}>
            Need Help?
          </h3>
          <p className={`${
            state.fontSize === 'small' ? 'text-sm' : 
            state.fontSize === 'large' ? 'text-lg' : 'text-base'
          } ${state.highContrast ? 'text-blue-200' : 'text-blue-700'}`}>
            If you encounter any issues during setup, check the browser console for error messages. 
            Make sure your Supabase project is active and the environment variables are correctly set in Netlify.
          </p>
        </div>
      </div>
    </div>
  );
}