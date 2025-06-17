#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const SITE_JSON_PATH = path.join(process.cwd(), 'public', 'site.json');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function loadSiteData() {
  try {
    const data = fs.readFileSync(SITE_JSON_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(colorize('Error loading site.json:', 'red'), error.message);
    process.exit(1);
  }
}

function saveSiteData(data) {
  try {
    fs.writeFileSync(SITE_JSON_PATH, JSON.stringify(data, null, 2));
    console.log(colorize('✓ Site data saved successfully!', 'green'));
  } catch (error) {
    console.error(colorize('Error saving site.json:', 'red'), error.message);
    process.exit(1);
  }
}

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function estimateReadingTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function createPost() {
  console.log(colorize('\n📝 Creating a new post...', 'cyan'));
  console.log(colorize('Press Ctrl+C to cancel at any time.\n', 'yellow'));

  try {
    const title = await question('Post title: ');
    if (!title.trim()) {
      console.log(colorize('Title cannot be empty!', 'red'));
      return;
    }

    const slug = await question(`Slug (${createSlug(title)}): `) || createSlug(title);
    const description = await question('Description (optional): ');
    const category = await question('Category (optional): ');
    const tagsInput = await question('Tags (comma-separated, optional): ');
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(Boolean) : [];

    console.log(colorize('\nContent (type your markdown content, press Ctrl+D when done):', 'cyan'));
    
    let content = '';
    process.stdin.setEncoding('utf8');
    
    return new Promise((resolve) => {
      process.stdin.on('data', (chunk) => {
        content += chunk;
      });

      process.stdin.on('end', () => {
        const siteData = loadSiteData();
        
        // Check if slug already exists
        if (siteData.pages.some(page => page.slug === slug)) {
          console.log(colorize(`\nError: A post with slug "${slug}" already exists!`, 'red'));
          resolve();
          return;
        }

        const newPost = {
          title,
          slug,
          content: content.trim(),
          publishedAt: formatDate(new Date()),
          readingTime: estimateReadingTime(content)
        };

        if (description) newPost.description = description;
        if (category) newPost.category = category;
        if (tags.length > 0) newPost.tags = tags;

        siteData.pages.unshift(newPost); // Add to beginning
        saveSiteData(siteData);

        console.log(colorize('\n🎉 Post created successfully!', 'green'));
        console.log(colorize(`   Title: ${title}`, 'bright'));
        console.log(colorize(`   Slug: ${slug}`, 'bright'));
        console.log(colorize(`   URL: /${slug}`, 'bright'));
        
        resolve();
      });
    });

  } catch (error) {
    console.log(colorize('\nOperation cancelled.', 'yellow'));
  }
}

async function listPosts() {
  const siteData = loadSiteData();
  
  console.log(colorize('\n📚 All Posts:', 'cyan'));
  console.log(colorize('─'.repeat(80), 'blue'));

  if (siteData.pages.length === 0) {
    console.log(colorize('No posts found.', 'yellow'));
    return;
  }

  siteData.pages.forEach((page, index) => {
    console.log(colorize(`${index + 1}. ${page.title}`, 'bright'));
    console.log(colorize(`   Slug: ${page.slug}`, 'blue'));
    if (page.category) console.log(colorize(`   Category: ${page.category}`, 'magenta'));
    if (page.publishedAt) console.log(colorize(`   Published: ${page.publishedAt}`, 'green'));
    if (page.tags && page.tags.length > 0) {
      console.log(colorize(`   Tags: ${page.tags.join(', ')}`, 'yellow'));
    }
    console.log();
  });

  console.log(colorize(`Total: ${siteData.pages.length} posts`, 'cyan'));
}

