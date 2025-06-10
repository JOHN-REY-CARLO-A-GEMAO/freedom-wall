import React, { useState, useRef, useEffect } from 'react';
import { Hash, X } from 'lucide-react';
import { extractHashtags, isValidHashtag } from '../utils/hashtagUtils';

interface HashtagInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

const HashtagInput: React.FC<HashtagInputProps> = ({
  value,
  onChange,
  placeholder = "Share your thoughts... Use #hashtags to categorize!",
  maxLength = 1000
}) => {
  const [hashtags, setHashtags] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const extractedHashtags = extractHashtags(value);
    setHashtags(extractedHashtags);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const removeHashtag = (hashtagToRemove: string) => {
    const regex = new RegExp(`#${hashtagToRemove}\\b`, 'gi');
    const newValue = value.replace(regex, '').replace(/\s+/g, ' ').trim();
    onChange(newValue);
  };

  const addHashtag = (hashtag: string) => {
    if (isValidHashtag(hashtag) && !hashtags.includes(hashtag)) {
      const newValue = `${value} #${hashtag}`.trim();
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <textarea
          ref={textareaRef}
          rows={4}
          className="w-full rounded-md border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 font-serif resize-none"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          maxLength={maxLength}
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
          {value.length}/{maxLength}
        </div>
      </div>

      {hashtags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Hash className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Your hashtags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((hashtag) => (
              <span
                key={hashtag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
              >
                #{hashtag}
                <button
                  type="button"
                  onClick={() => removeHashtag(hashtag)}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p>💡 <strong>Tip:</strong> Use hashtags like #procrastination #foodie #dormlife to help others find your story!</p>
      </div>
    </div>
  );
};

export default HashtagInput;