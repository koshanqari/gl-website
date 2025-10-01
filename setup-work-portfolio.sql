-- Setup Work Portfolio with Featured Support
-- Run this in Supabase SQL Editor

-- Step 1: Add featured column to work table
ALTER TABLE work ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS idx_work_featured ON work(featured);

-- Step 2: Insert sample portfolio projects (12 projects across 4 categories)

INSERT INTO work (title, description, image_url, category, date, client, attendees, location, featured) VALUES

-- FEATURED PROJECTS (3)
(
  'Global Tech Summit 2024',
  'A three-day international technology conference bringing together 2,000+ industry leaders, innovators, and decision-makers. Featured keynotes from Fortune 500 CEOs, interactive product showcases, and cutting-edge tech demonstrations across AI, blockchain, and cloud computing.',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80',
  'Conference',
  'October 2024',
  'TechCorp International',
  '2000+ Attendees',
  'Mumbai, India',
  true
),
(
  'Luxury Brand Product Launch',
  'An exclusive evening celebrating the launch of a prestigious luxury automotive brand in India. Featuring immersive VR experiences, live performance by international artists, and curated dining experience for 300 VIP guests including celebrities, influencers, and media.',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80',
  'Product Launch',
  'September 2024',
  'Luxury Auto Group',
  '300 VIP Guests',
  'New Delhi, India',
  true
),
(
  'Annual Leadership Retreat',
  'Five-day strategic planning and team building retreat for C-suite executives. Included leadership workshops, outdoor team challenges, wellness sessions, and strategic planning facilitation in a luxury resort setting with world-class amenities.',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80',
  'Corporate Event',
  'August 2024',
  'Global Finance Ltd',
  '50 Executives',
  'Goa, India',
  true
),

-- CONFERENCES (3)
(
  'Healthcare Innovation Summit',
  'Two-day medical conference showcasing latest innovations in healthcare technology and patient care. Featured panel discussions with leading doctors, interactive medical device demos, and networking sessions for healthcare professionals.',
  'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80',
  'Conference',
  'July 2024',
  'HealthTech India',
  '800 Attendees',
  'Bangalore, India',
  false
),
(
  'Annual Sales Conference 2024',
  'Pan-India sales team gathering featuring awards ceremony, motivational keynotes, product training sessions, and team building activities. High-energy event with entertainment, recognition programs, and strategic planning sessions.',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80',
  'Conference',
  'June 2024',
  'Retail Giants Inc',
  '1500 Attendees',
  'Hyderabad, India',
  false
),

-- PRODUCT LAUNCHES (2)
(
  'Smartphone Launch Event',
  'Dynamic product unveiling event featuring live demonstrations, celebrity brand ambassador, media coverage, and interactive experience zones. Integrated social media amplification with live streaming to millions.',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80',
  'Product Launch',
  'May 2024',
  'Mobile Tech Co',
  '500 Attendees',
  'Mumbai, India',
  false
),
(
  'Sustainable Fashion Collection Launch',
  'Eco-friendly fashion show and brand launch event combining runway show, influencer partnerships, sustainable lifestyle exhibition, and exclusive shopping experience for fashion industry insiders and media.',
  'https://images.unsplash.com/photo-1558008258-3256797b43f3?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80',
  'Product Launch',
  'April 2024',
  'EcoStyle Fashion',
  '250 Guests',
  'New Delhi, India',
  false
),

-- CORPORATE EVENTS (3)
(
  'Annual Employee Appreciation Gala',
  'Black-tie gala dinner celebrating employee achievements with awards ceremony, live entertainment, gourmet dining, and recognition programs. Created memorable experiences honoring exceptional performance and company milestones.',
  'https://images.unsplash.com/photo-1519167758481-83f29da1a0a?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80',
  'Corporate Event',
  'March 2024',
  'Tech Solutions Pvt Ltd',
  '600 Employees',
  'Pune, India',
  false
),
(
  'Quarterly Town Hall Meeting',
  'Company-wide town hall featuring CEO address, departmental updates, Q&A sessions, and team celebrations. Hybrid format connecting 10 offices across India with interactive engagement and live polling.',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80',
  'Corporate Event',
  'February 2024',
  'National Bank Corp',
  '3000 Employees',
  'Multiple Locations',
  false
),
(
  'Corporate Team Building Retreat',
  'Weekend team building experience combining adventure activities, problem-solving challenges, leadership workshops, and relaxation. Strengthened cross-functional collaboration and team bonding.',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80',
  'Corporate Event',
  'January 2024',
  'Consulting Firm Partners',
  '120 Team Members',
  'Lonavala, India',
  false
),

-- GALA EVENTS (2)
(
  'Charity Fundraising Gala',
  'Elegant charity event supporting education initiatives. Featured silent auction, celebrity performances, gourmet dinner, and inspiring speeches from beneficiaries. Raised significant funds while creating meaningful connections.',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80',
  'Gala Event',
  'December 2023',
  'Education Foundation',
  '400 Donors',
  'Mumbai, India',
  false
),
(
  'Industry Awards Ceremony',
  'Prestigious awards night honoring excellence in the technology sector. Red carpet arrivals, awards presentation, networking dinner, and after-party with live DJ. Celebrated innovation and achievement.',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80',
  'Gala Event',
  'November 2023',
  'Tech Industry Association',
  '350 Attendees',
  'Bangalore, India',
  false
);

