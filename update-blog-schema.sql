-- Update blogs table to support top_featured and featured
-- Run this in Supabase SQL Editor

-- Add top_featured column
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS top_featured BOOLEAN DEFAULT FALSE;

-- Create index for top_featured
CREATE INDEX IF NOT EXISTS idx_blogs_top_featured ON blogs(top_featured);

-- Ensure only one blog can be top_featured at a time
-- This is a check constraint, but we'll handle it in application logic
-- for better user experience

-- Optional: If you want to enforce at database level (commented out)
-- CREATE OR REPLACE FUNCTION ensure_single_top_featured()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   IF NEW.top_featured = TRUE THEN
--     UPDATE blogs SET top_featured = FALSE WHERE id != NEW.id;
--   END IF;
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER enforce_single_top_featured
--   BEFORE INSERT OR UPDATE ON blogs
--   FOR EACH ROW
--   EXECUTE FUNCTION ensure_single_top_featured();

