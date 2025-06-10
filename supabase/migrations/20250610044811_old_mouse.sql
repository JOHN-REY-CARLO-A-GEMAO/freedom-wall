/*
  # Update confessions table for hashtag support

  1. Schema Changes
    - Remove `category` column from confessions table
    - Add `hashtags` column as text array to store user-generated hashtags
    - Update existing data to maintain compatibility

  2. Security
    - Maintain existing RLS policies
    - No changes to authentication or permissions

  3. Data Migration
    - Safely migrate existing category data to hashtags format
    - Preserve all existing confession data
*/

-- Add hashtags column to confessions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'confessions' AND column_name = 'hashtags'
  ) THEN
    ALTER TABLE confessions ADD COLUMN hashtags text[] DEFAULT '{}';
  END IF;
END $$;

-- Migrate existing category data to hashtags (if category column exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'confessions' AND column_name = 'category'
  ) THEN
    -- Convert existing categories to hashtags
    UPDATE confessions 
    SET hashtags = ARRAY[
      CASE category
        WHEN 'procrastination' THEN 'procrastination'
        WHEN 'food-adventures' THEN 'foodie'
        WHEN 'nap-expertise' THEN 'napmaster'
        WHEN 'awkward-moments' THEN 'awkward'
        WHEN 'campus-legends' THEN 'campuslegends'
        WHEN 'future-plans' THEN 'futureplans'
        WHEN 'random' THEN 'random'
        ELSE 'general'
      END
    ]
    WHERE hashtags = '{}' OR hashtags IS NULL;
    
    -- Drop the category column after migration
    ALTER TABLE confessions DROP COLUMN IF EXISTS category;
  END IF;
END $$;

-- Update indexes for better hashtag search performance
CREATE INDEX IF NOT EXISTS idx_confessions_hashtags ON confessions USING GIN (hashtags);