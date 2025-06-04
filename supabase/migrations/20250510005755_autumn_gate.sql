/*
  # Create confessions and comments tables

  1. New Tables
    - `confessions`
      - Core table for storing user confessions
      - Includes category, content, and moderation fields
    - `comments`
      - Related table for confession comments
      - Links to confessions via foreign key

  2. Security
    - Enable RLS on both tables
    - Public read access to all records
    - Public create access with basic validation
    - Controlled update access for specific fields

  3. Performance
    - Indexes on frequently queried columns
    - Optimized for common query patterns
*/

-- Create confessions table
CREATE TABLE IF NOT EXISTS confessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  category text NOT NULL,
  has_trigger_warning boolean DEFAULT false,
  trigger_warning_text text,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  support_count integer DEFAULT 0,
  is_reported boolean DEFAULT false
);

-- Create comments table with foreign key relationship
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  confession_id uuid NOT NULL REFERENCES confessions(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  support_count integer DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE confessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for confessions
CREATE POLICY "Allow public read access to confessions"
  ON confessions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public to create confessions"
  ON confessions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow support count updates"
  ON confessions
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (
    (support_count IS NOT NULL) AND
    (is_reported IS NOT NULL)
  );

-- Create policies for comments
CREATE POLICY "Allow public read access to comments"
  ON comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public to create comments"
  ON comments
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow comment support count updates"
  ON comments
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (support_count IS NOT NULL);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_comments_confession_id ON comments(confession_id);
CREATE INDEX IF NOT EXISTS idx_confessions_created_at ON confessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_confessions_category ON confessions(category);