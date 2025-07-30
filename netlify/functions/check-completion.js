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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }

  try {
    const studentId = event.queryStringParameters?.studentId;

    if (!studentId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Student ID parameter is required'
        }),
      };
    }

    // Always return not completed for test IDs
    if (studentId.startsWith('TEST')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          hasCompleted: false,
          studentId: studentId
        }),
      };
    }

    if (supabase) {
      // Check if student has already completed the exam
      const { data, error } = await supabase
        .from('exam_results')
        .select('id')
        .eq('student_id', studentId)
        .limit(1);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      const hasCompleted = data && data.length > 0;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          hasCompleted: hasCompleted,
          studentId: studentId
        }),
      };
    } else {
      // No database configured
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          hasCompleted: false,
          studentId: studentId
        }),
      };
    }

  } catch (error) {
    console.error('Error checking completion:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to check completion status',
        error: error.message
      }),
    };
  }
};
