import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Category } from '../types';
import { CATEGORIES } from '../data/mockData';
import { useModeration } from '../hooks/useModeration';
import Button from './ui/Button';
import SecureImageUpload from './SecureImageUpload';

interface ConfessionFormProps {
  onAddConfession: (
    content: string, 
    category: Category, 
    hasTriggerWarning: boolean, 
    triggerWarningText?: string,
    imageUrl?: string
  ) => void;
  onCancel?: () => void;
}

const ConfessionForm: React.FC<ConfessionFormProps> = ({ 
  onAddConfession,
  onCancel 
}) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('academics');
  const [hasTriggerWarning, setHasTriggerWarning] = useState(false);
  const [triggerWarningText, setTriggerWarningText] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);

  const { checkContent, isChecking } = useModeration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    setModerationError(null);

    try {
      // Check content before submitting
      const moderationResult = await checkContent(content);

      if (!moderationResult) {
        throw new Error('Content moderation failed');
      }

      if (!moderationResult.isApproved) {
        setModerationError(moderationResult.message || 'Content not allowed');
        return;
      }
      
      // Content approved, proceed with submission
      onAddConfession(
        content, 
        category, 
        hasTriggerWarning, 
        hasTriggerWarning ? triggerWarningText : undefined,
        imageUrl
      );
      
      // Reset form
      setContent('');
      setCategory('academics');
      setHasTriggerWarning(false);
      setTriggerWarningText('');
      setImageUrl(undefined);
    } catch (error) {
      setModerationError(error instanceof Error ? error.message : 'Failed to submit confession');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="confession-content" className="block text-sm font-medium text-gray-700 mb-1">
          Share your thoughts anonymously
        </label>
        <textarea
          id="confession-content"
          rows={4}
          className="w-full rounded-md border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 font-serif"
          placeholder="What's on your mind? Your confession is completely anonymous..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={1000}
          required
        />
        <div className="mt-1 text-xs text-gray-500 flex justify-end">
          {content.length}/1000 characters
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Add an image (optional)
        </label>
        <SecureImageUpload onUpload={handleImageUpload} maxSize={10} />
      </div>

      {moderationError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{moderationError}</p>
        </div>
      )}

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          className="w-full rounded-md border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          {Object.values(CATEGORIES).map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label} - {cat.description}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-gray-50 p-3 rounded-md">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="trigger-warning"
              type="checkbox"
              className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              checked={hasTriggerWarning}
              onChange={(e) => setHasTriggerWarning(e.target.checked)}
            />
          </div>
          <div className="ml-3">
            <label htmlFor="trigger-warning" className="flex items-center text-sm font-medium text-gray-700">
              <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
              Add a trigger warning
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Use this for content that may be sensitive or potentially triggering for some readers.
            </p>
          </div>
        </div>

        {hasTriggerWarning && (
          <div className="mt-3">
            <label htmlFor="trigger-warning-text" className="block text-xs font-medium text-gray-700 mb-1">
              Specify trigger warning content (optional)
            </label>
            <input
              type="text"
              id="trigger-warning-text"
              className="w-full rounded-md border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 text-sm"
              placeholder="e.g., Anxiety, Mental Health, Academic Stress"
              value={triggerWarningText}
              onChange={(e) => setTriggerWarningText(e.target.value)}
              maxLength={100}
            />
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
        {onCancel && (
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        
        <Button 
          type="submit" 
          isLoading={isSubmitting || isChecking}
          disabled={!content.trim() || isSubmitting || isChecking}
        >
          Share Anonymously
        </Button>
      </div>
    </form>
  );
};

export default ConfessionForm;