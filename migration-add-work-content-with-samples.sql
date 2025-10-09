-- Migration: Add content field to work table and populate with sample markdown content
-- Run this SQL to add the content field and sample content to existing work table

-- Set search path to use web schema
SET search_path TO web, public;

-- Add content column to work table (if it doesn't exist)
ALTER TABLE work ADD COLUMN IF NOT EXISTS content TEXT;

-- Optional: Add a comment to document the column
COMMENT ON COLUMN work.content IS 'Detailed content for individual work project pages (supports Markdown)';

-- Update existing work items with sample markdown content
-- This demonstrates the markdown capabilities available in the content field

-- Sample 1: Conference Event
UPDATE work 
SET content = E'# Event Overview

This flagship technology conference brought together industry leaders, innovators, and tech enthusiasts for three days of inspiration and networking.

## Key Highlights

### Day 1: Innovation & Technology
- **Keynote Speakers**: Featured C-level executives from Fortune 500 companies
- **Tech Demos**: Live demonstrations of cutting-edge technologies
- **Networking Sessions**: Structured networking with industry leaders

### Day 2: Workshops & Breakout Sessions
Our team organized 12 parallel tracks covering:
- Artificial Intelligence & Machine Learning
- Cloud Computing & DevOps
- Cybersecurity Best Practices
- Future of Work & Digital Transformation

### Day 3: Awards & Closing Ceremony
- Recognition of innovation excellence
- Startup pitch competition
- Closing keynote and networking dinner

## Our Services Delivered

### 🎯 Event Strategy
- Comprehensive event planning and timeline management
- Speaker coordination and content curation
- Attendee engagement strategy

### 🏢 Venue & Logistics
- Multi-track venue setup with state-of-the-art AV
- Registration and badge management
- Transportation and accommodation coordination

### 🎥 Technical Production
- Professional audio-visual setup
- Live streaming to 5000+ remote attendees
- Recording and post-event content distribution

### 🎨 Branding & Experience
- Custom event branding and signage
- Mobile event app development
- Interactive exhibition spaces

## Results & Impact

> "The event exceeded all our expectations. The seamless execution and attention to detail made this our most successful conference to date." - Event Sponsor

**Key Metrics:**
- ✅ **2000+** in-person attendees
- ✅ **5000+** virtual participants  
- ✅ **98%** attendee satisfaction rate
- ✅ **45+** hours of curated content
- ✅ **Zero** technical issues during live sessions

## Photo Gallery

The event featured stunning stage designs, interactive exhibition booths, and memorable networking spaces that fostered meaningful connections.

---

*Interested in organizing a similar event? [Contact us](/contact) to discuss your requirements.*'
WHERE category = 'Conference' 
LIMIT 1;

-- Sample 2: Product Launch
UPDATE work 
SET content = E'# Product Launch Excellence

A high-impact product launch event that generated buzz and drove immediate market interest for our client\'s revolutionary new product.

## Event Concept

The launch was designed as an immersive experience, taking attendees on a journey from problem identification to solution revelation.

### Pre-Launch Campaign
- Teaser campaign across social media
- Influencer partnerships and media outreach
- Exclusive preview for VIP guests

### The Main Event

#### 🎪 Venue Transformation
We transformed a historic venue into a futuristic showcase:
- **Interactive Product Zones**: Hands-on demonstrations
- **Immersive Brand Experience**: 360° projection mapping
- **Social Media Stations**: Instagram-worthy moments at every corner

#### 🎤 Program Flow
1. **Opening Act** - Dynamic visual presentation
2. **Problem Statement** - Executive keynote
3. **The Reveal** - Dramatic product unveiling
4. **Live Demonstration** - Product in action
5. **Q&A & Networking** - Media and influencer engagement

## Technical Excellence

### Audio Visual Setup
- **4K LED Screens**: 20ft x 10ft main display
- **Lighting Design**: Custom programmed light show
- **Sound System**: Crystal-clear audio with wireless mics
- **Live Streaming**: Multi-camera professional broadcast

### Event Technology
- Custom event app with:
  - Real-time schedule updates
  - Product information access
  - Networking features
  - Live polling and Q&A

## Media Coverage

The event garnered significant attention:

- 📰 **50+** media outlets covered the launch
- 📱 **10M+** social media impressions
- 🎥 **2M+** live stream views
- 📊 **85%** media sentiment positive

## Client Testimonial

> "Golden Lotus Events transformed our product launch into an unforgettable experience. The attention to detail and creative execution exceeded our wildest expectations."
> 
> — *Marketing Director, Product Team*

## Post-Event Impact

- 🚀 **500%** increase in product page visits
- 💰 **$2M+** in pre-orders within 48 hours
- 📈 **300%** boost in brand awareness
- ⭐ **4.9/5** average product rating

---

**Ready to launch your next big thing?** [Let\'s talk](/contact)'
WHERE category = 'Product Launch' 
LIMIT 1;

-- Sample 3: Corporate Event
UPDATE work 
SET content = E'# Corporate Event Excellence

A sophisticated corporate event that seamlessly blended business objectives with memorable experiences.

## Event Profile

### Objectives
- Strengthen team cohesion across departments
- Celebrate company milestones and achievements
- Unveil strategic vision for the upcoming year
- Foster networking among leadership teams

### Event Structure

#### Morning Session: Strategic Summit
- **CEO Address**: Company vision and strategy
- **Department Presentations**: Key achievements and goals
- **Panel Discussion**: Industry trends and opportunities

#### Afternoon: Team Building Activities
- **Collaborative Challenges**: Problem-solving exercises
- **Innovation Workshop**: Design thinking sessions
- **Networking Lunch**: Curated seating for cross-team connections

#### Evening: Awards Gala
- **Recognition Ceremony**: Employee excellence awards
- **Entertainment**: Live band and cultural performances
- **Networking Dinner**: Fine dining experience

## Venue & Setup

### Venue Selection
We selected a premium hotel with:
- ✓ 500-person ballroom capacity
- ✓ Multiple breakout rooms
- ✓ State-of-the-art AV infrastructure
- ✓ Accommodation for out-of-town guests

### Décor & Ambiance
- **Theme**: "Future Forward" with modern minimalist design
- **Color Palette**: Corporate blues with gold accents
- **Lighting**: Dynamic LED setup with custom programming
- **Floral Arrangements**: Contemporary centerpieces

## Logistics Management

### Guest Management
- Digital invitation and RSVP system
- Personalized name badges with QR codes
- Welcome kits with event schedule and swag

### Catering
- Multi-cuisine buffet with 20+ dishes
- Dietary accommodations (vegan, gluten-free, etc.)
- Premium beverage selection
- Dessert station with custom-branded items

### Transportation
- Shuttle service from corporate office
- Valet parking arrangements
- Airport pickup for VIP guests

## Technology Integration

### Event App Features
- Real-time agenda updates
- Interactive venue maps
- Live voting for awards
- Photo sharing platform
- Feedback collection

### Audio Visual
- Professional stage setup
- Wireless presentation system
- Live recording for absent employees
- Social media live streaming

## Outcomes & Success Metrics

| Metric | Target | Achieved |
|--------|--------|----------|
| Attendance Rate | 90% | 96% |
| Employee Satisfaction | 4.0/5 | 4.7/5 |
| Engagement Score | 75% | 89% |
| On-time Execution | 100% | 100% |

## Feedback Highlights

**What attendees loved most:**
- 🎯 Well-organized and seamless execution
- 🤝 Excellent networking opportunities
- 🎤 Engaging speakers and content
- 🍽️ Outstanding catering quality
- 🎨 Beautiful venue and décor

## Photography & Memories

Professional photography captured every moment, from candid team interactions to formal award ceremonies, creating a lasting visual record of this milestone event.

---

*Planning your next corporate event? [Schedule a consultation](/contact) with our team.*'
WHERE category = 'Corporate Event' 
LIMIT 1;

-- Sample 4: Gala Event
UPDATE work 
SET content = E'# Elegant Gala Evening

An exquisite black-tie gala that raised significant funds while providing guests with an unforgettable evening of elegance and entertainment.

## Event Vision

Create a sophisticated fundraising gala that:
- Celebrates organizational achievements
- Raises funds for charitable causes
- Provides world-class entertainment
- Creates lasting memories for donors and supporters

## The Experience

### Red Carpet Arrival
- Professional photographers capturing arrivals
- Step-and-repeat branding wall
- Welcome champagne reception
- Live string quartet performance

### Main Event Flow

#### 🍸 Cocktail Hour (7:00 PM - 8:00 PM)
- Premium bar with signature cocktails
- Gourmet hors d\'oeuvres
- Silent auction preview
- Networking among distinguished guests

#### 🍽️ Dinner Service (8:00 PM - 9:30 PM)
- **Five-course chef-curated menu**
- Wine pairing with each course
- Live entertainment between courses
- CEO welcome address

#### 🎤 Program (9:30 PM - 10:30 PM)
- Mission impact video presentation
- Beneficiary testimonials
- Live auction with professional auctioneer
- Fund-a-need paddle raise
- Award presentations

#### 🎵 After Party (10:30 PM - 1:00 AM)
- Live band performance
- Dance floor with DJ
- Dessert and coffee bar
- Photo booth with props

## Design & Décor

### Theme: "A Night Under the Stars"

**Visual Elements:**
- Crystal chandeliers and twinkling lights
- Dramatic ceiling draping in midnight blue
- Elegant floral centerpieces with gold accents
- Custom-designed stage backdrop

**Table Settings:**
- Fine china and crystal glassware
- Gold Chiavari chairs with velvet cushions
- Personalized place cards with calligraphy
- Ambient candlelight throughout

## Entertainment

### Musical Performances
- **Opener**: Classical quartet
- **Dinner**: Jazz ensemble
- **Main Act**: Renowned performer (2-song set)
- **Dance Party**: Professional DJ and live band rotation

### Special Features
- Surprise celebrity appearance
- Professional dancers for flash mob
- Live painting artist creating event artwork
- Fireworks finale

## Fundraising Success

### Revenue Generated
- Ticket Sales: **$250,000**
- Live Auction: **$180,000**
- Silent Auction: **$75,000**
- Fund-a-Need: **$120,000**
- Corporate Sponsorships: **$200,000**

**Total Raised: $825,000** *(exceeded goal by 38%)*

### Auction Highlights
Top auction items included:
- Private villa vacation in Tuscany
- VIP concert tickets with backstage passes
- Luxury watch collection
- Original artwork by local artist
- Wine cellar experience with sommelier

## Sponsor Recognition

### Title Sponsor Benefits
- Prominent logo placement throughout venue
- Speaking opportunity during program
- VIP table for 10 guests
- Recognition in all event materials

### Supporting Sponsors
Special thanks to 15 corporate sponsors who made this event possible through their generous support.

## Guest Experience

> "The most elegant and well-executed gala I\'ve attended in years. Every detail was perfect."
> 
> — *Board Member*

**Attendee Satisfaction:**
- 🌟 **4.9/5** overall rating
- 🎭 **97%** would attend again
- 💝 **92%** increased donation commitment
- 🗣️ **100%** would recommend to others

## Media & Publicity

- Featured in 3 major newspapers
- 20+ social media influencers in attendance
- Professional videographer captured highlights
- Post-event recap video shared across platforms

## Legacy & Impact

The funds raised will directly support:
- ✅ 50 scholarships for underprivileged students
- ✅ New community center construction
- ✅ Healthcare access programs
- ✅ Arts education initiatives

---

*Planning a gala or fundraising event? [Let us help you create magic](/contact).*'
WHERE category = 'Gala Event' 
LIMIT 1;

-- Sample 5: Generic template for other categories
UPDATE work 
SET content = E'# Project Overview

This exceptional event showcased our expertise in delivering world-class experiences that exceed client expectations.

## Event Highlights

### Planning & Preparation
Our team worked closely with the client to understand their vision and objectives, creating a comprehensive event plan that covered every detail.

**Key Planning Elements:**
- Strategic timeline development
- Vendor selection and management
- Budget optimization
- Risk assessment and mitigation

### Execution Excellence

#### Venue & Setup
- Professional venue selection and inspection
- Complete layout design and floor planning
- Technical infrastructure setup
- Safety and compliance management

#### Guest Experience
- Seamless registration process
- Engaging event programming
- Quality catering and hospitality
- Memorable takeaways and branding

#### Technical Production
- Professional audio-visual equipment
- Stage and lighting design
- Live streaming and recording
- Technical support throughout

## Services Provided

### 🎯 Event Strategy & Consultation
Complete event conceptualization and strategic planning to ensure alignment with client objectives.

### 📋 Project Management
End-to-end coordination of all event elements with dedicated project managers.

### 🎨 Creative Design
Custom branding, collateral design, and visual experience creation.

### 🔧 Technical Support
Professional AV equipment, technical staff, and backup systems.

### 🤝 Vendor Coordination
Management of all third-party vendors including catering, entertainment, and décor.

### 📊 Post-Event Analysis
Comprehensive reporting and insights for continuous improvement.

## Results & Impact

The event achieved all primary objectives:
- ✅ Exceeded attendance targets
- ✅ High participant satisfaction
- ✅ Stayed within budget
- ✅ Generated positive media coverage
- ✅ Strengthened brand presence

## Client Feedback

> "Working with Golden Lotus Events was an absolute pleasure. Their professionalism, attention to detail, and creative approach made our event truly memorable."
> 
> — *Client Representative*

## Photo Gallery

Professional photography captured the essence of the event, from setup to teardown, documenting every memorable moment.

---

**Ready to create your next unforgettable event?** [Contact us today](/contact) to discuss your vision.'
WHERE content IS NULL OR content = '';

COMMIT;

-- Verification query to check updated records
SELECT id, title, category, 
       CASE 
         WHEN content IS NOT NULL AND length(content) > 100 THEN 'Content Added ✓'
         ELSE 'No Content'
       END as content_status,
       length(content) as content_length
FROM work 
ORDER BY id;

