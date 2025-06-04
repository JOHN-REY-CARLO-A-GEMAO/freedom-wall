import React, { useState } from 'react';
import { Sparkles, HelpCircle, FileText, Settings } from 'lucide-react';
import GuidelinesModal from './GuidelinesModal';
import PreferencesPanel from './PreferencesPanel';

const Header: React.FC = () => {
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  return (
    <header className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 sm:py-6">
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Campus Chronicles</h1>
              <p className="text-xs sm:text-sm text-purple-100">Where Every Story is Legendary</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button 
              className="flex items-center space-x-1 text-purple-100 hover:text-white transition-colors p-2"
              onClick={() => setShowGuidelines(true)}
            >
              <FileText className="h-5 w-5" />
              <span className="hidden sm:inline text-sm">Guidelines</span>
            </button>

            <button 
              className="flex items-center space-x-1 text-purple-100 hover:text-white transition-colors p-2"
              onClick={() => setShowPreferences(true)}
            >
              <Settings className="h-5 w-5" />
              <span className="hidden sm:inline text-sm">Preferences</span>
            </button>
          </div>
        </div>

        <div className="py-3 sm:py-4 border-t border-purple-400/30">
          <div className="flex items-center text-purple-100">
            <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
            <p className="text-xs sm:text-sm">
              Share your epic tales and legendary moments! All posts vanish in 30 days, 
              like your homework deadline memories. 😄
            </p>
          </div>
        </div>
      </div>

      <GuidelinesModal 
        isOpen={showGuidelines} 
        onClose={() => setShowGuidelines(false)} 
      />

      <PreferencesPanel
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
      />
    </header>
  );
};

export default Header;