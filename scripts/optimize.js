const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const sharp = require('sharp');
const glob = require('glob');

/**
 * Optimize images in the project
 */
async function optimizeImages(options = {}) {
  const spinner = ora('Optimizing images...').start();
  
  try {
    const currentDir = process.cwd();
    const publicDir = path.join(currentDir, 'public');
    
    if (!fs.existsSync(publicDir)) {
      spinner.warn(chalk.yellow('No public directory found'));
      return;
    }
    
    // Find all image files
    const imagePattern = path.join(publicDir, '**/*.{jpg,jpeg,png,gif,webp}');
    const imageFiles = glob.sync(imagePattern);
    
    if (imageFiles.length === 0) {
      spinner.succeed(chalk.green('No images found to optimize'));
      return;
    }
    
    let totalSaved = 0;
    let optimizedCount = 0;
    
    for (const imagePath of imageFiles) {
      const relativePath = path.relative(publicDir, imagePath);
      spinner.text = `Optimizing ${relativePath}...`;
      
      try {
        const originalStats = await fs.stat(imagePath);
        const originalSize = originalStats.size;
        
        // Skip if already optimized (check for .optimized marker)
        const optimizedMarker = imagePath + '.optimized';
        if (fs.existsSync(optimizedMarker)) {
          continue;
        }
        
        const ext = path.extname(imagePath).toLowerCase();
        const outputPath = imagePath;
        
        let sharpInstance = sharp(imagePath);
        
        // Get image metadata
        const metadata = await sharpInstance.metadata();
        
        // Resize if too large
        if (metadata.width > 1920) {
          sharpInstance = sharpInstance.resize(1920, null, {
            withoutEnlargement: true
          });
        }
        
        // Apply format-specific optimizations
        switch (ext) {
          case '.jpg':
          case '.jpeg':
            sharpInstance = sharpInstance.jpeg({
              quality: options.quality || 85,
              progressive: true
            });
            break;
          case '.png':
            sharpInstance = sharpInstance.png({
              compressionLevel: 9,
              progressive: true
            });
            break;
          case '.webp':
            sharpInstance = sharpInstance.webp({
              quality: options.quality || 85
            });
            break;
        }
        
        // Save optimized image
        await sharpInstance.toFile(outputPath + '.tmp');
        
        // Check if optimization actually reduced file size
        const optimizedStats = await fs.stat(outputPath + '.tmp');
        const optimizedSize = optimizedStats.size;
        
        if (optimizedSize < originalSize) {
          await fs.move(outputPath + '.tmp', outputPath, { overwrite: true });
          await fs.writeFile(optimizedMarker, '');
          
          const saved = originalSize - optimizedSize;
          totalSaved += saved;
          optimizedCount++;
          
          console.log(chalk.green(`  ✓ ${relativePath} - Saved ${formatBytes(saved)}`));
        } else {
          // Remove temp file if no improvement
          await fs.remove(outputPath + '.tmp');
          console.log(chalk.gray(`  - ${relativePath} - No improvement`));
        }
        
      } catch (error) {
        console.log(chalk.red(`  ✗ ${relativePath} - Error: ${error.message}`));
      }
    }
    
    spinner.succeed(chalk.green(`Image optimization complete!`));
    console.log(chalk.cyan(`\n📊 Optimization Results:`));
    console.log(chalk.gray(`  Images processed: ${imageFiles.length}`));
    console.log(chalk.gray(`  Images optimized: ${optimizedCount}`));
    console.log(chalk.gray(`  Total space saved: ${formatBytes(totalSaved)}`));
    
  } catch (error) {
    spinner.fail(chalk.red('Image optimization failed'));
    throw error;
  }
}

/**
 * Generate WebP versions of images
 */
async function generateWebP(options = {}) {
  const spinner = ora('Generating WebP images...').start();
  
  try {
    const currentDir = process.cwd();
    const publicDir = path.join(currentDir, 'public');
    
    if (!fs.existsSync(publicDir)) {
      spinner.warn(chalk.yellow('No public directory found'));
      return;
    }
    
    // Find all non-WebP image files
    const imagePattern = path.join(publicDir, '**/*.{jpg,jpeg,png}');
    const imageFiles = glob.sync(imagePattern);
    
    if (imageFiles.length === 0) {
      spinner.succeed(chalk.green('No images found to convert'));
      return;
    }
    
    let convertedCount = 0;
    
    for (const imagePath of imageFiles) {
      const relativePath = path.relative(publicDir, imagePath);
      const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      
      // Skip if WebP version already exists
      if (fs.existsSync(webpPath)) {
        continue;
      }
      
      spinner.text = `Converting ${relativePath} to WebP...`;
      
      try {
        await sharp(imagePath)
          .webp({ quality: options.quality || 85 })
          .toFile(webpPath);
        
        convertedCount++;
        console.log(chalk.green(`  ✓ ${relativePath} → ${path.basename(webpPath)}`));
        
      } catch (error) {
        console.log(chalk.red(`  ✗ ${relativePath} - Error: ${error.message}`));
      }
    }
    
    spinner.succeed(chalk.green(`WebP generation complete!`));
    console.log(chalk.cyan(`\n📊 WebP Results:`));
    console.log(chalk.gray(`  Images processed: ${imageFiles.length}`));
    console.log(chalk.gray(`  WebP images created: ${convertedCount}`));
    
  } catch (error) {
    spinner.fail(chalk.red('WebP generation failed'));
    throw error;
  }
}

