/**
 * Extract hashtags from text content
 */
export const extractHashtags = (content: string): string[] => {
  const hashtagRegex = /#[a-zA-Z0-9_]+/g;
  const matches = content.match(hashtagRegex);
  
  if (!matches) return [];
  
  // Remove duplicates and clean up hashtags
  const uniqueHashtags = [...new Set(matches.map(tag => 
    tag.toLowerCase().replace('#', '')
  ))];
  
  return uniqueHashtags;
};

/**
 * Format hashtag for display
 */
export const formatHashtag = (hashtag: string): string => {
  return `#${hashtag}`;
};

/**
 * Validate hashtag format
 */
export const isValidHashtag = (hashtag: string): boolean => {
  const hashtagRegex = /^[a-zA-Z0-9_]+$/;
  return hashtagRegex.test(hashtag) && hashtag.length >= 2 && hashtag.length <= 30;
};

/**
 * Get trending hashtags from confessions
 */
export const getTrendingHashtags = (confessions: any[]): HashtagInfo[] => {
  const hashtagCounts = new Map<string, number>();
  
  confessions.forEach(confession => {
    if (confession.hashtags) {
      confession.hashtags.forEach((hashtag: string) => {
        hashtagCounts.set(hashtag, (hashtagCounts.get(hashtag) || 0) + 1);
      });
    }
  });
  
  // Convert to array and sort by count
  const hashtagArray = Array.from(hashtagCounts.entries()).map(([tag, count]) => ({
    tag,
    count,
    trending: count >= 3 // Consider trending if used 3+ times
  }));
  
  return hashtagArray.sort((a, b) => b.count - a.count).slice(0, 10);
};

/**
 * Highlight hashtags in text
 */
export const highlightHashtags = (content: string): string => {
  return content.replace(/#[a-zA-Z0-9_]+/g, (match) => {
    return `<span class="text-purple-600 font-medium hover:text-purple-700 cursor-pointer">${match}</span>`;
  });
};