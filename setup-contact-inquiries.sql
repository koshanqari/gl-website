-- Create contact_inquiries table for "Plan My Event" form submissions
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Personal Information
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(20),
  
  -- Location Information
  country VARCHAR(100) DEFAULT 'India',
  pincode VARCHAR(10),
  state VARCHAR(100),
  city VARCHAR(100),
  
  -- Event Information
  event_type VARCHAR(50) NOT NULL,
  event_date DATE,
  budget VARCHAR(50),
  guest_count INTEGER,
  message TEXT NOT NULL,
  
  -- Status and Metadata
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'followed_up', 'closed')),
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to VARCHAR(255),
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_email ON contact_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_event_type ON contact_inquiries(event_type);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_event_date ON contact_inquiries(event_date);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_country ON contact_inquiries(country);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_state ON contact_inquiries(state);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_city ON contact_inquiries(city);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Create a policy for public insert access (form submissions)
CREATE POLICY "Anyone can submit contact inquiries."
ON contact_inquiries FOR INSERT
WITH CHECK (true);

-- Create a policy for admin full access
CREATE POLICY "Admins can manage contact inquiries."
ON contact_inquiries FOR ALL
USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_contact_inquiries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the update_contact_inquiries_updated_at function
CREATE TRIGGER update_contact_inquiries_updated_at_trigger
BEFORE UPDATE ON contact_inquiries
FOR EACH ROW
EXECUTE FUNCTION update_contact_inquiries_updated_at();

-- Insert sample contact inquiries
INSERT INTO contact_inquiries (
  name, email, company, phone, country, pincode, state, city, 
  event_type, event_date, budget, guest_count, message, status, priority
) VALUES
(
  'John Smith',
  'john.smith@techcorp.com',
  'TechCorp Solutions',
  '+91-9876543210',
  'India',
  '110001',
  'Delhi',
  'New Delhi',
  'corporate',
  '2024-03-15',
  '25k-50k',
  150,
  'We need a corporate annual conference for our tech team. Looking for a modern venue with AV capabilities and catering for 150 people.',
  'new',
  'high'
),
(
  'Sarah Johnson',
  'sarah.j@startup.com',
  'StartupHub',
  '+91-8765432109',
  'India',
  '400001',
  'Maharashtra',
  'Mumbai',
  'product-launch',
  '2024-04-20',
  '10k-25k',
  75,
  'Product launch event for our new mobile app. Need creative setup with demo stations and networking area.',
  'new',
  'medium'
),
(
  'Michael Chen',
  'michael.chen@global.com',
  'Global Enterprises',
  '+91-7654321098',
  'India',
  '560001',
  'Karnataka',
  'Bangalore',
  'conference',
  '2024-05-10',
  '50k-100k',
  300,
  'Annual sales conference for our regional team. Need venue with breakout rooms, main auditorium, and accommodation for out-of-town attendees.',
  'contacted',
  'high'
),
(
  'Emily Rodriguez',
  'emily.r@family.com',
  NULL,
  '+91-6543210987',
  'India',
  '600001',
  'Tamil Nadu',
  'Chennai',
  'wedding',
  '2024-06-15',
  'over-100k',
  200,
  'Dream wedding ceremony and reception. Looking for elegant venue with outdoor ceremony space and indoor reception hall.',
  'quoted',
  'medium'
),
(
  'David Thompson',
  'david.t@corporate.com',
  'Corporate Inc',
  '+91-5432109876',
  'India',
  '700001',
  'West Bengal',
  'Kolkata',
  'gala',
  '2024-07-22',
  '25k-50k',
  100,
  'Annual charity gala dinner. Need formal venue with stage for presentations and dance floor for entertainment.',
  'followed_up',
  'low'
);

-- Create a view for admin dashboard with formatted data
CREATE OR REPLACE VIEW contact_inquiries_summary AS
SELECT 
  id,
  name,
  email,
  company,
  phone,
  CONCAT(city, ', ', state, ', ', country) as location,
  event_type,
  event_date,
  budget,
  guest_count,
  status,
  priority,
  assigned_to,
  created_at,
  updated_at,
  CASE 
    WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 'Today'
    WHEN created_at >= NOW() - INTERVAL '7 days' THEN 'This Week'
    WHEN created_at >= NOW() - INTERVAL '30 days' THEN 'This Month'
    ELSE 'Older'
  END as time_category
FROM contact_inquiries
ORDER BY created_at DESC;
