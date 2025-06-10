import React, { useState, useEffect } from 'react';
import { useConfessions } from '../hooks/useConfessions';
import Header from '../components/Header';
import ConfessionForm from '../components/ConfessionForm';
import ConfessionsList from '../components/ConfessionsList';
import FilterBar from '../components/FilterBar';
import TrendingTopics from '../components/TrendingTopics';
import Button from '../components/ui/Button';
import { Plus, X } from 'lucide-react';

const HomePage: React.FC = () => {
  const {
    confessions,
    isLoading,
    error,
    addConfession,
    addComment,
    supportConfession,
    supportComment,
    reportConfession,
    filterByHashtag,
    searchConfessions,
  } = useConfessions();

  const [filteredConfessions, setFilteredConfessions] = useState(confessions);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null);
  const [showNewConfessionForm, setShowNewConfessionForm] = useState(false);

  useEffect(() => {
    let results = confessions;
    
    if (activeHashtag) {
      results = filterByHashtag(activeHashtag);
    }
    
    if (searchTerm) {
      results = searchConfessions(searchTerm);
    }
    
    setFilteredConfessions(results);
  }, [confessions, searchTerm, activeHashtag]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterByHashtag = (hashtag: string | null) => {
    setActiveHashtag(hashtag);
  };

  const handleAddConfession = (
    content: string, 
    hashtags: string[],
    hasTriggerWarning: boolean, 
    triggerWarningText?: string
  ) => {
    addConfession(content, hashtags, hasTriggerWarning, triggerWarningText);
    setShowNewConfessionForm(false);
    setSearchTerm('');
    setActiveHashtag(null);
  };

  const handleHashtagClick = (hashtag: string) => {
    setActiveHashtag(hashtag);
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-6">
        {error && (
          <div className="mb-3 sm:mb-6 bg-red-50 dark:bg-red-900 p-3 rounded-md border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-6">
            <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 pt-2 pb-3 space-y-3">
              {showNewConfessionForm ? (
                <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
                      Share your epic tale
                    </h2>
                    <button 
                      className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 p-1" 
                      onClick={() => setShowNewConfessionForm(false)}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <ConfessionForm 
                    onAddConfession={handleAddConfession} 
                    onCancel={() => setShowNewConfessionForm(false)}
                  />
                </div>
              ) : (
                <Button 
                  onClick={() => setShowNewConfessionForm(true)}
                  className="w-full sm:w-auto text-sm"
                  icon={<Plus className="h-4 w-4 sm:h-5 sm:w-5" />}
                >
                  Share your story
                </Button>
              )}

              <FilterBar 
                onSearch={handleSearch}
                onFilterByHashtag={handleFilterByHashtag}
                searchTerm={searchTerm}
                activeHashtag={activeHashtag}
                confessions={confessions}
              />
            </div>

            <ConfessionsList 
              confessions={filteredConfessions}
              isLoading={isLoading}
              onSupport={supportConfession}
              onAddComment={addComment}
              onSupportComment={supportComment}
              onReport={reportConfession}
              onHashtagClick={handleHashtagClick}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-3 sm:space-y-6">
            <aside className="lg:sticky lg:top-4">
              <TrendingTopics confessions={confessions} />
            </aside>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 mt-6 sm:mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
            <p>Campus Chronicles: Where Every Story is Legendary © 2025</p>
            <p className="mt-1">A place for sharing your most epic (and embarrassing) campus moments!</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;