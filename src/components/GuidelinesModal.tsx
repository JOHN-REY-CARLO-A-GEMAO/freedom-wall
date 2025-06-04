import React from 'react';
import { X, Sparkles, AlertTriangle, MessageSquare, Users, Shield } from 'lucide-react';
import Button from './ui/Button';

interface GuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuidelinesModal: React.FC<GuidelinesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold flex items-center">
            <Sparkles className="h-6 w-6 text-purple-600 mr-2" />
            Community Guidelines
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="mb-6 text-gray-700">
            Campus Chronicles is your space for sharing epic tales, hilarious moments, and legendary stories. 
            Let's keep it fun and awesome for everyone! 🎉
          </p>

          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-medium flex items-center mb-2 text-purple-700">
                <Shield className="h-5 w-5 mr-2" />
                The Fun Rules
              </h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Keep it anonymous - no real names or personal details</li>
                <li>Stories vanish after 30 days (like your lecture notes 😉)</li>
                <li>Be creative, be funny, be awesome!</li>
                <li>No spoiling other people's fun</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-medium flex items-center mb-2 text-purple-700">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Not Cool, Don't Do It
              </h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>No mean stuff or bullying</li>
                <li>No spam or fake stories</li>
                <li>No sharing other people's secrets</li>
                <li>No NSFW content (keep it PG-13)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-medium flex items-center mb-2 text-purple-700">
                <MessageSquare className="h-5 w-5 mr-2" />
                Epic Communication
              </h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Be funny and supportive in comments</li>
                <li>Share your similar experiences</li>
                <li>Use emojis liberally! 🎉</li>
                <li>Keep the memes coming</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-medium flex items-center mb-2 text-purple-700">
                <Users className="h-5 w-5 mr-2" />
                Building the Legend
              </h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Share your epic wins and hilarious fails</li>
                <li>Create new campus legends</li>
                <li>Make people laugh and smile</li>
                <li>Keep it fun and lighthearted</li>
              </ul>
            </section>

            <div className="bg-purple-50 p-4 rounded-md border border-purple-100 mt-6">
              <p className="text-purple-800 font-medium">Remember:</p>
              <p className="text-purple-700 mt-2">
                This is your space to share fun stories, create legends, and make people laugh. 
                Keep it awesome! 🌟
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <Button onClick={onClose}>
            Let's go! 🚀
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuidelinesModal;