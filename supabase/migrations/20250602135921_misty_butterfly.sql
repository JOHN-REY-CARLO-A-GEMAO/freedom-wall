-- Drop the existing update policy
DROP POLICY IF EXISTS "Allow support count updates" ON confessions;

-- Create new policy that specifically handles support count updates
CREATE POLICY "Allow support count updates" ON confessions
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (
    -- Only allow updating support_count and is_reported fields
    (
      (support_count IS NOT DISTINCT FROM (SELECT support_count + 1 FROM confessions WHERE id = id)) OR
      (support_count IS NOT DISTINCT FROM (SELECT support_count - 1 FROM confessions WHERE id = id)) OR
      (is_reported IS NOT DISTINCT FROM true)
    )
    -- Ensure support_count is non-negative
    AND (support_count >= 0)
  );