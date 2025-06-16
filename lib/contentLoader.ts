import fs from 'fs';
import path from 'path';
import type { SiteConfig, Page } from '../types/site';

export interface SiteData {
  site: SiteConfig['site'];
  pages: Page[];
  header?: SiteConfig['header'];
  footer?: SiteConfig['footer'];
  contentBlocks?: SiteConfig['contentBlocks'];
}

// Re-export types for backward compatibility
export type { SiteConfig, Page };

export function loadSiteData(): SiteData {
  const filePath = path.join(process.cwd(), 'public', 'site.json');
  
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const fullData: SiteConfig = JSON.parse(fileContents);
    
    // Validate required fields
    if (!fullData.site || !fullData.pages) {
      throw new Error('Invalid site.json format: missing site or pages');
    }
    
    // Validate pages
    fullData.pages.forEach((page, index) => {
      if (!page.title || !page.slug || !page.content) {
        throw new Error(`Invalid page at index ${index}: missing title, slug, or content`);
      }
    });
    
    // Return the structured data
    return {
      site: fullData.site,
      pages: fullData.pages,
      header: fullData.header,
      footer: fullData.footer,
      contentBlocks: fullData.contentBlocks
    };
  } catch (error) {
    console.error('Error loading site.json:', error);
    throw error;
  }
}

export function getPageBySlug(slug: string): Page | null {
  const siteData = loadSiteData();
  return siteData.pages.find(page => page.slug === slug) || null;
}

export function getAllPageSlugs(): string[] {
  const siteData = loadSiteData();
  return siteData.pages.map(page => page.slug);
} 