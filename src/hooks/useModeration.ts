import { useState } from 'react';

interface ModerationResult {
  isApproved: boolean;
  flags: {
    hate: boolean;
    harassment: boolean;
    selfHarm: boolean;
    sexual: boolean;
    personalInfo: boolean;
  };
  message?: string;
}

export const useModeration = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkContent = async (content: string): Promise<ModerationResult | null> => {
    setIsChecking(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/moderate-content`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to check content');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to moderate content');
      return null;
    } finally {
      setIsChecking(false);
    }
  };

  return {
    checkContent,
    isChecking,
    error,
  };
};