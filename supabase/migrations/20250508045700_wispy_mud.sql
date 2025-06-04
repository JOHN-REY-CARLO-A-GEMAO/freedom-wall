/*
  # Add support messages table

  1. New Tables
    - `support_messages`
      - `id` (uuid, primary key)
      - `confession_id` (text, references confessions)
      - `content` (text)
      - `created_at` (timestamp)
      - `is_read` (boolean)

  2. Security
    - Enable RLS on `support_messages` table
    - Add policy for authenticated users to create messages
    - Add policy for confession authors to read their messages
*/

CREATE TABLE IF NOT EXISTS support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  confession_id text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_read boolean DEFAULT false
);

ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

-- Allow any authenticated user to create support messages
CREATE POLICY "Users can create support messages"
  ON support_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow users to read support messages for their confessions
CREATE POLICY "Users can read support messages for their confessions"
  ON support_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM confessions
      WHERE confessions.id = support_messages.confession_id
      AND confessions.user_id = auth.uid()
    )
  );