# 🚀 zyros 

⚫ Name changed from Zyros-ssg to Zyros.

A **developer-friendly static site generator** built with Next.js and Tailwind CSS. Transform a simple JSON file into a beautiful, fast static website with powerful features that developers and content creators love.

![zyros](https://img.shields.io/badge/zyros-v2.0.6-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![npm](https://img.shields.io/npm/v/zyros)
![License](https://img.shields.io/npm/l/zyros)
![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)

## DEMO
**https://zyros.vercel.app/**
![Demo](p0s9gqg.jpg)

## ✨ Features

### 🎯 Core Features
- 📄 **JSON-based content management** - Define your entire site in a single JSON file
- 🎨 **8 Beautiful themes** - Choose from light, dark, minimal, ocean, sunset, forest, midnight, and neon themes
- 📝 **Enhanced Markdown support** - Write content in Markdown with beautiful rendering and syntax highlighting
- ⚡ **Static generation** - Lightning-fast sites with Next.js static export
- 📱 **Responsive design** - Mobile-first, beautiful on all devices with smooth animations
- 🎯 **Zero configuration** - Works out of the box

### 🔍 Advanced Search & Discovery
- 🔍 **Smart search** - Built-in fuzzy search with keyboard shortcuts (⌘+K)
- 🏷️ **Advanced filtering** - Filter by categories, tags, and publication date
- 📊 **Search analytics** - Track popular search queries and optimize content

### 🎨 User Experience
- 🌈 **Dynamic theme switcher** - Real-time theme switching with local storage persistence
- 📖 **Reading progress** - Visual progress bar and reading time estimation
- 📑 **Table of contents** - Auto-generated navigation for long articles
- 📋 **Copy code blocks** - One-click copying with visual feedback
- ⌨️ **Keyboard navigation** - Full keyboard accessibility support
- 🎭 **Smooth animations** - Beautiful transitions and micro-interactions

### 📊 Analytics & Insights
- 📈 **Built-in analytics** - Track page views, reading time, and user engagement
- 🔍 **Search analytics** - Monitor what users are searching for
- 🎨 **Theme preferences** - Understand which themes are most popular
- 📊 **Performance metrics** - Monitor scroll depth and content engagement
- 💾 **Privacy-first** - All analytics stored locally, no external tracking

### 🚀 Social & Engagement
- 📤 **Social sharing** - Share articles on Twitter, Facebook, LinkedIn with native support
- 📧 **Newsletter subscription** - Built-in email collection with local storage
- 🔗 **Copy link sharing** - Easy link copying with visual feedback
- 📱 **Mobile sharing** - Native mobile sharing API support

### 🛠️ Developer Tools
- 🖥️ **CLI content management** - Create, edit, and manage content from the command line
- 📊 **Content statistics** - View detailed stats about your content
- 🔧 **TypeScript support** - Full type safety and better developer experience
- 📦 **Plugin-ready architecture** - Extensible design for future enhancements
- 🎨 **Template system** - Multiple starter templates for different use cases
- 🔍 **Content validation** - Validate your content structure and catch errors
- 🖼️ **Image optimization** - Automatic image compression and WebP generation
- 🚀 **One-click deployment** - Deploy to Vercel, Netlify, GitHub Pages, and more

### 📊 SEO & Performance
- 📊 **SEO optimized** - Automatic meta tags, Open Graph, and structured data
- 🚀 **Performance optimized** - Lighthouse scores of 100/100
- 📱 **Mobile-first** - Responsive design that works on all devices
- 🔍 **Search engine friendly** - Optimized for discoverability
- 📡 **RSS feed generation** - Automatic RSS feed for your content
- 🗺️ **Sitemap generation** - SEO-friendly sitemaps

## 🚀 Quick Start

### Installation & Setup

The easiest way to get started with zyros is using npx:

```bash
# Create a new project (gets complete zyros project)
npx zyros init my-blog

# Navigate to your project
cd my-blog

# Start development server (dependencies auto-installed!)
npm run dev
```

Your site will be available at `http://localhost:3000`!

### What You Get

When you run `npx zyros init`, you get a **complete copy** of the entire zyros project including:

- ✅ **All components** - Advanced search, content blocks, forms, layouts (including Layout.tsx)
- ✅ **All themes** - 8 beautiful themes ready to use
- ✅ **Demo content** - Rich example content to learn from
- ✅ **Full functionality** - Analytics, social sharing, newsletter, etc.
- ✅ **Development tools** - TypeScript, ESLint, Tailwind CSS configured
- ✅ **Deployment ready** - Build scripts and deployment configurations
- ✅ **Dependencies included** - No need to run npm install separately!
- ✅ **Production tested** - Thoroughly validated and error-free

### Alternative Installation Methods

#### Global Installation
```bash
# Install globally to use zyros command anywhere
npm install -g zyros

# Then create projects
zyros init my-blog
```

#### Local Development
```bash
# Clone for contributing or customization
git clone https://github.com/zyrasoftware/zyros.git
cd zyros
npm install
npm run dev
```

## 📁 Project Structure

When you run `npx zyros init my-blog`, you get the complete project structure:

```
my-blog/
├── components/            # React components
│   ├── Layout.tsx        # Main layout component
│   ├── ContentBlocks.tsx # Advanced content blocks
│   ├── AdvancedSearch.tsx # Search functionality
│   └── ...               # All other components
├── pages/                # Next.js pages
│   ├── index.tsx         # Homepage
│   ├── [slug].tsx        # Dynamic pages
│   └── analytics.tsx     # Analytics dashboard
├── styles/               # Styling
│   ├── globals.css       # Global styles
│   └── themes.ts         # Theme definitions
├── lib/                  # Utilities
│   ├── contentLoader.ts  # Content loading logic
│   └── analytics.ts      # Analytics functions
├── public/               # Static assets
│   ├── site.json         # Your content and configuration
│   ├── favicon.svg       # Site favicon
│   └── ...               # Other assets
├── types/                # TypeScript definitions
├── scripts/              # Build and utility scripts
├── next.config.ts        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## 🎨 Themes

Choose from eight stunning themes, each with unique color palettes and visual styles:

### Available Themes
- **Light** - Clean and bright with excellent readability
- **Dark** - Easy on the eyes with modern dark aesthetics  
- **Minimal** - Simple and elegant stone-inspired design
- **Ocean** - Cool and refreshing cyan-blue gradients
- **Sunset** - Warm and vibrant orange-pink tones
- **Forest** - Natural and calming emerald-green palette
- **Midnight** - Deep and mysterious purple-slate combination
- **Neon** - Bold and electric green-on-black cyberpunk style

### Usage
```json
{
  "site": {
    "theme": "ocean"
  }
}
```

### Dynamic Theme Switching
Users can switch themes in real-time using the theme switcher in the header. Theme preferences are automatically saved to local storage.

## 📝 Content Format

### Site Configuration

```json
{
  "site": {
    "title": "Your Site Title",
    "theme": "light",
    "description": "Your site description",
    "author": "Your Name",
    "url": "https://yoursite.com"
  },
  "pages": [
    {
      "title": "Page Title",
      "slug": "url-slug",
      "content": "# Your Markdown Content\n\nWrite your content here...",
      "description": "Page description for SEO",
      "category": "blog",
      "tags": ["tag1", "tag2"],
      "publishedAt": "2024-01-15",
      "readingTime": 5
    }
  ]
}
```

### Markdown Support

zyros supports full Markdown syntax:

- **Headers** (`# ## ###`)
- **Bold** and *italic* text
- [Links](https://example.com)
- Lists (ordered and unordered)
- `Code blocks` and syntax highlighting
- > Blockquotes
- Tables
- Images
- And more!

## 🛠️ CLI Commands

### Content Management
```bash
# Create a new post
zyros content create

# List all posts
zyros content list

# Delete a post
zyros content delete

# Show content statistics
zyros content stats
```

### Project Management
```bash
# Initialize new project
zyros init my-site

# Build for production
zyros build

# Start development server
zyros dev

# Validate content and structure
zyros validate

# Optimize images and assets
zyros optimize
```

### Template Management
```bash
# List available templates
zyros template list

# Apply a template
zyros template apply minimal

# Create custom template
zyros template create my-template
```

### Deployment
```bash
# Deploy to Vercel
zyros deploy vercel

# Deploy to Netlify
zyros deploy netlify

# Deploy to GitHub Pages
zyros deploy github

# Deploy to AWS S3
zyros deploy s3 my-bucket
```

### Configuration
```bash
# Show all configuration
zyros config --list

# Get specific value
zyros config --get site.title

# Set configuration value
zyros config --set site.theme=dark
```

## 🎨 Templates

zyros comes with multiple templates for different use cases:

- **Default** - Clean blog template
- **Portfolio** - Showcase your work
- **Documentation** - Technical docs
- **Business** - Professional website
- **Minimal** - Ultra-clean design

```bash
# Use a specific template
zyros init my-site --template portfolio
```

## 🔧 Advanced Configuration

### Custom Themes

Create your own theme by extending the theme system:

```json
{
  "site": {
    "theme": "custom",
    "customTheme": {
      "name": "custom",
      "background": "bg-purple-900",
      "text": "text-white",
      "accent": "text-yellow-400"
    }
  }
}
```

### SEO Configuration

```json
{
  "site": {
    "seo": {
      "keywords": ["blog", "tech", "programming"],
      "ogImage": "/og-image.jpg",
      "twitterCard": "summary_large_image"
    }
  }
}
```

### Analytics Integration

```json
{
  "site": {
    "analytics": {
      "googleAnalytics": "GA_MEASUREMENT_ID",
      "plausible": "domain.com"
    }
  }
}
```

## 📊 Scripts

| Command | Description |
|---------|-------------|
| `zyros init <name>` | Initialize new project |
| `zyros dev` | Start development server |
| `zyros build` | Build for production |
| `zyros content create` | Create new post |
| `zyros content list` | List all posts |
| `zyros validate` | Validate project |
| `zyros optimize` | Optimize assets |
| `zyros deploy <platform>` | Deploy to platform |

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
zyros deploy vercel --prod
```

### Netlify
```bash
npm install -g netlify-cli
zyros deploy netlify --prod
```

### GitHub Pages
```bash
zyros deploy github
```

### Manual Deployment
1. Run `zyros build`
2. Upload the `dist/` folder to your hosting provider
3. Configure your server to serve `index.html` for all routes

## 🔍 Validation & Optimization

### Content Validation
```bash
# Validate your content structure
zyros validate

# Check for common issues
# - Missing required fields
# - Duplicate slugs
# - Invalid markdown syntax
# - SEO recommendations
```

### Image Optimization
```bash
# Optimize all images
zyros optimize

# Optimize images only
zyros optimize --images

# Generate WebP versions
zyros optimize --webp
```

## 📊 Analytics Dashboard

Access your site's analytics to understand your audience:

- **Page Performance** - Views, reading time, engagement
- **Search Insights** - Popular queries and trends
- **User Behavior** - Theme preferences, navigation patterns
- **Content Analytics** - Most popular posts and categories

All analytics are privacy-first and stored locally.

## 🗺️ Roadmap

### ✅ Recently Added (v2.0.5)
- [x] **NPM Package** - Install globally or use with npx
- [x] **CLI Tool** - Complete command-line interface
- [x] **Template System** - Multiple starter templates
- [x] **Content Validation** - Validate structure and content
- [x] **Image Optimization** - Automatic image processing
- [x] **One-click Deployment** - Deploy to multiple platforms
- [x] **TypeScript Support** - Full type definitions
- [x] **Enhanced Reliability** - Fixed critical file filtering issues
- [x] **Windows Compatibility** - Improved cross-platform support
- [x] **Comprehensive Testing** - Thoroughly tested and validated

### 🚧 Coming Soon (v2.1)
- [ ] **Plugin System** - Extensible architecture
- [ ] **CMS Integration** - Headless CMS support
- [ ] **Multi-language Support** - i18n capabilities
- [ ] **Advanced SEO** - Schema markup, meta optimization
- [ ] **Performance Monitoring** - Real-time metrics
- [ ] **Comment System** - GitHub Issues integration

### 🔮 Future Plans (v3.0+)
- [ ] **Visual Editor** - WYSIWYG content editing
- [ ] **Collaboration Tools** - Multi-author support
- [ ] **E-commerce Integration** - Product pages
- [ ] **Advanced Analytics** - Detailed insights
- [ ] **Mobile App** - Content management on the go

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Setup

```bash
# Clone the repository
git clone https://github.com/zyrasoftware/zyros.git
cd zyros

# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm test

# Build package
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Markdown rendering by [react-markdown](https://github.com/remarkjs/react-markdown)
- CLI powered by [Commander.js](https://github.com/tj/commander.js)
- Beautiful terminal output with [Chalk](https://github.com/chalk/chalk)

## 📞 Support
#SOON
- 📖 [Documentation]()
- 💬 [Community Discussions](https://github.com/zyrasoftware/zyros/discussions)
- 🐛 [Report Issues](https://github.com/zyrasoftware/zyros/issues)
- 📧 [Email Support](mailto:zyrasoftwaredev@gmail.com)

---

**Made with ❤️ by Zyra Software**

*Transform your ideas into beautiful static sites with zyros*
