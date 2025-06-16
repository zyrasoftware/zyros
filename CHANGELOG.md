# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-01-30

### 🎉 Major Release - NPM Package Ready!

This is a major release that transforms zyros into a fully-featured npm package with comprehensive CLI tools and enhanced functionality.

### Added

#### 📦 NPM Package & CLI
- **Global installation support** - Install with `npm install -g zyros`
- **Comprehensive CLI tool** - Full command-line interface with `zyros` command
- **Project initialization** - Create new projects with `zyros init`
- **Template system** - Multiple starter templates for different use cases
- **Content management CLI** - Create, list, delete, and manage content from terminal

#### 🎨 Templates & Themes
- **Multiple templates** - Default, portfolio, documentation, business, minimal
- **Template management** - List, apply, and create custom templates
- **Enhanced theme system** - 8 beautiful built-in themes
- **Custom theme support** - Create and use custom themes

#### 🔍 Validation & Optimization
- **Content validation** - Validate site structure and content integrity
- **Image optimization** - Automatic image compression and WebP generation
- **Asset optimization** - CSS and JS minification
- **Performance optimization** - Built-in performance enhancements

#### 🚀 Deployment & DevOps
- **One-click deployment** - Deploy to Vercel, Netlify, GitHub Pages, AWS S3
- **Deployment configuration** - Automatic config generation for platforms
- **Build optimization** - Enhanced build process with RSS and sitemap generation
- **Environment support** - Development and production environment handling

#### 🛠️ Developer Experience
- **TypeScript definitions** - Full type safety and IntelliSense support
- **Enhanced CLI** - Beautiful terminal output with colors and spinners
- **Project validation** - Comprehensive project structure validation
- **Error handling** - Improved error messages and debugging

#### 📊 Analytics & SEO
- **Enhanced analytics** - Improved privacy-first analytics system
- **SEO optimization** - Advanced meta tags, Open Graph, and structured data
- **RSS feed generation** - Automatic RSS feed creation
- **Sitemap generation** - SEO-friendly XML sitemaps

### Enhanced

#### 🎯 Core Features
- **Improved build system** - Faster builds with better optimization
- **Enhanced search** - Better search performance and accuracy
- **Mobile optimization** - Improved mobile experience and performance
- **Accessibility** - Enhanced keyboard navigation and screen reader support

#### 📝 Content Management
- **Rich content support** - Enhanced Markdown rendering with more features
- **Content statistics** - Detailed analytics about your content
- **Reading time calculation** - Automatic reading time estimation
- **Content organization** - Better categorization and tagging system

#### 🎨 User Interface
- **Improved animations** - Smoother transitions and micro-interactions
- **Better responsive design** - Enhanced mobile and tablet experience
- **Theme switching** - Improved theme switching with better persistence
- **Loading states** - Better loading indicators and skeleton screens

### Fixed

#### 🐛 Bug Fixes
- **Build process** - Fixed various build-related issues
- **Theme switching** - Resolved theme persistence issues
- **Search functionality** - Fixed search indexing and performance
- **Mobile navigation** - Improved mobile menu behavior
- **Image handling** - Better image loading and optimization

#### 🔧 Technical Improvements
- **Memory usage** - Optimized memory consumption during builds
- **Bundle size** - Reduced JavaScript bundle size
- **CSS optimization** - Improved CSS generation and minification
- **Error boundaries** - Better error handling and recovery

### Changed

#### 💔 Breaking Changes
- **Package structure** - Reorganized for npm distribution
- **CLI interface** - New command structure (old scripts still work)
- **Configuration format** - Enhanced site.json schema (backward compatible)
- **Build output** - Changed from `.next` to `dist` directory

#### 🔄 Migrations
- **Automatic migration** - Existing projects are automatically updated
- **Backward compatibility** - Old configurations continue to work
- **Gradual adoption** - New features are opt-in

### Security

#### 🔒 Security Improvements
- **Dependency updates** - Updated all dependencies to latest secure versions
- **Input validation** - Enhanced validation for user inputs
- **XSS protection** - Improved cross-site scripting protection
- **Content Security Policy** - Better CSP headers for deployed sites

## [1.0.0] - 2024-01-01

### Added
- Initial release of zyros
- JSON-based content management
- 8 beautiful themes
- Markdown support with syntax highlighting
- Static site generation with Next.js
- Responsive design
- Search functionality
- Analytics dashboard
- Social sharing
- Newsletter subscription
- Reading progress indicator
- Table of contents
- Copy code blocks
- Theme switching

### Features
- **Core functionality** - Basic static site generation
- **Theme system** - 8 built-in themes
- **Content management** - JSON-based content system
- **Search** - Basic search functionality
- **Analytics** - Privacy-first analytics
- **Social features** - Sharing and newsletter

---

## Upgrade Guide

### From 1.x to 2.0

1. **Install the new version**:
   ```bash
   npm install -g zyros
   ```

2. **Update your project**:
   ```bash
   cd your-project
   zyros validate
   ```

3. **Use new CLI commands**:
   ```bash
   # Old way
   npm run content:create
   
   # New way
   zyros content create
   ```

4. **Update build scripts** (optional):
   ```json
   {
     "scripts": {
       "dev": "zyros dev",
       "build": "zyros build",
       "deploy": "zyros deploy vercel"
     }
   }
   ```

### Migration Notes

- All existing projects continue to work without changes
- New CLI commands provide enhanced functionality
- Old npm scripts are still supported
- Configuration format is backward compatible
- Build output directory changed from `.next` to `dist`

---

## Support

- 📖 [Documentation](https://github.com/zyrasoftware/zyros)
- 💬 [Community](https://github.com/zyrasoftware/zyros/discussions)
- 🐛 [Issues](https://github.com/zyrasoftware/zyros/issues)
- 📧 [Email](mailto:hello@zyra.software) 