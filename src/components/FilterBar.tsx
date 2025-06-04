import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Category } from '../types';
import { CATEGORIES } from '../data/mockData';
import Button from './ui/Button';

interface FilterBarProps {
  onSearch: (term: string) => void;
  onFilterByCategory: (category: Category | null) => void;
  searchTerm: string;
  activeCategory: Category | null;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  onFilterByCategory,
  searchTerm,
  activeCategory,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleClearSearch = () => {
    onSearch('');
  };

  const handleCategoryClick = (category: Category) => {
    if (activeCategory === category) {
      onFilterByCategory(null);
    } else {
      onFilterByCategory(category);
    }
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <button
            className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div>
        <div className="flex items-center space-x-2 mb-1.5 sm:mb-2">
          <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 dark:text-gray-400" />
          <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Categories</h3>
        </div>
        
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {Object.values(CATEGORIES).map((category) => (
            <button
              key={category.value}
              onClick={() => handleCategoryClick(category.value)}
              className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium transition-all ${
                activeCategory === category.value
                  ? `${category.color} text-white shadow-sm`
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category.label}
            </button>
          ))}
          
          {activeCategory && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs py-0.5 px-2"
              onClick={() => onFilterByCategory(null)}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;