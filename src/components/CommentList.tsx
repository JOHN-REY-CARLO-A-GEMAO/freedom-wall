import React from 'react';
import { Heart } from 'lucide-react';
import { Comment } from '../types';
import { formatDistanceToNow } from '../utils/dateUtils';

interface CommentListProps {
  comments: Comment[];
  onSupportComment: (commentId: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, onSupportComment }) => {
  if (comments.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-white p-3 rounded-md shadow-sm">
          <p className="text-gray-800 font-serif text-sm">{comment.content}</p>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(comment.createdAt)} ago
            </span>
            
            <button 
              className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors"
              onClick={() => onSupportComment(comment.id)}
            >
              <Heart className={`h-4 w-4 ${comment.supportCount > 0 ? 'fill-purple-500 text-purple-500' : ''}`} />
              <span className="text-xs font-medium">{comment.supportCount}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;