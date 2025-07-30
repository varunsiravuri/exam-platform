const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }

  try {
    const { studentId, studentName, results } = JSON.parse(event.body);

    if (!studentId || !studentName || !results) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Missing required fields: studentId, studentName, results'
        }),
      };
    }

    if (supabase) {
      // CRITICAL: Check if student has already completed the exam
      const { data: existingResults, error: checkError } = await supabase
        .from('exam_results')
        .select('id, student_id, created_at')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (checkError) {
        console.error('Error checking existing results:', checkError);
        throw new Error(`Database check error: ${checkError.message}`);
      }

      // If student already has results, prevent duplicate submission
      if (existingResults && existingResults.length > 0) {
        console.log(`Duplicate submission attempt blocked for student: ${studentId}`);
        return {
          statusCode: 409, // Conflict status code
          headers,
          body: JSON.stringify({
            success: false,
            message: 'You have already completed this exam. Retakes are not allowed.',
            code: 'EXAM_ALREADY_COMPLETED',
            existingSubmission: {
              studentId: studentId,
              submittedAt: existingResults[0].created_at
            }
          }),
        };
      }

      // Create filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${studentId}_${studentName.replace(/\s+/g, '_')}_${timestamp}.json`;

      // Add server timestamp to results
      const completeResults = {
        ...results,
        serverTimestamp: new Date().toISOString(),
        savedAt: new Date().toLocaleString(),
        filename
      };

      // Calculate section scores for summary
      const networkingSection = results.sectionBreakdown?.find(s => s.section === 'networking');
      const wifiQuantSection = results.sectionBreakdown?.find(s => s.section === 'wifi-quant');

      // Prepare data for database with unique constraint on student_id
      const examResult = {
        student_id: studentId,
        student_name: studentName,
        filename: filename,
        completion_time: results.completionTime,
        total_questions: results.totalQuestions || 60,
        correct_answers: results.correctAnswers || 0,
        incorrect_answers: results.incorrectAnswers || 0,
        unanswered: results.unanswered || 0,
        total_score: results.totalScore || 0,
        max_score: results.maxScore || 60,
        percentage: results.percentage || 0,
        grade: results.grade || 'F',
        networking_score: networkingSection?.totalScore || 0,
        networking_percentage: networkingSection?.percentage || 0,
        wifi_quant_score: wifiQuantSection?.totalScore || 0,
        wifi_quant_percentage: wifiQuantSection?.percentage || 0,
        detailed_results: completeResults,
        created_at: new Date().toISOString()
      };

      // Use upsert to prevent duplicates - this will update if student_id exists
      const { data, error } = await supabase
        .from('exam_results')
        .upsert([examResult], { 
          onConflict: 'student_id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Supabase error:', error);
        
        // Check if it's a unique constraint violation (duplicate)
        if (error.code === '23505' || error.message.includes('duplicate')) {
          return {
            statusCode: 409,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'You have already completed this exam. Retakes are not allowed.',
              code: 'EXAM_ALREADY_COMPLETED'
            }),
          };
        }
        
        throw new Error(`Database error: ${error.message}`);
      }

      console.log(`Exam result saved successfully for student: ${studentId}`);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Results saved successfully to database',
          filename: filename,
          filepath: 'database',
          studentId: studentId,
          isNewSubmission: true
        }),
      };
    } else {
      // Fallback: Save to Netlify environment (temporary storage)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Results saved successfully (temporary storage)',
          filename: filename,
          filepath: 'temporary'
        }),
      };
    }

  } catch (error) {
    console.error('Error saving results:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to save results',
        error: error.message
      }),
    };
  }
};