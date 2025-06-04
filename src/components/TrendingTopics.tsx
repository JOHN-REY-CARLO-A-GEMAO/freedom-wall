import React from 'react';
import { TrendingUp as TrendTingUp, TrendingDown, Minus, BarChart } from 'lucide-react';
import { useTrendingTopics } from '../hooks/useTrendingTopics';
import { Confession } from '../types';

interface TrendingTopicsProps {
  confessions: Confession[];
}

const TrendingTopics: React.FC<TrendingTopicsProps> = ({ confessions }) => {
  const { trendingTopics, isLoading, error } = useTrendingTopics(confessions);

  if (isLoading) {
    return (
      <div className="animate-pulse bg-white rounded-lg shadow-sm p-4">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (!trendingTopics.length) {
    return (
      <div className="bg-gray-50 text-gray-500 p-4 rounded-lg text-center">
        No trending topics yet
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart className="h-5 w-5 text-purple-600" />
        <h2 className="font-medium text-gray-900">Trending Topics</h2>
      </div>

      <div className="space-y-3">
        {trendingTopics.map((topic) => (
          <div key={topic.topic} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-700">{topic.topic}</span>
                {topic.trend === 'up' && (
                  <TrendTingUp className="h-4 w-4 text-green-500" />
                )}
                {topic.trend === 'down' && (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                {topic.trend === 'stable' && (
                  <Minus className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <div className="mt-1 flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${topic.percentage}%` }}
                  />
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  {topic.percentage}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Based on analysis of {confessions.length} recent confessions
      </p>
    </div>
  );
};

export default TrendingTopics;