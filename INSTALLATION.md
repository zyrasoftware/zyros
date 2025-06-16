# 📦 Installation Guide

This guide will help you install and set up zyros on your system.

## Prerequisites

Before installing zyros, make sure you have:

- **Node.js** (version 18 or higher)
- **npm** (version 8 or higher) or **yarn**
- **Git** (for version control)

### Check Your Environment

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

If you don't have Node.js installed, download it from [nodejs.org](https://nodejs.org/).

## Installation Methods

### Method 1: Global Installation (Recommended)

Install zyros globally to use it anywhere on your system:

```bash
npm install -g zyros
```

After installation, you can use the `zyros` command anywhere:

```bash
# Verify installation
zyros --version

# Create a new project
zyros init my-blog
```

### Method 2: Using npx (No Installation Required)

Use npx to run zyros without installing it globally:

```bash
# Create a new project
npx zyros init my-blog
```

### Method 3: Local Project Installation

Install zyros as a dependency in an existing project:

```bash
# Navigate to your project
cd my-existing-project

# Install as a dependency
npm install zyros

# Use via npm scripts or npx
npx zyros init .
```

## Quick Start

### 1. Create Your First Project

```bash
# Using global installation
zyros init my-blog

# Or using npx
npx zyros init my-blog
```

### 2. Navigate to Your Project

```bash
cd my-blog
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

Your site will be available at `http://localhost:3000`!

## Project Structure

After initialization, your project will have this structure:

```
my-blog/
├── public/
│   ├── site.json          # Your content and configuration
│   ├── favicon.svg        # Site favicon
│   └── assets/            # Images and static files
├── package.json           # Project dependencies and scripts
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

## Configuration

### Basic Configuration

Edit `public/site.json` to configure your site:

```json
{
  "site": {
    "title": "My Awesome Blog",
    "description": "A blog about awesome things",
    "theme": "light",
    "author": "Your Name",
    "url": "https://yourdomain.com"
  },
  "pages": []
}
```

### Available Themes

Choose from 8 built-in themes:

- `light` - Clean and bright
- `dark` - Modern dark theme
- `minimal` - Simple elegance
- `ocean` - Cool blue tones
- `sunset` - Warm orange-pink
- `forest` - Natural green
- `midnight` - Deep purple
- `neon` - Electric green

## Templates

zyros comes with several templates for different use cases:

### Available Templates

- **default** - Clean blog template
- **portfolio** - Showcase your work
- **documentation** - Technical docs
- **business** - Professional website
- **minimal** - Ultra-clean design

### Using Templates

```bash
# List available templates
zyros template list

# Create project with specific template
zyros init my-portfolio --template portfolio

# Apply template to existing project
zyros template apply minimal
```

## Common Commands

### Content Management

```bash
# Create a new post
zyros content create

# List all posts
zyros content list

# Show content statistics
zyros content stats
```

### Development

```bash
# Start development server
zyros dev

# Build for production
zyros build

# Validate content
zyros validate

# Optimize images
zyros optimize
```

### Deployment

```bash
# Deploy to Vercel
zyros deploy vercel

# Deploy to Netlify
zyros deploy netlify

# Deploy to GitHub Pages
zyros deploy github
```

## Troubleshooting

### Common Issues

#### 1. Permission Errors (macOS/Linux)

If you get permission errors during global installation:

```bash
# Use sudo (not recommended)
sudo npm install -g zyros

# Or configure npm to use a different directory (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g zyros
```

#### 2. Node.js Version Issues

If you get Node.js version errors:

```bash
# Check your Node.js version
node --version

# Update Node.js to the latest LTS version
# Visit https://nodejs.org/ for download links
```

#### 3. Command Not Found

If `zyros` command is not found after global installation:

```bash
# Check if the package is installed
npm list -g zyros

# Check your PATH
echo $PATH

# Reinstall the package
npm uninstall -g zyros
npm install -g zyros
```

#### 4. Port Already in Use

If port 3000 is already in use:

```bash
# Use a different port
zyros dev --port 3001

# Or kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Getting Help

If you encounter issues:

1. **Check the documentation**: [GitHub Repository](https://github.com/zyrasoftware/zyros)
2. **Search existing issues**: [GitHub Issues](https://github.com/zyrasoftware/zyros/issues)
3. **Ask the community**: [GitHub Discussions](https://github.com/zyrasoftware/zyros/discussions)
4. **Report a bug**: [Create an issue](https://github.com/zyrasoftware/zyros/issues/new)

## Next Steps

After installation:

1. **Customize your site** - Edit `public/site.json`
2. **Create content** - Use `zyros content create`
3. **Choose a theme** - Update the theme in your configuration
4. **Add your content** - Write posts in Markdown
5. **Deploy your site** - Use `zyros deploy <platform>`

## Advanced Setup

### Development Environment

For contributing to zyros:

```bash
# Clone the repository
git clone https://github.com/zyrasoftware/zyros.git
cd zyros

# Install dependencies
npm install

# Link for local development
npm link

# Now you can use your local version
zyros --version
```

### Custom Templates

Create your own templates:

```bash
# Create a template from current project
zyros template create my-template

# Share your template
# Templates are stored in ~/.zyros/templates/
```

### Environment Variables

Set environment variables for deployment:

```bash
# For RSS and sitemap generation
export SITE_URL=https://yourdomain.com

# For analytics
export GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

## Updating

### Update Global Installation

```bash
# Check current version
zyros --version

# Update to latest version
npm update -g zyros

# Or reinstall
npm uninstall -g zyros
npm install -g zyros
```

### Update Project Dependencies

```bash
# In your project directory
npm update zyros
```

## Uninstalling

### Remove Global Installation

```bash
npm uninstall -g zyros
```

### Remove Project Dependencies

```bash
# In your project directory
npm uninstall zyros
```

---

**Need more help?** Visit our [documentation](https://github.com/zyrasoftware/zyros) or join our [community](https://github.com/zyrasoftware/zyros/discussions). 