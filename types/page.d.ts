export interface Page {
  title: string;
  slug: string;
  content: string;
  description?: string;
  category?: string;
  tags?: string[];
  date?: string; // For frontmatter compatibility
  publishedAt?: string;
  updatedAt?: string;
  readingTime?: number;
  featured?: boolean;
  draft?: boolean;
  author?: string;
  image?: string;
  seo?: PageSEO;
}

export interface PageSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

export interface PageMetadata {
  title: string;
  description?: string;
  publishedAt?: Date;
  updatedAt?: Date;
  readingTime?: number;
  wordCount?: number;
  category?: string;
  tags?: string[];
  author?: string;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  children?: TableOfContentsItem[];
}

export interface SearchResult {
  title: string;
  slug: string;
  description?: string;
  content: string;
  category?: string;
  tags?: string[];
  score: number;
}

export interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  averageTimeOnPage: number;
  bounceRate: number;
  topPages: Array<{
    slug: string;
    title: string;
    views: number;
  }>;
  topSearchQueries: Array<{
    query: string;
    count: number;
  }>;
} 