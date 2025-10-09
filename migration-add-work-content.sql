-- Migration: Add content field to work table
-- Run this SQL to add the content field to existing work table

-- Set search path to use web schema
SET search_path TO web, public;

-- Add content column to work table (if it doesn't exist)
ALTER TABLE work ADD COLUMN IF NOT EXISTS content TEXT;

-- Optional: Add a comment to document the column
COMMENT ON COLUMN work.content IS 'Detailed content for individual work project pages (supports Markdown)';

