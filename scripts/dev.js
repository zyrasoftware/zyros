#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting zyros development server...\n');

// Check if site.json exists
const siteJsonPath = path.join(process.cwd(), 'public', 'site.json');
if (!fs.existsSync(siteJsonPath)) {
  console.log('⚠️  No site.json found. Creating a sample configuration...\n');
  
  const sampleConfig = {
    site: {
      title: "My Awesome Blog",
      theme: "ocean",
      description: "A beautiful static site built with zyros"
    },
    pages: [
      {
        title: "Welcome to zyros",
        slug: "welcome",
        description: "Get started with the most developer-friendly static site generator",
        content: "# Welcome to zyros\n\nCongratulations! You've successfully set up your new static site.\n\n## What's Next?\n\n1. **Customize your content** - Edit `public/site.json` to add your own pages\n2. **Choose a theme** - Try different themes like `dark`, `minimal`, `sunset`, or `neon`\n3. **Write in Markdown** - Use full Markdown syntax with code highlighting\n4. **Deploy anywhere** - Run `npm run export` to generate static files\n\n## Features\n\n- ⚡ Lightning fast static generation\n- 🎨 8 beautiful themes\n- 🔍 Built-in search with ⌘+K\n- 📱 Mobile-first responsive design\n- 🌈 Dynamic theme switching\n\nHappy building! 🎉"
      }
    ]
  };
  
  fs.writeFileSync(siteJsonPath, JSON.stringify(sampleConfig, null, 2));
  console.log('✅ Created sample site.json configuration\n');
}

// Start the development server
console.log('🔥 Starting Next.js development server...\n');
const dev = spawn('npm', ['run', 'dev'], { 
  stdio: 'inherit',
  shell: true 
});

dev.on('close', (code) => {
  console.log(`\n👋 Development server stopped with code ${code}`);
});

dev.on('error', (err) => {
  console.error('❌ Failed to start development server:', err);
}); 