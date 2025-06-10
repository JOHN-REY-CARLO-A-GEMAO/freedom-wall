import React from 'react';
import { Hash } from 'lucide-react';

interface HashtagBadgeProps {
  hashtag: string;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  onClick?: (hashtag: string) => void;
  className?: string;
}

const HashtagBadge: React.FC<HashtagBadgeProps> = ({ 
  hashtag, 
  count,
  size = 'md',
  onClick,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1'
  };

  const badgeClass = `inline-flex items-center rounded-full bg-purple-100 text-purple-800 font-medium ${sizeClasses[size]} ${onClick ? 'cursor-pointer hover:bg-purple-200 transition-colors' : ''} ${className}`;

  const handleClick = () => {
    if (onClick) {
      onClick(hashtag);
    }
  };

  return (
    <span className={badgeClass} onClick={handleClick}>
      <Hash className="h-3 w-3 mr-1" />
      {hashtag}
      {count !== undefined && (
        <span className="ml-1 text-purple-600 font-semibold">
          {count}
        </span>
      )}
    </span>
  );
};

export default HashtagBadge;