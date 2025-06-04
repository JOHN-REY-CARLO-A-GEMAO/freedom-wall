import React, { useState } from 'react';
import { MessageCircleHeart } from 'lucide-react';
import Button from './ui/Button';
import { useModeration } from '../hooks/useModeration';

interface SupportMessageFormProps {
  confessionId: string;
  onSend: (content: string) => Promise<void>;
  onCancel: () => void;
}

const SupportMessageForm: React.FC<SupportMessageFormProps> = ({
  confessionId,
  onSend,
  onCancel,
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { checkContent, isChecking } = useModeration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Check content before sending
      const moderationResult = await checkContent(content);

      if (!moderationResult?.isApproved) {
        setError(moderationResult?.message || 'Message not allowed');
        return;
      }

      await onSend(content);
      setContent('');
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="support-message" className="block text-sm font-medium text-gray-700 mb-1">
          Send an anonymous supportive message
        </label>
        <textarea
          id="support-message"
          rows={3}
          className="w-full rounded-md border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          placeholder="Share your words of support..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
          required
        />
        <div className="mt-1 text-xs text-gray-500 flex justify-end">
          {content.length}/500 characters
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting || isChecking}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          icon={<MessageCircleHeart className="h-4 w-4" />}
          isLoading={isSubmitting || isChecking}
          disabled={!content.trim() || isSubmitting || isChecking}
        >
          Send Support
        </Button>
      </div>
    </form>
  );
};

export default SupportMessageForm;