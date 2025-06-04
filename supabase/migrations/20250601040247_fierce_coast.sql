-- Drop the existing update policy
DROP POLICY IF EXISTS "Allow support count updates" ON confessions;

-- Create new policy that specifically handles support count updates
CREATE POLICY "Allow support count updates" ON confessions
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (
    -- Only allow incrementing/decrementing support_count by 1
    (
      (support_count IS NOT DISTINCT FROM (SELECT support_count + 1 FROM confessions WHERE id = confessions.id)) OR
      (support_count IS NOT DISTINCT FROM (SELECT support_count - 1 FROM confessions WHERE id = confessions.id))
    )
    -- Ensure support_count is non-negative
    AND support_count >= 0
  );