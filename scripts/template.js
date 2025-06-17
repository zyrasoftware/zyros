const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

/**
 * Get available templates
 */
async function getTemplates() {
  const templatesDir = path.join(__dirname, '..', 'templates');
  
  if (!fs.existsSync(templatesDir)) {
    return [];
  }
  
  const templates = await fs.readdir(templatesDir);
  return templates.filter(template => 
    fs.statSync(path.join(templatesDir, template)).isDirectory()
  );
}

/**
 * List available templates
 */
async function listTemplates() {
  console.log(chalk.cyan('\n📋 Available Templates:'));
  console.log(chalk.blue('─'.repeat(50)));
  
  const templates = await getTemplates();
  
  if (templates.length === 0) {
    console.log(chalk.yellow('No templates found.'));
    return;
  }
  
  const templateInfo = {
    default: {
      name: 'Default',
      description: 'Clean and minimal blog template',
      features: ['Basic blog layout', 'Light/dark themes', 'Search functionality']
    },
    portfolio: {
      name: 'Portfolio',
      description: 'Showcase your work and projects',
      features: ['Project galleries', 'About section', 'Contact form']
    },
    documentation: {
      name: 'Documentation',
      description: 'Technical documentation site',
      features: ['Sidebar navigation', 'Code highlighting', 'API docs']
    },
    business: {
      name: 'Business',
      description: 'Professional business website',
      features: ['Landing page', 'Services section', 'Team profiles']
    },
    minimal: {
      name: 'Minimal',
      description: 'Ultra-clean minimal design',
      features: ['Typography focus', 'Minimal UI', 'Fast loading']
    }
  };
  
  templates.forEach((template, index) => {
    const info = templateInfo[template] || {
      name: template.charAt(0).toUpperCase() + template.slice(1),
      description: 'Custom template',
      features: ['Custom layout']
    };
    
    console.log(chalk.bold(`${index + 1}. ${info.name}`));
    console.log(chalk.gray(`   ${info.description}`));
    console.log(chalk.green(`   Features: ${info.features.join(', ')}`));
    console.log(chalk.blue(`   Usage: zyros init my-site --template ${template}`));
    console.log();
  });
  
  process.exit(0);
}

/**
 * Apply template to current project
 */
async function applyTemplate(templateName, options = {}) {
  const spinner = ora(`Applying template: ${templateName}...`).start();
  
  try {
    const templatePath = path.join(__dirname, '..', 'templates', templateName);
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template "${templateName}" not found`);
    }
    
    const currentDir = process.cwd();
    
    // Check if current directory has a site.json
    const siteJsonPath = path.join(currentDir, 'public', 'site.json');
    if (!fs.existsSync(siteJsonPath)) {
      throw new Error('No site.json found. Make sure you\'re in a zyros project directory.');
    }
    
    // Backup current site.json
    spinner.text = 'Backing up current configuration...';
    const backupPath = path.join(currentDir, 'public', `site.json.backup.${Date.now()}`);
    await fs.copy(siteJsonPath, backupPath);
    
    // Copy template files (excluding site.json to preserve content)
    spinner.text = 'Copying template files...';
    const templateFiles = await fs.readdir(templatePath);
    
    for (const file of templateFiles) {
      const srcPath = path.join(templatePath, file);
      const destPath = path.join(currentDir, file);
      
      // Skip site.json to preserve existing content
      if (file === 'public') {
        const publicSrc = path.join(templatePath, 'public');
        const publicDest = path.join(currentDir, 'public');
        
        if (fs.existsSync(publicSrc)) {
          const publicFiles = await fs.readdir(publicSrc);
          for (const publicFile of publicFiles) {
            if (publicFile !== 'site.json') {
              await fs.copy(
                path.join(publicSrc, publicFile),
                path.join(publicDest, publicFile),
                { overwrite: options.force }
              );
            }
          }
        }
      } else {
        await fs.copy(srcPath, destPath, { overwrite: options.force });
      }
    }
    
    // Update theme in site.json if template has a preferred theme
    const templateConfigPath = path.join(templatePath, 'template.json');
    if (fs.existsSync(templateConfigPath)) {
      const templateConfig = await fs.readJson(templateConfigPath);
      if (templateConfig.defaultTheme) {
        const siteData = await fs.readJson(siteJsonPath);
        siteData.site.theme = templateConfig.defaultTheme;
        await fs.writeJson(siteJsonPath, siteData, { spaces: 2 });
      }
    }
    
    spinner.succeed(chalk.green(`Template "${templateName}" applied successfully!`));
    
    console.log('\n' + chalk.cyan('✨ Template applied!'));
    console.log(chalk.gray(`Backup created: ${path.basename(backupPath)}`));
    console.log('\n' + chalk.yellow('Next steps:'));
    console.log(chalk.gray('  npm run dev    # Start development server'));
    console.log(chalk.gray('  npm run build  # Build for production'));
    
    process.exit(0);
    
  } catch (error) {
    spinner.fail(chalk.red('Failed to apply template'));
    throw error;
  }
}

/**
 * Create a new template from current project
 */
async function createTemplate(templateName, options = {}) {
  const spinner = ora(`Creating template: ${templateName}...`).start();
  
  try {
    const currentDir = process.cwd();
    const templatesDir = path.join(__dirname, '..', 'templates');
    const templatePath = path.join(templatesDir, templateName);
    
    // Check if template already exists
    if (fs.existsSync(templatePath) && !options.force) {
      throw new Error(`Template "${templateName}" already exists. Use --force to overwrite.`);
    }
    
    // Ensure templates directory exists
    await fs.ensureDir(templatesDir);
    
    // Copy current project structure
    spinner.text = 'Copying project files...';
    await fs.copy(currentDir, templatePath, {
      filter: (src) => {
        const relativePath = path.relative(currentDir, src);
        // Exclude build artifacts and dependencies
        return !relativePath.match(/^(node_modules|\.next|dist|\.git)/);
      }
    });
    
    // Create template configuration
    const templateConfig = {
      name: templateName,
      description: options.description || `Custom template: ${templateName}`,
      version: '1.0.0',
      defaultTheme: 'light',
      features: options.features || [],
      author: options.author || 'Unknown'
    };
    
    await fs.writeJson(path.join(templatePath, 'template.json'), templateConfig, { spaces: 2 });
    
    spinner.succeed(chalk.green(`Template "${templateName}" created successfully!`));
    
    console.log('\n' + chalk.cyan('📦 Template created!'));
    console.log(chalk.gray(`Location: ${templatePath}`));
    console.log('\n' + chalk.yellow('Usage:'));
    console.log(chalk.gray(`  zyros init my-site --template ${templateName}`));
    
    process.exit(0);
    
  } catch (error) {
    spinner.fail(chalk.red('Failed to create template'));
    throw error;
  }
}

module.exports = {
  getTemplates,
  listTemplates,
  applyTemplate,
  createTemplate
}; 