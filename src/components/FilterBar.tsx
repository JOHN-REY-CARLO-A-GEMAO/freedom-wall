import React, { useState } from 'react';
import { Search, X, Hash, TrendingUp } from 'lucide-react';
import { HashtagInfo } from '../types';
import { getTrendingHashtags } from '../utils/hashtagUtils';
import HashtagBadge from './ui/HashtagBadge';
import Button from './ui/Button';

interface FilterBarProps {
  onSearch: (term: string) => void;
  onFilterByHashtag: (hashtag: string | null) => void;
  searchTerm: string;
  activeHashtag: string | null;
  confessions: any[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  onFilterByHashtag,
  searchTerm,
  activeHashtag,
  confessions,
}) => {
  const [showAllHashtags, setShowAllHashtags] = useState(false);
  const trendingHashtags = getTrendingHashtags(confessions);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleClearSearch = () => {
    onSearch('');
  };

  const handleHashtagClick = (hashtag: string) => {
    if (activeHashtag === hashtag) {
      onFilterByHashtag(null);
    } else {
      onFilterByHashtag(hashtag);
    }
  };

  const displayedHashtags = showAllHashtags ? trendingHashtags : trendingHashtags.slice(0, 6);

  return (
    <div className="space-y-2 sm:space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="Search stories or hashtags..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <button
            className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Trending Hashtags */}
      {trendingHashtags.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-500" />
              <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Trending Hashtags
              </h3>
            </div>
            {trendingHashtags.length > 6 && (
              <button
                onClick={() => setShowAllHashtags(!showAllHashtags)}
                className="text-xs text-purple-600 hover:text-purple-700"
              >
                {showAllHashtags ? 'Show less' : 'Show all'}
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {displayedHashtags.map((hashtagInfo) => (
              <HashtagBadge
                key={hashtagInfo.tag}
                hashtag={hashtagInfo.tag}
                count={hashtagInfo.count}
                size="sm"
                onClick={handleHashtagClick}
                className={activeHashtag === hashtagInfo.tag ? 'bg-purple-600 text-white' : ''}
              />
            ))}
            
            {activeHashtag && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs py-0.5 px-2"
                onClick={() => onFilterByHashtag(null)}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Quick Hashtag Suggestions */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>💡 <strong>Popular tags:</strong> #dormlife #procrastination #foodie #studylife #campuslegends</p>
      </div>
    </div>
  );
};

export default FilterBar;