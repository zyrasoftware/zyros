const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

/**
 * Validate site.json structure and content
 */
function validateSiteData(siteData) {
  const errors = [];
  const warnings = [];
  
  // Validate site configuration
  if (!siteData.site) {
    errors.push('Missing "site" configuration');
  } else {
    if (!siteData.site.title) {
      errors.push('Site title is required');
    }
    
    if (!siteData.site.description) {
      warnings.push('Site description is recommended for SEO');
    }
    
    const validThemes = ['light', 'dark', 'minimal', 'ocean', 'sunset', 'forest', 'midnight', 'neon'];
    if (siteData.site.theme && !validThemes.includes(siteData.site.theme)) {
      warnings.push(`Unknown theme "${siteData.site.theme}". Valid themes: ${validThemes.join(', ')}`);
    }
  }
  
  // Validate pages
  if (!siteData.pages || !Array.isArray(siteData.pages)) {
    errors.push('Pages must be an array');
  } else {
    const slugs = new Set();
    
    siteData.pages.forEach((page, index) => {
      const pagePrefix = `Page ${index + 1}`;
      
      // Required fields
      if (!page.title) {
        errors.push(`${pagePrefix}: Title is required`);
      }
      
      if (!page.slug) {
        errors.push(`${pagePrefix}: Slug is required`);
      } else {
        // Check for duplicate slugs
        if (slugs.has(page.slug)) {
          errors.push(`${pagePrefix}: Duplicate slug "${page.slug}"`);
        }
        slugs.add(page.slug);
        
        // Validate slug format
        if (!/^[a-z0-9-]+$/.test(page.slug)) {
          errors.push(`${pagePrefix}: Slug "${page.slug}" should only contain lowercase letters, numbers, and hyphens`);
        }
      }
      
      if (!page.content) {
        errors.push(`${pagePrefix}: Content is required`);
      }
      
      // Optional field validation
      if (page.publishedAt && !/^\d{4}-\d{2}-\d{2}$/.test(page.publishedAt)) {
        warnings.push(`${pagePrefix}: publishedAt should be in YYYY-MM-DD format`);
      }
      
      if (page.readingTime && (typeof page.readingTime !== 'number' || page.readingTime < 1)) {
        warnings.push(`${pagePrefix}: readingTime should be a positive number`);
      }
      
      if (page.tags && !Array.isArray(page.tags)) {
        warnings.push(`${pagePrefix}: tags should be an array`);
      }
      
      // Content validation
      if (page.content) {
        // Check for common markdown issues
        const lines = page.content.split('\n');
        let inCodeBlock = false;
        
        lines.forEach((line, lineIndex) => {
          if (line.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
          }
          
          // Check for unmatched markdown syntax
          if (!inCodeBlock) {
            const boldMatches = (line.match(/\*\*/g) || []).length;
            if (boldMatches % 2 !== 0) {
              warnings.push(`${pagePrefix}: Unmatched bold syntax on line ${lineIndex + 1}`);
            }
            
            const italicMatches = (line.match(/(?<!\*)\*(?!\*)/g) || []).length;
            if (italicMatches % 2 !== 0) {
              warnings.push(`${pagePrefix}: Unmatched italic syntax on line ${lineIndex + 1}`);
            }
          }
        });
        
        if (inCodeBlock) {
          warnings.push(`${pagePrefix}: Unclosed code block`);
        }
      }
    });
  }
  
  return { errors, warnings };
}

/**
 * Validate project structure
 */