/**
 * Optimize CSS and JS files
 */
async function optimizeAssets() {
  const spinner = ora('Optimizing CSS and JS assets...').start();
  
  try {
    const currentDir = process.cwd();
    const distDir = path.join(currentDir, 'out');
    
    if (!fs.existsSync(distDir)) {
      spinner.warn(chalk.yellow('No out directory found. Run build first.'));
      return;
    }
    
    // Find CSS and JS files
    const cssPattern = path.join(distDir, '**/*.css');
    const jsPattern = path.join(distDir, '**/*.js');
    
    const cssFiles = glob.sync(cssPattern);
    const jsFiles = glob.sync(jsPattern);
    
    let totalSaved = 0;
    
    // Optimize CSS files (remove comments and extra whitespace)
    for (const cssFile of cssFiles) {
      const content = await fs.readFile(cssFile, 'utf8');
      const originalSize = Buffer.byteLength(content, 'utf8');
      
      // Simple CSS minification (remove comments and extra whitespace)
      const minified = content
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
        .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
        .replace(/;\s*/g, ';') // Remove spaces after semicolon
        .trim();
      
      const newSize = Buffer.byteLength(minified, 'utf8');
      const saved = originalSize - newSize;
      
      if (saved > 0) {
        await fs.writeFile(cssFile, minified);
        totalSaved += saved;
        console.log(chalk.green(`  ✓ ${path.relative(distDir, cssFile)} - Saved ${formatBytes(saved)}`));
      }
    }
    
    spinner.succeed(chalk.green(`Asset optimization complete!`));
    console.log(chalk.cyan(`\n📊 Asset Results:`));
    console.log(chalk.gray(`  CSS files processed: ${cssFiles.length}`));
    console.log(chalk.gray(`  JS files found: ${jsFiles.length} (already optimized by Next.js)`));
    console.log(chalk.gray(`  Total space saved: ${formatBytes(totalSaved)}`));
    
  } catch (error) {
    spinner.fail(chalk.red('Asset optimization failed'));
    throw error;
  }
}

/**
 * Clean up optimization markers and temporary files
 */
async function cleanupOptimization() {
  const spinner = ora('Cleaning up optimization files...').start();
  
  try {
    const currentDir = process.cwd();
    const publicDir = path.join(currentDir, 'public');
    
    if (!fs.existsSync(publicDir)) {
      spinner.succeed(chalk.green('No cleanup needed'));
      return;
    }
    
    // Find and remove .optimized marker files
    const markerPattern = path.join(publicDir, '**/*.optimized');
    const markerFiles = glob.sync(markerPattern);
    
    for (const markerFile of markerFiles) {
      await fs.remove(markerFile);
    }
    
    // Find and remove .tmp files
    const tmpPattern = path.join(publicDir, '**/*.tmp');
    const tmpFiles = glob.sync(tmpPattern);
    
    for (const tmpFile of tmpFiles) {
      await fs.remove(tmpFile);
    }
    
    spinner.succeed(chalk.green(`Cleanup complete! Removed ${markerFiles.length + tmpFiles.length} files`));
    
  } catch (error) {
    spinner.fail(chalk.red('Cleanup failed'));
    throw error;
  }
}

/**
 * Main optimization function
 */
async function optimizeProject(options = {}) {
  console.log(chalk.cyan('🚀 Starting project optimization...'));
  
  try {
    if (!options.assets && !options.images) {
      // Run all optimizations by default
      await optimizeImages(options);
      await generateWebP(options);
      await optimizeAssets();
    } else {
      if (options.images) {
        await optimizeImages(options);
        await generateWebP(options);
      }
      if (options.assets) {
        await optimizeAssets();
      }
    }
    
    console.log(chalk.green('\n✅ Project optimization complete!'));
    console.log(chalk.yellow('\n💡 Tips:'));
    console.log(chalk.gray('  • Use WebP images for better performance'));
    console.log(chalk.gray('  • Run optimization after adding new images'));
    console.log(chalk.gray('  • Use "zyros optimize --cleanup" to remove optimization markers'));
    
  } catch (error) {
    console.error(chalk.red('Optimization failed:'), error.message);
    process.exit(1);
  }
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = {
  optimizeImages,
  generateWebP,
  optimizeAssets,
  cleanupOptimization,
  optimizeProject
}; 