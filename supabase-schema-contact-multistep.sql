-- Multi-Step Contact Form Schema
-- Run this in your Supabase SQL Editor

-- Drop existing table if you want to recreate (CAUTION: This will delete data!)
-- DROP TABLE IF EXISTS contact_inquiries CASCADE;

-- Create contact_inquiries table with multi-step support
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  
  -- Step tracking
  current_step INTEGER DEFAULT 1,
  step_completed INTEGER DEFAULT 0,
  
  -- Form 1: Basic Contact Info
  name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  step1_completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Form 2: Meeting Preferences
  preferred_date TEXT,
  preferred_time_slot TEXT,
  preferred_mode TEXT, -- 'video_call', 'phone_call', 'in_person', 'email'
  step2_completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Form 3: Event Details
  event_type TEXT,
  event_date TEXT,
  event_country TEXT DEFAULT 'India',
  event_pincode TEXT,
  event_region TEXT,
  event_city TEXT,
  guest_count INTEGER,
  message TEXT,
  step3_completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Legacy fields for backward compatibility
  country TEXT,
  pincode TEXT,
  state TEXT,
  city TEXT,
  budget TEXT,
  
  -- Admin fields
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'in_progress', 'converted', 'closed'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
  admin_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_session_id ON contact_inquiries(session_id);
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_step_completed ON contact_inquiries(step_completed);
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_inquiries(created_at DESC);

-- Enable Row Level Security
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public insert/update (users can create and update their own inquiries)
CREATE POLICY "Allow public insert on contact_inquiries" ON contact_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on contact_inquiries" ON contact_inquiries
  FOR UPDATE USING (true);

-- Allow authenticated users (admin) to read all
CREATE POLICY "Allow authenticated read on contact_inquiries" ON contact_inquiries
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE TRIGGER update_contact_inquiries_updated_at
  BEFORE UPDATE ON contact_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE contact_inquiries IS 'Stores contact form inquiries with multi-step form support';
COMMENT ON COLUMN contact_inquiries.session_id IS 'Unique session ID for tracking multi-step form progress';
COMMENT ON COLUMN contact_inquiries.step_completed IS 'Tracks the last completed step (0-3)';
COMMENT ON COLUMN contact_inquiries.current_step IS 'Current step user is on (1-3)';