async function deletePost() {
  const siteData = loadSiteData();
  
  if (siteData.pages.length === 0) {
    console.log(colorize('No posts to delete.', 'yellow'));
    return;
  }

  console.log(colorize('\n🗑️  Delete a post:', 'cyan'));
  console.log(colorize('Available posts:', 'bright'));

  siteData.pages.forEach((page, index) => {
    console.log(colorize(`${index + 1}. ${page.title} (${page.slug})`, 'bright'));
  });

  const indexInput = await question('\nEnter post number to delete (or "cancel"): ');
  
  if (indexInput.toLowerCase() === 'cancel') {
    console.log(colorize('Operation cancelled.', 'yellow'));
    return;
  }

  const index = parseInt(indexInput) - 1;
  
  if (isNaN(index) || index < 0 || index >= siteData.pages.length) {
    console.log(colorize('Invalid post number!', 'red'));
    return;
  }

  const post = siteData.pages[index];
  const confirm = await question(colorize(`Are you sure you want to delete "${post.title}"? (yes/no): `, 'red'));
  
  if (confirm.toLowerCase() === 'yes' || confirm.toLowerCase() === 'y') {
    siteData.pages.splice(index, 1);
    saveSiteData(siteData);
    console.log(colorize(`✓ Post "${post.title}" deleted successfully!`, 'green'));
  } else {
    console.log(colorize('Operation cancelled.', 'yellow'));
  }
}

async function updateSiteConfig() {
  const siteData = loadSiteData();
  
  console.log(colorize('\n⚙️  Update site configuration:', 'cyan'));
  console.log(colorize('Current configuration:', 'bright'));
  console.log(colorize(`  Title: ${siteData.site.title}`, 'blue'));
  console.log(colorize(`  Theme: ${siteData.site.theme}`, 'blue'));
  console.log(colorize(`  Description: ${siteData.site.description || 'Not set'}`, 'blue'));

  const newTitle = await question(`\nNew title (${siteData.site.title}): `);
  const newTheme = await question(`New theme (${siteData.site.theme}): `);
  const newDescription = await question(`New description (${siteData.site.description || 'Not set'}): `);

  if (newTitle) siteData.site.title = newTitle;
  if (newTheme) siteData.site.theme = newTheme;
  if (newDescription) siteData.site.description = newDescription;

  saveSiteData(siteData);
  console.log(colorize('✓ Site configuration updated!', 'green'));
  process.exit(0);
}

