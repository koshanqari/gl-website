-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  avatar_url VARCHAR(500),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at);

-- Create RLS policies
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON testimonials
  FOR SELECT USING (true);

-- Allow admin full access (this will be handled by service role)
CREATE POLICY "Allow admin full access" ON testimonials
  FOR ALL USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_testimonials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_testimonials_updated_at();

-- Insert sample testimonials
INSERT INTO testimonials (name, position, company, content, avatar_url, rating, featured) VALUES
('Sarah Johnson', 'Marketing Director', 'TechCorp Solutions', 'Golden Lotus transformed our annual conference into an unforgettable experience. Their attention to detail and creative approach exceeded all our expectations.', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format&q=80', 5, true),
('Michael Chen', 'CEO', 'InnovateLabs', 'The team at Golden Lotus delivered a flawless product launch event. Their professionalism and innovative solutions made our brand shine.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80', 5, true),
('Emily Rodriguez', 'Event Manager', 'Global Enterprises', 'Working with Golden Lotus was a game-changer. They understood our vision and brought it to life with exceptional execution and creativity.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format&q=80', 5, true),
('David Thompson', 'VP Operations', 'StartupHub', 'Golden Lotus made our corporate retreat seamless and engaging. Their team handled every detail perfectly, allowing us to focus on our business.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80', 5, false),
('Lisa Wang', 'Head of Marketing', 'GrowthTech', 'The creativity and professionalism of Golden Lotus is unmatched. They turned our brand activation into a memorable experience for all attendees.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face&auto=format&q=80', 5, false),
('James Wilson', 'Founder', 'NextGen Ventures', 'Golden Lotus delivered beyond our expectations. Their strategic approach and flawless execution made our investor event a huge success.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format&q=80', 5, false);
