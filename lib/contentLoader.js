const fs = require('fs');
const path = require('path');

function loadSiteData() {
  const filePath = path.join(process.cwd(), 'public', 'site.json');
  
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const fullData = JSON.parse(fileContents);
    
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

function getPageBySlug(slug) {
  const siteData = loadSiteData();
  return siteData.pages.find(page => page.slug === slug) || null;
}

function getAllPageSlugs() {
  const siteData = loadSiteData();
  return siteData.pages.map(page => page.slug);
}

module.exports = {
  loadSiteData,
  getPageBySlug,
  getAllPageSlugs
}; 