export type IBlog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: 'EARNING' | 'PRODUCTIVITY' | 'SAFETY' | 'LIFESTYLE';
  tags: string[];
  coverImage?: string;
  readTimeMin: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
};
