import { useState, useEffect } from 'react';
import { Confession } from '../types';

interface TrendingTopic {
  topic: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export const useTrendingTopics = (confessions: Confession[]) => {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const analyzeTopics = () => {
      try {
        setIsLoading(true);
        
        // Common keywords to look for in confessions
        const topicKeywords = {
          'Academic Stress': ['exam', 'study', 'grade', 'assignment', 'professor', 'class'],
          'Mental Health': ['anxiety', 'stress', 'depression', 'overwhelmed', 'therapy'],
          'Social Life': ['friend', 'party', 'social', 'lonely', 'relationship'],
          'Career Concerns': ['job', 'internship', 'future', 'career', 'interview'],
          'Campus Life': ['dorm', 'roommate', 'campus', 'housing', 'dining'],
        };

        // Count occurrences of each topic
        const topicCounts = new Map<string, number>();
        const totalConfessions = confessions.length;

        confessions.forEach(confession => {
          const content = confession.content.toLowerCase();
          
          Object.entries(topicKeywords).forEach(([topic, keywords]) => {
            if (keywords.some(keyword => content.includes(keyword))) {
              topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
            }
          });
        });

        // Calculate percentages and determine trends
        const topics = Array.from(topicCounts.entries()).map(([topic, count]) => {
          const percentage = (count / totalConfessions) * 100;
          
          // Simple trend calculation (could be enhanced with historical data)
          const trend: 'up' | 'down' | 'stable' = percentage > 30 ? 'up' : 
                                                 percentage < 10 ? 'down' : 
                                                 'stable';

          return {
            topic,
            count,
            percentage: Math.round(percentage),
            trend,
          };
        });

        // Sort by count in descending order
        const sortedTopics = topics.sort((a, b) => b.count - a.count);
        
        setTrendingTopics(sortedTopics);
      } catch (err) {
        setError('Failed to analyze trending topics');
        console.error('Error analyzing topics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (confessions.length > 0) {
      analyzeTopics();
    }
  }, [confessions]);

  return {
    trendingTopics,
    isLoading,
    error,
  };
};