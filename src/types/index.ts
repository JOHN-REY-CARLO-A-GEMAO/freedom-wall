export interface Confession {
  id: string;
  content: string;
  category: Category;
  createdAt: Date;
  expiresAt: Date;
  hasTriggerWarning: boolean;
  triggerWarningText?: string;
  supportCount: number;
  isReported: boolean;
  comments: Comment[];
  imageUrl?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  supportCount: number;
}

export type Category = 
  | 'procrastination'
  | 'food-adventures'
  | 'nap-expertise'
  | 'awkward-moments'
  | 'campus-legends'
  | 'future-plans'
  | 'random';

export interface CategoryInfo {
  value: Category;
  label: string;
  description: string;
  color: string;
}