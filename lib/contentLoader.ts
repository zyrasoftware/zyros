import fs from 'fs';
import path from 'path';
import type { SiteConfig, Page } from '../types/site';
import fsPromises from 'fs/promises';
import matter from 'gray-matter';

export interface SiteData {
  site: SiteConfig['site'];
  pages: Page[];
  header?: SiteConfig['header'] | null;
  footer?: SiteConfig['footer'] | null;
  contentBlocks?: SiteConfig['contentBlocks'] | null;
  designSystem?: SiteConfig['designSystem'] | null;
  customTheme?: SiteConfig['customTheme'] | null;
  ui?: SiteConfig['ui'] | null;
  animations?: SiteConfig['animations'] | null;
  layout?: SiteConfig['layout'] | null;
  floatingElements?: SiteConfig['floatingElements'] | null;
  customButtons?: SiteConfig['customButtons'] | null;
}

// Re-export types for backward compatibility
export type { SiteConfig, Page };

export function loadSiteData(): SiteData {
  const filePath = path.join(process.cwd(), 'public', 'site.json');
  
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const fullData: SiteConfig = JSON.parse(fileContents);
    
    // Debug logging
    console.log('🔍 Loading site.json...');
    console.log('📄 CustomButtons found in file:', !!fullData.customButtons);
    console.log('🎯 CustomButtons content:', fullData.customButtons);
    
    // Validate required fields
    if (!fullData.site) {
      throw new Error('Invalid site.json format: missing site');
    }
    
    // Validate pages if they exist
    if (fullData.pages && Array.isArray(fullData.pages)) {
    fullData.pages.forEach((page, index) => {
      if (!page.title || !page.slug || !page.content) {
        throw new Error(`Invalid page at index ${index}: missing title, slug, or content`);
      }
    });
    }
    
    // Return the structured data
    const result = {
      site: fullData.site,
      pages: fullData.pages || [],
      header: fullData.header || null,
      footer: fullData.footer || null,
      contentBlocks: fullData.contentBlocks || null,
      designSystem: fullData.designSystem || null,
      customTheme: fullData.customTheme || null,
      ui: fullData.ui || null,
      animations: fullData.animations || null,
      layout: fullData.layout || null,
      floatingElements: fullData.floatingElements || null,
      customButtons: fullData.customButtons || null
    };

    console.log('📦 Result customButtons:', result.customButtons);
    console.log('✅ Data loading complete');

    // Remove undefined values to prevent serialization issues
    Object.keys(result).forEach(key => {
      if (result[key as keyof typeof result] === undefined) {
        delete result[key as keyof typeof result];
      }
    });

    return result;
  } catch (error) {
    console.error('Error loading site.json:', error);
    throw error;
  }
}

export function getPageBySlug(slug: string): Page | null {
  const siteData = loadSiteData();
  if (!siteData.pages || !Array.isArray(siteData.pages)) {
    return null;
  }
  return siteData.pages.find(page => page.slug === slug) || null;
}

export function getAllPageSlugs(): string[] {
  const siteData = loadSiteData();
  if (!siteData.pages || !Array.isArray(siteData.pages)) {
    return [];
  }
  return siteData.pages.map(page => page.slug);
}

/**
 * Enhanced content loader that supports both site.json and markdown files
 * Addresses scalability concerns by supporting multi-file content structure
 */

interface ContentConfig {
  contentDir?: string;
  useMarkdownFiles?: boolean;
  fallbackToSiteJson?: boolean;
}

export async function loadContent(
  configPath: string = 'public/site.json',
  options: ContentConfig = {}
): Promise<SiteData> {
  const {
    contentDir = 'content',
    useMarkdownFiles = true,
    fallbackToSiteJson = true
  } = options;

  // Try to load from markdown files first (new approach)
  if (useMarkdownFiles) {
    try {
      const markdownContent = await loadFromMarkdownFiles(contentDir);
      if (markdownContent) {
        return markdownContent;
      }
    } catch (error) {
      console.warn('Failed to load from markdown files, falling back to site.json:', error);
    }
  }

  // Fallback to traditional site.json approach
  if (fallbackToSiteJson) {
    return loadFromSiteJson(configPath);
  }

  throw new Error('No content source available');
}

/**
 * Load content from individual markdown files
 * Structure: content/site.json + content/pages/*.md + content/posts/*.md
 */
async function loadFromMarkdownFiles(contentDir: string): Promise<SiteData | null> {
  const contentPath = path.resolve(process.cwd(), contentDir);
  
  // Check if content directory exists
  try {
    await fsPromises.access(contentPath);
  } catch {
    return null;
  }

  // Load site configuration
  const siteConfigPath = path.join(contentPath, 'site.json');
  let siteConfig: any = {};
  
  try {
    const siteConfigContent = await fsPromises.readFile(siteConfigPath, 'utf-8');
    siteConfig = JSON.parse(siteConfigContent);
  } catch (error) {
    console.warn('No site.json found in content directory, using defaults');
  }

  // Load pages from markdown files
  const pages: Page[] = [];
  
  // Load from content/pages/
  const pagesDir = path.join(contentPath, 'pages');
  try {
    const pageFiles = await fsPromises.readdir(pagesDir);
    const markdownFiles = pageFiles.filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
    
    for (const file of markdownFiles) {
      const filePath = path.join(pagesDir, file);
      const page = await parseMarkdownFile(filePath, 'page');
      if (page) pages.push(page);
    }
  } catch (error) {
    // Pages directory doesn't exist, that's okay
  }

  // Load from content/posts/
  const postsDir = path.join(contentPath, 'posts');
  try {
    const postFiles = await fsPromises.readdir(postsDir);
    const markdownFiles = postFiles.filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
    
    for (const file of markdownFiles) {
      const filePath = path.join(postsDir, file);
      const post = await parseMarkdownFile(filePath, 'post');
      if (post) pages.push(post);
    }
  } catch (error) {
    // Posts directory doesn't exist, that's okay
  }

  return {
    site: {
      title: 'My Site',
      description: 'A modern static site built with Zyros',
      ...siteConfig
    },
    pages: pages.sort((a, b) => {
      // Sort by date if available, otherwise by title
      if (a.publishedAt && b.publishedAt) {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
      return a.title.localeCompare(b.title);
    })
  };
}

/**
 * Parse a markdown file with frontmatter
 */
async function parseMarkdownFile(filePath: string, defaultType: string = 'page'): Promise<Page | null> {
  try {
    const fileContent = await fsPromises.readFile(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);
    
    const fileName = path.basename(filePath, path.extname(filePath));
    const slug = frontmatter.slug || fileName;
    
    return {
      slug,
      title: frontmatter.title || fileName,
      content,
      description: frontmatter.description || frontmatter.excerpt || '',
      publishedAt: frontmatter.date || frontmatter.publishedAt || new Date().toISOString(),
      category: frontmatter.category || defaultType,
      tags: frontmatter.tags || [],
      author: frontmatter.author || '',
      readingTime: calculateReadingTime(content),
      ...frontmatter // Include any additional frontmatter fields
    };
  } catch (error) {
    console.warn(`Failed to parse markdown file ${filePath}:`, error);
    return null;
  }
}

/**
 * Calculate reading time for content
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Traditional site.json loader (existing functionality)
 */
async function loadFromSiteJson(configPath: string): Promise<SiteData> {
  // ... existing loadSiteData implementation ...
  try {
    const configContent = await fsPromises.readFile(configPath, 'utf-8');
    return JSON.parse(configContent);
  } catch (error) {
    throw new Error(`Failed to load site configuration from ${configPath}: ${error}`);
  }
} 