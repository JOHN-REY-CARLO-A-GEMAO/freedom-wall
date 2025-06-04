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
        try {
          const errorBody = await response.json();
          if (errorBody && (errorBody.message || errorBody.error)) {
            throw new Error(errorBody.message || errorBody.error);
          } else {
            throw new Error(`Moderation request failed: Status ${response.status}`);
          }
        } catch (e) {
          // If parsing JSON fails or it's not a JSON error response
          if (e instanceof Error && (e.message.includes("Moderation request failed") || e.message !== 'Failed to check content')) {
            throw e; // rethrow the specific error from above
          }
          throw new Error(`Moderation request failed: Status ${response.status}`);
        }
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during content moderation.';
      setError(errorMessage);
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