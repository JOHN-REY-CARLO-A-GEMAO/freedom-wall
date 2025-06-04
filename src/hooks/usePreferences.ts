import { useState, useEffect } from 'react';
import { Category } from '../types';

interface Preferences {
  theme: 'light' | 'dark';
  favoriteCategories: Category[];
  contentFilters: {
    showTriggerWarnings: boolean;
    hideReportedContent: boolean;
  };
}

const DEFAULT_PREFERENCES: Preferences = {
  theme: 'light',
  favoriteCategories: [],
  contentFilters: {
    showTriggerWarnings: true,
    hideReportedContent: false,
  },
};

const STORAGE_KEY = 'campus-confessions-preferences';

export const usePreferences = () => {
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedPreferences = JSON.parse(stored);
        setPreferences(parsedPreferences);
        
        // Apply theme to document
        document.documentElement.classList.toggle('dark', parsedPreferences.theme === 'dark');
      } catch (error) {
        console.error('Failed to parse stored preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    
    // Apply theme to document
    document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
  }, [preferences]);

  const updateTheme = (theme: 'light' | 'dark') => {
    setPreferences(prev => ({ ...prev, theme }));
  };

  const toggleFavoriteCategory = (category: Category) => {
    setPreferences(prev => {
      const favorites = prev.favoriteCategories.includes(category)
        ? prev.favoriteCategories.filter(c => c !== category)
        : [...prev.favoriteCategories, category];
      return { ...prev, favoriteCategories: favorites };
    });
  };

  const updateContentFilters = (filters: Partial<Preferences['contentFilters']>) => {
    setPreferences(prev => ({
      ...prev,
      contentFilters: { ...prev.contentFilters, ...filters },
    }));
  };

  return {
    preferences,
    updateTheme,
    toggleFavoriteCategory,
    updateContentFilters,
  };
};