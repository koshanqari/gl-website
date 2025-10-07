-- Migration Script for Existing contact_inquiries Table
-- This script safely migrates from old schema to new multi-step schema
-- Run this in your Supabase SQL Editor OR any PostgreSQL database

-- Step 1: Backup existing data (IMPORTANT!)
-- You can skip this if you don't have important data yet
CREATE TABLE IF NOT EXISTS contact_inquiries_backup AS 
SELECT * FROM contact_inquiries;

-- Step 2: Add new columns to existing table
-- This preserves your existing data while adding new fields

-- Session tracking columns
ALTER TABLE contact_inquiries 
ADD COLUMN IF NOT EXISTS session_id UUID DEFAULT gen_random_uuid();

ALTER TABLE contact_inquiries 
ADD COLUMN IF NOT EXISTS current_step INTEGER DEFAULT 3;

ALTER TABLE contact_inquiries 
ADD COLUMN IF NOT EXISTS step_completed INTEGER DEFAULT 3;

-- Step completion timestamps
ALTER TABLE contact_inquiries 
ADD COLUMN IF NOT EXISTS step1_completed_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE contact_inquiries 
ADD COLUMN IF NOT EXISTS step2_completed_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE contact_inquiries 
ADD COLUMN IF NOT EXISTS step3_completed_at TIMESTAMP WITH TIME ZONE;

-- Form 2 fields (Meeting Preferences)
ALTER TABLE contact_inquiries 
ADD COLUMN IF NOT EXISTS preferred_date TEXT;

ALTER TABLE contact_inquiries 
ADD COLUMN IF NOT EXISTS preferred_time_slot TEXT;

ALTER TABLE contact_inquiries 
ADD COLUMN IF NOT EXISTS preferred_mode TEXT;

-- Form 3 fields (Event Details - new naming)
ALTER TABLE contact_inquiries 
ADD COLUMN IF NOT EXISTS event_country TEXT;

ALTER TABLE contact_inquiries 
ADD COLUMN IF NOT EXISTS event_pincode TEXT;

ALTER TABLE contact_inquiries 
ADD COLUMN IF NOT EXISTS event_region TEXT;

ALTER TABLE contact_inquiries 
ADD COLUMN IF NOT EXISTS event_city TEXT;

-- Completion timestamp
ALTER TABLE contact_inquiries 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Step 3: Add unique constraint on session_id
-- First, ensure all existing records have a unique session_id
UPDATE contact_inquiries 
SET session_id = gen_random_uuid() 
WHERE session_id IS NULL;

-- Now add the unique constraint
ALTER TABLE contact_inquiries 
ADD CONSTRAINT contact_inquiries_session_id_key UNIQUE (session_id);

-- Step 4: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contact_session_id ON contact_inquiries(session_id);
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_step_completed ON contact_inquiries(step_completed);
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_inquiries(created_at DESC);

-- Step 5: Update existing records to mark them as completed
-- This ensures old submissions are treated as "fully completed"
UPDATE contact_inquiries 
SET 
  step_completed = 3,
  completed_at = created_at,
  step1_completed_at = created_at,
  step2_completed_at = created_at,
  step3_completed_at = created_at
WHERE step_completed IS NULL OR completed_at IS NULL;

-- Step 6: Enable Row Level Security (if not already enabled)
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Step 7: Drop old policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public insert on contact_inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "Allow public update on contact_inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "Allow authenticated read on contact_inquiries" ON contact_inquiries;

-- Step 8: Create new policies
-- Allow anyone to insert (create new inquiry)
CREATE POLICY "Allow public insert on contact_inquiries" ON contact_inquiries
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update (for multi-step form)
CREATE POLICY "Allow public update on contact_inquiries" ON contact_inquiries
  FOR UPDATE USING (true);

-- Allow authenticated users (admin) to read all
CREATE POLICY "Allow authenticated read on contact_inquiries" ON contact_inquiries
  FOR SELECT USING (auth.role() = 'authenticated');

-- Step 9: Add helpful comments
COMMENT ON TABLE contact_inquiries IS 'Contact form inquiries with multi-step support - Database agnostic';
COMMENT ON COLUMN contact_inquiries.session_id IS 'Unique session ID for tracking multi-step form progress';
COMMENT ON COLUMN contact_inquiries.step_completed IS 'Last completed step (0-3): 0=not started, 1=step1, 2=step2, 3=all steps';
COMMENT ON COLUMN contact_inquiries.current_step IS 'Current step user is on (1-3)';

-- Step 10: Verify migration
SELECT 
  COUNT(*) as total_records,
  COUNT(CASE WHEN step_completed = 3 THEN 1 END) as completed_submissions,
  COUNT(CASE WHEN step_completed < 3 THEN 1 END) as partial_submissions
FROM contact_inquiries;

-- Success! Your table is now ready for multi-step forms
-- Old data is preserved and marked as "completed"
