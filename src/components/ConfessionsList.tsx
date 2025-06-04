import React from 'react';
import { Confession } from '../types';
import ConfessionCard from './ConfessionCard';

interface ConfessionsListProps {
  confessions: Confession[];
  isLoading: boolean;
  onSupport: (id: string) => void;
  onAddComment: (id: string, content: string) => void;
  onSupportComment: (confessionId: string, commentId: string) => void;
  onReport: (id: string) => void;
}

const ConfessionsList: React.FC<ConfessionsListProps> = ({
  confessions,
  isLoading,
  onSupport,
  onAddComment,
  onSupportComment,
  onReport,
}) => {
  if (isLoading) {
    return (
      <div className="py-10">
        <div className="flex justify-center">
          <svg 
            className="animate-spin h-8 w-8 text-purple-600" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <p className="text-center text-gray-500 mt-4">Loading confessions...</p>
      </div>
    );
  }

  if (confessions.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-lg text-gray-600">No confessions found.</p>
        <p className="text-gray-500 mt-2">Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {confessions.map((confession) => (
        <ConfessionCard
          key={confession.id}
          confession={confession}
          onSupport={onSupport}
          onAddComment={onAddComment}
          onSupportComment={onSupportComment}
          onReport={onReport}
        />
      ))}
    </div>
  );
};

export default ConfessionsList;