async function validateProjectStructure() {
  const errors = [];
  const warnings = [];
  const currentDir = process.cwd();
  
  // Check for required files
  const requiredFiles = [
    'public/site.json',
    'package.json'
  ];
  
  for (const file of requiredFiles) {
    const filePath = path.join(currentDir, file);
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing required file: ${file}`);
    }
  }
  
  // Check package.json
  const packageJsonPath = path.join(currentDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = await fs.readJson(packageJsonPath);
      
          if (!packageJson.dependencies || !packageJson.dependencies['zyros']) {
      warnings.push('zyros not found in dependencies');
      }
      
      if (!packageJson.scripts || !packageJson.scripts.build) {
        warnings.push('Build script not found in package.json');
      }
    } catch (error) {
      errors.push('Invalid package.json format');
    }
  }
  
  // Check for common directories
  const recommendedDirs = ['public', 'components', 'pages', 'styles'];
  for (const dir of recommendedDirs) {
    const dirPath = path.join(currentDir, dir);
    if (!fs.existsSync(dirPath)) {
      warnings.push(`Recommended directory missing: ${dir}`);
    }
  }
  
  return { errors, warnings };
}

/**
 * Validate images and assets
 */
async function validateAssets() {
  const warnings = [];
  const currentDir = process.cwd();
  const publicDir = path.join(currentDir, 'public');
  
  if (!fs.existsSync(publicDir)) {
    return { errors: [], warnings };
  }
  
  try {
    const files = await fs.readdir(publicDir, { recursive: true });
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
    );
    
    for (const imageFile of imageFiles) {
      const imagePath = path.join(publicDir, imageFile);
      const stats = await fs.stat(imagePath);
      
      // Check file size (warn if > 1MB)
      if (stats.size > 1024 * 1024) {
        warnings.push(`Large image file: ${imageFile} (${Math.round(stats.size / 1024 / 1024)}MB)`);
      }
    }
  } catch (error) {
    warnings.push('Could not validate assets: ' + error.message);
  }
  
  return { errors: [], warnings };
}

/**
 * Validate entire project
 */
async function validateProject() {
  const spinner = ora('Validating project...').start();
  
  try {
    let totalErrors = 0;
    let totalWarnings = 0;
    
    // Validate project structure
    spinner.text = 'Validating project structure...';
    const structureValidation = await validateProjectStructure();
    totalErrors += structureValidation.errors.length;
    totalWarnings += structureValidation.warnings.length;
    
    // Validate site.json
    const siteJsonPath = path.join(process.cwd(), 'public', 'site.json');
    if (fs.existsSync(siteJsonPath)) {
      spinner.text = 'Validating site configuration...';
      try {
        const siteData = await fs.readJson(siteJsonPath);
        const siteValidation = validateSiteData(siteData);
        totalErrors += siteValidation.errors.length;
        totalWarnings += siteValidation.warnings.length;
        
        // Combine all validation results
        const allErrors = [...structureValidation.errors, ...siteValidation.errors];
        const allWarnings = [...structureValidation.warnings, ...siteValidation.warnings];
        
        // Validate assets
        spinner.text = 'Validating assets...';
        const assetValidation = await validateAssets();
        allWarnings.push(...assetValidation.warnings);
        totalWarnings += assetValidation.warnings.length;
        
        spinner.stop();
        
        // Display results
        console.log(chalk.cyan('\n🔍 Validation Results'));
        console.log(chalk.blue('─'.repeat(50)));
        
        if (allErrors.length === 0 && allWarnings.length === 0) {
          console.log(chalk.green('✅ All validations passed!'));
          console.log(chalk.gray('Your project looks great and ready to build.'));
        } else {
          if (allErrors.length > 0) {
            console.log(chalk.red(`\n❌ ${allErrors.length} Error(s):`));
            allErrors.forEach(error => {
              console.log(chalk.red(`   • ${error}`));
            });
          }
          
          if (allWarnings.length > 0) {
            console.log(chalk.yellow(`\n⚠️  ${allWarnings.length} Warning(s):`));
            allWarnings.forEach(warning => {
              console.log(chalk.yellow(`   • ${warning}`));
            });
          }
          
          console.log('\n' + chalk.cyan('💡 Recommendations:'));
          if (allErrors.length > 0) {
            console.log(chalk.gray('   • Fix all errors before building'));
          }
          if (allWarnings.length > 0) {
            console.log(chalk.gray('   • Consider addressing warnings for better SEO and performance'));
          }
        }
        
        console.log('\n' + chalk.blue('📊 Summary:'));
        console.log(chalk.gray(`   Pages: ${siteData.pages ? siteData.pages.length : 0}`));
        console.log(chalk.gray(`   Errors: ${totalErrors}`));
        console.log(chalk.gray(`   Warnings: ${totalWarnings}`));
        
        if (totalErrors > 0) {
          process.exit(1);
        } else {
          process.exit(0);
        }
        
      } catch (error) {
        spinner.fail(chalk.red('Invalid site.json format'));
        console.error(chalk.red('Error parsing site.json:'), error.message);
        process.exit(1);
      }
    } else {
      spinner.fail(chalk.red('site.json not found'));
      process.exit(1);
    }
    
  } catch (error) {
    spinner.fail(chalk.red('Validation failed'));
    throw error;
  }
}

module.exports = {
  validateSiteData,
  validateProjectStructure,
  validateAssets,
  validateProject
}; 