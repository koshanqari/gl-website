-- Complete Database Schema for Golden Lotus Website
-- Run this in your PostgreSQL database
-- All tables are in the 'web' schema

-- Create web schema
CREATE SCHEMA IF NOT EXISTS web;

-- Set search path to use web schema
SET search_path TO web, public;

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  read_time TEXT NOT NULL,
  author TEXT NOT NULL,
  author_image_url TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  top_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create work table (our-work)
CREATE TABLE IF NOT EXISTS work (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  client TEXT,
  attendees TEXT,
  location TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create capabilities table
CREATE TABLE IF NOT EXISTS capabilities (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  tag TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  designation TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create leads table (CRM)
CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  phone TEXT,
  email TEXT,
  company TEXT,
  
  -- Step 1: Basic Information
  step1_completed_at TIMESTAMP WITH TIME ZONE,
  preferred_connect_date DATE,
  preferred_connect_time TEXT,
  preferred_connect_mode JSONB, -- Array: ['phone', 'whatsapp', 'video_call', 'in_person']
  
  -- Step 2: Service & Project Details
  step2_completed_at TIMESTAMP WITH TIME ZONE,
  project_date DATE,
  project_country TEXT DEFAULT 'India',
  project_pincode TEXT,
  project_region TEXT,
  project_city TEXT,
  target_count INTEGER,
  service_type JSONB, -- Array: ['Event Strategy', 'Venue & Logistics', etc.]
  
  -- Step 3: Additional Details
  step3_completed_at TIMESTAMP WITH TIME ZONE,
  additional_details TEXT,
  
  -- Admin fields
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'proposal', 'closed'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
  admin_notes TEXT,
  lead_source TEXT DEFAULT 'form', -- 'form', 'manual', 'referral'
  
  -- UTM tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs(featured);
CREATE INDEX IF NOT EXISTS idx_blogs_date ON blogs(date DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_top_featured ON blogs(top_featured);

CREATE INDEX IF NOT EXISTS idx_work_category ON work(category);
CREATE INDEX IF NOT EXISTS idx_work_date ON work(date DESC);
CREATE INDEX IF NOT EXISTS idx_work_featured ON work(featured);

CREATE INDEX IF NOT EXISTS idx_capabilities_tag ON capabilities(tag);
CREATE INDEX IF NOT EXISTS idx_capabilities_sort_order ON capabilities(sort_order);

CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);
CREATE INDEX IF NOT EXISTS idx_testimonials_sort_order ON testimonials(sort_order);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON leads(priority);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);

-- Enable Row Level Security (RLS)
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE work ENABLE ROW LEVEL SECURITY;
ALTER TABLE capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on blogs" ON blogs
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on work" ON work
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on capabilities" ON capabilities
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on testimonials" ON testimonials
  FOR SELECT USING (true);

-- Leads table - no public read access (admin only)
CREATE POLICY "Allow admin read access on leads" ON leads
  FOR SELECT USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON blogs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_updated_at
  BEFORE UPDATE ON work
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_capabilities_updated_at
  BEFORE UPDATE ON capabilities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample capability tags
INSERT INTO capabilities (title, description, image_url, tag, sort_order) VALUES
('Event Strategy', 'Strategic planning and conceptualization of corporate events', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500', 'Event Strategy', 1),
('Venue & Logistics', 'Complete venue management and logistical coordination', 'https://images.unsplash.com/photo-1519167758481-83f29b0b0b5c?w=500', 'Venue & Logistics', 2),
('AV & Technical', 'Audio-visual equipment and technical support services', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500', 'AV & Technical', 3),
('Vendor Management', 'Coordination and management of all event vendors', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500', 'Vendor Management', 4),
('Guest Management', 'Complete guest experience and hospitality management', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500', 'Guest Management', 5),
('Marketing & Engagement', 'Event marketing and audience engagement strategies', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500', 'Marketing & Engagement', 6)
ON CONFLICT DO NOTHING;
