import React, { useState } from 'react';
import { Heart, MessageCircle, Flag, AlertTriangle, MessageCircleHeart } from 'lucide-react';
import { formatDistanceToNow } from '../utils/dateUtils';
import { Confession } from '../types';
import Button from './ui/Button';
import CategoryBadge from './ui/CategoryBadge';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import SupportMessageForm from './SupportMessageForm';
import { useSupportMessages } from '../hooks/useSupportMessages';

interface ConfessionCardProps {
  confession: Confession;
  onSupport: (id: string) => void;
  onAddComment: (id: string, content: string) => void;
  onSupportComment: (confessionId: string, commentId: string) => void;
  onReport: (id: string) => void;
}

const ConfessionCard: React.FC<ConfessionCardProps> = ({
  confession,
  onSupport,
  onAddComment,
  onSupportComment,
  onReport,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [showTriggerWarning, setShowTriggerWarning] = useState(!confession.hasTriggerWarning);
  const [isReported, setIsReported] = useState(confession.isReported);
  const [showSupportForm, setShowSupportForm] = useState(false);

  const { sendSupportMessage } = useSupportMessages();

  const handleSupport = () => {
    onSupport(confession.id);
  };

  const handleReport = () => {
    if (!isReported) {
      onReport(confession.id);
      setIsReported(true);
    }
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleAddComment = (content: string) => {
    onAddComment(confession.id, content);
  };

  const handleSupportComment = (commentId: string) => {
    onSupportComment(confession.id, commentId);
  };

  const handleSendSupport = async (content: string) => {
    try {
      await sendSupportMessage(confession.id, content);
      setShowSupportForm(false);
    } catch (error) {
      console.error('Failed to send support message:', error);
    }
  };

  // Get the time until expiration
  const timeRemaining = formatDistanceToNow(confession.expiresAt);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Trigger Warning Banner */}
      {confession.hasTriggerWarning && !showTriggerWarning && (
        <div className="bg-amber-50 dark:bg-amber-900/50 p-2 sm:p-4 border-b border-amber-200 dark:border-amber-700">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
            <p className="text-amber-800 dark:text-amber-200 text-sm sm:text-base">
              {confession.triggerWarningText 
                ? `Trigger Warning: ${confession.triggerWarningText}` 
                : 'Trigger Warning: This post may contain sensitive content.'}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100"
            onClick={() => setShowTriggerWarning(true)}
          >
            View Content
          </Button>
        </div>
      )}

      {/* Content Section */}
      {showTriggerWarning && (
        <div className="p-3 sm:p-4">
          <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
            <CategoryBadge category={confession.category} size="sm" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Expires in {timeRemaining}
            </span>
          </div>
          
          <p className="text-gray-800 dark:text-gray-200 mb-4 font-serif text-sm sm:text-base leading-relaxed">
            {confession.content}
          </p>

          {confession.imageUrl && (
            <div className="mb-4 secure-image-container">
              <img 
                src={confession.imageUrl} 
                alt="Confession image"
                className="w-full h-auto rounded-lg shadow-sm"
                loading="lazy"
              />
            </div>
          )}
          
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button 
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-1 sm:p-0"
                onClick={handleSupport}
              >
                <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${confession.supportCount > 0 ? 'fill-purple-500 text-purple-500 dark:fill-purple-400 dark:text-purple-400' : ''}`} />
                <span className="text-xs sm:text-sm font-medium">{confession.supportCount}</span>
              </button>
              
              <button 
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors p-1 sm:p-0"
                onClick={handleToggleComments}
              >
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm font-medium">{confession.comments.length}</span>
              </button>

              <button 
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-1 sm:p-0"
                onClick={() => setShowSupportForm(true)}
              >
                <MessageCircleHeart className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Support</span>
              </button>
            </div>
            
            <button 
              className={`flex items-center space-x-1 p-1 sm:p-0 ${
                isReported 
                  ? 'text-red-500 dark:text-red-400' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400'
              } transition-colors`}
              onClick={handleReport}
              disabled={isReported}
            >
              <Flag className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs">{isReported ? 'Reported' : 'Report'}</span>
            </button>
          </div>

          {/* Support Message Form */}
          {showSupportForm && (
            <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
              <SupportMessageForm
                confessionId={confession.id}
                onSend={handleSendSupport}
                onCancel={() => setShowSupportForm(false)}
              />
            </div>
          )}
        </div>
      )}

      {/* Comments Section */}
      {showComments && showTriggerWarning && (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 border-t border-gray-100 dark:border-gray-700">
          <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-3">Comments</h3>
          
          <CommentList 
            comments={confession.comments} 
            onSupportComment={handleSupportComment} 
          />
          
          <div className="mt-4">
            <CommentForm onAddComment={handleAddComment} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfessionCard;