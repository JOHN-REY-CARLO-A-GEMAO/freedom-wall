import React from 'react';
import { Trophy } from 'lucide-react';
import { Challenge } from '../types';
import ChallengeCard from './ChallengeCard';

interface WeeklyChallengesProps {
  challenges: Challenge[];
  onParticipate: (challengeId: string) => void;
}

const WeeklyChallenges: React.FC<WeeklyChallengesProps> = ({ challenges, onParticipate }) => {
  const activeChallenge = challenges.find(c => c.isActive);

  if (!challenges.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Trophy className="h-5 w-5 text-purple-600" />
        <h2 className="font-medium text-gray-900">Weekly Challenge</h2>
      </div>

      {activeChallenge ? (
        <ChallengeCard
          challenge={activeChallenge}
          onParticipate={onParticipate}
        />
      ) : (
        <div className="bg-gray-50 text-gray-500 p-4 rounded-lg text-center">
          No active challenges at the moment
        </div>
      )}
    </div>
  );
};

export default WeeklyChallenges;