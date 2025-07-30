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
    if (supabase) {
      // Get results from Supabase database
      const { data, error } = await supabase
        .from('exam_results')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      // Transform data to match expected format
      const results = data.map(row => ({
        filename: row.filename,
        studentId: row.student_id,
        studentName: row.student_name,
        percentage: row.percentage,
        grade: row.grade,
        completionTime: row.completion_time,
        createdAt: row.created_at,
        size: JSON.stringify(row.detailed_results).length,
        totalScore: row.total_score,
        maxScore: row.max_score,
        correctAnswers: row.correct_answers,
        incorrectAnswers: row.incorrect_answers,
        unanswered: row.unanswered,
        networkingScore: row.networking_score,
        wifiQuantScore: row.wifi_quant_score,
        networkingPercentage: row.networking_percentage,
        wifiQuantPercentage: row.wifi_quant_percentage
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          results: results
        }),
      };
    } else {
      // No database configured
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          results: []
        }),
      };
    }

  } catch (error) {
    console.error('Error fetching results:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to fetch results',
        error: error.message
      }),
    };
  }
};