import React from 'react';
import { Calendar, Users, Clock } from 'lucide-react';
import { Challenge } from '../types';
import Button from './ui/Button';
import { formatDistanceToNow } from '../utils/dateUtils';

interface ChallengeCardProps {
  challenge: Challenge;
  onParticipate: (challengeId: string) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onParticipate }) => {
  const timeRemaining = formatDistanceToNow(challenge.endDate);
  const hasEnded = new Date() > challenge.endDate;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg shadow-sm p-6 border border-purple-100">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-medium text-purple-900">{challenge.title}</h3>
        {challenge.isActive && !hasEnded && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        )}
      </div>

      <p className="mt-2 text-gray-600">{challenge.description}</p>

      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-2" />
          <span>
            {hasEnded ? 'Ended' : 'Ends'} in {timeRemaining}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-4 w-4 mr-2" />
          <span>{challenge.participantCount} participants</span>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-2" />
          <span>
            {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      {!hasEnded && (
        <div className="mt-6">
          <Button
            onClick={() => onParticipate(challenge.id)}
            className="w-full"
          >
            Share Your Story
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChallengeCard;