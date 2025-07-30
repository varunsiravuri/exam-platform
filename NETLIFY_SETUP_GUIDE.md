# 🔧 Netlify + Supabase Setup Troubleshooting Guide

## Current Issue: "Database Offline" Error

You're seeing this error because the Netlify Functions can't connect to your Supabase database. Here's how to fix it:

## Step 1: Verify Supabase Setup

1. **Check Your Supabase Project**:
   - Go to [https://supabase.com](https://supabase.com)
   - Open your project dashboard
   - Ensure the project is active (not paused)

2. **Get Your Credentials**:
   - Go to Settings → API
   - Copy your **Project URL** (looks like: `https://abcdefghijk.supabase.co`)
   - Copy your **anon/public key** (starts with `eyJ...`)

## Step 2: Configure Netlify Environment Variables

1. **Go to Netlify Dashboard**:
   - Open your deployed site
   - Click "Site settings"
   - Go to "Environment variables"

2. **Add These Variables** (EXACTLY as shown):
   ```
   Variable name: SUPABASE_URL
   Value: https://your-project-id.supabase.co
   
   Variable name: SUPABASE_ANON_KEY  
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Important Notes**:
   - Variable names are case-sensitive
   - No quotes around the values
   - No extra spaces
   - Use the ANON key, not the service role key

## Step 3: Redeploy Your Site

After adding environment variables:
1. Go to "Deploys" tab
2. Click "Trigger deploy" → "Deploy site"
3. Wait for deployment to complete

## Step 4: Test the Connection

1. **Take a Test Exam**:
   - Go to your site
   - Use student ID: `TEST001`
   - Complete the exam

2. **Check Admin Dashboard**:
   - Go to: `your-site.netlify.app?admin=true`
   - You should see "Database Connected" status
   - Results should appear in the table

3. **Verify in Supabase**:
   - Go to your Supabase project
   - Click "Table Editor"
   - Check the `exam_results` table for data

## Common Issues & Solutions

### Issue 1: "Database not configured" Error
**Solution**: Environment variables not set correctly
- Double-check variable names (case-sensitive)
- Ensure no extra spaces in values
- Redeploy after changes

### Issue 2: "Failed to fetch results from server"
**Solution**: Netlify Functions not working
- Check if functions are deployed in Netlify dashboard
- Look for function logs in Netlify
- Ensure Supabase credentials are valid

### Issue 3: "CORS Error"
**Solution**: Usually resolves after proper deployment
- Clear browser cache
- Try in incognito mode
- Check network tab for actual error

### Issue 4: Environment Variables Not Working
**Solution**: 
1. Delete and recreate the variables
2. Make sure you're using the correct Supabase keys
3. Redeploy the site completely

## Verification Checklist

- [ ] Supabase project is active and accessible
- [ ] Database table `exam_results` exists
- [ ] Environment variables are set in Netlify
- [ ] Site has been redeployed after adding variables
- [ ] Admin dashboard shows "Database Connected"
- [ ] Test exam results appear in both dashboard and Supabase

## Debug Steps

If still not working:

1. **Check Netlify Function Logs**:
   - Go to Netlify dashboard
   - Click "Functions" tab
   - Look for error messages

2. **Test Environment Variables**:
   - In Netlify, go to Site settings → Environment variables
   - Verify both SUPABASE_URL and SUPABASE_ANON_KEY are present

3. **Check Browser Console**:
   - Open browser developer tools
   - Look for error messages in console
   - Check Network tab for failed requests

4. **Verify Supabase Permissions**:
   - In Supabase, go to Authentication → Policies
   - Ensure RLS policies allow public access

## Contact Support

If you're still having issues, provide:
- Your Netlify site URL
- Screenshot of environment variables (hide the actual keys)
- Any error messages from browser console
- Screenshot of Supabase table structure