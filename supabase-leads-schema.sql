-- Golden Lotus - Leads Table (Mini CRM)
-- Clean, focused schema for lead management
-- Compatible with ANY PostgreSQL database

-- Drop old table if exists
DROP TABLE IF EXISTS contact_inquiries CASCADE;
DROP TABLE IF EXISTS leads CASCADE;

-- Create leads table
CREATE TABLE leads (
  id BIGSERIAL PRIMARY KEY,
  
  -- Step 1: Basic Contact Info
  name TEXT,
  phone TEXT,
  email TEXT,
  company TEXT,
  step1_completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Step 2: Meeting Preferences
  preferred_connect_date TEXT,
  preferred_connect_time TEXT,
  preferred_connect_mode TEXT,
  step2_completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Step 3: Event Details
  event_type TEXT,
  event_date TEXT,
  event_country TEXT,
  event_pincode TEXT,
  event_region TEXT,
  event_city TEXT,
  guest_count INTEGER,
  additional_details TEXT,
  step3_completed_at TIMESTAMP WITH TIME ZONE,
  
  -- CRM Fields
  status TEXT DEFAULT 'new', -- new, contacted, qualified, proposal_sent, won, lost
  priority TEXT DEFAULT 'medium', -- low, medium, high
  admin_notes TEXT,
  
  -- Marketing Tracking
  lead_source TEXT DEFAULT 'form', -- form, manual, referral, social, etc.
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_phone ON leads(phone);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_priority ON leads(priority);
CREATE INDEX idx_leads_lead_source ON leads(lead_source);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_updated_at ON leads(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create security policies
-- Allow public insert (form submissions)
CREATE POLICY "Allow public insert on leads" ON leads
  FOR INSERT WITH CHECK (true);

-- Allow public update (for multi-step form)
CREATE POLICY "Allow public update on leads" ON leads
  FOR UPDATE USING (true);

-- Allow authenticated users (admin) to read all
CREATE POLICY "Allow authenticated read on leads" ON leads
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to update all
CREATE POLICY "Allow authenticated update on leads" ON leads
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to delete
CREATE POLICY "Allow authenticated delete on leads" ON leads
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add table and column comments
COMMENT ON TABLE leads IS 'Lead management table for Golden Lotus CRM with multi-step form support';
COMMENT ON COLUMN leads.status IS 'Lead status: new, contacted, qualified, proposal_sent, won, lost';
COMMENT ON COLUMN leads.priority IS 'Lead priority: low, medium, high';
COMMENT ON COLUMN leads.lead_source IS 'How the lead was acquired: form, manual, referral, social, etc.';
COMMENT ON COLUMN leads.step1_completed_at IS 'Timestamp when basic contact info was submitted';
COMMENT ON COLUMN leads.step2_completed_at IS 'Timestamp when meeting preferences were submitted';
COMMENT ON COLUMN leads.step3_completed_at IS 'Timestamp when event details were submitted';

-- Success message
SELECT 'Leads table created successfully! Ready for CRM.' AS status;
