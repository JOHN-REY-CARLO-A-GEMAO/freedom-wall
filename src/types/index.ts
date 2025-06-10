export interface Confession {
  id: string;
  content: string;
  hashtags: string[];
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

export interface HashtagInfo {
  tag: string;
  count: number;
  trending: boolean;
}