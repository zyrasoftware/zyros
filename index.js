/**
 * zyros - A developer-friendly static site generator
 * 
 * Main entry point for the npm package
 */

// Warn users if they're trying to use this as a regular dependency
console.warn('\n⚠️  WARNING: zyros is a CLI tool, not a library dependency!');
console.warn('Instead of "npm install zyros", you should use:');
console.warn('  • npx zyros@latest init my-project (recommended)');
console.warn('  • npm install -g zyros (for global install)');
console.warn('See: https://github.com/zyrasoftware/zyros\n');

const path = require('path');
const fs = require('fs');

// Export core functionality
module.exports = {
  // Core functions
  loadSiteData: require('./lib/contentLoader').loadSiteData,
  generateSite: require('./scripts/build').generateSite,
  
  // CLI utilities
  createPost: require('./scripts/cli').createPost,
  listPosts: require('./scripts/cli').listPosts,
  
  // Template system
  getTemplates: require('./scripts/template').getTemplates,
  applyTemplate: require('./scripts/template').applyTemplate,
  
  // Validation
  validateSiteData: require('./scripts/validate').validateSiteData,
  
  // Optimization
  optimizeImages: require('./scripts/optimize').optimizeImages,
  
  // Deployment helpers
  deployToVercel: require('./scripts/deploy').deployToVercel,
  deployToNetlify: require('./scripts/deploy').deployToNetlify,
  
  // Constants
  VERSION: require('./package.json').version,
  DEFAULT_CONFIG: {
    site: {
      title: 'My Site',
      theme: 'light',
      description: 'A site built with zyros'
    },
    pages: []
  }
}; 