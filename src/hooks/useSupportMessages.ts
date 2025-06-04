import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const useSupportMessages = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendSupportMessage = async (confessionId: string, content: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('support_messages')
        .insert([{ 
          confession_id: confessionId, 
          content 
        }]);

      if (insertError) throw insertError;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send support message';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendSupportMessage,
    isLoading,
    error,
  };
};