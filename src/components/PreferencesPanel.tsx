import React from 'react';
import { Settings, Moon, Sun, Eye, EyeOff } from 'lucide-react';
import { usePreferences } from '../hooks/usePreferences';
import { CATEGORIES } from '../data/mockData';
import Button from './ui/Button';

interface PreferencesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PreferencesPanel: React.FC<PreferencesPanelProps> = ({ isOpen, onClose }) => {
  const {
    preferences,
    updateTheme,
    toggleFavoriteCategory,
    updateContentFilters,
  } = usePreferences();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-medium">Preferences</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close panel</span>
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Theme Selection */}
          <section>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Theme</h3>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={preferences.theme === 'light' ? 'primary' : 'ghost'}
                onClick={() => updateTheme('light')}
                icon={<Sun className="h-4 w-4" />}
              >
                Light
              </Button>
              <Button
                size="sm"
                variant={preferences.theme === 'dark' ? 'primary' : 'ghost'}
                onClick={() => updateTheme('dark')}
                icon={<Moon className="h-4 w-4" />}
              >
                Dark
              </Button>
            </div>
          </section>

          {/* Favorite Categories */}
          <section>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Favorite Categories
            </h3>
            <div className="space-y-2">
              {Object.values(CATEGORIES).map((category) => (
                <button
                  key={category.value}
                  onClick={() => toggleFavoriteCategory(category.value)}
                  className={`flex items-center w-full p-2 rounded-md transition-colors ${
                    preferences.favoriteCategories.includes(category.value)
                      ? 'bg-purple-100 text-purple-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="flex-1 text-left">{category.label}</span>
                  {preferences.favoriteCategories.includes(category.value) && (
                    <span className="text-purple-600">★</span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Content Filters */}
          <section>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Content Filters
            </h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={preferences.contentFilters.showTriggerWarnings}
                  onChange={(e) =>
                    updateContentFilters({
                      showTriggerWarnings: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">
                  Show trigger warnings
                </span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={preferences.contentFilters.hideReportedContent}
                  onChange={(e) =>
                    updateContentFilters({
                      hideReportedContent: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">
                  Hide reported content
                </span>
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPanel;