#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');

/**
 * Content management utilities for Zyros
 * Supports both traditional site.json and new markdown files approach
 */

class ContentManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.siteJsonPath = path.join(this.projectRoot, 'public', 'site.json');
    this.contentDir = path.join(this.projectRoot, 'content');
  }

  async detectContentStructure() {
    const hasContentDir = await fs.pathExists(this.contentDir);
    const hasSiteJson = await fs.pathExists(this.siteJsonPath);
    
    if (hasContentDir) {
      return 'markdown';
    } else if (hasSiteJson) {
      return 'site.json';
    } else {
      return 'none';
    }
  }

  async initializeMarkdownStructure() {
    console.log(chalk.blue('🚀 Initializing markdown content structure...'));
    
    // Create content directory structure
    await fs.ensureDir(path.join(this.contentDir, 'pages'));
    await fs.ensureDir(path.join(this.contentDir, 'posts'));
    
    // Create sample site.json in content directory
    const siteConfig = {
      title: 'My Zyros Site',
      description: 'A modern static site built with Zyros',
      author: 'Your Name',
      url: 'https://yoursite.com',
      theme: 'light',
      features: {
        newsletter: true,
        darkMode: true,
        socialShare: true,
        analytics: true
      },
      social: {
        twitter: 'https://twitter.com/yourhandle',
        github: 'https://github.com/yourusername',
        linkedin: 'https://linkedin.com/in/yourprofile'
      }
    };
    
    await fs.writeJson(
      path.join(this.contentDir, 'site.json'),
      siteConfig,
      { spaces: 2 }
    );

    // Create sample pages
    const aboutContent = `---
title: "About"
description: "Learn more about this site"
slug: "about" 
category: "page"
---

# About This Site

Welcome to my site built with Zyros! This is a sample about page created using markdown files.

## Features

- ✅ **Markdown Support** - Write content in markdown
- ✅ **Frontmatter** - Metadata in YAML format
- ✅ **Auto-generated** - Automatic slug and reading time
- ✅ **Scalable** - Each page is a separate file

## Getting Started

Edit this file at \`content/pages/about.md\` to customize your about page.
`;

    await fs.writeFile(
      path.join(this.contentDir, 'pages', 'about.md'),
      aboutContent
    );

    // Create sample blog post
    const postContent = `---
title: "Welcome to Your New Zyros Site"
description: "Getting started with your markdown-powered Zyros site"
date: "${new Date().toISOString().split('T')[0]}"
category: "blog"
tags: ["welcome", "getting-started", "zyros"]
author: "Your Name"
featured: true
---

# Welcome to Your New Zyros Site!

Congratulations on setting up your new Zyros site with markdown support! This approach offers several advantages:

## Why Markdown Files?

### 🚀 **Scalability**
- Each post is a separate file
- Easy to manage hundreds of posts
- No more massive JSON files

### 👥 **Collaboration** 
- Multiple authors can work simultaneously
- Git-friendly - proper diff and merge support
- Easy to review changes

### ✍️ **Writing Experience**
- Native markdown support
- Frontmatter for metadata
- Your favorite editor works perfectly

## File Structure

Your content is organized like this:

\`\`\`
content/
├── site.json          # Global site configuration
├── pages/             # Static pages (About, Contact, etc.)
│   └── about.md
└── posts/             # Blog posts
    └── welcome.md
\`\`\`

## Frontmatter

Each markdown file can include metadata:

\`\`\`yaml
---
title: "Your Post Title"
date: "2024-01-15"
category: "blog"
tags: ["tag1", "tag2"]
author: "Your Name"
description: "Brief description"
featured: true
---
\`\`\`

## What's Next?

1. Edit \`content/site.json\` to customize your site settings
2. Create new posts in \`content/posts/\`
3. Add pages in \`content/pages/\`
4. Run \`npm run dev\` to see your changes

Happy writing! 🎉
`;

    await fs.writeFile(
      path.join(this.contentDir, 'posts', 'welcome.md'),
      postContent
    );

    console.log(chalk.green('✅ Markdown content structure created!'));
    console.log(chalk.yellow('\nNext steps:'));
    console.log(chalk.gray('  1. Edit content/site.json for site settings'));
    console.log(chalk.gray('  2. Add pages in content/pages/'));
    console.log(chalk.gray('  3. Add posts in content/posts/'));
    console.log(chalk.gray('  4. Run "npm run dev" to see your site'));
  }

  async createMarkdownPost(title, type = 'post') {
    const contentStructure = await this.detectContentStructure();
    
    if (contentStructure !== 'markdown') {
      console.log(chalk.yellow('⚠️  Markdown structure not detected. Initializing...'));
      await this.initializeMarkdownStructure();
    }

    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const date = new Date().toISOString().split('T')[0];
    const filename = type === 'post' ? `${date}-${slug}.md` : `${slug}.md`;
    const targetDir = type === 'post' ? 'posts' : 'pages';
    const filePath = path.join(this.contentDir, targetDir, filename);

    const content = `---
title: "${title}"
description: "Brief description of this ${type}"
${type === 'post' ? `date: "${date}"` : ''}
category: "${type === 'post' ? 'blog' : 'page'}"
${type === 'post' ? 'tags: []' : ''}
author: "Your Name"
draft: false
---

# ${title}

Write your content here using markdown...

## Subheading

Your content goes here. You can use:

- **Bold text**
- *Italic text*
- [Links](https://example.com)
- Code blocks
- Images
- And more!

## Code Example

\`\`\`javascript
console.log('Hello, Zyros!');
\`\`\`

Happy writing! 🎉
`;

    await fs.writeFile(filePath, content);
    
    console.log(chalk.green(`✅ Created new ${type}: ${filename}`));
    console.log(chalk.gray(`   Location: ${filePath}`));
    return filePath;
  }

  async migrateFromSiteJson() {
    console.log(chalk.blue('🔄 Migrating from site.json to markdown structure...'));
    
    if (!await fs.pathExists(this.siteJsonPath)) {
      console.log(chalk.red('❌ No site.json found to migrate from'));
      return;
    }

    const siteData = await fs.readJson(this.siteJsonPath);
    
    // Initialize markdown structure
    await this.initializeMarkdownStructure();
    
    // Migrate pages
    if (siteData.pages && siteData.pages.length > 0) {
      console.log(chalk.blue(`📄 Migrating ${siteData.pages.length} pages...`));
      
      for (const page of siteData.pages) {
        const filename = `${page.slug || page.title.toLowerCase().replace(/\s+/g, '-')}.md`;
        const category = page.category || 'page';
        const targetDir = category === 'blog' || category === 'post' ? 'posts' : 'pages';
        
        const frontmatter = [
          '---',
          `title: "${page.title}"`,
          page.description ? `description: "${page.description}"` : '',
          page.date || page.publishedAt ? `date: "${page.date || page.publishedAt}"` : '',
          `category: "${category}"`,
          page.tags && page.tags.length > 0 ? `tags: [${page.tags.map(t => `"${t}"`).join(', ')}]` : '',
          page.author ? `author: "${page.author}"` : '',
          page.featured ? 'featured: true' : '',
          page.draft ? 'draft: true' : '',
          '---',
          '',
          page.content || `# ${page.title}\n\nContent migrated from site.json`
        ].filter(Boolean).join('\n');

        const filePath = path.join(this.contentDir, targetDir, filename);
        await fs.writeFile(filePath, frontmatter);
        
        console.log(chalk.green(`  ✅ Migrated: ${filename}`));
      }
    }

    // Update site configuration
    const { pages, ...siteConfig } = siteData;
    await fs.writeJson(
      path.join(this.contentDir, 'site.json'),
      { site: siteConfig },
      { spaces: 2 }
    );

    console.log(chalk.green('✅ Migration completed!'));
    console.log(chalk.yellow('\nMigration summary:'));
    console.log(chalk.gray('  - Created content/ directory structure'));
    console.log(chalk.gray('  - Migrated all pages to markdown files'));
    console.log(chalk.gray('  - Updated site configuration'));
    console.log(chalk.gray('\nNote: Your original site.json is preserved'));
  }

  async showHelp() {
    console.log(chalk.bold('\n📚 Zyros Content Management'));
    console.log(chalk.gray('Supports both site.json and markdown approaches\n'));
    
    console.log(chalk.yellow('Available commands:'));
    console.log(chalk.gray('  init-markdown    Initialize markdown content structure'));
    console.log(chalk.gray('  create-post      Create a new blog post'));
    console.log(chalk.gray('  create-page      Create a new page'));
    console.log(chalk.gray('  migrate          Migrate from site.json to markdown'));
    console.log(chalk.gray('  detect           Show current content structure'));
    
    console.log(chalk.yellow('\nContent Approaches:'));
    console.log(chalk.gray('  📄 site.json     - Simple, single file (current)'));
    console.log(chalk.gray('  📁 markdown      - Scalable, multi-file (recommended)'));
    
    console.log(chalk.yellow('\nMarkdown Benefits:'));
    console.log(chalk.gray('  ✅ Better scalability for many posts'));
    console.log(chalk.gray('  ✅ Git-friendly (proper diffs, collaboration)'));
    console.log(chalk.gray('  ✅ Standard frontmatter metadata'));
    console.log(chalk.gray('  ✅ Each content piece is a separate file'));
    console.log(chalk.gray('  ✅ No merge conflicts on large JSON files'));
  }
}

async function main() {
  const contentManager = new ContentManager();
  const command = process.argv[2];

  switch (command) {
    case 'init-markdown':
      await contentManager.initializeMarkdownStructure();
      break;

    case 'create-post':
      const postTitle = process.argv[3] || 'New Blog Post';
      await contentManager.createMarkdownPost(postTitle, 'post');
      break;

    case 'create-page':
      const pageTitle = process.argv[3] || 'New Page';
      await contentManager.createMarkdownPost(pageTitle, 'page');
      break;

    case 'migrate':
      await contentManager.migrateFromSiteJson();
      break;

    case 'detect':
      const structure = await contentManager.detectContentStructure();
      console.log(chalk.blue('🔍 Content Structure Detection:'));
      console.log(chalk.gray(`Current approach: ${structure}`));
      if (structure === 'markdown') {
        console.log(chalk.gray('Using: content/ directory with markdown files'));
      } else if (structure === 'site.json') {
        console.log(chalk.gray('Using: public/site.json (traditional approach)'));
      } else {
        console.log(chalk.gray('No content structure detected'));
      }
      break;

    default:
      await contentManager.showHelp();
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { ContentManager }; 