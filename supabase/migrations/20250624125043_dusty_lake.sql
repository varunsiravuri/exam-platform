/*
  # Add unique constraint on student_id to prevent duplicates

  1. Changes
    - Add unique constraint on student_id column
    - This will prevent duplicate submissions from the same student
    - Existing duplicates will need to be cleaned up manually

  2. Security
    - Maintains existing RLS policies
    - No changes to permissions
*/

-- Add unique constraint on student_id to prevent duplicate submissions
ALTER TABLE exam_results 
ADD CONSTRAINT unique_student_submission 
UNIQUE (student_id);

-- Create index for better performance on student_id lookups
CREATE INDEX IF NOT EXISTS idx_exam_results_student_id_unique ON exam_results(student_id);