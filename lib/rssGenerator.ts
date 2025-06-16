import fs from 'fs';
import path from 'path';
import { SiteData } from './contentLoader';

export function generateRSSFeed(siteData: SiteData, baseUrl: string = 'https://your-site.com') {
  const { site, pages } = siteData;
  
  const rssItems = pages
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt || '2024-01-01');
      const dateB = new Date(b.publishedAt || '2024-01-01');
      return dateB.getTime() - dateA.getTime();
    })
    .map(page => {
      const pubDate = page.publishedAt 
        ? new Date(page.publishedAt).toUTCString()
        : new Date().toUTCString();
      
      const description = page.description || 
        page.content.replace(/[#*`]/g, '').substring(0, 200) + '...';
      
      return `
    <item>
      <title><![CDATA[${page.title}]]></title>
      <description><![CDATA[${description}]]></description>
      <link>${baseUrl}/${page.slug}</link>
      <guid isPermaLink="true">${baseUrl}/${page.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      ${page.category ? `<category><![CDATA[${page.category}]]></category>` : ''}
      ${page.tags ? page.tags.map(tag => `<category><![CDATA[${tag}]]></category>`).join('\n      ') : ''}
    </item>`;
    }).join('\n');

  const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${site.title}]]></title>
    <description><![CDATA[${site.description || 'A static site built with zyros'}]]></description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>zyros</generator>${rssItems}
  </channel>
</rss>`;

  return rssContent;
}

export function writeRSSFeed(siteData: SiteData, outputDir: string, baseUrl?: string) {
  const rssContent = generateRSSFeed(siteData, baseUrl);
  const rssPath = path.join(outputDir, 'rss.xml');
  
  fs.writeFileSync(rssPath, rssContent, 'utf8');
  console.log('✓ RSS feed generated at', rssPath);
} 