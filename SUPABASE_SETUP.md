# 🗄️ Supabase Database Setup Guide

## Step 1: Create Supabase Project

1. **Go to Supabase**: Visit [https://supabase.com](https://supabase.com)
2. **Sign up/Login**: Create account or login
3. **Create New Project**: 
   - Click "New Project"
   - Choose organization
   - Enter project name: `candela-exam-system`
   - Enter database password (save this!)
   - Select region closest to your users
   - Click "Create new project"

## Step 2: Set Up Database Schema

1. **Go to SQL Editor**: In your Supabase dashboard, click "SQL Editor"
2. **Run Migration**: Copy and paste the content from `supabase/migrations/001_create_exam_results_table.sql`
3. **Execute**: Click "Run" to create the table and policies

## Step 3: Get Your Credentials

1. **Go to Settings**: Click "Settings" → "API"
2. **Copy Project URL**: Copy your project URL (looks like: `https://your-project-id.supabase.co`)
3. **Copy Anon Key**: Copy your `anon` `public` key

## Step 4: Configure Netlify Environment Variables

1. **Go to Netlify Dashboard**: Visit your deployed site
2. **Site Settings**: Click "Site settings" → "Environment variables"
3. **Add Variables**:
   ```
   SUPABASE_URL = https://your-project-id.supabase.co
   SUPABASE_ANON_KEY = your-anon-key-here
   ```
4. **Deploy**: Trigger a new deployment to apply changes

## Step 5: Test the Setup

1. **Take a Test Exam**: Use student ID `TEST001` to complete an exam
2. **Check Database**: Go to Supabase → "Table Editor" → "exam_results"
3. **Verify Data**: You should see the exam result stored in the database
4. **Check Admin Dashboard**: Visit `your-site.netlify.app?admin=true` to see results

## Database Schema Overview

### `exam_results` Table
- **Primary Key**: `id` (UUID)
- **Student Info**: `student_id`, `student_name`
- **Exam Data**: `total_questions`, `correct_answers`, `incorrect_answers`, `unanswered`
- **Scoring**: `total_score`, `max_score`, `percentage`, `grade`
- **Section Breakdown**: `networking_score`, `networking_percentage`, `wifi_quant_score`, `wifi_quant_percentage`
- **Full Details**: `detailed_results` (JSON with all answers)
- **Metadata**: `filename`, `completion_time`, `created_at`

## Security Features

- **Row Level Security (RLS)**: Enabled for data protection
- **Public Policies**: Allow read/insert for exam functionality
- **No Authentication Required**: Simplified for exam environment
- **Data Validation**: Server-side validation in Netlify Functions

## Backup & Export

- **Automatic Backups**: Supabase provides automatic daily backups
- **CSV Export**: Admin dashboard includes CSV export functionality
- **Database Export**: Can export full database from Supabase dashboard

## Troubleshooting

### "Database Offline" Error
1. Check environment variables are set correctly
2. Verify Supabase project is active
3. Check API keys are valid

### Results Not Saving
1. Check browser console for errors
2. Verify Netlify Functions are deployed
3. Test database connection in Supabase dashboard

### No Results in Admin Dashboard
1. Ensure students have completed exams
2. Check database has data in "Table Editor"
3. Refresh admin dashboard

## Production Considerations

- **Database Limits**: Free tier has limits, upgrade if needed
- **Performance**: Indexes are created for common queries
- **Monitoring**: Use Supabase dashboard to monitor usage
- **Scaling**: Supabase scales automatically with your needs

---

**🎯 Quick Setup Checklist:**
- [ ] Create Supabase project
- [ ] Run database migration
- [ ] Copy URL and API key
- [ ] Set Netlify environment variables
- [ ] Test with sample exam
- [ ] Verify admin dashboard shows results