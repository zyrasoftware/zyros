const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');

/**
 * Initialize a new zyros project
 */
async function initProject(projectName, options = {}) {
  const spinner = ora('Initializing zyros project...').start();
  
  try {
    const projectPath = path.resolve(process.cwd(), projectName);
    
    // Check if directory exists
    if (fs.existsSync(projectPath) && !options.force) {
      spinner.stop();
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `Directory ${projectName} already exists. Overwrite?`,
          default: false
        }
      ]);
      
      if (!overwrite) {
        console.log(chalk.yellow('Project initialization cancelled.'));
        return;
      }
      spinner.start();
    }
    
    // Create project directory
    await fs.ensureDir(projectPath);
    
        // Copy the entire project structure
    spinner.text = 'Copying project files...';
    // Find the zyros project root directory more reliably
    let sourceDir = __dirname;
    
    // If we're in the scripts directory, go up one level
    if (path.basename(sourceDir) === 'scripts') {
      sourceDir = path.join(sourceDir, '..');
    } else {
      // If we're already at the root (when called via CLI), use current directory
      // But we need to find the actual zyros source directory
      const packageJsonPath = path.join(sourceDir, 'package.json');
      if (!fs.existsSync(packageJsonPath)) {
        // Try to find the package.json by going up directories
        let currentDir = sourceDir;
        let found = false;
        for (let i = 0; i < 5; i++) {
          const testPath = path.join(currentDir, 'package.json');
          if (fs.existsSync(testPath)) {
            const pkg = require(testPath);
            if (pkg.name === 'zyros') {
              sourceDir = currentDir;
              found = true;
              break;
            }
          }
          currentDir = path.join(currentDir, '..');
        }
        if (!found) {
          throw new Error('Could not find zyros source directory. Please run this command from the zyros project directory.');
        }
      }
    }
    
    // Prevent copying to subdirectory of itself
    const absoluteProjectPath = path.resolve(projectPath);
    const absoluteSourceDir = path.resolve(sourceDir);
    
    if (absoluteProjectPath.startsWith(absoluteSourceDir)) {
      throw new Error('Cannot create project inside the zyros source directory. Please run this command from a different location.');
    }
    
    // Files and directories to copy (everything except what we want to exclude)
    const excludePatterns = [
      'node_modules',
      '.git',
      '.next',
      'out',
      'dist',
      '.env*',
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',
      '.DS_Store',
      'Thumbs.db',
      'tsconfig.tsbuildinfo',
      '*.tgz',
      // CLI and development files (not needed for end users)
      'bin',
      'scripts',
      'templates',
      '.npmignore',
      'index.js'  // Main CLI entry point
    ];

    // Copy everything from source directory
    await fs.copy(sourceDir, projectPath, {
      filter: (src, dest) => {
        const relativePath = path.relative(sourceDir, src);
        const pathParts = relativePath.split(path.sep);
        const basename = path.basename(src);
        
        // Skip excluded patterns
        for (const pattern of excludePatterns) {
          // Check if any path component matches the pattern (for directories)
          // or if the basename matches (for files)
          if (pathParts.includes(pattern) || basename === pattern) {
            return false;
          }
          
          // Handle glob patterns like .env*, *.tgz
          if (pattern.includes('*')) {
            const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
            if (regex.test(basename)) {
              return false;
            }
          }
        }
        
        return true;
      }
    });

    // Update package.json for the new project
    spinner.text = 'Updating package.json...';
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);
    
    // Update project-specific fields
    packageJson.name = projectName;
    packageJson.version = '1.0.0';
    packageJson.private = true;
    
    // Remove npm publishing related fields
    delete packageJson.bin;
    delete packageJson.files;
    delete packageJson.keywords;
    delete packageJson.repository;
    delete packageJson.bugs;
    delete packageJson.homepage;
    delete packageJson.engines;
    
    // Update scripts for local development
    packageJson.scripts = {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      export: 'next build && next export',
      lint: 'next lint',
      'type-check': 'tsc --noEmit'
    };

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

    // Smart dependency handling
    spinner.text = 'Setting up dependencies...';
    
    // Skip automatic dependency installation to prevent hanging
    spinner.text = 'Project files copied successfully...';
    
    // Update site.json with project name
    spinner.text = 'Customizing site configuration...';
    const siteJsonPath = path.join(projectPath, 'public', 'site.json');
    if (fs.existsSync(siteJsonPath)) {
      const siteConfig = await fs.readJson(siteJsonPath);
      
      // Update site title to match project name
      if (siteConfig.site) {
        siteConfig.site.title = projectName.charAt(0).toUpperCase() + projectName.slice(1).replace(/-/g, ' ');
        siteConfig.site.description = `A beautiful static site built with zyros`;
        siteConfig.site.url = "https://yoursite.com";
        siteConfig.site.author = "Your Name";
      }
      
      await fs.writeJson(siteJsonPath, siteConfig, { spaces: 2 });
    }
    
    // Create .gitignore
    spinner.text = 'Creating .gitignore...';
    const gitignoreContent = `# Dependencies
node_modules/
.pnp
.pnp.js

# Production
dist/
.next/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Temporary
.tmp/
tmp/
`;
    
    await fs.writeFile(path.join(projectPath, '.gitignore'), gitignoreContent);
    
    spinner.succeed(chalk.green('Project initialized successfully!'));
    
    console.log('\n' + chalk.cyan('🎉 Your zyros project is ready!'));
    console.log('\n' + chalk.bold('Next steps:'));
    console.log(chalk.gray(`  cd ${projectName}`));
    console.log(chalk.gray('  npm install'));
    console.log(chalk.gray('  npm run dev'));
    console.log('\n' + chalk.green('✨ Your site will be available at http://localhost:3000'));
    console.log('\n' + chalk.yellow('📦 Don\'t forget to run "npm install" first!'));
    console.log('\n' + chalk.bold('What you got:'));
    console.log(chalk.gray('  • Complete zyros project with all features'));
    console.log(chalk.gray('  • 8 beautiful themes ready to use'));
    console.log(chalk.gray('  • Advanced components and layouts'));
    console.log(chalk.gray('  • Full demo content to learn from'));
    console.log('\n' + chalk.bold('Customize your site:'));
    console.log(chalk.gray('  • Edit public/site.json to change content'));
    console.log(chalk.gray('  • Modify components in the components/ folder'));
    console.log(chalk.gray('  • Add your own pages and styling'));
    console.log('\n' + chalk.yellow('📖 Documentation: https://github.com/zyrasoftware/zyros'));
    console.log(chalk.yellow('💬 Community: https://github.com/zyrasoftware/zyros/discussions'));
    
    // Ensure process exits cleanly
    process.exit(0);
    
  } catch (error) {
    spinner.fail(chalk.red('Failed to initialize project'));
    console.error(chalk.red('Error details:'), error.message);
    console.error(chalk.gray('Stack trace:'), error.stack);
    process.exit(1);
  }
}

/**
 * Get available templates
 */
async function getTemplates() {
  const templatesDir = path.join(__dirname, '..', 'templates');
  
  if (!fs.existsSync(templatesDir)) {
    return ['default'];
  }
  
  const templates = await fs.readdir(templatesDir);
  return templates.filter(template => 
    fs.statSync(path.join(templatesDir, template)).isDirectory()
  );
}

module.exports = {
  initProject,
  getTemplates
}; 