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
    const filename = event.queryStringParameters?.filename;

    if (!filename) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Filename parameter is required'
        }),
      };
    }

    if (supabase) {
      // Get specific result from Supabase database
      const { data, error } = await supabase
        .from('exam_results')
        .select('detailed_results')
        .eq('filename', filename)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Result not found'
            }),
          };
        }
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: data.detailed_results
        }),
      };
    } else {
      // No database configured
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Result not found'
        }),
      };
    }

  } catch (error) {
    console.error('Error fetching result:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to fetch result',
        error: error.message
      }),
    };
  }
};