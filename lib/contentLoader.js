const fs = require('fs');
const path = require('path');

function loadSiteData() {
  const filePath = path.join(process.cwd(), 'public', 'site.json');
  
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const fullData = JSON.parse(fileContents);
    
    // Debug logging
    console.log('🔍 Loading site.json (JS version)...');
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
      header: fullData.header,
      footer: fullData.footer,
      contentBlocks: fullData.contentBlocks,
      designSystem: fullData.designSystem,
      customTheme: fullData.customTheme,
      ui: fullData.ui,
      animations: fullData.animations,
      layout: fullData.layout,
      floatingElements: fullData.floatingElements,
      customButtons: fullData.customButtons
    };

    console.log('📦 Result customButtons (JS):', result.customButtons);
    console.log('✅ Data loading complete (JS)');

    return result;
  } catch (error) {
    console.error('Error loading site.json:', error);
    throw error;
  }
}

function getPageBySlug(slug) {
  const siteData = loadSiteData();
  if (!siteData.pages || !Array.isArray(siteData.pages)) {
    return null;
  }
  return siteData.pages.find(page => page.slug === slug) || null;
}

function getAllPageSlugs() {
  const siteData = loadSiteData();
  if (!siteData.pages || !Array.isArray(siteData.pages)) {
    return [];
  }
  return siteData.pages.map(page => page.slug);
}

module.exports = {
  loadSiteData,
  getPageBySlug,
  getAllPageSlugs
}; 