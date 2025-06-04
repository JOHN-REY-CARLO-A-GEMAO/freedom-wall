import React from 'react';
import { Category, CategoryInfo } from '../../types';
import { CATEGORIES } from '../../data/mockData';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ 
  category, 
  size = 'md',
  className = '' 
}) => {
  const categoryInfo: CategoryInfo | undefined = CATEGORIES[category];
  
  // Return null if category is not found
  if (!categoryInfo) {
    console.warn(`Category "${category}" not found in CATEGORIES`);
    return null;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1'
  };

  const badgeClass = `inline-flex items-center rounded-full ${categoryInfo.color} text-white font-medium ${sizeClasses[size]} ${className}`;

  return (
    <span className={badgeClass}>
      {categoryInfo.label}
    </span>
  );
};

export default CategoryBadge;