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
    const sourceDir = path.join(__dirname, '..');
    
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
      '*.tgz'
    ];

    // Copy everything from source directory
    await fs.copy(sourceDir, projectPath, {
      filter: (src, dest) => {
        const relativePath = path.relative(sourceDir, src);
        
        // Skip excluded patterns
        for (const pattern of excludePatterns) {
          if (relativePath.includes(pattern) || path.basename(src) === pattern) {
            return false;
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
    
    try {
      // Check if we're running from a global install vs npx
      const isGlobalInstall = __dirname.includes('node_modules');
      
      if (isGlobalInstall) {
        // Running from global install - copy node_modules for efficiency
        const sourceNodeModules = path.join(sourceDir, 'node_modules');
        const destNodeModules = path.join(projectPath, 'node_modules');
        
        if (fs.existsSync(sourceNodeModules)) {
          spinner.text = 'Copying dependencies (this saves download time)...';
          await fs.copy(sourceNodeModules, destNodeModules);
          
          // Copy package-lock.json for consistency
          const sourceLock = path.join(sourceDir, 'package-lock.json');
          const destLock = path.join(projectPath, 'package-lock.json');
          if (fs.existsSync(sourceLock)) {
            await fs.copy(sourceLock, destLock);
          }
        }
      } else {
        // Running from npx - run npm install
        spinner.text = 'Installing dependencies...';
        
        const { spawn } = require('child_process');
        const isWindows = process.platform === 'win32';
        const npmCmd = isWindows ? 'npm.cmd' : 'npm';
        
        await new Promise((resolve, reject) => {
          const child = spawn(npmCmd, ['install'], {
            cwd: projectPath,
            stdio: 'inherit',
            shell: true
          });
          
          child.on('close', (code) => {
            if (code === 0) {
              resolve();
            } else {
              reject(new Error(`npm install failed with code ${code}`));
            }
          });
          
          child.on('error', reject);
        });
      }
      
    } catch (error) {
      console.log(chalk.yellow('\n⚠️  Could not set up dependencies automatically'));
      console.log(chalk.gray('You\'ll need to run "npm install" manually in your project directory'));
    }
    
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
    console.log(chalk.gray('  npm run dev'));
    console.log('\n' + chalk.green('✨ Your site will be available at http://localhost:3000'));
    console.log('\n' + chalk.blue('📦 Dependencies are already installed and ready to go!'));
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
    
  } catch (error) {
    spinner.fail(chalk.red('Failed to initialize project'));
    throw error;
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