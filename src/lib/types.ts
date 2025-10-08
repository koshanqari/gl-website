// Database types for PostgreSQL

export interface Blog {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  date: string;
  read_time: string;
  author: string;
  author_image_url: string;
  top_featured: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Work {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  date: string;
  client: string;
  attendees: string;
  location: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  name: string;
  designation: string;
  company: string;
  content: string;
  image_url?: string;
  rating: number;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Capability {
  id: number;
  title: string;
  description: string;
  image_url: string;
  tag: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: number;
  name: string | null;
  phone: string | null;
  email: string | null;
  company: string | null;
  
  // Step 1: Basic Information
  step1_completed_at: string | null;
  preferred_connect_date: string | null;
  preferred_connect_time: string | null;
  preferred_connect_mode: string[] | null;
  
  // Step 2: Service & Project Details
  step2_completed_at: string | null;
  project_date: string | null;
  project_country: string | null;
  project_pincode: string | null;
  project_region: string | null;
  project_city: string | null;
  target_count: number | null;
  service_type: string[] | null;
  
  // Step 3: Additional Details
  step3_completed_at: string | null;
  additional_details: string | null;
  
  // Admin fields
  status: string;
  priority: string;
  admin_notes: string | null;
  lead_source: string;
  
  // UTM tracking
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}