function showStats() {
  const siteData = loadSiteData();
  
  console.log(colorize('\n📊 Site Statistics:', 'cyan'));
  console.log(colorize('─'.repeat(40), 'blue'));

  const totalPosts = siteData.pages.length;
  const categories = [...new Set(siteData.pages.map(p => p.category).filter(Boolean))];
  const tags = [...new Set(siteData.pages.flatMap(p => p.tags || []))];
  const totalWords = siteData.pages.reduce((sum, page) => sum + page.content.split(/\s+/).length, 0);
  const avgReadingTime = totalPosts > 0 ? Math.round(totalWords / totalPosts / 200) : 0;

  console.log(colorize(`Total Posts: ${totalPosts}`, 'bright'));
  console.log(colorize(`Categories: ${categories.length}`, 'magenta'));
  console.log(colorize(`Tags: ${tags.length}`, 'yellow'));
  console.log(colorize(`Total Words: ${totalWords.toLocaleString()}`, 'green'));
  console.log(colorize(`Avg Reading Time: ${avgReadingTime} min`, 'blue'));

  if (categories.length > 0) {
    console.log(colorize('\nCategories:', 'magenta'));
    categories.forEach(cat => {
      const count = siteData.pages.filter(p => p.category === cat).length;
      console.log(colorize(`  • ${cat}: ${count} posts`, 'bright'));
    });
  }

  if (tags.length > 0) {
    console.log(colorize('\nTop Tags:', 'yellow'));
    const tagCounts = {};
    siteData.pages.forEach(page => {
      (page.tags || []).forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([tag, count]) => {
        console.log(colorize(`  • ${tag}: ${count} posts`, 'bright'));
      });
  }
  
  process.exit(0);
}

function showHelp() {
  console.log(colorize('\n🚀 Zyros SSG CLI', 'cyan'));
  console.log(colorize('A command-line tool for managing your static site content.\n', 'bright'));
  
  console.log(colorize('Usage:', 'yellow'));
  console.log('  node scripts/cli.js <command>\n');
  
  console.log(colorize('Commands:', 'yellow'));
  console.log(colorize('  create, new     ', 'green') + 'Create a new blog post');
  console.log(colorize('  list, ls        ', 'green') + 'List all posts');
  console.log(colorize('  delete, rm      ', 'green') + 'Delete a post');
  console.log(colorize('  config          ', 'green') + 'Update site configuration');
  console.log(colorize('  stats           ', 'green') + 'Show site statistics');
  console.log(colorize('  help, --help    ', 'green') + 'Show this help message');
  
  console.log(colorize('\nExamples:', 'yellow'));
  console.log('  node scripts/cli.js create');
  console.log('  node scripts/cli.js list');
  console.log('  node scripts/cli.js stats');
  
      console.log(colorize('\nFor more information, visit: https://github.com/zyrasoftware/zyros', 'blue'));
  
  process.exit(0);
}

async function main() {
  const command = process.argv[2];

  // Check if site.json exists
  if (!fs.existsSync(SITE_JSON_PATH)) {
    console.error(colorize('Error: site.json not found in public/ directory!', 'red'));
    console.log(colorize('Make sure you\'re running this from the project root.', 'yellow'));
    process.exit(1);
  }

  switch (command) {
    case 'create':
    case 'new':
      await createPost();
      break;
    case 'list':
    case 'ls':
      listPosts();
      break;
    case 'delete':
    case 'rm':
      await deletePost();
      break;
    case 'config':
      await updateSiteConfig();
      break;
    case 'stats':
      showStats();
      break;
    case 'help':
    case '--help':
    case undefined:
      showHelp();
      break;
    default:
      console.log(colorize(`Unknown command: ${command}`, 'red'));
      console.log(colorize('Run "node scripts/cli.js help" for available commands.', 'yellow'));
      process.exit(1);
  }

  rl.close();
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log(colorize('\n\nOperation cancelled.', 'yellow'));
  rl.close();
  process.exit(0);
});

// Additional functions for the new CLI
async function manageConfig(options) {
  const siteData = loadSiteData();
  
  if (options.list) {
    console.log(colorize('\n⚙️  Site Configuration:', 'cyan'));
    console.log(colorize('─'.repeat(40), 'blue'));
    console.log(colorize(`Title: ${siteData.site.title}`, 'bright'));
    console.log(colorize(`Theme: ${siteData.site.theme}`, 'bright'));
    console.log(colorize(`Description: ${siteData.site.description || 'Not set'}`, 'bright'));
    process.exit(0);
    return;
  }
  
  if (options.get) {
    const keys = options.get.split('.');
    let value = siteData;
    for (const key of keys) {
      value = value[key];
      if (value === undefined) break;
    }
    console.log(value || 'Not set');
    process.exit(0);
    return;
  }
  
  if (options.set) {
    const [keyPath, newValue] = options.set.split('=');
    const keys = keyPath.split('.');
    let target = siteData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!target[keys[i]]) target[keys[i]] = {};
      target = target[keys[i]];
    }
    
    target[keys[keys.length - 1]] = newValue;
    saveSiteData(siteData);
    console.log(colorize(`✓ Set ${keyPath} = ${newValue}`, 'green'));
    process.exit(0);
    return;
  }
  
  // Interactive config update
  await updateSiteConfig();
}

// Export functions for use in other modules
module.exports = {
  createPost,
  listPosts,
  deletePost,
  showStats,
  manageConfig,
  loadSiteData,
  saveSiteData
};

// Only run main if this script is executed directly
if (require.main === module) {
  main().catch(error => {
    console.error(colorize('An error occurred:', 'red'), error.message);
    rl.close();
    process.exit(1);
  });
} 