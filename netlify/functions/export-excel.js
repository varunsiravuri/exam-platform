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
    if (!supabase) {
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Database not configured'
        }),
      };
    }

    // Get all results from database
    const { data, error } = await supabase
      .from('exam_results')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'No results found to export'
        }),
      };
    }

    // Generate CSV content with detailed breakdown
    const csvContent = [
      'Student ID,Student Name,Completion Date,Completion Time,Total Score,Max Score,Percentage,Grade,Correct Answers,Incorrect Answers,Unanswered,Networking Score,Networking %,Wi-Fi Quant Score,Wi-Fi Quant %',
      ...data.map(result => 
        `${result.student_id},"${result.student_name}","${new Date(result.completion_time).toLocaleDateString()}","${new Date(result.completion_time).toLocaleTimeString()}",${result.total_score},${result.max_score},${result.percentage}%,${result.grade},${result.correct_answers},${result.incorrect_answers},${result.unanswered},${result.networking_score},${result.networking_percentage}%,${result.wifi_quant_score},${result.wifi_quant_percentage}%`
      )
    ].join('\n');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Candela_Exam_Results_${timestamp}.csv`;

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`
      },
      body: csvContent,
    };

  } catch (error) {
    console.error('Error creating export:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to create export',
        error: error.message
      }),
    };
  }
};