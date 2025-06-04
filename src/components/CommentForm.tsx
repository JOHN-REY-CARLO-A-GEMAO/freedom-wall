import React, { useState } from 'react';
import Button from './ui/Button';

interface CommentFormProps {
  onAddComment: (content: string) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onAddComment }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate a slight delay to show loading state
    setTimeout(() => {
      onAddComment(content);
      setContent('');
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label htmlFor="comment" className="sr-only">
        Add a supportive comment
      </label>
      <textarea
        id="comment"
        rows={2}
        placeholder="Add a supportive comment..."
        className="w-full rounded-md border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 text-sm p-2 resize-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={500}
        required
      />
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {content.length}/500 characters
        </span>
        
        <Button 
          type="submit" 
          size="sm" 
          isLoading={isSubmitting}
          disabled={!content.trim() || isSubmitting}
        >
          Post comment
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;