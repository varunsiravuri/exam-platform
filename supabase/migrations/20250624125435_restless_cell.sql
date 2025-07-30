/*
  # Clean Duplicate Results and Add Unique Constraint

  1. Data Cleanup
    - Remove duplicate exam results, keeping only the latest submission per student
    - Preserve the most recent result based on created_at timestamp
  
  2. Schema Changes
    - Add unique constraint on student_id to prevent future duplicates
    - Add performance index for student_id lookups
  
  3. Security
    - Maintain existing RLS policies
    - No changes to permissions
*/

-- Step 1: Clean up duplicate entries, keeping only the latest submission per student
WITH ranked_results AS (
  SELECT id,
         student_id,
         ROW_NUMBER() OVER (
           PARTITION BY student_id 
           ORDER BY created_at DESC, completion_time DESC
         ) as rn
  FROM exam_results
),
duplicates_to_delete AS (
  SELECT id 
  FROM ranked_results 
  WHERE rn > 1
)
DELETE FROM exam_results 
WHERE id IN (SELECT id FROM duplicates_to_delete);

-- Step 2: Add unique constraint on student_id to prevent future duplicates
ALTER TABLE exam_results 
ADD CONSTRAINT unique_student_submission 
UNIQUE (student_id);

-- Step 3: Create index for better performance on student_id lookups
CREATE INDEX IF NOT EXISTS idx_exam_results_student_id_unique ON exam_results(student_id);

-- Step 4: Add a comment to document the constraint
COMMENT ON CONSTRAINT unique_student_submission ON exam_results IS 
'Ensures each student can only have one exam result submission';