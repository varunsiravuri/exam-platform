/*
  # Create exam results table

  1. New Tables
    - `exam_results`
      - `id` (uuid, primary key)
      - `student_id` (text)
      - `student_name` (text)
      - `filename` (text, unique)
      - `completion_time` (timestamptz)
      - `total_questions` (integer)
      - `correct_answers` (integer)
      - `incorrect_answers` (integer)
      - `unanswered` (integer)
      - `total_score` (numeric)
      - `max_score` (integer)
      - `percentage` (numeric)
      - `grade` (text)
      - `networking_score` (numeric)
      - `networking_percentage` (numeric)
      - `wifi_quant_score` (numeric)
      - `wifi_quant_percentage` (numeric)
      - `detailed_results` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `exam_results` table
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
CREATE INDEX IF NOT EXISTS idx_exam_results_created_at ON exam_results(created_at);