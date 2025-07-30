# 🔧 Fix "Database Offline" Error - Step by Step Guide

## The Problem
You're seeing "Database Offline: Unable to connect to the database" because:
1. Supabase database is not set up, OR
2. Environment variables are not configured in Netlify

## Solution: Set Up Supabase Database

### Step 1: Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login to your account
3. Click "New Project"
4. Choose your organization
5. Enter project name: `candela-exam-system`
6. Enter a strong database password (SAVE THIS!)
7. Select region closest to your users
8. Click "Create new project"

### Step 2: Set Up Database Table
1. In your Supabase dashboard, go to "SQL Editor"
2. Click "New Query"
3. Copy and paste this SQL code:

```sql
-- Create exam results table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exam_results_student_id ON exam_results(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_completion_time ON exam_results(completion_time);
CREATE INDEX IF NOT EXISTS idx_exam_results_created_at ON exam_results(created_at);
```

4. Click "Run" to execute the SQL

### Step 3: Get Your Supabase Credentials
1. In Supabase dashboard, go to "Settings" → "API"
2. Copy these two values:
   - **Project URL** (looks like: `https://abcdefghijk.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

### Step 4: Configure Netlify Environment Variables
1. Go to your Netlify dashboard
2. Open your deployed site
3. Click "Site settings"
4. Go to "Environment variables"
5. Click "Add a variable" and add these TWO variables:

**Variable 1:**
- Key: `SUPABASE_URL`
- Value: `https://your-project-id.supabase.co` (your actual URL)

**Variable 2:**
- Key: `SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your actual key)

### Step 5: Redeploy Your Site
1. After adding environment variables, go to "Deploys" tab
2. Click "Trigger deploy" → "Deploy site"
3. Wait for deployment to complete

### Step 6: Test the Connection
1. Go to your site: `https://test.pinnit.in?admin=true`
2. You should now see "Database Connected" instead of "Database Offline"
3. Test by taking an exam with student ID `TEST001`
4. Check if results appear in the admin dashboard

## Troubleshooting

### If still showing "Database Offline":
1. **Check environment variables**: Make sure both `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set correctly
2. **Verify Supabase project**: Ensure your Supabase project is active (not paused)
3. **Check spelling**: Variable names are case-sensitive
4. **Redeploy**: Always redeploy after adding environment variables

### If you see "Failed to fetch results":
1. Check browser console for error messages
2. Verify the SQL table was created successfully
3. Make sure RLS policies are set up correctly

## Quick Test
Once set up, you can:
1. Use the Database Manager: `https://test.pinnit.in?database-manager=true`
2. Run automated tests: `https://test.pinnit.in?automated-testing=true`
3. Take a test exam with student ID: `TEST100`, `TEST101`, or `TEST103`

## Need Help?
If you're still having issues:
1. Check the browser console for error messages
2. Verify your Supabase project is active
3. Make sure environment variables are exactly as shown above
4. Try the Database Manager tool for connection testing